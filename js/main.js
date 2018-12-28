window.addEventListener('load', init);

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const message = document.querySelector('#message');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const seconds = document.querySelector('#seconds');


    const levels = {
        easy: 5,
        medium : 3, 
        hard: 2
    }

    const currentLevel = levels.medium;


    // Globals
    let score = 0,
    time = currentLevel,
    isPlaying;


// set array of words to an empty array
const words = [];

// Initialize
function init(){
    
    // Call countdown every second
    setInterval(countdown, 1000);

    // Check game status
    setInterval(checkStatus, 5000);

    // Start matching on word input
    wordInput.addEventListener('input', startMatch);

    // to call words api
    fetch("https://api.datamuse.com/words?ml=ringing+in+the+ears&max=500", {
        'Access-Control-Allow-Origin': 'https://api.datamuse.com/words?ml=ringing+in+the+ears&max=500',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

    })
    .then(response =>{
        return response.json();
    }).then(res =>{
        res.forEach(result => {
            words.push(result.word);
        });
        // load word from the set array
        showWord(words);
    })

}

// Pick & show random word
function showWord(words){
    const randIndex = Math.floor(Math.random() * words.length);
    // // output the random word
    currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown(){
    // make sure time is not run out
    if(time > 0){
    // decrement
    time --; 
    }else if(time === 0){
        // Game is over
        isPlaying = false;
    }
    // Show time
    timeDisplay.innerHTML = time; 
}


// start match
function startMatch(){
    if(matchWords()){
        isPlaying = true;
        time = currentLevel + 1;
        showWord(words);
        wordInput.value = '';
        score++;
    }

    // If score is -1, display 0
    if(score === -1){
        scoreDisplay.innerHTML = 0;
    }else{
        scoreDisplay.innerHTML = score;
    }
}

// Match currentWord to wordInput
function matchWords(){
    if(wordInput.value === currentWord.innerHTML){
        message.innerHTML = 'correct...';
        return true;
    } else {
        message.innerHTML = '';
        return false;
    }
}

// check status
function checkStatus (){
    if(!isPlaying && time === 0){
        message.innerHTML = 'Game Over !!!';
        score = -1;
    }
}
