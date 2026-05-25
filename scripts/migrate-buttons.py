#!/usr/bin/env python3
"""Migra <button className={btnX}> ... </button> y <Link className=\"btn-...\"> ... </Link> a primitivos."""
import os, re

VARIANT_MAP = {
    'btnPrimary': ('primary', 'sm'),
    'btnSecondary': ('secondary', 'sm'),
    'btnDanger': ('danger', 'sm'),
}

CSS_MAP = {
    'btn-primary-sm': ('primary', 'sm'),
    'btn-secondary-sm': ('secondary', 'sm'),
    'btn-primary': ('primary', 'md'),
    'btn-secondary': ('secondary', 'md'),
    'btn-danger': ('danger', 'sm'),
}

def find_matching_close(src: str, open_end: int, tag: str) -> int:
    open_re = re.compile(rf'<{tag}[\s>]')
    close_re = re.compile(rf'</{tag}>')
    depth = 1
    pos = open_end
    while depth > 0:
        next_open = open_re.search(src, pos)
        next_close = close_re.search(src, pos)
        if not next_close:
            return -1
        if next_open and next_open.start() < next_close.start():
            depth += 1
            pos = next_open.end()
        else:
            depth -= 1
            if depth == 0:
                return next_close.start()
            pos = next_close.end()
    return -1

def migrate(src, tag, new_tag, attr_pattern, build_replace_attrs):
    """Generic: find <tag ... attr ...> ... </tag> and replace."""
    count = 0
    while True:
        m = re.search(rf'<{tag}((?:[^<>]|<(?!/?{tag}))*?)\b{attr_pattern}((?:[^<>]|<(?!/?{tag}))*?)>', src, re.S)
        if not m:
            break
        groups = m.groups()
        before = groups[0]
        after = groups[-1]
        middle_groups = groups[1:-1]
        new_attrs = build_replace_attrs(before, after, middle_groups)
        if new_attrs is None:
            break
        new_open = f'<{new_tag} {new_attrs}>'.replace('  ', ' ').replace('< ', '<')
        close_idx = find_matching_close(src, m.end(), tag)
        if close_idx == -1:
            print(f"WARN unbalanced {tag} at {m.start()}")
            break
        src = src[:m.start()] + new_open + src[m.end():close_idx] + f'</{new_tag}>' + src[close_idx+len(f'</{tag}>'):]
        count += 1
    return src, count

def build_const(before, after, mids):
    const = mids[0]
    variant, size = VARIANT_MAP[const]
    attrs = (before + after).strip()
    return f'{attrs} variant="{variant}" size="{size}"'.strip()

def build_css(before, after, mids):
    full_class = mids[0]
    classes = full_class.split()
    btn_cls = next((c for c in classes if c in CSS_MAP), None)
    if not btn_cls:
        return None
    variant, size = CSS_MAP[btn_cls]
    remaining = [c for c in classes if c != btn_cls]
    extra = f' className="{" ".join(remaining)}"' if remaining else ''
    attrs = (before + after).strip()
    return f'{attrs} variant="{variant}" size="{size}"{extra}'.strip()

CONST_PATTERN = r'className=\{(btnPrimary|btnSecondary|btnDanger)\}'
CSS_PATTERN = r'className="([^"]*\bbtn-(?:primary|secondary|danger)(?:-sm)?\b[^"]*)"'

for root, dirs, files in os.walk('apps/web/src'):
    for fn in files:
        if not fn.endswith('.tsx'): continue
        path = os.path.join(root, fn)
        src = open(path).read()
        orig = src
        src, c1 = migrate(src, 'button', 'Button', CONST_PATTERN, build_const)
        src, c2 = migrate(src, 'button', 'Button', CSS_PATTERN, build_css)
        src, c3 = migrate(src, 'Link', 'LinkButton', CONST_PATTERN, build_const)
        src, c4 = migrate(src, 'Link', 'LinkButton', CSS_PATTERN, build_css)
        if src != orig:
            open(path, 'w').write(src)
            print(f"{path}: button(+{c1+c2}) link(+{c3+c4})")
