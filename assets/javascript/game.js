
/*
   GLOBAL VARIABLES
*/
const maxGuesses = 8;
const wordArray = [
    { wordToGuess: "Ghostbusters", imgSrc: "assets/images/ghostbusters.jpg" },
    { wordToGuess: "Stripes", imgSrc: "assets/images/stripes.jpg" },
    { wordToGuess: "Groundhog Day", imgSrc: "assets/images/groundhog_day.jpg" },
    { wordToGuess: "CaddyShack", imgSrc: "assets/images/caddyshack.jpg" },
    { wordToGuess: "Lost in Translation", imgSrc: "assets/images/lost_in_translation.jpg" },
    { wordToGuess: "Scrooged", imgSrc: "assets/images/scrooged.jpg" },
    { wordToGuess: "Kingpin", imgSrc: "assets/images/kingpin.jpg" },
    { wordToGuess: "What About Bob", imgSrc: "assets/images/what_about_bob.jpg" },
    { wordToGuess: "Zombieland", imgSrc: "assets/images/zombieland.jpg" },
    { wordToGuess: "Meatballs", imgSrc: "assets/images/meatballs.jpg" }
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
    wordsToGuessArray: wordArray.slice(),
    wordsGuessed: [],
    wordArrayPos: -1,

    wordToGuess: "",
    guessesRemaining: 0,
    winCount: 0,
    gameOver: false,
    allWordsGuessed: false,
    currentWordGuessed: false,
    loseSoundFile : "assets/sounds/sadtrombone.wav",
    winSoundFile : "assets/sounds/yay.wav",

    instructionText: "",
    lettersGuessed: [],        //keep track of letters guessed, no repeat letters
    wrongLettersGuessed: [],   //subset of letters guessed that  are letters not in the word
    gameBoardWordDisplay: [],  //starts by displaying the word masked with "_" for each letter
    gameBoardHtmlObjects: [],  //an h2 object for each word in the gameBoardWordDisplay array
    letterGuessed: "",

    initNewGame: function () {
        this.winCount = 0;
        scoreObject.textContent = this.winCount;
        this.allWordsGuessed = false;
        this.currentWordGuessed = false;
        this.gameOver = false;
        this.wordsGuessed = [];
        this.wordsToGuessArray = wordArray.slice();
        this.initGameTurn();
    },

    initGameTurn: function () {
        this.wordToGuess = this.getNewWord();
        this.currentWordGuessed = false;
        this.lettersGuessed = [];
        this.wrongLettersGuessed = [];

        if (this.wordToGuess.length > 0) {
            imageObject.setAttribute("src", guessImgPath);
            this.gameBoardWordDisplay = this.buildMaskedWord(this.wordToGuess);
            
            //empty the div if there is anything in there from the previous turn
            while (lettersObject.hasChildNodes()) {
                lettersObject.removeChild(lettersObject.firstChild);
            }

            this.gameBoardHtmlObjects = this.getMaskedHtml(this.gameBoardWordDisplay);
            for(var i=0; i < this.gameBoardHtmlObjects.length; i++){
                lettersObject.appendChild(this.gameBoardHtmlObjects[i]);
            }

            this.instructionText = "Press any letter to start guessing";
            instructionTextObject.textContent = this.instructionText;
            this.guessesRemaining = maxGuesses;
            guessesObject.textContent = "Guesses Remaining: " + this.guessesRemaining;
            this.lettersGuessed = [];
            guessedLettersObject.textContent = this.lettersGuessed.join(' ');
        }

    },

    /*
      Name:  getNewWord

      Purpose:  Pulls a new word out of the master word array.  Makes
        sure the word isn't one that has already been guessed.

      Returns:  string  (the new word to guess) 
    */
    getNewWord: function () {
        var newWord;


        if (this.wordsToGuessArray.length < 1) {
            newWord = "";
            this.wordArrayPos = -1;
        }
        else {
            var randomNum = Math.floor(Math.random() * this.wordsToGuessArray.length);
            newWord = this.wordsToGuessArray[randomNum].wordToGuess;
            this.wordArrayPos = randomNum;
        }

        return newWord;
    },

    buildMaskedWord: function (word) {
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

    getMaskedHtml(words){
        var htmlObjects = [];
        var wordsArray = words.join(' ').split('|');

        for(var i=0; i < wordsArray.length; i++){
            var h2Object = document.createElement("h2");
            h2Object.textContent = wordsArray[i];
            htmlObjects.push(h2Object);
        }

        return htmlObjects;
    },

    findLetterOccurences: function (array, letter) {
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

    unmaskLetters: function (maskedWord, unmaskedWord, positions) {
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
            maskedWord[pos] = unmaskedWord[pos];
        }
        return maskedWord;
    },

    moveGuessedWord: function () {
        this.wordsGuessed.push(this.wordsToGuessArray.splice(this.wordArrayPos, 1));
    }

};


/*
  Most of the logic is invoked based on each time a user presses a key
*/
document.onkeyup = function (event) {
    gameObject.letterGuessed = event.key.toLowerCase();

    //If the user guessed the word but the game isn't over, start a new game turn
    if (gameObject.currentWordGuessed && !gameObject.gameOver) {
        gameObject.initGameTurn();

        //If no words are returned, the game is over and the user guessed all the words
        if (gameObject.wordToGuess.length == 0) {
            gameObject.instructionText = "Congratulations!  You guessed all of the words!  Huzzah!  Press any key to begin a new game.";
            instructionTextObject.textContent = gameObject.instructionText;
            gameObject.gameOver = true;
            gameObject.allWordsGuessed = true;
        }
    }
    //If the game is over, start a new game
    else if (gameObject.gameOver) {
        gameObject.initNewGame();
    }
    //If the user is still guessing a word, only count letters of the alphabet (ignore numbers, function keys, etc)
    else if ((gameObject.letterGuessed.length == 1) && (gameObject.letterGuessed.search(/[a-z]/g) >= 0)) {

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
                if (gameObject.guessesRemaining < 1) {
                    gameObject.gameOver = true;
                    gameObject.instructionText = "Well shucky darn you used up all your guesses.  Looks like you lose the game.  Press any key to start a new game.";
                    instructionTextObject.textContent = gameObject.instructionText;
                    imageObject.setAttribute("src", loseImgPath);
                    new Audio(gameObject.loseSoundFile).play();
                }
            }
            //GUESSED RIGHT!
            //Letter was found, unmask the letter every place it was found in the word
            else {
                gameObject.instructionText = "Nice job!  The letter '" + gameObject.letterGuessed + "' is in the word.";
                instructionTextObject.textContent = gameObject.instructionText;
                gameObject.gameBoardWordDisplay = gameObject.unmaskLetters(gameObject.gameBoardWordDisplay, gameObject.wordToGuess, positions);
                gameObject.gameBoardHtmlObjects = gameObject.getMaskedHtml(gameObject.gameBoardWordDisplay);
                var children = lettersObject.children;
                for(var i=0; i < gameObject.gameBoardHtmlObjects.length; i++){
                    if(i < children.length){
                        children[i].textContent = gameObject.gameBoardHtmlObjects[i].textContent;
                    }
                }                

                //If the word is guessed, they won that round
                //Set currentWordGuessed to true so a new turn can start
                if (gameObject.gameBoardWordDisplay.indexOf("_") === -1) {
                    gameObject.currentWordGuessed = true;
                    gameObject.winCount++;
                    scoreObject.textContent = gameObject.winCount;
                    gameObject.instructionText = "Nice job you guessed the word!  Press any key to guess a new word.";
                    instructionTextObject.textContent = gameObject.instructionText;
                    imageObject.setAttribute("src", gameObject.wordsToGuessArray[gameObject.wordArrayPos].imgSrc);
                    new Audio(gameObject.winSoundFile).play();
                    gameObject.moveGuessedWord();
                }
            }

        }
        //Otherwise the user already selected this letter, ignore the input and make them guess again
        else {
            gameObject.instructionText = "You've already guessed the letter '" + gameObject.letterGuessed + "'.  Try another one.";
            instructionTextObject.textContent = gameObject.instructionText;
        }
    }
};

/*
  Initialize a new game when the page is loaded
*/
gameObject.initNewGame();