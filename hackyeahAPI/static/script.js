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
                'zdrowie': 50,
                'oszczędności': 0,
                'spełnienie': 0,
                'wiedza': 0,
                'ryzyko': 0,
                'umiejętności społeczne': 0,
                'majątek': 0,
                'doświadczenie zawodowe': 0
            },
            currentStageIndex: 0,
            currentQuestionIndex: 0,
            contractType: 'brak',
            income: 0,
            retirementSavings: 0,
            modifier: function () {

                // Zdrowie ma podstawowy wpływ, jeśli jest niskie, mocno obniża modyfikator.
                // Dzielimy przez 100, aby uzyskać wartość między 0 a 1.
                let zdrowieWpływ = this.playerAttributes['zdrowie'] / 100;

                // Wiedza poprawia modyfikator, ale z malejącymi zyskami (np. logarytmicznie lub pierwiastek),
                // aby początkowe punkty dawały większy skok niż kolejne.
                // Tutaj używam pierwiastka kwadratowego dla "miękkiego" wzrostu.
                // Dodajemy 1, aby uniknąć pierwiastka z 0 i żeby mieć bazę 1, gdy wiedza = 0.
                let wiedzaWpływ = Math.sqrt(this.playerAttributes['wiedza'] + 1) / 5; // Dzielimy przez 5, aby skala była rozsądna.

                // Doświadczenie zawodowe również zwiększa modyfikator, ale może mieć bardziej liniowy wpływ
                // lub też z pewnym progiem. Tutaj prosty wzrost liniowy, skalowany.
                let doswiadczenieWpływ = this.playerAttributes['doświadczenie zawodowe'] / 20; // Skalujemy, żeby nie dominowało.

                // Łączymy wpływy. Możemy je mnożyć, aby efekt był bardziej złożony (np. brak zdrowia mocno obniża całość),
                // lub sumować z wagami. Wybieram mnożenie zdrowia z sumą pozostałych, co daje,
                // że jeśli zdrowie jest bliskie zeru, modyfikator też będzie niski, niezależnie od wiedzy/doświadczenia.
                // Maksymalne wartości dla wiedzy i doświadczenia trzeba dostosować do oczekiwanej skali gry.

                // Ograniczamy wpływ wiedzy i doświadczenia, żeby nie rosły w nieskończoność.
                wiedzaWpływ = Math.min(wiedzaWpływ, 1.0); // Maksymalnie 1.0 z wiedzy
                doswiadczenieWpływ = Math.min(doswiadczenieWpływ, 1.0); // Maksymalnie 1.0 z doświadczenia

                let bazowyModyfikator = 0.25; // Startowy modyfikator, gdy wszystko jest na 0 (oprócz zdrowia).

                let totalModifier = zdrowieWpływ * (bazowyModyfikator + wiedzaWpływ + doswiadczenieWpływ);

                // Możemy również dodać minimalny modyfikator, żeby nigdy nie spadł do zera całkowicie.
                totalModifier = Math.max(totalModifier, 0.1); // Nigdy poniżej 0.1

                return totalModifier;
            }
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
            <div class="summary-item"><span>Dochód:</span> <span>${gameState.income * gameState.modifier()} zł</span></div>
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
                    if (questionTextP.textContent === 'Jaki rodzaj umowy wybierasz?') {
                        
                        if (card.textContent.indexOf('B2B') > -1) {
                            gameState.contractType = 'B2B';
                        } else if (card.textContent.indexOf('UOP') > -1) {
                            gameState.contractType = 'UOP'
                        } else {
                            gameState.contractType = 'Brak'
                        }
                    }

                    if (questionTextP.textContent === 'Czas wybrać pracę. Jaki zawód wybierasz?') {

                        if (card.textContent.indexOf('10000') > -1) {
                            gameState.income = 10000;
                        } else if (card.textContent.indexOf('12000') > -1) {
                            gameState.income = 12000;
                        } else if (card.textContent.indexOf('6000') > -1) {
                            gameState.income = 6000;
                        } else if (card.textContent.indexOf('4500') > -1) {
                            gameState.income = 4500;
                        } else {
                            gameState.income = 0;
                        }
                    }

                    if (questionTextP.textContent === 'Czy odkładasz dodatkowo pieniądze na swoją emeryturę? Jeśli tak, to ile?') {

                        if (card.textContent.indexOf('10%') > -1) {
                            gameState.retirementSavings = .1;
                        } else if (card.textContent.indexOf('15%') > -1) {
                            gameState.retirementSavings = .15;
                        }
                    }
                    
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
            income: gameState.income * gameState.modifier(),
            contractType: gameState.contractType,
            retirementSavings: gameState.retirementSavings
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