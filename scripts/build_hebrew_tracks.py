"""Backward-compatible entry point for the three Hebrew track builders."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

if __name__ == "__main__":
    requested = sys.argv[1:] or ["Aleph", "Bet", "Gimel"]
    for track in requested:
        if track not in {"Aleph", "Bet", "Gimel"}:
            raise SystemExit(f"Unknown track: {track}")
        script = "build_bet_track.py" if track == "Bet" else "build_foundation_tracks.py"
        subprocess.run([sys.executable, str(ROOT / "scripts" / script), track], check=True)
