"""
Fix light-mode issues in story.tsx and timeline.tsx:
1. Replace all text-white -> text-foreground
2. Replace all hardcoded dark oklch backgrounds/borders with CSS var tokens
3. Replace hover:text-white -> hover:text-primary
4. Fix remaining hardcoded light oklch color values

Run from: s:\Personal Projects\Portfolio
"""
import re

# ─────────────────────────────────────────────────────────────
# Helper: apply ordered list of (pattern, replacement) pairs
# ─────────────────────────────────────────────────────────────
def apply_fixes(content, fixes):
    for pattern, replacement in fixes:
        content = re.sub(pattern, replacement, content)
    return content

# ─────────────────────────────────────────────────────────────
# Common fixes for both files
# ─────────────────────────────────────────────────────────────
COMMON_FIXES = [
    # Text classes
    (r'\btext-white\b',           'text-foreground'),
    (r'hover:text-white\b',       'hover:text-primary'),
    (r'group-hover:text-white\b', 'group-hover:text-primary'),

    # Page wrapper hardcoded dark bg
    (r'"oklch\(0\.08 0\.02 260\)"', '"var(--background)"'),
    (r"'oklch\(0\.08 0\.02 260\)'", "'var(--background)'"),

    # Hardcoded dark surface backgrounds (oklch near 0.07–0.13)
    (r'"oklch\(0\.07 0\.02 260 / 50%\)"',      '"var(--surface-0)"'),
    (r'"oklch\(0\.09 0\.025 260 / 80%\)"',     '"var(--surface-1)"'),
    (r'"oklch\(0\.10 0\.03 260 / 80%\)"',      '"var(--surface-3)"'),
    (r'"oklch\(0\.10 0\.03 260 / 70%\)"',      '"var(--surface-2)"'),
    (r'"oklch\(0\.10 0\.03 260 / 60%\)"',      '"var(--surface-2)"'),
    (r'"oklch\(0\.10 0\.03 260\)"',             '"var(--surface-sidebar)"'),
    (r'"oklch\(0\.11 0\.03 260 / 95%\)"',      '"var(--surface-overlay)"'),
    (r'"oklch\(0\.11 0\.03 260 / 80%\)"',      '"var(--surface-1)"'),
    (r'"oklch\(0\.12 0\.03 260\)"',             '"var(--card)"'),
    (r'"oklch\(0\.12 0\.04 260\)"',             '"var(--surface-hover)"'),
    (r'"oklch\(0\.12 0\.04 260 / 50%\)"',      '"var(--surface-active)"'),
    (r'"oklch\(0\.12 0\.04 260 / 60%\)"',      '"var(--surface-4)"'),
    (r'"oklch\(0\.12 0\.04 260 / 80%\)"',      '"var(--surface-4)"'),
    (r'"oklch\(0\.12 0\.04 260 / 90%\)"',      '"var(--surface-2)"'),
    (r'"oklch\(0\.13 0\.04 260 / 90%\)"',      '"var(--timeline-card-selected)"'),
    (r'"oklch\(0\.14 0\.03 260 / 60%\)"',      '"var(--muted)"'),
    (r'"oklch\(0\.15 0\.03 260\)"',             '"var(--muted)"'),

    # Borders — dark hardcoded values
    (r'"oklch\(0\.18 0\.04 260 / 50%\)"',      '"var(--surface-divider)"'),
    (r'"oklch\(0\.18 0\.04 260 / 60%\)"',      '"var(--surface-border-light)"'),
    (r'"oklch\(0\.20 0\.04 260 / 50%\)"',      '"var(--border)"'),
    (r'"oklch\(0\.20 0\.04 260 / 60%\)"',      '"var(--surface-divider)"'),
    (r'"oklch\(0\.22 0\.04 260 / 40%\)"',      '"var(--border)"'),
    (r'"oklch\(0\.22 0\.04 260 / 50%\)"',      '"var(--border)"'),
    (r'"oklch\(0\.22 0\.04 260 / 60%\)"',      '"var(--border)"'),
    (r'"oklch\(0\.22 0\.04 260 / 70%\)"',      '"var(--surface-border)"'),
    (r'"oklch\(0\.25 0\.04 260 / 60%\)"',      '"var(--surface-sidebar-border)"'),
    (r'"oklch\(0\.35 0\.02 220\)"',             '"var(--token-faint)"'),

    # Cyan/neon values — hardcoded
    (r'"oklch\(0\.82 0\.18 170\)"',             '"var(--neon-cyan)"'),
    (r'"oklch\(0\.82 0\.18 170 / 75%\)"',      '"var(--token-cyan)"'),
    (r'"oklch\(0\.82 0\.18 170 / 85%\)"',      '"var(--token-cyan)"'),
    (r'"oklch\(0\.82 0\.18 170 / 07%\)"',      '"color-mix(in oklch, var(--neon-cyan) 7%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 08%\)"',      '"color-mix(in oklch, var(--neon-cyan) 8%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 10%\)"',      '"color-mix(in oklch, var(--neon-cyan) 10%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 18%\)"',      '"color-mix(in oklch, var(--neon-cyan) 18%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 20%\)"',      '"color-mix(in oklch, var(--neon-cyan) 20%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 22%\)"',      '"color-mix(in oklch, var(--neon-cyan) 22%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 25%\)"',      '"color-mix(in oklch, var(--neon-cyan) 25%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 30%\)"',      '"color-mix(in oklch, var(--neon-cyan) 30%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 38%\)"',      '"color-mix(in oklch, var(--neon-cyan) 38%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 40%\)"',      '"color-mix(in oklch, var(--neon-cyan) 40%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 50%\)"',      '"color-mix(in oklch, var(--neon-cyan) 50%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 55%\)"',      '"color-mix(in oklch, var(--neon-cyan) 55%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 60%\)"',      '"color-mix(in oklch, var(--neon-cyan) 60%, transparent)"'),
    (r'"oklch\(0\.82 0\.18 170 / 70%\)"',      '"color-mix(in oklch, var(--neon-cyan) 70%, transparent)"'),

    # Text color values — near-white hardcoded
    (r'"oklch\(0\.92 0\.01 180\)"',             '"var(--foreground)"'),
    (r'"oklch\(0\.88 0\.01 180\)"',             '"var(--foreground)"'),
    (r'"oklch\(0\.85 0\.16 195\)"',             '"var(--primary)"'),
    (r'"oklch\(0\.75 0\.02 200\)"',             '"var(--muted-foreground)"'),
    (r'"oklch\(0\.65 0\.03 220\)"',             '"var(--muted-foreground)"'),
    (r'"oklch\(0\.60 0\.03 220\)"',             '"var(--muted-foreground)"'),
    (r'"oklch\(0\.58 0\.02 210\)"',             '"var(--muted-foreground)"'),
    (r'"oklch\(0\.50 0\.03 220\)"',             '"var(--timeline-date-color)"'),
    (r'"oklch\(0\.45 0\.02 220\)"',             '"var(--muted-foreground)"'),
    (r'"oklch\(0\.40 0\.02 220\)"',             '"var(--token-dim)"'),

    # Purple hardcoded
    (r'"oklch\(0\.7 0\.22 320 / 50%\)"',       '"color-mix(in oklch, var(--token-purple) 50%, transparent)"'),
    (r'"oklch\(0\.7 0\.22 320 / 10%\)"',       '"color-mix(in oklch, var(--token-purple) 10%, var(--card))"'),
    (r'"oklch\(0\.7 0\.22 320 / 06%\)"',       '"color-mix(in oklch, var(--token-purple) 6%, var(--card))"'),
    (r'"oklch\(0\.7 0\.22 320 / 25%\)"',       '"color-mix(in oklch, var(--token-purple) 25%, transparent)"'),
    (r'"oklch\(0\.7 0\.22 320 / 18%\)"',       '"color-mix(in oklch, var(--token-purple) 18%, transparent)"'),
    (r'"oklch\(0\.7 0\.22 320 / 80%\)"',       '"color-mix(in oklch, var(--token-purple) 80%, transparent)"'),
    (r'"oklch\(0\.7 0\.22 320 / 70%\)"',       '"color-mix(in oklch, var(--token-purple) 70%, transparent)"'),
    (r'"oklch\(0\.7 0\.22 320 / 60%\)"',       '"color-mix(in oklch, var(--token-purple) 60%, transparent)"'),
    (r'"oklch\(0\.7 0\.22 320 / 30%\)"',       '"color-mix(in oklch, var(--token-purple) 30%, transparent)"'),

    # Inline-style alpha-appended CSS vars like ${GREEN}30 (invalid) → color-mix
    (r'`\$\{GREEN\}([0-9a-f]{2})`',            lambda m: f'`color-mix(in oklch, ${{GREEN}} {int(m.group(1), 16) * 100 // 255}%, transparent)`'),
    (r'`\$\{PURPLE\}([0-9a-f]{2})`',           lambda m: f'`color-mix(in oklch, ${{PURPLE}} {int(m.group(1), 16) * 100 // 255}%, transparent)`'),
    (r'`\$\{CYAN\}([0-9a-f]{2})`',             lambda m: f'`color-mix(in oklch, ${{CYAN}} {int(m.group(1), 16) * 100 // 255}%, transparent)`'),
    (r'`\$\{accent\}([0-9a-f]{2})`',           lambda m: f'`color-mix(in oklch, ${{accent}} {int(m.group(1), 16) * 100 // 255}%, transparent)`'),

    # Timeline-specific
    (r'"oklch\(0\.10 0\.03 260 / 85%\)"',      '"var(--card)"'),
    (r'"oklch\(0\.08 0\.02 260 / 50%\)"',      '"var(--surface-0)"'),
    (r'linear-gradient\(to bottom, oklch\(0\.82 0\.18 170 / 20%\), transparent\)',
                                                'var(--timeline-connector)'),

    # Story ambient glow
    (r'oklch\(0\.15 0\.05 280 / 50%\)',         'var(--hero-overlay)'),
    (r'oklch\(0\.14 0\.05 280 / 35%\)',         'var(--hero-overlay)'),
    (r'oklch\(0\.14 0\.05 280 / 55%\)',         'var(--hero-overlay)'),
    (r'oklch\(0\.15 0\.05 280 / 40%\)',         'var(--hero-overlay)'),
]

# ─────────────────────────────────────────────────────────────
# Story-specific fixes
# ─────────────────────────────────────────────────────────────
STORY_FIXES = COMMON_FIXES + [
    # Page wrapper
    (r'(className="relative min-h-screen") style=\{\{ background: "var\(--background\)"[^}]*\}\}',
     r'\1 bg-background'),
    # Sidebar overlay on mobile
    (r'className="fixed inset-0 z-45 bg-black/60',
     'className="fixed inset-0 z-45 bg-foreground/40'),
    # Story sidebar bg
    (r'"var\(--surface-sidebar\)", borderLeft: `1px solid oklch\(0\.25 0\.04 260 \/ 60%\)`',
     '"var(--surface-sidebar)", borderLeft: "1px solid var(--surface-sidebar-border)"'),
    # TerminalBlock chrome bar remaining hardcode
    (r'"1px solid oklch\(0\.18 0\.04 260 / 60%\)"', '"1px solid var(--surface-border-light)"'),
    # CalloutBox background
    (r'background: `\$\{accent\}05`', 'background: `color-mix(in oklch, ${accent} 5%, var(--card))`'),
    (r'border: `1px solid \$\{accent\}18`', 'border: `1px solid color-mix(in oklch, ${accent} 25%, transparent)`'),
]

# ─────────────────────────────────────────────────────────────
# Timeline-specific fixes
# ─────────────────────────────────────────────────────────────
TIMELINE_FIXES = COMMON_FIXES + [
    # Page wrapper  
    (r'style=\{\{ background: "var\(--background\)" \}\}', ''),
    # Calendar view toggle
    (r'background: viewMode === "calendar" \? "var\(--neon-cyan\)" : "transparent"',
     'background: viewMode === "calendar" ? "var(--primary)" : "transparent"'),
    (r'color: viewMode === "calendar" \? "black" : "var\(--muted-foreground\)"',
     'color: viewMode === "calendar" ? "var(--primary-foreground)" : "var(--muted-foreground)"'),
    (r'background: viewMode === "heatmap" \? "var\(--neon-cyan\)" : "transparent"',
     'background: viewMode === "heatmap" ? "var(--primary)" : "transparent"'),
    (r'color: viewMode === "heatmap" \? "black" : "var\(--muted-foreground\)"',
     'color: viewMode === "heatmap" ? "var(--primary-foreground)" : "var(--muted-foreground)"'),
]

def process_file(path, fixes, label):
    with open(path, encoding='utf-8') as f:
        content = f.read()
    
    original = content
    content = apply_fixes(content, fixes)

    # Count remaining text-white
    remaining_tw = content.count('text-white')
    remaining_raw_oklch = len(re.findall(r'"oklch\(0\.[01][0-9] ', content))

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

    changed = sum(1 for a, b in zip(original.splitlines(), content.splitlines()) if a != b)
    print(f"[{label}] lines changed: {changed}")
    print(f"[{label}] remaining text-white: {remaining_tw}")
    print(f"[{label}] remaining raw dark oklch: {remaining_raw_oklch}")

process_file('src/routes/story.tsx',    STORY_FIXES,    'story')
process_file('src/routes/timeline.tsx', TIMELINE_FIXES, 'timeline')
print("Done — UTF-8 preserved.")
