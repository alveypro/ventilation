#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"
TARGET_DIR="public/data/respirators"

REMOTE_CANDIDATES=(
  "/home/admin/.openclaw/workspace/data/respirators"
  "/home/admin/workspace/data/respirators"
  "/opt/openclaw/workspace/data/respirators"
)

mkdir -p "$TARGET_DIR"

FOUND_DIR=""
for dir in "${REMOTE_CANDIDATES[@]}"; do
  if ssh -i "$REMOTE_KEY" "$REMOTE_HOST" "[ -f '$dir/domestic.json' ] && [ -f '$dir/imported.json' ] && [ -f '$dir/parameters.json' ]"; then
    FOUND_DIR="$dir"
    break
  fi
done

if [[ -z "$FOUND_DIR" ]]; then
  echo "No respirator JSON set found on remote host."
  echo "Checked:"
  printf '  - %s\n' "${REMOTE_CANDIDATES[@]}"
  exit 1
fi

echo "Syncing from $REMOTE_HOST:$FOUND_DIR"
scp -i "$REMOTE_KEY" "$REMOTE_HOST:$FOUND_DIR/domestic.json" "$TARGET_DIR/domestic.json"
scp -i "$REMOTE_KEY" "$REMOTE_HOST:$FOUND_DIR/imported.json" "$TARGET_DIR/imported.json"
scp -i "$REMOTE_KEY" "$REMOTE_HOST:$FOUND_DIR/parameters.json" "$TARGET_DIR/parameters.json"
echo "Done: $TARGET_DIR"
