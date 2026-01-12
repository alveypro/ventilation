import re
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
RULE_PATH = ROOT / "data" / "sources" / "呼吸机之家_站点内容包_A+B_不含ICU" / "贴牌同款自动归类规则引擎_规则版.yaml"


def parse_rules(lines):
    rules = []
    current_section = None
    current = None

    def flush():
        nonlocal current
        if current:
            rules.append(current)
            current = None

    for raw in lines:
        line = raw.rstrip()
        if line.strip().startswith("hard_model_rules:"):
            flush()
            current_section = "hard"
            continue
        if line.strip().startswith("platform_rules:"):
            flush()
            current_section = "platform"
            continue
        if not current_section:
            continue
        if re.match(r"\s*-\s+id:\s*", line):
            flush()
            current = {
                "id": line.split("id:")[1].strip(),
                "type": current_section,
                "pattern": "",
                "modelId": None,
                "platformId": None,
                "confidence": None,
            }
            continue
        if not current:
            continue
        if "pattern:" in line:
            current["pattern"] = line.split("pattern:", 1)[1].strip()
        if "model_id:" in line:
            value = line.split("model_id:", 1)[1].strip()
            current["modelId"] = int(value) if value.isdigit() else None
        if "platform_id:" in line:
            value = line.split("platform_id:", 1)[1].strip()
            current["platformId"] = int(value) if value.isdigit() else None
        if "confidence:" in line:
            value = line.split("confidence:", 1)[1].strip()
            current["confidence"] = int(value) if value.isdigit() else None

    flush()
    return rules


def main():
    lines = RULE_PATH.read_text(encoding="utf-8").splitlines()
    rules = parse_rules(lines)
    output_path = ROOT / "src" / "data" / "platform-rules.ts"
    payload = "// 自动从规则引擎 YAML 生成\n"
    payload += "export const platformRules = " + json.dumps(rules, ensure_ascii=False, indent=2) + "\n"
    output_path.write_text(payload, encoding="utf-8")
    print("rules", len(rules))


if __name__ == "__main__":
    main()
