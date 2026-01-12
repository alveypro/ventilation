import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_array(path: Path, export_name: str):
    text = path.read_text(encoding='utf-8')
    marker = f"export const {export_name} = "
    start = text.find(marker)
    if start == -1:
        raise RuntimeError(f"{export_name} not found")
    array_start = text.find("[", start)
    array_end = text.rfind("]")
    payload = text[array_start:array_end + 1]
    payload = re.sub(r'([\s,{])([a-zA-Z0-9_]+)\s*:', r'\1"\2":', payload)
    payload = payload.replace("'", '"')
    payload = re.sub(r',\s*([}\]])', r'\1', payload)
    return text, json.loads(payload)


def save_array(path: Path, text: str, export_name: str, data):
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    marker = f"export const {export_name} = "
    start = text.find(marker)
    if start == -1:
        raise RuntimeError(f"{export_name} not found for save")
    array_start = text.find("[", start)
    array_end = text.rfind("]")
    if array_start == -1 or array_end == -1 or array_end <= array_start:
        raise RuntimeError(f"{export_name} array bounds not found for save")
    updated = text[:array_start] + payload + text[array_end + 1:]
    path.write_text(updated, encoding='utf-8')


def build_table(keywords):
    rows = []
    for key in keywords[:6]:
        rows.append(f"| {key} | 核心概念/指标 | 结合病情与检查综合判断 |")
    if not rows:
        rows.append("| AHI/ODI/T90 | 指标解读 | 与症状及合并症一起评估 |")
    return "| 项目 | 说明 | 临床提示 |\n| --- | --- | --- |\n" + "\n".join(rows)


def clinical_template(item):
    title = item.get('title', '')
    summary = item.get('summary', '')
    keywords = item.get('keywords') or []
    category = item.get('category', '')
    doc_type = item.get('docType', '')
    focus = []
    if any(k in title for k in ['PSG', 'AHI', 'RDI', 'ODI', 'T90', '波形', '判读']):
        focus = [
            '以睡眠监测与指标判读为核心，强调事件识别与低氧负荷。',
            '需结合睡眠分期、体位与症状综合解读。',
        ]
    elif any(k in title for k in ['CPAP', 'APAP', 'BiPAP', 'NIV', 'S/T', 'iVAPS', 'AVAPS']):
        focus = [
            '以通气模式选择与参数设定为核心，强调适应证与禁忌证。',
            '重点关注压力支持、漏气与依从性。',
        ]
    elif '漏气' in title or '面罩' in title or '湿化' in title:
        focus = [
            '以设备管理与舒适度优化为核心，强调面罩适配与湿化管理。',
            '问题处理应遵循“先适配、再参数、再随访”的顺序。',
        ]
    else:
        focus = [
            f'属于{category or "临床"}领域的{doc_type or "指南"}类内容。',
            '可用于临床路径梳理与操作规范参考。',
        ]

    table = build_table(keywords)
    return "\n".join([
        "## 一句话定义",
        summary or f"{title}是呼吸治疗与睡眠医学中的常用概念，需结合临床路径理解。",
        "",
        "## 临床关注点",
        "- " + "\n- ".join(focus),
        "",
        "## 核心流程",
        "1. 明确适应证与风险人群。",
        "2. 结合监测指标与症状做分层。",
        "3. 选择合适的治疗/参数策略。",
        "4. 设定随访节奏并评估疗效。",
        "",
        "## 指标与参数表",
        table,
        "",
        "## 常见误区",
        "- 仅依赖单一指标判断，忽略症状与合并症。",
        "- 忽视漏气/依从性导致疗效评价偏差。",
        "- 未覆盖最差体位/REM 期即下结论。",
        "",
        "## FAQ",
        "**Q: 需要哪些检查才能确认结论？**  ",
        "A: 以标准监测为主，结合量表、症状与风险分层。",
        "",
        "**Q: 是否可以自行调整参数？**  ",
        "A: 轻度调整需结合随访数据，关键参数应由专业人员指导。",
        "",
        "## 合规提示",
        "- 内容仅作教育用途，实际诊疗需遵循最新指南与医嘱。",
        "- 不提供个体化处方或药械推荐。",
    ])


def user_template(item):
    title = item.get('title', '')
    summary = item.get('summary', '')
    keywords = item.get('keywords') or []
    key_points = [
        summary or f"{title}适用于家庭使用场景，建议在专业指导下执行。",
    ]
    key_points += [f"关注点：{key}" for key in keywords[:4]]
    table = build_table(keywords)
    return key_points, "\n".join([
        "## 这篇内容适合谁",
        "- 家庭用户、护理人员、随访团队。",
        "- 需要快速理解操作要点与常见问题的人群。",
        "",
        "## 操作步骤",
        "1. 准备设备与配件，检查管路/面罩/湿化。",
        "2. 按顺序佩戴并确认漏气。",
        "3. 记录使用感受与异常。",
        "4. 定期清洁与复查参数。",
        "",
        "## 关键指标表",
        table,
        "",
        "## 常见问题处理",
        "- 不适/干燥：先检查湿化与面罩贴合。",
        "- 漏气偏高：从面罩位置与头带松紧开始排查。",
        "- 依从性差：短时分段适应并记录变化。",
        "",
        "## 安全与合规",
        "- 出现明显呼吸困难、持续低氧、胸痛等情况应及时就医。",
        "- 不建议未经专业评估自行更改关键参数。",
        "",
        "## FAQ",
        "**Q: 清洁频率是多少？**  ",
        "A: 水箱/面罩建议每日清洁，管路与过滤棉按说明定期更换。",
        "",
        "**Q: 能否和家人共用设备？**  ",
        "A: 不建议共用，涉及卫生与个体化参数设置。",
    ])


def main():
    clinical_path = ROOT / 'src' / 'data' / 'clinical-handbook.ts'
    user_path = ROOT / 'src' / 'data' / 'public-user-library.ts'

    clinical_text, clinical_data = load_array(clinical_path, 'clinicalHandbookData')
    user_text, user_data = load_array(user_path, 'publicUserLibraryData')

    for item in clinical_data:
        if not item.get('content'):
            item['content'] = clinical_template(item)

    for item in user_data:
        if not item.get('content'):
            key_points, content = user_template(item)
            item['content'] = content
            if not item.get('keyPoints'):
                item['keyPoints'] = key_points

    save_array(clinical_path, clinical_text, 'clinicalHandbookData', clinical_data)
    save_array(user_path, user_text, 'publicUserLibraryData', user_data)


if __name__ == '__main__':
    main()
