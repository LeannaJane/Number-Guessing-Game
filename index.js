import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const db = await open({
    filename: './game_history.db',
    driver: sqlite3.Database
});


async function WelcomeText(name) {
    const answer = await rl.question("Do you want to play the number guessing game? yes/no ")
    let answerUpper = answer.toUpperCase()

    if (answerUpper === "YES" || answerUpper === "Y") {
        let maxAttempts = 20;
        let modeName = "Medium";

        while (true) {
            console.log("\nWhat level do you want to play?");
            console.log("1. Easy - 50 Guesses");
            console.log("2. Medium - 20 Guesses");
            console.log("3. Hard - 5 Guesses");
            console.log("4. Exit");

            const choiceInput = await rl.question("\nEnter your choice: ");
            const choice = parseInt(choiceInput, 10);
            
            let isValid = false;

            switch (choice) {
                case 1:
                    console.log("\nWelcome to Easy mode!");
                    maxAttempts = 50;
                    modeName = "Easy";
                    isValid = true;
                    break;
                case 2:
                    console.log("\nWelcome to Medium mode!");
                    maxAttempts = 20;
                    modeName = "Medium";
                    isValid = true;
                    break;
                case 3: 
                    console.log("\nWelcome to Hard mode!");
                    maxAttempts = 5;
                    modeName = "Hard";
                    isValid = true;
                    break;
                case 4:
                    console.log("Exiting Game...");
                    return false; 
                default:
                    console.log("\nInvalid choice! Please enter a number between 1 and 4.");
                    break;
            }
            
            if (isValid) {
                break; 
            } 
        } 
        return { maxAttempts, modeName };
    }
    else {
        return false; 
    }
}

function GetRandomNumber() {
    let randomNum = Math.floor(Math.random() * 100) + 1;
    return randomNum;
}

async function GuessNumber(rl, randomNum, maxAttempts, name) {
    let chances = 0;
    let guessedNumbers = [];

    const startTime = Date.now();
    while (chances < maxAttempts) {
       
        const answer = await rl.question("Number Choice: ");
        const parsedAnswer = parseInt(answer, 10);

        if (isNaN(parsedAnswer)) {
            console.log("Please enter a valid number!");
            continue;
        }

        if (guessedNumbers.includes(parsedAnswer)) {
            console.log("This number has already been guessed!");
            continue;
        }

        if (parsedAnswer < 1 || parsedAnswer > 100) {
            console.log("This number should be between 1-100");
            continue;
        }

        guessedNumbers.push(parsedAnswer);
        chances++;
        
        if (parsedAnswer == randomNum) {
            const endTime = Date.now();
            const totalTimeSeconds = ((endTime - startTime) / 1000).toFixed(1); 
            
            const totalAttempts = guessedNumbers.length; 
            const attemptWord = totalAttempts === 1 ? "attempt" : "attempts";
            
            console.log(`Yay, you guessed the Number ${parsedAnswer} in ${totalAttempts} ${attemptWord}!`);
            console.log(`It took you exactly ${totalTimeSeconds} seconds.`);
            
            return { playerName: name, outcome: "WON", attempts: totalAttempts, time: totalTimeSeconds };
        }
        else {
            console.log("Incorrect - Try again!")
        }
    } 
    const endTime = Date.now();
    const totalTimeSeconds = ((endTime - startTime) / 1000).toFixed(1);

    console.log(`\nOops, you lost! The number was: ${randomNum}`);
    console.log(`You spent ${totalTimeSeconds} seconds guessing.`);
    return { playerName: name, outcome: "LOST", attempts: guessedNumbers.length, time: totalTimeSeconds };
}


async function ShowStats() {
    console.log("\n===============================================================");
    console.log("            PLAYER SCOREBOARD          ");
    console.log("=================================================================");

    try {
        const rows = await db.all(`SELECT player_name, difficulty, outcome, attempts, time_seconds, played_at FROM game_logs ORDER BY id DESC`);

        if (rows.length === 0) {
            console.log("No match logs found yet! Go play a game to set some records.");
            return;
        }

        console.log(String("NAME").padEnd(12) + " | " + String("MODE").padEnd(8) + " | " + String("RESULT").padEnd(7) + " | " + String("GUESSES").padEnd(7) + " | " + "TIME");
        console.log("-------------------------------------------------------------");
        
        rows.forEach(row => {
            console.log(
                String(row.player_name).padEnd(12) + " | " + 
                String(row.difficulty).padEnd(8) + " | " + 
                String(row.outcome).padEnd(7) + " | " + 
                String(row.attempts).padEnd(7) + " | " + 
                `${row.time_seconds}s`
            );
        });
    } catch (err) {
        console.log("Could not read statistics from database:", err.message);
    }
    console.log("=============================================\n");
}


async function main() {

    await db.run(`
        CREATE TABLE IF NOT EXISTS game_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT,
            difficulty TEXT,
            outcome TEXT,
            attempts INTEGER,
            time_seconds REAL,
            played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    let keepRunningApp = true;
    console.log("============================================");
    console.log("Welcome to the number guessing game!");
    console.log("============================================");

    const name = await rl.question("What is your name? ");
    while (keepRunningApp) {
        console.log(`\n--- MAIN MENU ---`);
        console.log("1. Play Game");
        console.log("2. View Scoreboard Stats");
        console.log("3. Exit");
        
        const menuChoice = await rl.question("\nSelect an option (1-3): ");

        if (menuChoice === "1") {
            const gameConfig = await WelcomeText(name);

            if (gameConfig) {
                const randomNum = GetRandomNumber();
                const stats = await GuessNumber(rl, randomNum, gameConfig.maxAttempts, name); 

                await db.run(
                    `INSERT INTO game_logs (player_name, difficulty, outcome, attempts, time_seconds) VALUES (?, ?, ?, ?, ?)`,
                    [stats.playerName, gameConfig.modeName, stats.outcome, stats.attempts, stats.time]
                );
                console.log("Match stats successfully saved to SQL database.");
            }
        } 
        else if (menuChoice === "2") {
            await ShowStats();
        } 
        else if (menuChoice === "3") {
            keepRunningApp = false;
        } 
        else {
            console.log("Invalid choice! Please enter 1, 2, or 3.");
        }
    }

    console.log("\nThanks for playing!");
    rl.close(); 
    await db.close(); 
}

main();