document.addEventListener('DOMContentLoaded', () => {

    // --- STAN GRY ---
    let gameState = {};
    let gameData = [];
    let character = 'Kobieta'; // Domyślna wartość
    let challenge = 'Swobodny'; // Domyślna wartość

    // --- ELEMENTY DOM ---
    const gameContainer = document.getElementById('game-container');
    const stagesContainer = document.getElementById('stages-container');
    const questionTextP = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const characterImage = document.getElementById('character-image');
    const attributesContainer = document.getElementById('attributes-container');
    const summaryContainer = document.getElementById('summary-container');
    const gameWrapper = document.getElementById('game-wrapper');

    // --- SŁOWNIK KOLORÓW ---
    const attributeColors = {
        'Zdrowie': '#2ecc71',
        'Oszczędności': '#f1c40f',
        'Spełnienie': '#3498db',
        'Wiedza': '#9b59b6',
        'Ryzyko/Stres': '#e74c3c',
        'społeczeństwo': '#e67e22',
    };

    // --- POBIERANIE DANYCH ---
    const fetchGameData = async () => {
        try {
            const response = await fetch('/api/game-rules/');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            gameData = await response.json();
            initGame();
        } catch (error)
 {
            console.error("Nie udało się pobrać danych gry:", error);
            gameContainer.innerHTML = `<p style="color: red; text-align: center;">Wystąpił błąd podczas ładowania gry. Spróbuj odświeżyć stronę.</p>`;
        }
    };

    // --- INICJALIZACJA GRY ---
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
        if(gameWrapper) gameWrapper.style.display = 'flex';
        buildStagesBar();
        updateSidebar();
        displayCurrentQuestion();
    };

    // --- BUDOWANIE ELEMENTÓW UI ---
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

    // --- GŁÓWNA PĘTLA GRY ---
    const displayCurrentQuestion = () => {
        if (gameData.length === 0 || !questionTextP) return;

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
        if(characterImage) characterImage.src = `/mediafiles/${imageBase}${imageNumber}.png`;

        currentQuestion.answers.forEach(answer => {
            const card = document.createElement('button');
            card.className = 'answer-card';
            card.innerHTML = `<h3>${answer.text}</h3><p>${answer.description || 'Kliknij, aby wybrać tę opcję.'}</p>`;
            card.onclick = () => {
                // Tutaj w przyszłości będzie logika wpływu na atrybuty
                // applyImpacts(answer.impacts);
                gameState.currentQuestionIndex++;
                updateSidebar();
                displayCurrentQuestion();
            };
            answersContainer.appendChild(card);
        });
    };

    // --- ZAKOŃCZENIE GRY ---
    const endGame = () => {
        const finalStateJSON = JSON.stringify(gameState.playerAttributes);
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/summary/'; // URL do widoku podsumowania

        const csrfTokenInput = document.querySelector('#csrf-token-container input[name="csrfmiddlewaretoken"]');
        if (!csrfTokenInput) {
            console.error('CSRF token not found!');
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
        fetchGameData();
    } else {
        // Ten kod nie powinien się uruchomić na stronie podsumowania, ale to dobre zabezpieczenie.
        console.log("Nie jesteś w widoku gry, skrypt nie będzie inicjowany.");
    }
});