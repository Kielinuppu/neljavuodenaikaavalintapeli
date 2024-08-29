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
let currentAudio = null;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
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
    selectedOption = 0;  // Alustetaan selectedOption
    
    // Poistetaan mahdolliset aiemmat valinnat
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
    
    // Toistetaan ääni pienellä viiveellä, jotta kuvat ehtivät latautua
    setTimeout(() => playAudio(), 100);
}

function selectOption(option) {
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    const selectedElement = document.getElementById(`option${option}`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    } else {
        console.error(`Elementtiä option${option} ei löytynyt`);
    }
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    if (checkButton) {
        if (selectedOption === 0) {
            checkButton.disabled = true;
            checkButton.classList.add('disabled');
        } else {
            checkButton.disabled = false;
            checkButton.classList.remove('disabled');
        }
    }
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    
    const selectedElement = document.getElementById(`option${selectedOption}`);
    if (selectedElement) {
        if (selectedOption === question.correct) {
            selectedElement.classList.add('correct');
            correctAnswers++;
            updateStars();
            playAudio('oikein');
        } else {
            selectedElement.classList.add('incorrect');
            const correctElement = document.getElementById(`option${question.correct}`);
            if (correctElement) {
                correctElement.classList.add('correct');
            }
            playAudio('vaarin');
        }
        document.getElementById('check-button').style.display = 'none';
        document.getElementById('next-arrow').style.display = 'block';
    } else {
        console.error(`Elementtiä option${selectedOption} ei löytynyt`);
    }
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        starsContainer.innerHTML = '<img src="tahti.avif" alt="Star" class="star-icon">'.repeat(correctAnswers);
    }
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
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <p id="result">SAIT ${correctAnswers} / ${currentQuestions.length} OIKEIN</p>
            <div id="final-stars-container">${'<img src="tahti.avif" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
            <button onclick="restartGame()" style="background-color: transparent; color: black; border: 2px solid black; margin-top: 20px;">PELAA UUDELLEEN</button>
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
    }
    
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        starsContainer.style.display = 'block';
    }
    
    loadQuestion();
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function playAudio(type = 'question') {
    stopAllAudio();
    
    let audioSrc;
    if (type === 'question') {
        audioSrc = currentQuestions[currentQuestion].audio;
    } else if (type === 'oikein') {
        audioSrc = 'oikein.mp3';
    } else if (type === 'vaarin') {
        audioSrc = 'vaarin.mp3';
    }
    
    currentAudio = new Audio(audioSrc);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
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