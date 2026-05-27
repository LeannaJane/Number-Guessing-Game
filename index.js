import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function WelcomeText() {
    console.log("============================================");
    console.log("Welcome to the number guessing game!");
    console.log("============================================");

    const name = await rl.question("What is your name? ")
    console.log(`Hello, ${name}!`);

    const answer = await rl.question("Do you want to play the number guessing game? yes/no ")
    let answerUpper = answer.toUpperCase()

    if (answerUpper === "YES" || answerUpper === "Y") {
        let maxAttempts = 20;

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
                    isValid = true;
                    break;
                case 2:
                    console.log("\nWelcome to Medium mode!");
                    maxAttempts = 20;
                    isValid = true;
                    break;
                case 3: 
                    console.log("\nWelcome to Hard mode!");
                    maxAttempts = 5;
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
        return maxAttempts;
    }
    else {
        return false; 
    }
}

function GetRandomNumber() {
    let randomNum = Math.floor(Math.random() * 100) + 1;
    return randomNum;
}

async function GuessNumber(rl, randomNum, maxAttempts) {
    let chances = 0;
    let guessedNumbers = [];

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
            console.log(`Yay, you guessed the Number ${parsedAnswer}`);
            return true;
        }
        else {
            console.log("Incorrect - Try again!")
        }
    } 
    console.log(`\nOops, you lost! The number was: ${randomNum}`);
    return false;
}

async function main() {
    let keepPlaying = true;

    while (keepPlaying) {
        const maxAttempts = await WelcomeText();

        if (!maxAttempts) {
            break;
        }
        const randomNum = GetRandomNumber();
        await GuessNumber(rl, randomNum, maxAttempts); 

        const playAgain = await rl.question("\nDo you want to play again? ");

        if (playAgain.toUpperCase() !== "YES" && playAgain.toUpperCase() !== "Y") {
            keepPlaying = false; 
        }
    }
    console.log("Thanks for playing!");
    rl.close(); 
}

main();