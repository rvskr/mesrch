// Код выполняется после полной загрузки окна
window.onload = function() {
    // Получаем историю ссылок из локального хранилища и выводим её на страницу
    var savedHistory = localStorage.getItem('linksHistory');
    if (savedHistory) {
        document.getElementById('history').innerHTML = savedHistory;
    }
};

// Функция генерации ссылок
async function generateLinks() {
    var phoneInput = document.getElementById("phone");
    var phone = phoneInput.value.trim();
    var linksDiv = document.getElementById("links");
    var historyDiv = document.getElementById("history");

    if (phone !== "") {
        // Удаление всех пробелов из номера телефона
        phone = phone.replace(/\s/g, "");

        // Добавление мобильного кода страны, если его нет
        if (!phone.startsWith("+")) {
            phone = "+" + phone;
        }

        // Генерация HTML для ссылок
        var linksHTML = generateLink("WhatsApp", "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phone), "whatsapp");
        linksHTML += generateLink("Viber", "viber://chat?number=" + encodeURIComponent(phone), "viber");
        linksHTML += generateLink("Telegram", "https://t.me/" + encodeURIComponent(phone), "telegram");

        // Генерация HTML для истории
        var historyHTML = generateHistoryEntry(phone);

        // Вывод ссылок и обновление истории на странице
        linksDiv.innerHTML = linksHTML;
        historyDiv.innerHTML = historyHTML + historyDiv.innerHTML;

        // Сохранение истории в локальном хранилище
        localStorage.setItem('linksHistory', historyDiv.innerHTML);

        // Отображение сообщения об обновлении
        showUpdateMessage();
    } else {
        linksDiv.innerHTML = "<p>Введите номер телефона</p>";
    }
}

// Функция генерации HTML для ссылки
function generateLink(name, url, id) {
    return '<a href="' + url + '" target="_blank" id="' + id + '">' + name + '</a>';
}

// Функция генерации HTML для истории
function generateHistoryEntry(phone) {
    return '<p onclick="showLinks(this, \'' + phone + '\')">' + phone + '</p>';
}

// Функция отображения ссылок для выбранного номера телефона
function showLinks(element, phone) {
    var linksDiv = document.getElementById("links");
    var linksHTML = generateLink("WhatsApp", "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phone), "whatsapp") +
                    generateLink("Viber", "viber://chat?number=" + encodeURIComponent(phone), "viber") +
                    generateLink("Telegram", "https://t.me/" + encodeURIComponent(phone), "telegram");
    
    linksDiv.innerHTML = linksHTML;

    // Отображение сообщения об обновлении
    showUpdateMessage();
}

// Функция отображения сообщения об обновлении
function showUpdateMessage() {
    var updateDiv = document.getElementById("update");
    updateDiv.innerText = "Ссылки обновлены";
    setTimeout(function(){
        updateDiv.innerText = "";
    }, 2000);
}

// Функция очистки истории
function clearHistory() {
    localStorage.removeItem('linksHistory');
    document.getElementById("history").innerHTML = "";
}