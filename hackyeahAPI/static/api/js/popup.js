document.addEventListener("DOMContentLoaded", function () {
    // Seleccionamos solo el botón "Ustawienia"
    const settingsButton = document.querySelector(".btn-menu[href='#']:nth-of-type(1)");

    if (settingsButton) {
        settingsButton.addEventListener("click", function (e) {
            e.preventDefault();

            // Evitar duplicados si se hace clic varias veces
            if (document.querySelector(".popup-overlay")) return;

            // Crear overlay y popup
            const overlay = document.createElement("div");
            overlay.className = "popup-overlay";

            const popup = document.createElement("div");
            popup.className = "popup-box";

            const closeBtn = document.createElement("span");
            closeBtn.className = "popup-close";
            closeBtn.innerHTML = "&times;";

            const content = document.createElement("p");
            content.textContent = "Ta funkcjonalność nie została jeszcze zaimplementowana, ale w przyszłości zawierać będzie ustawienia dot. języka (tłumaczenie na angielski i rosyjski) oraz ustawienia dostępności (większa czcionka i kontrast).";

            // Construir el popup
            popup.appendChild(closeBtn);
            popup.appendChild(content);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            // Cerrar popup al hacer clic en la X o en el overlay
            closeBtn.addEventListener("click", () => overlay.remove());
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.remove();
            });
        });
    }
});
