#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/tools/deploy_aliyun.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  echo "Copy tools/deploy_aliyun.env.example to tools/deploy_aliyun.env and fill values."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# Keep Aliyun CLI config inside the workspace to avoid permission issues.
export HOME="${ROOT_DIR}/.aliyun-home"
mkdir -p "$HOME"

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env: $name"
    exit 1
  fi
}

require_env ALIYUN_ACCESS_KEY_ID
require_env ALIYUN_ACCESS_KEY_SECRET
require_env ALIYUN_REGION
require_env ROOT_DOMAIN
require_env JWT_SECRET
require_env MONGO_ROOT_PASSWORD

# Normalize ROOT_DOMAIN to avoid invalid DNS record values.
ROOT_DOMAIN="$(echo "$ROOT_DOMAIN" | tr -d '[:space:]')"
ROOT_DOMAIN="${ROOT_DOMAIN#http://}"
ROOT_DOMAIN="${ROOT_DOMAIN#https://}"
ROOT_DOMAIN="${ROOT_DOMAIN%%/*}"
ROOT_DOMAIN="${ROOT_DOMAIN%.}"
if [[ ! "$ROOT_DOMAIN" =~ ^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
  echo "Invalid ROOT_DOMAIN: $ROOT_DOMAIN"
  exit 1
fi

export ALIBABA_CLOUD_ACCESS_KEY_ID="$ALIYUN_ACCESS_KEY_ID"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="$ALIYUN_ACCESS_KEY_SECRET"
export ALIBABA_CLOUD_REGION_ID="$ALIYUN_REGION"

for cmd in aliyun python3 ssh scp tar; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd"
    exit 1
  fi
done

aliyun_cmd() {
  aliyun --mode AK \
    --access-key-id "$ALIYUN_ACCESS_KEY_ID" \
    --access-key-secret "$ALIYUN_ACCESS_KEY_SECRET" \
    --region "$ALIYUN_REGION" \
    "$@"
}

aliyun_value() {
  local field="$1"
  local rows="$2"
  shift 2
  local output
  if [[ "$rows" == "-" ]]; then
    output="$(aliyun_cmd "$@" --output "cols=${field}")"
  else
    output="$(aliyun_cmd "$@" --output "cols=${field}" "rows=${rows}")"
  fi
  echo "$output" | awk 'NR>1 && $1!="" && $1 !~ /^-+$/ {print $1; exit}'
}

log() {
  echo "[$(date +%H:%M:%S)] $*"
}

log "Building frontend..."
cd "$ROOT_DIR"
# Avoid vue-tsc Node version incompatibilities during deploy.
npx vite build

DEPLOY_TGZ="/tmp/airivo_deploy.tgz"
log "Packaging deploy bundle..."
tar -czf "$DEPLOY_TGZ" dist backend

if [[ -z "${VPC_ID:-}" ]]; then
  log "Locating or creating VPC..."
  VPC_ID="$(aliyun_value "VpcId" "Vpcs.Vpc[]" vpc DescribeVpcs --RegionId "$ALIYUN_REGION")"
  if [[ -z "$VPC_ID" ]]; then
    vpc_name="airivo-vpc"
    VPC_ID="$(aliyun_value "VpcId" "-" vpc CreateVpc --RegionId "$ALIYUN_REGION" --VpcName "$vpc_name" --CidrBlock "10.0.0.0/16")"
  fi
fi

if [[ -z "${VSWITCH_ID:-}" ]]; then
  log "Locating or creating VSwitch..."
  VSWITCH_ID="$(aliyun_value "VSwitchId" "VSwitches.VSwitch[]" vpc DescribeVSwitches --RegionId "$ALIYUN_REGION" --VpcId "$VPC_ID")"
  if [[ -z "$VSWITCH_ID" ]]; then
    ZONE_ID="$(aliyun_value "ZoneId" "Zones.Zone[]" ecs DescribeZones --RegionId "$ALIYUN_REGION")"
    VSWITCH_ID="$(aliyun_value "VSwitchId" "-" vpc CreateVSwitch --RegionId "$ALIYUN_REGION" --VpcId "$VPC_ID" --ZoneId "$ZONE_ID" --CidrBlock "10.0.1.0/24" --VSwitchName "airivo-vswitch")"
  fi
fi

if [[ -z "${SECURITY_GROUP_ID:-}" ]]; then
  log "Locating or creating Security Group..."
  SECURITY_GROUP_ID="$(aliyun_value "SecurityGroupId" "SecurityGroups.SecurityGroup[]" ecs DescribeSecurityGroups --RegionId "$ALIYUN_REGION" --VpcId "$VPC_ID")"
  if [[ -z "$SECURITY_GROUP_ID" ]]; then
    SECURITY_GROUP_ID="$(aliyun_value "SecurityGroupId" "-" ecs CreateSecurityGroup --RegionId "$ALIYUN_REGION" --VpcId "$VPC_ID" --SecurityGroupName "airivo-sg")"
    aliyun_cmd ecs AuthorizeSecurityGroup --RegionId "$ALIYUN_REGION" --SecurityGroupId "$SECURITY_GROUP_ID" --IpProtocol tcp --PortRange "22/22" --SourceCidrIp "0.0.0.0/0" >/dev/null
    aliyun_cmd ecs AuthorizeSecurityGroup --RegionId "$ALIYUN_REGION" --SecurityGroupId "$SECURITY_GROUP_ID" --IpProtocol tcp --PortRange "80/80" --SourceCidrIp "0.0.0.0/0" >/dev/null
    aliyun_cmd ecs AuthorizeSecurityGroup --RegionId "$ALIYUN_REGION" --SecurityGroupId "$SECURITY_GROUP_ID" --IpProtocol tcp --PortRange "443/443" --SourceCidrIp "0.0.0.0/0" >/dev/null
  fi
fi

SSH_KEY_NAME="${SSH_KEY_NAME:-airivo-deploy-key}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$ROOT_DIR/tools/keys/airivo-deploy-key}"
mkdir -p "$(dirname "$SSH_KEY_PATH")"

KEYPAIR_NAME_FOUND="$(aliyun_value "KeyPairName" "KeyPairs.KeyPair[]" ecs DescribeKeyPairs --RegionId "$ALIYUN_REGION" --KeyPairName "$SSH_KEY_NAME")"

if [[ -z "$KEYPAIR_NAME_FOUND" ]]; then
  log "Creating SSH key pair..."
  if [[ ! -f "$SSH_KEY_PATH" ]]; then
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" >/dev/null
  fi
  pub_key="$(cat "${SSH_KEY_PATH}.pub")"
  aliyun_cmd ecs ImportKeyPair --RegionId "$ALIYUN_REGION" --KeyPairName "$SSH_KEY_NAME" --PublicKeyBody "$pub_key" >/dev/null
else
  log "Using existing key pair: $SSH_KEY_NAME"
fi

log "Locating or creating ECS instance..."
instance_id=""
instance_id="$(aliyun_value "InstanceId" "Instances.Instance[]" ecs DescribeInstances --RegionId "$ALIYUN_REGION" --InstanceName "airivo-web")"

if [[ -z "$instance_id" ]]; then
  instance_type="${ECS_INSTANCE_TYPE:-}"
  if [[ -z "$instance_type" ]]; then
    types_table="$(aliyun_cmd ecs DescribeInstanceTypes --RegionId "$ALIYUN_REGION" --output "cols=InstanceTypeId,CpuCoreCount,MemorySize" "rows=InstanceTypes.InstanceType[]")"
    instance_type="$(echo "$types_table" | awk -F'|' 'NR>1 {id=$1; cpu=$2; mem=$3; gsub(/^[ \t]+|[ \t]+$/,"",id); gsub(/^[ \t]+|[ \t]+$/,"",cpu); gsub(/^[ \t]+|[ \t]+$/,"",mem); if (id ~ /^-+$/) next; if (id ~ /^ecs\./ && cpu+0 >= 2 && mem+0 >= 4) {print id; exit}}')"
  fi
  if [[ -z "$instance_type" ]]; then
    instance_type="ecs.c6.large"
  fi
  log "Using instance type: $instance_type"

  image_id="${ECS_IMAGE_ID:-}"
  image_size=""
  if [[ -z "$image_id" ]]; then
    images_table="$(aliyun_cmd ecs DescribeImages --RegionId "$ALIYUN_REGION" --ImageOwnerAlias system --OSType linux --Architecture x86_64 --InstanceType "$instance_type" --output "cols=ImageId,Size,ImageName" "rows=Images.Image[]")"
    image_id="$(echo "$images_table" | awk -F'|' 'NR>1 {id=$1; size=$2; name=$3; gsub(/^[ \t]+|[ \t]+$/,"",id); gsub(/^[ \t]+|[ \t]+$/,"",name); if (id ~ /^-+$/) next; line=tolower(id" "name); if (line ~ /ubuntu/ && line ~ /22/ && line ~ /04/) {print id; exit}}')"
    image_size="$(echo "$images_table" | awk -F'|' 'NR>1 {id=$1; size=$2; name=$3; gsub(/^[ \t]+|[ \t]+$/,"",id); gsub(/^[ \t]+|[ \t]+$/,"",name); gsub(/^[ \t]+|[ \t]+$/,"",size); if (id ~ /^-+$/) next; line=tolower(id" "name); if (line ~ /ubuntu/ && line ~ /22/ && line ~ /04/) {print size; exit}}')"
    if [[ -z "$image_id" ]]; then
      image_id="$(echo "$images_table" | awk -F'|' 'NR>1 {id=$1; name=$3; gsub(/^[ \t]+|[ \t]+$/,"",id); gsub(/^[ \t]+|[ \t]+$/,"",name); if (id ~ /^-+$/) next; if (tolower(name) ~ /ubuntu/) {print id; exit}}')"
      image_size="$(echo "$images_table" | awk -F'|' 'NR>1 {id=$1; size=$2; name=$3; gsub(/^[ \t]+|[ \t]+$/,"",id); gsub(/^[ \t]+|[ \t]+$/,"",name); gsub(/^[ \t]+|[ \t]+$/,"",size); if (id ~ /^-+$/) next; if (tolower(name) ~ /ubuntu/) {print size; exit}}')"
    fi
  fi
  if [[ -n "$image_id" && -z "$image_size" ]]; then
    image_size="$(aliyun_value "Size" "-" ecs DescribeImages --RegionId "$ALIYUN_REGION" --ImageId "$image_id")"
  fi
  if [[ -z "$image_id" ]]; then
    echo "Failed to resolve an Ubuntu image. Set ECS_IMAGE_ID in the env file."
    exit 1
  fi
  disk_size="${ECS_DISK_SIZE:-200}"
  if [[ "$image_size" =~ ^[0-9]+$ ]]; then
    if [[ "$image_size" -gt "$disk_size" ]]; then
      disk_size="$image_size"
    fi
  else
    if [[ "$disk_size" -lt 200 ]]; then
      disk_size=200
    fi
  fi
  log "Using system disk size: ${disk_size}G (image size: ${image_size:-unknown}G)"
  instance_id="$(aliyun_value "InstanceIdSet" "InstanceIdSets.InstanceIdSet[]" ecs RunInstances \
    --RegionId "$ALIYUN_REGION" \
    --ImageId "$image_id" \
    --InstanceType "$instance_type" \
    --SecurityGroupId "$SECURITY_GROUP_ID" \
    --VSwitchId "$VSWITCH_ID" \
    --InstanceName "airivo-web" \
    --InternetMaxBandwidthOut 20 \
    --SystemDisk.Size "$disk_size" \
    --KeyPairName "$SSH_KEY_NAME" \
    --InstanceChargeType PostPaid \
    --InternetChargeType PayByTraffic)"
  if [[ -z "$instance_id" ]]; then
    echo "Failed to create ECS instance. Check ECS limits and disk size."
    exit 1
  fi
fi

log "Waiting for instance public IP..."
public_ip=""
for _ in $(seq 1 30); do
  public_ip="$(aliyun_value "IpAddress" "Instances.Instance[].PublicIpAddress.IpAddress[]" ecs DescribeInstances --RegionId "$ALIYUN_REGION" --InstanceIds "[\"$instance_id\"]")"
  if [[ -n "$public_ip" ]]; then
    break
  fi
  sleep 5
done

if [[ -z "$public_ip" ]]; then
  echo "Failed to obtain public IP for instance $instance_id"
  exit 1
fi
public_ip="$(echo "$public_ip" | tr -d '[:space:]')"
if [[ ! "$public_ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid public IP resolved: '$public_ip'"
  exit 1
fi

log "Configuring DNS records..."
ensure_record() {
  local rr="$1"
  local value="$2"
  local type="A"
  local record_id records_table

  # Try create first; fallback to update on duplicate.
  set +e
  add_out="$(aliyun_cmd alidns AddDomainRecord --DomainName "$ROOT_DOMAIN" --RR "$rr" --Type "$type" --Value "$value" 2>&1)"
  add_status=$?
  set -e
  if [[ "$add_status" -eq 0 ]]; then
    return
  fi

  if ! echo "$add_out" | grep -qi "DomainRecordDuplicate"; then
    echo "$add_out"
    exit 1
  fi

  records_table="$(aliyun_cmd alidns DescribeDomainRecords --DomainName "$ROOT_DOMAIN" --RRKeyWord "$rr" --TypeKeyWord "$type" --output "cols=RecordId,Value,RR,Type" "rows=DomainRecords.Record[]")"
  record_id="$(echo "$records_table" | awk -v rr="$rr" -v type="$type" -v val="$value" 'NR>1 {if($3==rr && $4==type && $2==val){print $1; exit}}')"
  if [[ -z "$record_id" ]]; then
    record_id="$(echo "$records_table" | awk -v rr="$rr" -v type="$type" 'NR>1 {if($3==rr && $4==type){print $1; exit}}')"
  fi
  if [[ -z "$record_id" ]]; then
    echo "Failed to locate existing DNS record for ${rr}.${ROOT_DOMAIN}"
    exit 1
  fi
  aliyun_cmd alidns UpdateDomainRecord --RecordId "$record_id" --RR "$rr" --Type "$type" --Value "$value" >/dev/null
}

ensure_record "@" "$public_ip"
if [[ "${ENABLE_WWW:-1}" == "1" ]]; then
  ensure_record "www" "$public_ip"
fi
if [[ "${ENABLE_API_DOMAIN:-1}" == "1" ]]; then
  ensure_record "api" "$public_ip"
fi

log "Uploading bundle to server..."
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$DEPLOY_TGZ" "${ECS_LOGIN_USER:-ubuntu}@${public_ip}:/tmp/airivo_deploy.tgz"

log "Provisioning server..."
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "${ECS_LOGIN_USER:-ubuntu}@${public_ip}" <<EOF
set -euo pipefail
sudo apt-get update
sudo apt-get install -y nginx docker.io docker-compose-plugin
sudo mkdir -p /opt/airivo
sudo tar -xzf /tmp/airivo_deploy.tgz -C /opt/airivo
sudo mkdir -p /opt/airivo/mongo
sudo tee /opt/airivo/docker-compose.prod.yml >/dev/null <<'COMPOSE'
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      MONGODB_URI: mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASSWORD}@mongo:27017/${MONGO_DB}?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongo
  mongo:
    image: mongo:6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DB}
    volumes:
      - /opt/airivo/mongo:/data/db
COMPOSE

sudo tee /etc/nginx/sites-available/airivo.conf >/dev/null <<'NGINX'
server {
  listen 80;
  server_name ${ROOT_DOMAIN} www.${ROOT_DOMAIN};
  root /opt/airivo/dist;
  index index.html;

  location / {
    try_files \$uri /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}

server {
  listen 80;
  server_name api.${ROOT_DOMAIN};

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
NGINX

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/airivo.conf /etc/nginx/sites-enabled/airivo.conf
sudo nginx -t
sudo systemctl restart nginx

cd /opt/airivo
sudo docker compose -f docker-compose.prod.yml up -d --build
EOF

if [[ "${ENABLE_HTTPS:-0}" == "1" ]]; then
  log "Enabling HTTPS via certbot..."
  ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "${ECS_LOGIN_USER:-ubuntu}@${public_ip}" <<EOF
set -euo pipefail
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d "${ROOT_DOMAIN}" -d "www.${ROOT_DOMAIN}" -d "api.${ROOT_DOMAIN}" --non-interactive --agree-tos -m "admin@${ROOT_DOMAIN}"
EOF
fi

log "Done."
log "Site: http://${ROOT_DOMAIN}"
log "API:  http://api.${ROOT_DOMAIN}/api/health"
