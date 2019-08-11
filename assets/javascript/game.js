var wordsToGuess = ["Dorothy","Sophia","Blanche","Rose"];
var wordsGuessed = ["Dorothy"];
var wordToGuess = "Blanche";
var lettersGuessed = [];
var gameBoardWordDisplay = [];
var letterGuessed;

function buildMaskedWord(word){
    var maskedWord = [];
    for(var i=0; i < word.length; i++){
        maskedWord.push("_");
    }
    return maskedWord;
}

function unmaskLetter(array, position, letter){

}

gameBoardWordDisplay = buildMaskedWord(wordToGuess);

console.log(gameBoardWordDisplay);

document.onkeyup = function(event){
    letterGuessed = event.key.toLowerCase();
    var indexPos = wordToGuess.toLowerCase().indexOf(letterGuessed);
    if( indexPos === -1){
        console.log(letterGuessed + " not found");
    }
    else{
        console.log(letterGuessed + " is part of the word");
        gameBoardWordDisplay[indexPos] = wordToGuess[indexPos];
        console.log(gameBoardWordDisplay);
    }
};

