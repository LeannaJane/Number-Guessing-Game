# Number-Guessing-Game


A CLI (command line interface) number guessing game.

This project is a solution for: https://roadmap.sh/projects/number-guessing-game

---

## Features
- Dynamic difficulty modes (easy, med, hard)
- Time stamps for testing the users speed at guessing the number
- SQL database usage - this game saves the data to game_history.db and outputs the stats to the user.
- Fail safe constraits - validation to catch any invalid inputs

---
### Presequites

Ensure you have Node.js installed on your machine (v18+ recommended). If you are on Fedora, you can install it via:
```bash
sudo dnf install nodejs
```
How to install SQL:
```bash
The project relies on two core database dependencies:
1. `sqlite3` - The core binary engine database driver for SQLite.
2. `sqlite` - The modern, promise-based API wrapper that enables clean `async/await` syntax.
```

How to install npm:

```bash
npm install
```

How to Run:

```bash
node index.js
```


Game usage Screenshots:
<img width="916" height="632" alt="image" src="https://github.com/user-attachments/assets/10d48a04-a254-4420-9095-c5fa61202d5b" />

<img width="916" height="632" alt="image" src="https://github.com/user-attachments/assets/86b0a8b4-a2db-4ef5-8bcc-6ecc82590de7" />

