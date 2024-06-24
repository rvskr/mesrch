let lastClipboardPhone = ""; // Переменная для хранения последнего обнаруженного номера

window.onload = function() {
    // Получаем историю ссылок из локального хранилища и выводим её на страницу
    var savedHistory = localStorage.getItem('linksHistory');
    if (savedHistory) {
        document.getElementById('history').innerHTML = savedHistory;
        
    }

    // Проверяем буфер обмена при загрузке страницы
    checkClipboardForPhoneNumber();

    // Подсветка текущего номера в истории, если он есть
    highlightCurrentPhoneNumber();
};
// Функция для подсветки текущего номера в истории при загрузке страницы
function highlightCurrentPhoneNumber() {
    var historyItems = document.querySelectorAll('.history-item');
    var savedPhone = localStorage.getItem('lastPhoneNumber');

    if (savedPhone) {
        var currentHistoryItem = Array.from(historyItems).find(item => item.innerText.trim() === savedPhone);
        if (currentHistoryItem) {
            // Удаление класса .selected у всех элементов истории
            historyItems.forEach(item => item.classList.remove('selected'));
        }
    }
}




// Функция проверки буфера обмена на наличие номера телефона
async function checkClipboardForPhoneNumber() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const phonePattern = /^\+?[0-9\s\-]+$/; // Регулярное выражение для проверки номера телефона

        if (phonePattern.test(clipboardText.trim()) && clipboardText.trim() !== lastClipboardPhone) {
            lastClipboardPhone = clipboardText.trim();
            if (confirm(`Обнаружен номер телефона в буфере обмена: ${clipboardText.trim()}. Хотите вставить его?`)) {
                document.getElementById("phone").value = clipboardText.trim();
                generateLinks(); // Автоматическая генерация ссылок
            }
        }
    } catch (err) {
        console.error('Ошибка при чтении буфера обмена: ', err);
    }
}

// Функция для вставки номера из буфера обмена
async function pasteFromClipboard() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const phonePattern = /^\+?[0-9\s\-]+$/; // Регулярное выражение для проверки номера телефона
        if (phonePattern.test(clipboardText.trim())) {
            document.getElementById("phone").value = clipboardText.trim();
            generateLinks(); // Автоматическая генерация ссылок
        } else {
            alert("Буфер обмена не содержит допустимый номер телефона.");
        }
    } catch (err) {
        console.error('Ошибка при чтении буфера обмена: ', err);
        alert('Не удалось прочитать буфер обмена.');
    }
}

// Функция генерации ссылок
async function generateLinks() {
    var phoneInput = document.getElementById("phone");
    var phone = phoneInput.value.trim();
    var linksDiv = document.getElementById("links");
    var historyDiv = document.getElementById("history");

    if (phone !== "") {
        // Приведение номера телефона к единому формату
        phone = normalizePhoneNumber(phone);

        // Проверка на дублирование в истории
        var existingItems = historyDiv.querySelectorAll('.history-item');
        var alreadyExists = Array.from(existingItems).find(item => item.innerText.trim() === phone);

        if (alreadyExists) {
            // Удаление подсветки со всех элементов истории
            existingItems.forEach(item => item.classList.remove('selected'));

            // Подсветка выбранного элемента истории
            alreadyExists.classList.add('selected');
        } else {
            // Генерация HTML для ссылок
            var linksHTML = generateLink("WhatsApp", "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phone), "whatsapp");
            linksHTML += generateLink("Viber", "viber://chat?number=" + encodeURIComponent(phone), "viber");
            linksHTML += generateLink("Telegram", "https://t.me/" + encodeURIComponent(phone), "telegram");

            // Генерация HTML для истории
            var historyHTML = generateHistoryEntry(phone);

            // Вывод ссылок и обновление истории на странице
            linksDiv.innerHTML = linksHTML;
            historyDiv.innerHTML = historyHTML + historyDiv.innerHTML;

            // Установка класса selected для нового элемента истории
            var newHistoryItem = historyDiv.querySelector('.history-item');
            newHistoryItem.classList.add('selected'); // Убрано из этой части кода, т.к. установка будет только при активном выборе

            // Сохранение последнего использованного номера в локальное хранилище
            localStorage.setItem('lastPhoneNumber', phone);

            // Сохранение истории в локальном хранилище
            localStorage.setItem('linksHistory', historyDiv.innerHTML);

            // Отображение сообщения об обновлении
            showUpdateMessage();
        }

        // Показываем ссылки для выбранного номера
        showLinks(historyDiv.querySelector('.selected'), phone);
    } else {
        linksDiv.innerHTML = "<p>Введите номер телефона</p>";
    }
}


// Функция для приведения номера телефона к единому формату
function normalizePhoneNumber(phone) {
    // Удаление всех нецифровых символов
    phone = phone.replace(/\D/g, "");

    // Если номер не начинается с "+", добавляем символ "+"
    if (!phone.startsWith("+")) {
        phone = "+" + phone;
    }

    // Если номер начинается с "+0", заменяем на "+380"
    if (phone.startsWith("+0")) {
        phone = "+380" + phone.slice(2);
    }
    // Если номер начинается с "+8" и не содержит код страны, добавляем код страны +7 (для России)
    else if (phone.startsWith("+8") && phone.length === 11) {
        phone = "+7" + phone.slice(2);
    }

    return phone;
}

// Функция генерации HTML для ссылки
function generateLink(name, url, id) {
    return '<a href="' + url + '" target="_blank" id="' + id + '">' + name + '</a>';
}

// Функция сохранения номера в истории, если его там ещё нет
function saveToHistory(phone) {
    var historyDiv = document.getElementById("history");
    var existingHistory = historyDiv.innerHTML;

    if (!existingHistory.includes(phone)) {
        var historyHTML = generateHistoryEntry(phone);
        historyDiv.innerHTML = historyHTML + historyDiv.innerHTML;
        localStorage.setItem('linksHistory', historyDiv.innerHTML);
    }
}

// Функция генерации HTML для истории
function generateHistoryEntry(phone) {
    return '<p class="history-item" onclick="showLinks(this, \'' + phone + '\')">' + phone + '</p>';
}

// Функция отображения ссылок для выбранного номера телефона
function showLinks(element, phone) {
    var linksDiv = document.getElementById("links");
    var linksHTML = generateLink("WhatsApp", "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phone), "whatsapp") +
                    generateLink("Viber", "viber://chat?number=" + encodeURIComponent(phone), "viber") +
                    generateLink("Telegram", "https://t.me/" + encodeURIComponent(phone), "telegram");
    
    linksDiv.innerHTML = linksHTML;

    // Удаление подсветки со всех элементов истории
    var historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => item.classList.remove('selected'));

    // Подсветка выбранного элемента истории
    element.classList.add('selected');

    // Отображение сообщения об обновлении
    showUpdateMessage();
}

// Функция отображения сообщения об обновлении
function showUpdateMessage() {
    var updateDiv = document.getElementById("update");
    updateDiv.innerText = "Ссылки обновлены";
    setTimeout(function(){
        updateDiv.innerText = "";
    }, 5000);
}

// Функция очистки истории
function clearHistory() {
    localStorage.removeItem('linksHistory');
    document.getElementById("history").innerHTML = "";
}
