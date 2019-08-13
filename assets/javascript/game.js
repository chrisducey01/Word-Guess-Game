
/*
   GLOBAL VARIABLES
*/
const maxGuesses = 5;

//globals used throughout each round
var wordsToGuess = ["Stripes","Ghostbusters","Groundhog Day","Caddyshack","Lost in Translation","Scrooged","Kingpin","What About Bob","Zombieland","Meatballs"];
var wordsGuessed = [];  //keep track of words guessed as user successfully moves through them
var wordToGuess;  //the word to guess for each game, pulled from the array
var guessesRemaining;
var winCount = 0;
var gameOver = false;
var allWordsGuessed = false;
var currentWordGuessed = false;

//globals used and reset after each word is guessed
var instructionText;
var lettersGuessed = [];   //keep track of letters guessed, no repeat letters
var wrongLettersGuessed = [];   //subset of letters guessed that  are letters not in the word
var gameBoardWordDisplay = [];  //starts by displaying the word masked with "_" for each letter
var letterGuessed;

//grab elements from the html by id
var instructionTextObject = document.getElementById("instructions");
var lettersObject = document.getElementById("letters");
var guessesObject = document.getElementById("guesses");
var guessedLettersObject = document.getElementById("guessedLetters");
var scoreObject = document.getElementById("score");

/*
  FUNCTIONS GO BELOW HERE
*/

/*
  Name:  getNewWord

  Purpose:  Pulls a new word out of the master word array.  Makes
    sure the word isn't one that has already been guessed.

  Returns:  string  (the new word to guess)
*/
function getNewWord() {
    var newWord;

    for (var i = 0; i < wordsToGuess.length; i++) {
        if (wordsGuessed.indexOf(wordsToGuess[i]) === -1) {
            newWord = wordsToGuess[i];
            break;
        }
    }

    return newWord;
}

function buildMaskedWord(word) {
    var maskedWord = [];
    for (var i = 0; i < word.length; i++) {
        console.log(word[i]);
        if(word[i] === " "){
            maskedWord.push("|");
        }
        else{
            maskedWord.push("_");
        }
    }
    return maskedWord;
}

function findLetterOccurences(array, letter) {
    var arrayPositions = [];
    var indexPos = -1;

    do {
        if (indexPos === -1) {
            indexPos = array.toLowerCase().indexOf(letter);
        }
        else {
            indexPos = array.toLowerCase().indexOf(letter, indexPos + 1);
        }

        if (indexPos > -1) {
            arrayPositions.push(indexPos);
        }
    } while (indexPos > -1)
    return arrayPositions;
}

function unmaskLetters(maskedWord, unmaskedWord, positions) {
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        maskedWord[pos] = unmaskedWord[pos];
    }
    return maskedWord;
}

function initGameTurn() {
    wordToGuess = getNewWord();
    currentWordGuessed = false;
    lettersGuessed = [];
    wrongLettersGuessed = [];

    if (wordToGuess.length > 0) {
        gameBoardWordDisplay = buildMaskedWord(wordToGuess);
        console.log(gameBoardWordDisplay);
        lettersObject.textContent = gameBoardWordDisplay.join(' ');
        instructionText = "Press any letter to start guessing";
        instructionTextObject.textContent = instructionText;
        guessesRemaining = maxGuesses;
        guessesObject.textContent = "Guesses Remaining: " + guessesRemaining;    
        lettersGuessed = [];
        guessedLettersObject.textContent = lettersGuessed.join(' ');
    }
    else {
        allWordsGuessed = true;
        gameOver = true;
    }

}

function initNewGame(){
    winCount = 0;
    scoreObject.textContent = winCount;
    allWordsGuessed = false;
    currentWordGuessed = false;
    gameOver = false;
    wordsGuessed = [];
    initGameTurn();
}


document.onkeyup = function (event) {
    letterGuessed = event.key.toLowerCase();

    if (currentWordGuessed) {
        initGameTurn();
    }
    else if (gameOver) {
        initNewGame();
    }
    else {

        //Check to make sure the letter hasn't been guessed yet before playing it
        if (lettersGuessed.indexOf(letterGuessed) === -1) {
            lettersGuessed.push(letterGuessed);
            var positions = findLetterOccurences(wordToGuess, letterGuessed);

            //GUESSED WRONG!
            //If the letter wasn't found at all in the word  to guess, tell them to try again
            //Decrease the amount of guesses remaining
            if (positions.length < 1) {
                instructionText = "Sorry, the letter '" + letterGuessed + "' isn't in the word.";
                instructionTextObject.textContent = instructionText;
                guessesRemaining--;
                guessesObject.textContent = "Guesses Remaining: " + guessesRemaining;
                wrongLettersGuessed.push(letterGuessed);
                guessedLettersObject.textContent = wrongLettersGuessed.join(' ');

                //Check if they used up all their guesses
                //NOTE:  Still need to add in text to update the words on the screen so they know they lost
                if(guessesRemaining < 1){
                    gameOver = true;
                    instructionText = "Well shucky darn you used up all your guesses.  Looks like you lose the game.  Press any key to start a new game.";
                    instructionTextObject.textContent = instructionText;
                }
            }
            //GUESSED RIGHT!
            //Letter was found, unmask the letter every place it was found in the word
            else {
                instructionText = "Nice job!  The letter '" + letterGuessed + "' is in the word.";
                instructionTextObject.textContent = instructionText;
                gameBoardWordDisplay = unmaskLetters(gameBoardWordDisplay, wordToGuess, positions);
                lettersObject.textContent = gameBoardWordDisplay.join(' ');

                //If the word is guessed, they won that round
                if (gameBoardWordDisplay.indexOf("_") === -1) {
                    currentWordGuessed = true;
                    winCount++;
                    scoreObject.textContent = winCount;
                    wordsGuessed.push(wordToGuess);
                    instructionText = "Nice job you guessed the word!  Press any key to guess a new word.";
                    instructionTextObject.textContent = instructionText;
                }
            }

        }
        //Otherwise make them guess again
        else {
            instructionText = "You've already guessed the letter '" + letterGuessed + "'.  Try another one.";
            instructionTextObject.textContent = instructionText;
        }
    }
};


/*
   MAIN LOGIC GOES BELOW
*/

initNewGame();