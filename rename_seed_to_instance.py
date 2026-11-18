"""Rename the user-facing word "seed" to "instance" on every generator page.

Run from the repository root:
    python rename_seed_to_instance.py            # apply the changes
    python rename_seed_to_instance.py --dry-run  # only report what would change

Only visible page text is edited: text between HTML tags, outside <script> and
<style> blocks. Code (seedIn, newSeed, curSeed, the error-form field key, the
URL hash) is never touched, so the pages keep working and old links still load.
Running the script twice is harmless.
"""
import pathlib
import re
import sys

LABEL = "Instance"            # text of the label next to the number box
BUTTON = "Load Instance"      # text of the button that loads the number

# ----- ordered word replacements for running text
WORDS = [
    (r"\bLoad [Ss]eed\b", BUTTON),
    (r"\ba seed\b", "an instance"),
    (r"\bA seed\b", "An instance"),
    (r"\bseeds\b", "instances"),
    (r"\bSeeds\b", "Instances"),
    (r"\bseed\b", "instance"),
    (r"\bSeed\b", LABEL),
]

BLOCK = re.compile(r"(<script\b.*?</script>|<style\b.*?</style>)", re.S | re.I)
TAG = re.compile(r"(<[^>]*>)")


def fix_text(text):
    for pat, rep in WORDS:
        text = re.sub(pat, rep, text)
    return text


def fix_page(src):
    out = []
    for part in BLOCK.split(src):
        if BLOCK.fullmatch(part):
            out.append(part)
            continue
        pieces = TAG.split(part)
        out.append("".join(p if TAG.fullmatch(p) else fix_text(p) for p in pieces))
    return "".join(out)


def main():
    dry = "--dry-run" in sys.argv
    root = pathlib.Path(".")
    changed = 0
    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts:
            continue
        src = path.read_text(encoding="utf-8")
        new = fix_page(src)
        if new != src:
            changed += 1
            print(("would update " if dry else "updated ") + str(path))
            if not dry:
                path.write_text(new, encoding="utf-8")
    print(f"{changed} file(s) {'would change' if dry else 'changed'}")


if __name__ == "__main__":
    main()
