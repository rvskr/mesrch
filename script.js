window.onload = function() {
    var savedHistory = localStorage.getItem('linksHistory');
    if (savedHistory) {
        document.getElementById('history').innerHTML = savedHistory;
    }
};

function generateLinks() {
    var phone = document.getElementById("phone").value;
    var linksDiv = document.getElementById("links");
    var historyDiv = document.getElementById("history");
    var updateDiv = document.getElementById("update");
    var linksHTML = "";
    var historyHTML = "";

    // Проверка, что введен номер телефона
    if (phone.trim() !== "") {
        // Проверка и добавление "+" перед номером телефона
        if (!phone.startsWith("+")) {
            phone = "+" + phone;
        }

        // Генерация ссылок на мессенджеры
        var whatsappLink = '<a href="https://wa.me/' + phone + '" target="_blank">WhatsApp</a>';
        linksHTML += whatsappLink;

        var viberPhone = phone.replace("+", "%2B").replace(/[-()\s]/g, "");
        var viberLink = '<a href="viber://chat?number=' + viberPhone + '" target="_blank">Viber</a>';
        linksHTML += viberLink;

        var telegramLink = '<a href="tg://resolve?domain=' + phone + '" target="_blank">Telegram</a>';
        linksHTML += telegramLink;
        
        // Добавление текущего номера в историю
        historyHTML += '<p onclick="showLinks(this, \'' + phone + '\')">' + phone + '</p>';

        // Отображение новых ссылок
        linksDiv.innerHTML = linksHTML;
        historyDiv.innerHTML = historyHTML + historyDiv.innerHTML;

        // Сохранение истории в localStorage
        localStorage.setItem('linksHistory', historyDiv.innerHTML);

        // Отображение информации об обновлении
        updateDiv.innerText = "Ссылки обновлены";
        updateDiv.classList.remove("fadeout");
        setTimeout(function(){
            updateDiv.classList.add("fadeout");
        }, 500);

        // Анимация кнопок
        animateButtons();
    } else {
        // Вывод сообщения об ошибке, если номер телефона не введен
        linksDiv.innerHTML = "<p>Введите номер телефона</p>";
    }
}

function animateButtons() {
    var buttons = document.querySelectorAll('#links a');
    buttons.forEach(function(button) {
        if (button.href.includes("https://wa.me/") || button.href.includes("viber://chat?number=") || button.href.includes("tg://resolve?domain=")) {
            button.classList.add("highlight");
            setTimeout(function(){
                button.classList.remove("highlight");
            }, 500);
        }
    });
}

function showLinks(element, phone) {
    var linksDiv = document.getElementById("links");
    var linksHTML = "";

    var whatsappLink = '<a href="https://wa.me/' + phone + '" target="_blank">WhatsApp</a>';
    linksHTML += whatsappLink;

    var viberPhone = phone.replace("+", "%2B").replace(/[-()\s]/g, "");
    var viberLink = '<a href="viber://chat?number=' + viberPhone + '" target="_blank">Viber</a>';
    linksHTML += viberLink;

    var telegramLink = '<a href="tg://resolve?domain=' + phone + '" target="_blank">Telegram</a>';
    linksHTML += telegramLink;
    
    // Отображение новых ссылок
    linksDiv.innerHTML = linksHTML;

    // Подсветка элемента на короткое время
    element.classList.add("highlight");
    setTimeout(function(){
        element.classList.remove("highlight");
    }, 500);

    // Отображение информации об обновлении
    var updateDiv = document.getElementById("update");
    updateDiv.innerText = "Ссылки обновлены";
    updateDiv.classList.remove("fadeout");
    setTimeout(function(){
        updateDiv.classList.add("fadeout");
    }, 500);

    // Анимация кнопок
    animateButtons();
}

function clearHistory() {
    localStorage.removeItem('linksHistory');
    document.getElementById("history").innerHTML = "";
}
