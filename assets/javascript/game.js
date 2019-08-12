
/*
   GLOBAL VARIABLES
*/
const maxGuesses = 5;

//globals used throughout each round
var wordsToGuess = ["Dorothy","Sophia","Blanche","Rose"];
var wordsGuessed = [];  //keep track of words guessed as user successfully moves through them
var wordToGuess;  //the word to guess for each game, pulled from the array
var guessesRemaining = maxGuesses;
var winCount = 0;

//globals used and reset after each word is guessed
var instructionText = "Press any letter to start guessing";
var lettersGuessed = [];   //keep track of letters guessed, no repeat letters
var wrongLettersGuessed = [];   //subset of letters guessed that  are letters not in the word
var gameBoardWordDisplay = [];  //starts by displaying the word masked with "_" for each letter
var letterGuessed;


//grab elements from the html by id
var instructionTextObject = document.getElementById("instructions");
var lettersObject = document.getElementById("letters");
var guessesObject = document.getElementById("guesses");
var guessedLettersObject = document.getElementById("guessedLetters");

/*
  FUNCTIONS GO BELOW HERE
*/

/*
  Name:  getNewWord

  Purpose:  Pulls a new word out of the master word array.  Makes
    sure the word isn't one that has already been guessed.

  Returns:  string  (the new word to guess)
*/
function getNewWord(){
    var newWord;

    for(var i=0; i < wordsToGuess.length; i++){
        if(wordsGuessed.indexOf(wordsToGuess[i]) === -1){
            newWord = wordsToGuess[i];
            break;
        }
    }

    return newWord;
}

function buildMaskedWord(word){
    var maskedWord = [];
    for(var i=0; i < word.length; i++){
        maskedWord.push("_");
    }
    return maskedWord;
}

function findLetterOccurences(array, letter){
    var arrayPositions = [];
    var indexPos = -1;

    do{
        if(indexPos === -1){
            indexPos = array.toLowerCase().indexOf(letter);    
        }
        else{
            indexPos = array.indexOf(letter,indexPos + 1);
        }
        
        if(indexPos > -1){
            arrayPositions.push(indexPos);
        }
    } while(indexPos > -1)
    return arrayPositions;
}

function unmaskLetters(maskedWord,unmaskedWord, positions){
    for(var i=0; i < positions.length; i++){
        var pos = positions[i];
        maskedWord[pos] = unmaskedWord[pos];
    }
    return maskedWord;
}




document.onload = function(event){
    instructionTextObject.textContent = instructionText;
    lettersObject.textContent = gameBoardWordDisplay;
    guessesObject.textContent = "Guesses Remaining: " + guessesRemaining;
}

document.onkeyup = function(event){
    letterGuessed = event.key.toLowerCase();

    //Check to make sure the letter hasn't been guessed yet before playing it
    if(lettersGuessed.indexOf(letterGuessed) === -1){
        lettersGuessed.push(letterGuessed);

        console.log("Before guess: " + gameBoardWordDisplay);
        var positions = findLetterOccurences(wordToGuess, letterGuessed);

        //GUESSED WRONG!
        //If the letter wasn't found at all in the word  to guess, tell them to try again
        //Decrease the amount of guesses remaining
        if(positions.length < 1){
            instructionText = "Sorry, the letter '" + letterGuessed + "' isn't in the word.  Try again.";
            instructionTextObject.textContent = instructionText;
            guessesRemaining--;
            guessesObject.textContent = "Guesses Remaining: " + guessesRemaining;
            wrongLettersGuessed.push(letterGuessed);
            console.log("Letter Guessed: " + letterGuessed);
            console.log("Wrong Letter Array: " + wrongLettersGuessed);
            guessedLettersObject.textContent = wrongLettersGuessed.join(' ');
        }
        //GUESSED RIGHT!
        //Otherwise it was found, unmask the letter every place it was found in the word
        else{
            console.log("Found the letter here: " + positions);
            instructionText = "Nice job!  The letter '" + letterGuessed + "' is in the word.  Guess again.";
            instructionTextObject.textContent = instructionText;
            gameBoardWordDisplay = unmaskLetters(gameBoardWordDisplay, wordToGuess, positions);
            lettersObject.textContent = gameBoardWordDisplay.join(' ');
        }

    }
    //Otherwise make them guess again
    else{
        instructionText = "You've already guessed the letter '" + letterGuessed + "'.  Try another one.";
        instructionTextObject.textContent = instructionText;
    }


    if(gameBoardWordDisplay.indexOf("_") == -1){

    }
};


/*
   MAIN LOGIC GOES BELOW
*/

wordToGuess = getNewWord();
if(wordToGuess.length > 0){
    gameBoardWordDisplay = buildMaskedWord(wordToGuess);
    lettersObject.textContent = gameBoardWordDisplay.join(' ');
    console.log(gameBoardWordDisplay);
}
