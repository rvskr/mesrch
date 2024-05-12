window.onload = function() {
    var savedHistory = localStorage.getItem('linksHistory');
    if (savedHistory) {
        document.getElementById('history').innerHTML = savedHistory;
    }
};

function generateLinks() {
    var phoneInput = document.getElementById("phone");
    var phone = phoneInput.value.trim();
    var linksDiv = document.getElementById("links");
    var historyDiv = document.getElementById("history");

    if (phone !== "") {
        // Удаление всех пробелов из номера телефона
        phone = phone.replace(/\s/g, "");

        // Добавление кода страны, если его нет
        if (!phone.startsWith("+")) {
            // Получаем код страны из браузера
            var countryCode = getCountryCode();
            phone = "+" + countryCode + phone;
        }

        // Извлечение кода страны из номера телефона
        var country = getCountryCodeFromPhone(phone);
        phone = "+" + country + phone.replace(/\D/g, '');

        var linksHTML = generateLink("WhatsApp", "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phone), "whatsapp");
        linksHTML += generateLink("Viber", "viber://chat?number=" + encodeURIComponent(phone), "viber");
        linksHTML += generateLink("Telegram", "https://t.me/" + encodeURIComponent(phone), "telegram");

        var historyHTML = generateHistoryEntry(phone);

        linksDiv.innerHTML = linksHTML;
        historyDiv.innerHTML = historyHTML + historyDiv.innerHTML;

        localStorage.setItem('linksHistory', historyDiv.innerHTML);

        showUpdateMessage();
    } else {
        linksDiv.innerHTML = "<p>Введите номер телефона</p>";
    }
}

function generateLink(name, url, id) {
    return '<a href="' + url + '" target="_blank" id="' + id + '">' + name + '</a>';
}

function generateHistoryEntry(phone) {
    return '<p onclick="showLinks(this, \'' + phone + '\')">' + phone + '</p>';
}

function getCountryCode() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://ipinfo.io/json", false);
    xhr.send();

    if (xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        var countryCode = response.country;
        return countryCode;
    } else {
        console.error("Error getting country code:", xhr.status);
        return null;
    }
}

function getCountryCodeFromPhone(phone) {
    // Регулярное выражение для извлечения кода страны
    var countryCodeRegex = /^\+(\d{1,3})/;
    var match = phone.match(countryCodeRegex);
    return match ? match[1] : '';
}

function showLinks(element, phone) {
    var linksDiv = document.getElementById("links");
    var linksHTML = generateLink("WhatsApp", "https://api.whatsapp.com/send?phone=" + encodeURIComponent(phone), "whatsapp") +
                    generateLink("Viber", "viber://chat?number=" + encodeURIComponent(phone), "viber") +
                    generateLink("Telegram", "https://t.me/" + encodeURIComponent(phone), "telegram");
    
    linksDiv.innerHTML = linksHTML;

    showUpdateMessage();
}

function showUpdateMessage() {
    var updateDiv = document.getElementById("update");
    updateDiv.innerText = "Ссылки обновлены";
    setTimeout(function(){
        updateDiv.innerText = "";
    }, 2000);
}

function clearHistory() {
    localStorage.removeItem('linksHistory');
    document.getElementById("history").innerHTML = "";
}
