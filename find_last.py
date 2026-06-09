import re
with open('src/routes/timeline.tsx', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if re.search(r'"oklch\(0\.[01]', line):
        print('line', i+1, ':', line.strip()[:150])
