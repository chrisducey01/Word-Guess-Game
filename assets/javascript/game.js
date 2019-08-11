var wordsToGuess = ["Dorothy","Sophia","Blanche","Rose"];
var wordsGuessed = ["Dorothy"];
var wordToGuess = "Dorothy";
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

gameBoardWordDisplay = buildMaskedWord(wordToGuess);

console.log(gameBoardWordDisplay);


document.onkeyup = function(event){
    letterGuessed = event.key.toLowerCase();
    console.log("Before guess: " + gameBoardWordDisplay);
    var positions = findLetterOccurences(wordToGuess, letterGuessed);
    console.log("Found the letter here: " + positions);
    gameBoardWordDisplay = unmaskLetters(gameBoardWordDisplay, wordToGuess, positions);
    console.log("After guess: " + gameBoardWordDisplay);
};

