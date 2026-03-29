# CasasVigo Project

## Architecture Overview
Two separate services + two separate skills:
- **whatsapp-api** (transport) + **whatsapp skill** (raw messaging)
- **elbenxo-bot** (brain) + **elbenxo-bot skill** (contacts, personality, scheduler)
- See [docs/whatsapp-architecture.md](docs/whatsapp-architecture.md) for full details

## Environment Notes
- Platform: Windows (win32), user runs PowerShell
- Python is NOT installed — use Node.js for all scripting (not bash)
- Bash `ls` with backslash paths can fail — use forward slashes or `dir`
- Git has no global user config set on this machine
- `execSync` spawns visible terminal windows on Windows — use `execFileSync` with `windowsHide: true`
- Scripts that launch `claude -p` must use `execFileSync` + `input` option to pipe stdin, not temp files or shell redirection
