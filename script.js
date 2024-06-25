let lastClipboardPhone = ""; // Переменная для хранения последнего обнаруженного номера

window.onload = function() {
    // Получаем историю ссылок из локального хранилища и выводим её на страницу
    var savedHistory = localStorage.getItem('linksHistory');
    if (savedHistory) {
        document.getElementById('history').innerHTML = savedHistory;
    }

    // Автоматически вставляем номер из буфера обмена
    checkClipboardForPhoneNumber();

    // Подсветка текущего номера в истории, если он есть
    highlightCurrentPhoneNumber();
};

// Функция для подсветки текущего номера в истории при загрузке страницы
function highlightCurrentPhoneNumber() {
    var historyItems = document.querySelectorAll('.history-item');

    // Убираем класс 'selected' у всех элементов истории
    historyItems.forEach(item => item.classList.remove('selected'));
}

// Функция проверки буфера обмена на наличие номера телефона при загрузке страницы
async function checkClipboardForPhoneNumber() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const phonePattern = /^\+?[0-9\s\-]+$/; // Регулярное выражение для проверки номера телефона

        const normalizedPhone = normalizePhoneNumber(clipboardText.trim());

        // Вставляем номер из буфера обмена, если он прошел проверку
        if (phonePattern.test(clipboardText.trim()) && normalizedPhone !== lastClipboardPhone) {
            lastClipboardPhone = normalizedPhone;
            document.getElementById("phone").value = normalizedPhone;
            generateLinks(); // Автоматическая генерация ссылок
        }
    } catch (err) {
        console.error('Ошибка при чтении буфера обмена: ', err);
    }
}

// Функция для вставки номера из буфера обмена по кнопке
async function pasteFromClipboard() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const phonePattern = /^\+?[0-9\s\-]+$/; // Регулярное выражение для проверки номера телефона

        const normalizedPhone = normalizePhoneNumber(clipboardText.trim());

        // Вставляем номер из буфера обмена, если он прошел проверку
        if (phonePattern.test(clipboardText.trim())) {
            document.getElementById("phone").value = normalizedPhone;
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
function generateLinks() {
    var phoneInput = document.getElementById("phone");
    var phone = phoneInput.value.trim();
    var linksDiv = document.getElementById("links");
    var historyDiv = document.getElementById("history");

    if (phone !== "") {
        // Приведение номера телефона к единому формату
        phone = normalizePhoneNumber(phone);

        // Проверка на дублирование в истории
        var existingItems = historyDiv.querySelectorAll('.history-item');
        var alreadyExists = Array.from(existingItems).find(item => item.dataset.phone === phone);

        var historyHTML;
        if (alreadyExists) {
            // Обновляем элемент истории с текущим временем
            historyHTML = generateHistoryEntry(phone, true);
        } else {
            // Генерируем новый элемент истории с текущим временем
            historyHTML = generateHistoryEntry(phone, false);
        }

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

            // Вставка нового элемента в историю с обновлением времени
            historyDiv.innerHTML = historyHTML + historyDiv.innerHTML;

            // Установка класса selected для нового элемента истории
            var newHistoryItem = historyDiv.querySelector('.history-item');
            newHistoryItem.classList.add('selected');

            // Сохранение последнего использованного номера в локальное хранилище
            localStorage.setItem('lastPhoneNumber', phone);

            // Сохранение истории в локальном хранилище
            localStorage.setItem('linksHistory', historyDiv.innerHTML);

            // Отображение сообщения об обновлении
            showUpdateMessage("Ссылки обновлены");
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

// Функция генерации HTML для истории с добавлением времени или обновлением времени, если номер уже существует
function generateHistoryEntry(phone, exists) {
    var currentTime = new Date().toLocaleString(); // Получаем текущее время в формате строки
    var existingItems = Array.from(document.querySelectorAll('.history-item'));
    var existingItem = existingItems.find(item => item.dataset.phone === phone);

    if (exists && existingItem) {
        // Обновляем время для существующего элемента
        var timeList = existingItem.dataset.times ? existingItem.dataset.times.split('|') : [];
        timeList.push(currentTime);
        existingItem.dataset.times = timeList.join('|');
        var displayedTimes = timeList.slice(-2).join(' => '); // Показываем только последние 2 времени
        existingItem.innerHTML = phone + ' (' + displayedTimes + ')';

        // Сохраняем историю в локальном хранилище
        localStorage.setItem('linksHistory', document.getElementById('history').innerHTML);

        return existingItem.outerHTML;
    } else {
        // Создаем новый элемент с указанием времени
        return '<p class="history-item" data-phone="' + phone + '" data-times="' + currentTime + '" onclick="handleHistoryClick(event, \'' + phone + '\')" onmousedown="handleHistoryMouseDown(event, \'' + phone + '\')" onmouseup="handleHistoryMouseUp(event)">' + phone + ' (' + currentTime + ')</p>';
    }
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
    showUpdateMessage("Ссылки обновлены");
}

// Функция отображения сообщения об обновлении
function showUpdateMessage(message) {
    var updateDiv = document.getElementById("update");
    updateDiv.innerText = message;
    setTimeout(function(){
        updateDiv.innerText = "";
    }, 5000);
}

// Функция очистки истории
function clearHistory() {
    localStorage.removeItem('linksHistory');
    document.getElementById("history").innerHTML = "";
}

// Функция для обработки однократного нажатия на элемент истории
async function handleHistoryClick(event, phone) {
    if (event.detail === 1) { // Проверка на одиночный клик
        try {
            await navigator.clipboard.writeText(phone);
            showUpdateMessage("Номер скопирован: " + phone);
        } catch (err) {
            console.error('Ошибка при копировании номера: ', err);
        }
        showLinks(event.target, phone);
    }
}

// Переменные для обработки длительного нажатия
let longPressTimer;
let isLongPress = false;

// Функция для обработки начала зажатия на элементе истории
function handleHistoryMouseDown(event, phone) {
    isLongPress = false;
    longPressTimer = setTimeout(() => {
        isLongPress = true;
        showFullHistory(phone);
    }, 500); // Время задержки для распознавания длительного нажатия
}

// Функция для обработки конца зажатия на элементе истории
function handleHistoryMouseUp(event) {
    clearTimeout(longPressTimer);
}

// Функция для отображения полной истории времени для номера телефона
function showFullHistory(phone) {
    var historyItems = Array.from(document.querySelectorAll('.history-item'));
    var historyItem = historyItems.find(item => item.dataset.phone === phone);
    if (historyItem) {
        var times = historyItem.dataset.times.split('|').join('\n');
        alert('История для ' + phone + ':\n' + times); // Отображение полной истории времени в виде всплывающего сообщения
    }
}
