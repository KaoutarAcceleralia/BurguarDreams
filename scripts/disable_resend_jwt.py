#!/usr/bin/env python3
"""Desactiva verify_jwt en la Edge Function resend-email (arregla 401 con clave publishable)."""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT / ".env"
SLUG = "resend-email"


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        return env
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def api_request(method: str, url: str, token: str, body: object | None = None) -> object:
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {detail}") from e


def main() -> int:
    env = load_env()
    token = env.get("SUPABASE_ACCESS_TOKEN", "").strip()
    project_ref = env.get("SUPABASE_PROJECT_REF", "yscbwngotgbkytmzogol").strip()

    if not token:
        print("Añade a .env tu token personal de Supabase:", file=sys.stderr)
        print("  SUPABASE_ACCESS_TOKEN=sbp_...", file=sys.stderr)
        print("  https://supabase.com/dashboard/account/tokens", file=sys.stderr)
        print(file=sys.stderr)
        print("Alternativa sin token: Dashboard → Edge Functions → resend-email", file=sys.stderr)
        print('  → desactiva "Verify JWT" / "Enforce JWT Verification"', file=sys.stderr)
        return 1

    base = f"https://api.supabase.com/v1/projects/{project_ref}/functions"
    functions = api_request("GET", base, token)
    if not isinstance(functions, list):
        raise RuntimeError(f"Respuesta inesperada al listar funciones: {functions!r}")

    target = next((f for f in functions if f.get("slug") == SLUG), None)
    if not target:
        print(f"No existe la función '{SLUG}' en el proyecto.", file=sys.stderr)
        return 1

    fn_id = target.get("id")
    version = target.get("version", 1)
    if not fn_id:
        raise RuntimeError(f"La función '{SLUG}' no tiene id en la API: {target!r}")

    body = [
        {
            "id": fn_id,
            "slug": SLUG,
            "name": target.get("name") or SLUG,
            "status": target.get("status") or "ACTIVE",
            "version": version,
            "verify_jwt": False,
        }
    ]

    print(f"Actualizando {SLUG}: verify_jwt=false (versión {version})…")
    api_request("PUT", base, token, body)
    print("Listo. Prueba el formulario: resend-email debe responder 200 (o 5xx si falta RESEND_API_KEY).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
