#!/usr/bin/env python3
"""Auto-add missing typography imports."""
import os, re

TYPO = ['Title','SectionTitle','CardTitle','Subtitle','BodyStrong','Muted','Overline','Caption','Body']

for root, dirs, files in os.walk('apps/web/src'):
    for fn in files:
        if not fn.endswith('.tsx'): continue
        path = os.path.join(root, fn)
        src = open(path).read()
        used = [c for c in TYPO if re.search(rf'<{c}[ />]', src)]
        if not used: continue
        imports = '\n'.join(re.findall(r'^import .+$', src, re.M))
        missing = [c for c in used if not re.search(rf'(\W|^){c}(\W|$)', imports)]
        if not missing: continue
        m = re.search(r"^import\s*\{([^}]+)\}\s*from\s*'@/shared/ui'\s*;?\s*$", src, re.M)
        if m:
            existing = [s.strip() for s in m.group(1).split(',') if s.strip()]
            new_list = existing + missing
            new_import = "import { " + ", ".join(new_list) + " } from '@/shared/ui';"
            src = src[:m.start()] + new_import + src[m.end():]
        else:
            lines = src.split('\n')
            last_import = 0
            for i, ln in enumerate(lines):
                if ln.startswith('import '):
                    last_import = i
            new_import = "import { " + ", ".join(missing) + " } from '@/shared/ui';"
            lines.insert(last_import + 1, new_import)
            src = '\n'.join(lines)
        open(path, 'w').write(src)
        print(f"updated {path}: added {missing}")
