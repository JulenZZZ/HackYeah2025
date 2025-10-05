// hackyeahAPI/static/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STAN GRY ---
    let gameState = {};
    let gameData = [];
    let character = 'Kobieta';
    let challenge = 'Swobodny';
    let isEducationalMode = false;

    // --- ELEMENTY DOM ---
    const gameContainer = document.getElementById('game-container');
    const stagesContainer = document.getElementById('stages-container');
    const questionTextP = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const characterImage = document.getElementById('character-image');
    const attributesContainer = document.getElementById('attributes-container');
    const summaryContainer = document.getElementById('summary-container');
    const gameWrapper = document.getElementById('game-wrapper');
    const educationalContentDiv = document.getElementById('educational-content');

    // ... reszta kodu (słowniki, fetchGameData, initGame, etc.) bez zmian ...
    const attributeMeta = {
        'zdrowie': { color: '#2ecc71', name: 'Zdrowie' },
        'oszczędności': { color: '#f1c40f', name: 'Oszczędności' },
        'spełnienie': { color: '#3498db', name: 'Spełnienie' },
        'wiedza': { color: '#9b59b6', name: 'Wiedza' },
        'ryzyko': { color: '#e74c3c', name: 'Ryzyko/Stres' },
        'umiejętności społeczne': { color: '#e67e22', name: 'Społeczeństwo' },
        'majątek': { color: '#1abc9c', name: 'Majątek' },
        'doświadczenie zawodowe': { color: '#34495e', name: 'Doświadczenie' }
    };
    const fetchGameData = async () => {
        try {
            const response = await fetch('/api/game-rules/');

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            gameData = await response.json();
            initGame();
        } catch (error) {
            console.error("Nie udało się pobrać danych gry:", error);
            if(gameContainer) gameContainer.innerHTML = `<p style="color: red; text-align: center;">Wystąpił błąd podczas ładowania reguł gry z API. <br><small>${error.message}</small></p>`;
        }
    };
    const initGame = () => {
        gameState = {
            playerAttributes: {
                'zdrowie': 80,
                'oszczędności': 20,
                'spełnienie': 50,
                'wiedza': 10,
                'ryzyko': 10,
                'umiejętności społeczne': 30,
                'majątek': 50,
                'doświadczenie zawodowe': 0
            },
            currentStageIndex: 0,
            currentQuestionIndex: 0,
            contractType: 'brak',
            income: 0,
        };
        if(gameWrapper) gameWrapper.style.display = 'flex';
        buildStagesBar();
        updateSidebar();
        displayCurrentQuestion();
    };
    const buildStagesBar = () => {
        if (!stagesContainer) return;
        stagesContainer.innerHTML = '';
        gameData.forEach((stage, index) => {
            const stageElement = document.createElement('div');
            stageElement.className = 'stage';
            if (index === gameState.currentStageIndex) {
                stageElement.classList.add('active');
            }
            stageElement.textContent = stage.name;
            stagesContainer.appendChild(stageElement);
        });
    };
    const updateSidebar = () => {
        if (!attributesContainer || !summaryContainer) return;
        attributesContainer.innerHTML = '';
        for (const attrKey in gameState.playerAttributes) {
            const meta = attributeMeta[attrKey] || { color: '#bdc3c7', name: attrKey };
            const value = gameState.playerAttributes[attrKey];
            const attrElement = document.createElement('div');
            attrElement.className = 'attribute';
            attrElement.innerHTML = `
                <div class="attribute-name">${meta.name}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${value}%; background-color: ${meta.color};"></div>
                </div>`;
            attributesContainer.appendChild(attrElement);
        }

        const savings = gameState.playerAttributes['oszczędności'] * 100;
        summaryContainer.innerHTML = `
            <div class="summary-item"><span>Dochód:</span> <span>${gameState.income} zł</span></div>
            <div class="summary-item"><span>Rodzaj umowy:</span> <span>${gameState.contractType}</span></div>
            <div class="summary-item"><span>Oszczędności:</span> <span>${savings.toFixed(2)} zł</span></div>`;
    };
    const applyImpacts = (impacts) => {
        impacts.forEach(impact => {
            const attr = impact.attribute.toLowerCase();
            if (gameState.playerAttributes.hasOwnProperty(attr)) {
                let currentValue = gameState.playerAttributes[attr];
                switch (impact.operation) {
                    case '+':
                        currentValue += impact.value;
                        break;
                    case '-':
                        currentValue -= impact.value;
                        break;
                    case '*%':
                        currentValue *= (1 + impact.value / 100);
                        break;
                }
                gameState.playerAttributes[attr] = Math.max(0, Math.min(100, currentValue));
            }
        });
    };
    const checkConditions = (conditions) => {
        if (!conditions || conditions.length === 0) return true;
        return conditions.every(condition => {
            const attr = condition.attribute.toLowerCase();
            const playerValue = gameState.playerAttributes[attr];
            if (playerValue === undefined) return false;

            switch (condition.operator) {
                case '>=': return playerValue >= condition.value;
                case '<=': return playerValue <= condition.value;
                case '>':  return playerValue > condition.value;
                case '<':  return playerValue < condition.value;
                case '==': return playerValue == condition.value;
                default: return false;
            }
        });
    };

    const displayCurrentQuestion = () => {
        if (gameData.length === 0) return;

        const currentStage = gameData[gameState.currentStageIndex];
        if (!currentStage) {
            endGame();
            return;
        }

        let currentQuestion = currentStage.questions[gameState.currentQuestionIndex];

        while(currentQuestion && !checkConditions(currentQuestion.conditions)) {
            gameState.currentQuestionIndex++;
            currentQuestion = currentStage.questions[gameState.currentQuestionIndex];
        }

        if (!currentQuestion) {
            gameState.currentStageIndex++;
            gameState.currentQuestionIndex = 0;
            buildStagesBar();
            displayCurrentQuestion();
            return;
        }

        if(questionTextP) questionTextP.textContent = currentQuestion.text;
        if(answersContainer) answersContainer.innerHTML = '';

        // ZAKTUALIZOWANA LOGIKA TRYBU EDUKACYJNEGO
        // Sprawdzamy, czy tryb jest aktywny ORAZ czy dane pytanie POSIADA treść edukacyjną
        if (isEducationalMode && currentQuestion.educational_content && educationalContentDiv) {
            educationalContentDiv.innerHTML = `<p><strong>Wskazówka:</strong> ${currentQuestion.educational_content.content}</p>`;
            educationalContentDiv.style.display = 'block';
        } else if (educationalContentDiv) {
            // Ukrywamy div, jeśli nie ma treści lub tryb jest wyłączony
            educationalContentDiv.style.display = 'none';
        }

        const imageBase = character === 'Kobieta' ? 'girl' : 'boy';
        const imageNumber = gameState.currentStageIndex + 1;
        if(characterImage) characterImage.src = `/static/images/${imageBase}${imageNumber}.webp`;

        currentQuestion.answers.forEach(answer => {
            const card = document.createElement('button');
            card.className = 'answer-card';
            card.innerHTML = `<h3>${answer.text}</h3>`;

            const isAvailable = checkConditions(answer.conditions);
            if (!isAvailable) {
                card.disabled = true;
                card.style.opacity = "0.5";
                card.style.cursor = "not-allowed";
            }

            card.onclick = () => {
                if(isAvailable) {
                    applyImpacts(answer.impacts);
                    gameState.currentQuestionIndex++;
                    updateSidebar();
                    displayCurrentQuestion();
                }
            };
            answersContainer.appendChild(card);
        });
    };

    const endGame = () => {
        const finalState = {
            attributes: gameState.playerAttributes,
            income: gameState.income,
            contractType: gameState.contractType
        };

        const finalStateJSON = JSON.stringify(finalState);
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/summary/';

        const csrfTokenInput = document.querySelector('#csrf-token-container input[name="csrfmiddlewaretoken"]');
        if (!csrfTokenInput) {
            console.error('CSRF token not found for summary!');
            return;
        }
        form.appendChild(csrfTokenInput.cloneNode(true));

        const stateInput = document.createElement('input');
        stateInput.type = 'hidden';
        stateInput.name = 'final_state';
        stateInput.value = finalStateJSON;
        form.appendChild(stateInput);

        document.body.appendChild(form);
        form.submit();
    };

    // --- START APLIKACJI ---
    const gameInitDataEl = document.getElementById('game-init-data');
    if (gameInitDataEl) {
        character = gameInitDataEl.dataset.character;
        challenge = gameInitDataEl.dataset.challenge;
        isEducationalMode = gameInitDataEl.dataset.isEducationalMode === 'true';
        fetchGameData();
    }
});