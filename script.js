const questions = [
    { season: 'TALVI', correct: 2, img1: 'kuva1.avif', img2: 'kuva3.avif', audio: 'talvi.mp3' },
    { season: 'SYKSY', correct: 1, img1: 'kuva4.avif', img2: 'kuva1.avif', audio: 'syksy.mp3' },
    { season: 'KEVÄT', correct: 2, img1: 'kuva3.avif', img2: 'kuva5.avif', audio: 'kevat.mp3' },
    { season: 'KESÄ', correct: 2, img1: 'kuva4.avif', img2: 'kuva1.avif', audio: 'kesa.mp3' },
    { season: 'TALVI', correct: 2, img1: 'kuva6.avif', img2: 'kuva8.avif', audio: 'talvi.mp3' },
    { season: 'KEVÄT', correct: 2, img1: 'kuva9.avif', img2: 'kuva6.avif', audio: 'kevat.mp3' },
    { season: 'KESÄ', correct: 1, img1: 'kuva7.avif', img2: 'kuva8.avif', audio: 'kesa.mp3' },
    { season: 'SYKSY', correct: 1, img1: 'kuva9.avif', img2: 'kuva7.avif', audio: 'syksy.mp3' },
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    currentQuestions = getRandomQuestions(5);
    loadQuestion();
}

function getRandomQuestions(count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    document.getElementById('season').textContent = question.season;
    document.getElementById('option1').src = question.img1;
    document.getElementById('option2').src = question.img2;
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    playAudio();
}

function selectOption(option) {
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
}

function checkAnswer() {
    if (checkButtonClicked) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    if (selectedOption === question.correct) {
        document.getElementById(`option${selectedOption}`).classList.add('correct');
        correctAnswers++;
        updateStars();
    } else {
        document.getElementById(`option${selectedOption}`).classList.add('incorrect');
    }
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '<img src="tahti.avif" alt="Star" class="star-icon">'.repeat(correctAnswers);
}

function nextQuestion() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        selectedOption = 0;
        loadQuestion();
    }
}

function showResult() {
    document.getElementById('question-container').innerHTML = `
        <p id="result">SAIT ${correctAnswers} / ${currentQuestions.length} OIKEIN</p>
        <div id="final-stars-container">${'<img src="tahti.avif" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
        <button onclick="restartGame()" style="background-color: transparent; color: black; border: 2px solid black; margin-top: 20px;">PELAA UUDELLEEN</button>
    `;
    document.getElementById('stars-container').style.display = 'none';
}

function restartGame() {
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    currentQuestions = getRandomQuestions(5);
    document.getElementById('question-container').innerHTML = `
        <h1>KUMMASSA KUVASSA ON:</h1>
        <h2 id="season"></h2>
        <div class="options">
            <img id="option1" class="option" onclick="selectOption(1)">
            <img id="option2" class="option" onclick="selectOption(2)">
        </div>
        <div id="game-controls">
            <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
            <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
        </div>
    `;
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('stars-container').style.display = 'block';
    loadQuestion();
}

function playAudio() {
    const audio = new Audio(currentQuestions[currentQuestion].audio);
    audio.play();
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});