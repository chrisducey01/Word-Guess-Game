
/*
   GLOBAL VARIABLES
*/
const maxGuesses = 5;
const wordArray = [
    {wordToGuess: "Ghostbusters", imgSrc: "assets/images/ghostbusters.jpg"},
    {wordToGuess: "Stripes", imgSrc: "assets/images/stripes.jpg"},
    {wordToGuess: "Groundhog Day", imgSrc: "assets/images/groundhog_day.jpg"},
    {wordToGuess: "CaddyShack", imgSrc: "assets/images/caddyshack.jpg"},
    {wordToGuess: "Lost in Translation", imgSrc: "assets/images/lost_in_translation.jpg"},
    {wordToGuess: "Scrooged", imgSrc: "assets/images/scrooged.jpg"},
    {wordToGuess: "Kingpin", imgSrc: "assets/images/kingpin.jpg"},
    {wordToGuess: "What About Bob", imgSrc: "assets/images/what_about_bob.jpg"},
    {wordToGuess: "ZombieLand", imgSrc: "assets/images/zombieland.jpg"},
    {wordToGuess: "Meatballs", imgSrc: "assets/images/meatballs.jpg"}
];

const guessImgPath = "assets/images/question_mark.png";
const loseImgPath = "assets/images/game_over.png";


//grab elements from the html by id
var instructionTextObject = document.getElementById("instructions");
var lettersObject = document.getElementById("letters");
var guessesObject = document.getElementById("guesses");
var guessedLettersObject = document.getElementById("guessedLetters");
var scoreObject = document.getElementById("score");
var imageObject = document.getElementById("answerImage");

var gameObject = {
    wordsToGuessArray : wordArray.slice(),
    wordsGuessed : [],
    wordArrayPos : -1,

    wordToGuess : "",
    guessesRemaining : 0,
    winCount : 0,
    gameOver : false,
    allWordsGuessed : false,
    currentWordGuessed : false,

    instructionText : "",
    lettersGuessed : [],        //keep track of letters guessed, no repeat letters
    wrongLettersGuessed : [],   //subset of letters guessed that  are letters not in the word
    gameBoardWordDisplay : [],  //starts by displaying the word masked with "_" for each letter
    letterGuessed : "",


    getNewWord : function() {
        var newWord;
        

        if(this.wordsToGuessArray.length < 1){
            newWord = "";
            this.wordArrayPos = -1;
        }
        else
        {
            var randomNum = Math.floor(Math.random() * this.wordsToGuessArray.length);
            newWord = this.wordsToGuessArray[randomNum].wordToGuess;
            this.wordArrayPos = randomNum;
        }
    
        return newWord;
    },

    buildMaskedWord : function(word) {
        var maskedWord = [];
        for (var i = 0; i < word.length; i++) {
            if (word[i] === " ") {
                maskedWord.push("|");
            }
            else {
                maskedWord.push("_");
            }
        }
        return maskedWord;
    },

    unmaskLetters : function(maskedWord, unmaskedWord, positions) {
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
            maskedWord[pos] = unmaskedWord[pos];
        }
        return maskedWord;
    },

    initNewGame : function() {
        this.winCount = 0;
        scoreObject.textContent = this.winCount;
        this.allWordsGuessed = false;
        this.currentWordGuessed = false;
        this.gameOver = false;
        this.wordsGuessed = [];
        this.wordsToGuessArray = wordArray.slice();
        console.log(this.wordsToGuessArray);
        console.log(wordArray);
        this.initGameTurn();
    },

    initGameTurn : function() {
        this.wordToGuess = this.getNewWord();
        console.log("initGameTurn: word to guess is: " + this.wordToGuess);
        this.currentWordGuessed = false;
        this.lettersGuessed = [];
        this.wrongLettersGuessed = [];
    
        if (this.wordToGuess.length > 0) {
            imageObject.setAttribute("src",guessImgPath);
            this.gameBoardWordDisplay = this.buildMaskedWord(this.wordToGuess);
            lettersObject.textContent = this.gameBoardWordDisplay.join(' ');
            this.instructionText = "Press any letter to start guessing";
            instructionTextObject.textContent = this.instructionText;
            this.guessesRemaining = maxGuesses;
            guessesObject.textContent = "Guesses Remaining: " + this.guessesRemaining;
            this.lettersGuessed = [];
            guessedLettersObject.textContent = this.lettersGuessed.join(' ');
        }
    
    },    
    
    findLetterOccurences : function(array, letter) {
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
    },

    moveGuessedWord : function(){
        this.wordsGuessed.push(this.wordsToGuessArray.splice(this.wordArrayPos,1));
    }
    
};

/*
  Name:  getNewWord

  Purpose:  Pulls a new word out of the master word array.  Makes
    sure the word isn't one that has already been guessed.

  Returns:  string  (the new word to guess)
*/

document.onkeyup = function (event) {
    gameObject.letterGuessed = event.key.toLowerCase();

    if (gameObject.currentWordGuessed && !gameObject.gameOver) {
        gameObject.initGameTurn();

        //If no words are returned, the game is over and the user guessed all the words
        if(gameObject.wordToGuess.length == 0){
            console.log("Game is over you guessed all the words");
            gameObject.instructionText = "Congratulations!  You guessed all of the words!  Huzzah!  Press any key to begin a new game.";
            instructionTextObject.textContent =  gameObject.instructionText;
            gameObject.gameOver = true;
            gameObject.allWordsGuessed = true;
        }
    }
    else if (gameObject.gameOver) {
        console.log("Game is over");
        gameObject.initNewGame();
        console.log("stuff");
    }
    else if( (gameObject.letterGuessed.length == 1) && (gameObject.letterGuessed.search(/[a-z]/g) >= 0) ){

        //Check to make sure the letter hasn't been guessed yet before playing it
        if (gameObject.lettersGuessed.indexOf(gameObject.letterGuessed) === -1) {
            gameObject.lettersGuessed.push(gameObject.letterGuessed);
            var positions = gameObject.findLetterOccurences(gameObject.wordToGuess, gameObject.letterGuessed);

            //GUESSED WRONG!
            //If the letter wasn't found at all in the word  to guess, tell them to try again
            //Decrease the amount of guesses remaining
            if (positions.length < 1) {
                gameObject.instructionText = "Sorry, the letter '" + gameObject.letterGuessed + "' isn't in the word.";
                instructionTextObject.textContent = gameObject.instructionText;
                gameObject.guessesRemaining--;
                guessesObject.textContent = "Guesses Remaining: " + gameObject.guessesRemaining;
                gameObject.wrongLettersGuessed.push(gameObject.letterGuessed);
                guessedLettersObject.textContent = gameObject.wrongLettersGuessed.join(' ');

                //Check if they used up all their guesses
                //NOTE:  Still need to add in text to update the words on the screen so they know they lost
                if (gameObject.guessesRemaining < 1) {
                    gameObject.gameOver = true;
                    gameObject.instructionText = "Well shucky darn you used up all your guesses.  Looks like you lose the game.  Press any key to start a new game.";
                    instructionTextObject.textContent = gameObject.instructionText;
                    imageObject.setAttribute("src", loseImgPath);
                }
            }
            //GUESSED RIGHT!
            //Letter was found, unmask the letter every place it was found in the word
            else {
                gameObject.instructionText = "Nice job!  The letter '" + gameObject.letterGuessed + "' is in the word.";
                instructionTextObject.textContent = gameObject.instructionText;
                gameObject.gameBoardWordDisplay = gameObject.unmaskLetters(gameObject.gameBoardWordDisplay, gameObject.wordToGuess, positions);
                lettersObject.textContent = gameObject.gameBoardWordDisplay.join(' ');

                //If the word is guessed, they won that round
                if (gameObject.gameBoardWordDisplay.indexOf("_") === -1) {
                    gameObject.currentWordGuessed = true;
                    gameObject.winCount++;
                    scoreObject.textContent = gameObject.winCount;
                    gameObject.instructionText = "Nice job you guessed the word!  Press any key to guess a new word.";
                    instructionTextObject.textContent = gameObject.instructionText;
                    imageObject.setAttribute("src",gameObject.wordsToGuessArray[gameObject.wordArrayPos].imgSrc);
                    gameObject.moveGuessedWord();
                }
            }

        }
        //Otherwise make them guess again
        else {
            gameObject.instructionText = "You've already guessed the letter '" + gameObject.letterGuessed + "'.  Try another one.";
            instructionTextObject.textContent = gameObject.instructionText;
        }
    }
};


/*
   MAIN LOGIC GOES BELOW
*/

gameObject.initNewGame();