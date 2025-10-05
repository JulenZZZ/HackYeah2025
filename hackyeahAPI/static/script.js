document.addEventListener('DOMContentLoaded', () => {

    // --- STAN GRY ---
    let gameState = {};
    let gameData = [];
    let character = 'Kobieta';
    let challenge = 'Swobodny';

    // --- ELEMENTY DOM ---
    const gameContainer = document.getElementById('game-container');
    const stagesContainer = document.getElementById('stages-container');
    const questionTextP = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const characterImage = document.getElementById('character-image');
    const attributesContainer = document.getElementById('attributes-container');
    const summaryContainer = document.getElementById('summary-container');
    const endScreen = document.getElementById('end-screen');
    const gameWrapper = document.getElementById('game-wrapper');

    const attributeColors = {
        'Zdrowie': '#2ecc71',
        'Oszczędności': '#f1c40f',
        'Spełnienie': '#3498db',
        'Wiedza': '#9b59b6',
        'Ryzyko/Stres': '#e74c3c',
        'społeczeństwo': '#e67e22',
    };

    const fetchGameData = async () => {
        try {
            const response = await fetch('/api/game-rules/');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            gameData = await response.json();
            initGame();
        } catch (error) {
            console.error("Nie udało się pobrać danych gry:", error);
            gameContainer.innerHTML = `<p style="color: red; text-align: center;">Wystąpił błąd podczas ładowania gry. Spróbuj odświeżyć stronę.</p>`;
        }
    };

    const initGame = () => {
        gameState = {
            playerAttributes: {
                'Zdrowie': 80,
                'Oszczędności': 20,
                'Spełnienie': 50,
                'Wiedza': 10,
                'Ryzyko/Stres': 10,
                'społeczeństwo': 30,
            },
            currentStageIndex: 0,
            currentQuestionIndex: 0,
        };
        endScreen.classList.add('hidden');
        gameWrapper.classList.remove('hidden');
        buildStagesBar();
        updateSidebar();
        displayCurrentQuestion();
    };

    const buildStagesBar = () => {
        stagesContainer.innerHTML = '';
        gameData.forEach((stage, index) => {
            const stageElement = document.createElement('div');
            stageElement.classList.add('stage');
            if (index === gameState.currentStageIndex) {
                stageElement.classList.add('active');
            }
            stageElement.textContent = stage.name;
            stagesContainer.appendChild(stageElement);
        });
    };

    const updateSidebar = () => {
        attributesContainer.innerHTML = '';
        for (const attr in gameState.playerAttributes) {
            const value = gameState.playerAttributes[attr];
            const attrElement = document.createElement('div');
            attrElement.className = 'attribute';
            attrElement.innerHTML = `
                <div class="attribute-name">${attr}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${value}%; background-color: ${attributeColors[attr] || '#bdc3c7'};"></div>
                </div>`;
            attributesContainer.appendChild(attrElement);
        }

        summaryContainer.innerHTML = `
            <div class="summary-item"><span>Dochód:</span> <span>brak</span></div>
            <div class="summary-item"><span>Rodzaj umowy:</span> <span>brak</span></div>
            <div class="summary-item"><span>Po kosztach:</span> <span>-</span></div>
            <div class="summary-item"><span>Oszczędności emerytalne:</span> <span>210,99 zł</span></div>`;
    };

    const displayCurrentQuestion = () => {
        if (gameData.length === 0) return;

        const currentStage = gameData[gameState.currentStageIndex];
        if (!currentStage) {
            endGame();
            return;
        }

        let currentQuestion = currentStage.questions[gameState.currentQuestionIndex];
        if (!currentQuestion) {
            gameState.currentStageIndex++;
            gameState.currentQuestionIndex = 0;
            buildStagesBar();
            displayCurrentQuestion();
            return;
        }

        questionTextP.textContent = currentQuestion.text;
        answersContainer.innerHTML = '';
        const imageBase = character === 'Kobieta' ? 'girl' : 'boy';
        const imageNumber = gameState.currentStageIndex + 1;
        characterImage.src = `/mediafiles/${imageBase}${imageNumber}.png`;

        currentQuestion.answers.forEach(answer => {
            const card = document.createElement('button');
            card.className = 'answer-card';
            card.innerHTML = `<h3>${answer.text}</h3><p>${answer.description || 'Kliknij, aby wybrać tę opcję.'}</p>`;
            card.onclick = () => {
                gameState.currentQuestionIndex++;
                updateSidebar();
                displayCurrentQuestion();
            };
            answersContainer.appendChild(card);
        });
    };

    const endGame = () => {
        gameWrapper.classList.add('hidden');
        endScreen.classList.remove('hidden');

        // 1. Wypełnij pasek etapów
        const endStagesBar = document.getElementById('end-stages-bar');
        endStagesBar.innerHTML = '';
        gameData.forEach(stage => {
            const stageElement = document.createElement('div');
            stageElement.className = 'stage';
            stageElement.textContent = stage.name;
            endStagesBar.appendChild(stageElement);
        });

        // 2. Wypełnij atrybuty
        const endAttributesLeft = document.getElementById('end-attributes-left');
        const endAttributesRight = document.getElementById('end-attributes-right');
        endAttributesLeft.innerHTML = '';
        endAttributesRight.innerHTML = '';
        const leftAttrKeys = ['Zdrowie', 'Oszczędności', 'Spełnienie'];

        for (const attr in gameState.playerAttributes) {
            const value = gameState.playerAttributes[attr];
            const html = `
                <div class="end-attribute">
                    ${attr}
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${value}%; background-color: ${attributeColors[attr] || '#bdc3c7'};"></div>
                    </div>
                </div>`;
            if (leftAttrKeys.includes(attr)) {
                endAttributesLeft.innerHTML += html;
            } else {
                endAttributesRight.innerHTML += html;
            }
        }

        // 3. Wypełnij podsumowanie finansowe (obliczenia na podstawie końcowego stanu gry)
        const endSummaryLeft = document.getElementById('end-summary-left');
        const endSummaryRight = document.getElementById('end-summary-right');

        // Przykładowe dynamiczne obliczenia na podstawie atrybutów
        const finalIncome = (gameState.playerAttributes['Wiedza'] * 120).toLocaleString('pl-PL');
        const afterCostsValue = (gameState.playerAttributes['Spełnienie'] + gameState.playerAttributes['Zdrowie']) / 2;
        const finalSavings = (gameState.playerAttributes['Oszczędności'] * 10212.87).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        endSummaryLeft.innerHTML = `
            <div>Dochód: ${finalIncome}zł</div>
            <div>Rodzaj umowy: UOP</div>
            <div>Po kosztach pozostało:</div>
            <div class="summary-progress-bar-container progress-bar-container">
                <div class="progress-bar" style="width: ${afterCostsValue}%;"></div>
            </div>`;

        endSummaryRight.innerHTML = `
            <div>Suma oszczędności emerytalnych: ${finalSavings}zł</div>
            <div class="summary-progress-bar-container progress-bar-container">
                <div class="progress-bar" style="width: ${gameState.playerAttributes['Oszczędności']}%;"></div>
            </div>`;
    };

    const gameInitDataEl = document.getElementById('game-init-data');
    if (gameInitDataEl) {
        character = gameInitDataEl.dataset.character;
        challenge = gameInitDataEl.dataset.challenge;
        fetchGameData();
    } else {
        console.error("Nie znaleziono danych inicjalizacyjnych gry.");
    }
});