
var wordsToGuess = ["Dorothy","Sophia","Blanche","Rose"];
var wordsGuessed = ["Dorothy"];
var wordToGuess;
var lettersGuessed = [];
var gameBoardWordDisplay = [];
var letterGuessed;
var guessesRemaining;
var winCount = 0;
var lossCount = 0;
var instructionText = "Press any letter to start guessing";

var instructionTextObject = document.getElementById("instructions");
var lettersObject = document.getElementById("letters");



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


wordToGuess = getNewWord();
if(wordToGuess.length > 0){
    guessesRemaining = wordToGuess.length + 5;
    gameBoardWordDisplay = buildMaskedWord(wordToGuess);
    console.log(gameBoardWordDisplay);
}


document.onload = function(event){
    instructionTextObject.textContent = instructionText;
}

document.onkeyup = function(event){
    letterGuessed = event.key.toLowerCase();

    //Check to make sure the letter hasn't been guessed yet before playing it
    if(lettersGuessed.indexOf(letterGuessed) === -1){
        lettersGuessed.push(letterGuessed);
        guessesRemaining--;

        console.log("Before guess: " + gameBoardWordDisplay);
        var positions = findLetterOccurences(wordToGuess, letterGuessed);

        //If the letter wasn't found at all in the word  to guess, tell them to try again
        if(positions.length < 1){
            instructionText = "Sorry, the letter '" + letterGuessed + "' isn't in the word.  Try again.";
            instructionTextObject.textContent = instructionText;
            console.log(instructionText);
        }
        //Otherwise it was found, unmask the letter every place it was found in the word
        else{
            console.log("Found the letter here: " + positions);
            instructionText = "Nice job!  The letter '" + letterGuessed + "' is in the word.  Guess again.";
            instructionTextObject.textContent = instructionText;
            gameBoardWordDisplay = unmaskLetters(gameBoardWordDisplay, wordToGuess, positions);
    
        }

        console.log("After guess: " + gameBoardWordDisplay); 
        console.log("Guesses remaining: " + guessesRemaining);   
    }
    //Otherwise make them guess again
    else{
        instructionText = "You've already guessed the letter '" + letterGuessed + "'.  Try another one.";
        instructionTextObject.textContent = instructionText;
        console.log(instructionText);
    }


    if(gameBoardWordDisplay.indexOf("_") == -1){

    }
};

