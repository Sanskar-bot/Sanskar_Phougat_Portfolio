"""Fix remaining dark oklch values in timeline.tsx"""
import re

with open('src/routes/timeline.tsx', encoding='utf-8') as f:
    content = f.read()

remaining_fixes = [
    # Skeleton loader colors
    ('"oklch(0.16 0.03 260)"',       '"var(--border)"'),
    ('"oklch(0.11 0.03 260)"',       '"var(--card)"'),
    ('"oklch(0.18 0.03 260)"',       '"var(--muted)"'),
    # Tooltip / popover bg
    ('"oklch(0.09 0.03 260 / 95%)"', '"var(--surface-overlay)"'),
    ('"oklch(0.11 0.04 260 / 80%)"', '"var(--surface-1)"'),
    ('"oklch(0.11 0.03 260 / 90%)"', '"var(--card)"'),
    ('"oklch(0.10 0.03 260 / 90%)"', '"var(--card)"'),
    # Inline borders
    ('"1px solid oklch(0.82 0.18 170 / 18%)"', '"1px solid color-mix(in oklch, var(--neon-cyan) 18%, transparent)"'),
    ('"1px solid oklch(0.25 0.04 260 / 60%)"', '"1px solid var(--surface-sidebar-border)"'),
    # Filter panel
    ('filterOpen ? "oklch(0.82 0.18 170 / 15%)" : "oklch(0.11 0.03 260 / 90%)"',
     'filterOpen ? "color-mix(in oklch, var(--primary) 15%, transparent)" : "var(--card)"'),
    # Tag filter
    ('"oklch(0.82 0.18 170 / 14%)"', '"color-mix(in oklch, var(--primary) 14%, transparent)"'),
    ('"oklch(0.14 0.03 260)"',       '"var(--muted)"'),
]

for old, new in remaining_fixes:
    content = content.replace(old, new)

# Check how many dark raw oklch still remain
still_remaining = re.findall(r'"oklch\(0\.[01]', content)
print(f"Still remaining raw dark oklch: {len(still_remaining)}")
for m in still_remaining:
    print(" ", m)

with open('src/routes/timeline.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("timeline.tsx patched successfully.")
