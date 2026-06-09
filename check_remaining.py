import re

with open('src/routes/timeline.tsx', encoding='utf-8') as f:
    lines = f.readlines()

print("Remaining dark oklch values in timeline.tsx:")
for i, line in enumerate(lines):
    if re.search(r'"oklch\(0\.[01]', line):
        print(f"line {i+1}: {line.rstrip()[:120]}")
