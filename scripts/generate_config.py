#!/usr/bin/env python3
"""Generate js/config.js from .env variables."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"
OUTPUT = ROOT / "js" / "config.js"


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    if not path.exists():
        raise SystemExit(f"Missing {path}. Copy .env.example to .env and fill in values.")
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def main() -> None:
    env = load_env(ENV_FILE)
    url = env.get("SUPABASE_URL")
    key = env.get("SUPABASE_KEY")
    if not url or not key:
        raise SystemExit(".env must define SUPABASE_URL and SUPABASE_KEY")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        f'const SUPABASE_URL = "{url}";\n'
        f'const SUPABASE_KEY = "{key}";\n'
        "const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);\n"
        "let currentPropertyId = null;\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
