document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".btn-menu");

    const popupMessage = "Ta funkcjonalność nie została jeszcze zaimplementowana, ale w przyszłości zawierać będzie ustawienia dot. języka (tłumaczenie na angielski i rosyjski) oraz ustawienia dostępności (większa czcionka i kontrast).";

    menuButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();

    
            if (document.querySelector(".popup-overlay")) return;

        
            const overlay = document.createElement("div");
            overlay.className = "popup-overlay";

            
            const popup = document.createElement("div");
            popup.className = "popup-box";

            
            const closeBtn = document.createElement("span");
            closeBtn.className = "popup-close";
            closeBtn.innerHTML = "&times;";

            
            const content = document.createElement("p");
            content.textContent = popupMessage;

            popup.appendChild(closeBtn);
            popup.appendChild(content);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            
            const closePopup = () => overlay.remove();
            closeBtn.addEventListener("click", closePopup);
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) closePopup();
            });
        });
    });
});
