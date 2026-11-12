import re

vue_path = r'e:\code-github\baocun\daidaiUser\pages\me\index.vue'
with open(vue_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到 .account-view { 的位置
start_idx = None
for i, line in enumerate(lines):
    if '.account-view {' in line:
        start_idx = i
        break

if start_idx is None:
    print("ERROR: .account-view { not found")
    exit(1)

print(f"Found .account-view at line {start_idx + 1}")

# 找到要删除的3行：background-size, background-repeat, background-image
# 同时找到 border-radius 那行，在其前面插入 position 和 overflow
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    # 跳过 background-size / background-repeat / background-image 三行
    if (stripped.startswith('background-size:') or
        stripped.startswith('background-repeat:') or
        stripped.startswith('background-image:')):
        print(f"  Removing line {i+1}: {stripped[:60]}...")
        i += 1
        continue
    # 在 border-radius 前插入 position 和 overflow（仅限 .account-view 块内）
    if stripped.startswith('border-radius:') and start_idx <= i:
        # 获取缩进
        indent = line[:len(line) - len(line.lstrip())]
        new_lines.append(indent + 'position: relative;\n')
        new_lines.append(indent + 'overflow: hidden;\n')
        new_lines.append(line)
        i += 1
        continue
    new_lines.append(line)
    i += 1

# 现在找到 .account-view 块的结束 } 并在其后追加新样式
# 重新查找
final_lines = []
i = 0
account_view_block = False
inserted = False
while i < len(new_lines):
    line = new_lines[i]
    final_lines.append(line)
    if '.account-view {' in line:
        account_view_block = True
    if account_view_block and line.strip() == '}' and not inserted:
        # 追加新样式
        final_lines.append('\n')
        final_lines.append('\t.account-bg-img {\n')
        final_lines.append('\t\tposition: absolute;\n')
        final_lines.append('\t\ttop: 0;\n')
        final_lines.append('\t\tleft: 0;\n')
        final_lines.append('\t\twidth: 100%;\n')
        final_lines.append('\t\theight: 100%;\n')
        final_lines.append('\t\tz-index: 0;\n')
        final_lines.append('\t}\n')
        final_lines.append('\t.account-view > view:not(.account-bg-img) {\n')
        final_lines.append('\t\tposition: relative;\n')
        final_lines.append('\t\tz-index: 1;\n')
        final_lines.append('\t}\n')
        inserted = True
        account_view_block = False
    i += 1

if not inserted:
    print("ERROR: could not find closing brace of .account-view")
    exit(1)

with open(vue_path, 'w', encoding='utf-8') as f:
    f.writelines(final_lines)

print("SUCCESS: CSS replaced")
