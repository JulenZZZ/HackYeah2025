document.addEventListener('DOMContentLoaded', () => {

    // --- STAN GRY ---
    let gameState = {};
    let gameData = []; // Pusta tablica na dane z API

    // --- ELEMENTY DOM ---
    const attributesDiv = document.getElementById('attributes');
    const stageNameH2 = document.getElementById('stage-name');
    const questionTextP = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const startScreen = document.getElementById('start-screen');
    const endScreen = document.getElementById('end-screen');
    const storyContainer = document.getElementById('story-container');
    const attributesContainer = document.getElementById('attributes-container');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const finalAttributesDiv = document.getElementById('final-attributes');
    const characterImageContainer = document.getElementById('character-image-container');
    const endGameImageContainer = document.getElementById('end-game-image-container');

    // --- POBIERANIE DANYCH ---
    const fetchGameData = async () => {
        try {
            const response = await fetch('/api/game-rules/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gameData = await response.json();
            initGame(); // Rozpocznij grę po pobraniu danych
        } catch (error) {
            console.error("Nie udało się pobrać danych gry:", error);
            storyContainer.innerHTML = `<p style="color: red;">Wystąpił błąd podczas ładowania gry. Spróbuj odświeżyć stronę.</p>`;
        }
    };


    // --- FUNKCJE POMOCNICZE ---
    const checkCondition = (condition) => {
        const attributeValue = gameState.playerAttributes[condition.attribute] || 0;
        switch (condition.operator) {
            case '>=': return attributeValue >= condition.value;
            case '<=': return attributeValue <= condition.value;
            case '>':  return attributeValue > condition.value;
            case '<':  return attributeValue < condition.value;
            case '==': return attributeValue == condition.value;
            default: return true;
        }
    };

    const applyImpacts = (impacts) => {
        impacts.forEach(impact => {
            const oldValue = gameState.playerAttributes[impact.attribute] || 0;
            switch (impact.operation) {
                case '+':
                    gameState.playerAttributes[impact.attribute] = oldValue + impact.value;
                    break;
                case '-':
                    gameState.playerAttributes[impact.attribute] = oldValue - impact.value;
                    break;
                case '*%':
                    gameState.playerAttributes[impact.attribute] = Math.round(oldValue * (1 + impact.value / 100));
                    break;
            }
        });
    };

    // --- GŁÓWNA LOGIKA GRY ---

    const initGame = () => {
        gameState = {
            playerAttributes: {
                'wiedza': 0,
                'zdrowie': 50,
                'spełnienie': 0,
                'majątek': 100,
                'umiejętności społeczne': 0,
                'doświadczenie zawodowe': 0,
                'ryzyko': 0,
            },
            currentStageIndex: 0,
            currentQuestionIndex: 0,
        };
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        storyContainer.classList.remove('hidden');
        attributesContainer.classList.remove('hidden');
        displayCurrentQuestion();
        updateAttributesDisplay();
    };

    const updateAttributesDisplay = () => {
        attributesDiv.innerHTML = '';
        for (const attr in gameState.playerAttributes) {
            const attrElement = document.createElement('div');
            attrElement.className = 'attribute';
            attrElement.innerHTML = `<span class="name">${attr.charAt(0).toUpperCase() + attr.slice(1)}:</span> ${gameState.playerAttributes[attr]}`;
            attributesDiv.appendChild(attrElement);
        }
    };

    const displayCurrentQuestion = () => {
        if (gameData.length === 0) return; // Nie rób nic, jeśli dane nie są załadowane

        const currentStage = gameData[gameState.currentStageIndex];
        if (!currentStage) {
            endGame();
            return;
        }

        let currentQuestion = currentStage.questions[gameState.currentQuestionIndex];

        // Pomiń pytanie, jeśli warunki nie są spełnione
        while(currentQuestion && currentQuestion.conditions && !currentQuestion.conditions.every(checkCondition)) {
            gameState.currentQuestionIndex++;
            currentQuestion = currentStage.questions[gameState.currentQuestionIndex];
        }

        if (!currentQuestion) {
            gameState.currentStageIndex++;
            gameState.currentQuestionIndex = 0;
            displayCurrentQuestion(); // Przejdź do następnego etapu
            return;
        }

        stageNameH2.textContent = currentStage.name;
        questionTextP.textContent = currentQuestion.text;
        answersContainer.innerHTML = '';

        // Zaktualizuj obrazek postaci
        let imageUrl = '';
        if (currentStage.name === 'Młodość') {
            imageUrl = '/mediafiles/girl1.png';
        } else if (currentStage.name === 'Młody dorosły') {
            imageUrl = '/mediafiles/girl2.png';
        } else if (currentStage.name === 'Dorosły') {
            imageUrl = '/mediafiles/girl3.png';
        }

        if (imageUrl) {
            characterImageContainer.innerHTML = `<img src="${imageUrl}" alt="${currentStage.name}">`;
        } else {
            characterImageContainer.innerHTML = '';
        }


        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.className = 'answer-button';
            button.disabled = answer.conditions && !answer.conditions.every(checkCondition);

            button.onclick = () => {
                if(answer.impacts) {
                    applyImpacts(answer.impacts);
                }
                gameState.currentQuestionIndex++;
                updateAttributesDisplay();
                displayCurrentQuestion();
            };
            answersContainer.appendChild(button);
        });
    };

    const endGame = () => {
        storyContainer.classList.add('hidden');
        attributesContainer.classList.add('hidden');
        endScreen.classList.remove('hidden');

        // Wyświetl obrazek na koniec gry
        endGameImageContainer.innerHTML = `<img src="/mediafiles/girl4.png" alt="Emerytura" style="max-width: 200px; border-radius: 10px; margin-bottom: 20px;">`;

        finalAttributesDiv.innerHTML = ''; // Wyczyść poprzednie podsumowanie
        for (const attr in gameState.playerAttributes) {
            const attrElement = document.createElement('div');
            attrElement.className = 'attribute';
            attrElement.innerHTML = `<span class="name">${attr.charAt(0).toUpperCase() + attr.slice(1)}:</span> ${gameState.playerAttributes[attr]}`;
            finalAttributesDiv.appendChild(attrElement);
        }
    };

    // --- NASŁUCHIWANIE ZDARZEŃ ---
    startButton.addEventListener('click', fetchGameData); // Zmieniono na fetchGameData
    restartButton.addEventListener('click', initGame);

});
