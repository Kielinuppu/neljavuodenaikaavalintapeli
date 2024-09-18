const questions = [
    { correct: 2, img1: 'kuva1.avif', img2: 'kuva3.avif', audio: 'talvi.mp3' },
    { correct: 1, img1: 'kuva4.avif', img2: 'kuva1.avif', audio: 'syksy.mp3' },
    { correct: 2, img1: 'kuva3.avif', img2: 'kuva5.avif', audio: 'kevat.mp3' },
    { correct: 2, img1: 'kuva4.avif', img2: 'kuva1.avif', audio: 'kesa.mp3' },
    { correct: 2, img1: 'kuva6.avif', img2: 'kuva8.avif', audio: 'talvi.mp3' },
    { correct: 2, img1: 'kuva9.avif', img2: 'kuva6.avif', audio: 'kevat.mp3' },
    { correct: 1, img1: 'kuva7.avif', img2: 'kuva8.avif', audio: 'kesa.mp3' },
    { correct: 1, img1: 'kuva9.avif', img2: 'kuva7.avif', audio: 'syksy.mp3' },
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    currentQuestions = getRandomQuestions(5);
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playAudio(currentQuestions[currentQuestion].audio);
    });
}

function getRandomQuestions(count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    if (option1 && option2) {
        option1.src = question.img1;
        option2.src = question.img2;
        option1.onclick = () => selectOption(1);
        option2.onclick = () => selectOption(2);
    }
    const checkButton = document.getElementById('check-button');
    const nextArrow = document.getElementById('next-arrow');
    if (checkButton && nextArrow) {
        checkButton.style.display = 'block';
        nextArrow.style.display = 'none';
    }
    checkButtonClicked = false;
    selectedOption = 0;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

function selectOption(option) {
    selectedOption = option;
    document.querySelectorAll('.option').forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    if (checkButton) {
        checkButton.disabled = selectedOption === 0;
        checkButton.classList.toggle('disabled', selectedOption === 0);
    }
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    
    const selectedElement = document.getElementById(`option${selectedOption}`);
    if (selectedOption === question.correct) {
        selectedElement.classList.add('correct');
        correctAnswers++;
        updateStars();
        playAudio('oikein.mp3');
    } else {
        selectedElement.classList.add('incorrect');
        document.getElementById(`option${question.correct}`).classList.add('correct');
        playAudio('vaarin.mp3');
    }
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        starsContainer.innerHTML = '<img src="tahti.avif" alt="Star" class="star-icon">'.repeat(correctAnswers);
    }
}

function nextQuestion() {
    stopAllAudio();
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
        playAudio(currentQuestions[currentQuestion].audio);
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <h1>NELJÄ VUODENAIKAA</h1>
            <p id="result">SAIT ${correctAnswers} / ${currentQuestions.length} OIKEIN</p>
            <div id="final-stars-container">${'<img src="tahti.avif" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
            <button onclick="restartGame()">PELAA UUDELLEEN</button>
        `;
    }
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        starsContainer.style.display = 'none';
    }
}

function restartGame() {
    stopAllAudio();
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    currentQuestions = getRandomQuestions(5);
    
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <h1>NELJÄ VUODENAIKAA</h1>
            <div class="options">
                <img id="option1" class="option">
                <img id="option2" class="option">
            </div>
            <div id="game-controls">
                <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
                <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
            </div>
        `;
    }
    
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        starsContainer.style.display = 'block';
    }
    
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playAudio(currentQuestions[currentQuestion].audio);
    });
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function playAudio(src, callback) {
    stopAllAudio();
    currentAudio = new Audio(src);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
    if (callback) {
        currentAudio.onended = callback;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});