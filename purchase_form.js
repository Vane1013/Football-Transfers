// Данные менеджеров с бюджетом (0 звёзд)
const managers = {
    'Vanya': {
        name: 'Vanya',
        email: 'vanya@football.com',
        license: 'FIFA-AGENT-001',
        budget: 0,
        welcomeShown: false  // Флаг для отслеживания показа приветствия
    },
    'Serega': {
        name: 'Serega', 
        email: 'serega@football.com',
        license: 'FIFA-AGENT-002',
        budget: 0,
        welcomeShown: false  // Флаг для отслеживания показа приветствия
    }
};

let currentManager = 'Vanya';
let welcomeAlert = null; // Переменная для хранения ссылки на текущее приветственное сообщение

// Загрузка данных выбранного игрока
document.addEventListener('DOMContentLoaded', function() {
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer') || '{}');
    
    if (selectedPlayer.name) {
        // Отображаем информацию о выбранном игроке
        document.getElementById('playerName').textContent = selectedPlayer.name;
        document.getElementById('playerClub').textContent = `Club: ${selectedPlayer.club}`;
        document.getElementById('playerNumber').textContent = `Player Number: ${selectedPlayer.number}`;
        
        const formattedPrice = formatPrice(selectedPlayer.price);
        document.getElementById('playerPrice').textContent = formattedPrice;
        document.getElementById('actualPlayerPrice').value = selectedPlayer.price;
        
        // Устанавливаем сумму трансфера по умолчанию равной цене игрока
        document.getElementById('transferAmount').value = selectedPlayer.price;
        
        // Устанавливаем сообщение об успехе с именем игрока
        document.getElementById('successPlayerInfo').textContent = 
            `You have successfully purchased ${selectedPlayer.name} for ${formattedPrice}`;
        
        // Проверяем бюджет после загрузки игрока
        checkBudget();
    } else {
        window.location.href = 'players.html';
    }

    // Устанавливаем дату по умолчанию (завтра)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.querySelector('input[name="effective_date"]').value = tomorrow.toISOString().split('T')[0];
    
    // Обновляем отображение бюджета
    updateBudgetDisplay();
    
    // Показываем приветствие для текущего менеджера (если ещё не показывали)
    showWelcomeMessage();
});

// Функция выбора менеджера
function selectManager(managerName) {
    const manager = managers[managerName];
    if (manager) {
        // Удаляем предыдущее приветственное сообщение
        removeWelcomeMessage();
        
        currentManager = managerName;
        document.getElementById('managerName').value = manager.name;
        document.getElementById('managerEmail').value = manager.email;
        document.getElementById('agentLicense').value = manager.license;
        document.getElementById('currentManagerBudget').value = manager.budget;
        document.getElementById('currentManager').textContent = `Selected Manager: ${managerName}`;
        
        // Обновляем отображение бюджета
        updateBudgetDisplay();
        
        // Проверяем бюджет после смены менеджера
        checkBudget();
        
        // Показываем приветствие для нового менеджера (если ещё не показывали)
        showWelcomeMessage();
    }
}

// Обновление отображения бюджета
function updateBudgetDisplay() {
    const manager = managers[currentManager];
    if (manager) {
        document.getElementById('managerBudget').textContent = `⭐ ${manager.budget}`;
        document.getElementById('managerBudgetTitle').textContent = `${currentManager}'s Budget`;
    }
}

// Показ приветственного сообщения
function showWelcomeMessage() {
    const manager = managers[currentManager];
    
    // Проверяем, нужно ли показывать приветствие
    if (manager && manager.budget === 0 && !manager.welcomeShown) {
        // Создаем информационное сообщение
        welcomeAlert = document.createElement('div');
        welcomeAlert.className = 'alert alert-info';
        welcomeAlert.innerHTML = `
            <i class="fas fa-info-circle me-2"></i>
            <strong>Welcome to Transfermarkt, ${currentManager}!</strong>
            <button type="button" class="btn-close float-end" onclick="removeWelcomeMessage()"></button>
        `;
        
        // Вставляем перед формой
        const formSection = document.querySelector('.form-section');
        formSection.insertBefore(welcomeAlert, formSection.firstChild);
        
        // Помечаем, что приветствие показано для этого менеджера
        manager.welcomeShown = true;
    }
}

// Удаление приветственного сообщения
function removeWelcomeMessage() {
    if (welcomeAlert && welcomeAlert.parentNode) {
        welcomeAlert.parentNode.removeChild(welcomeAlert);
        welcomeAlert = null;
    }
}

// Проверка суммы трансфера и бюджета
document.getElementById('transferAmount').addEventListener('input', function() {
    const actualPrice = parseInt(document.getElementById('actualPlayerPrice').value);
    const enteredPrice = parseInt(this.value) || 0;
    const priceWarning = document.getElementById('priceWarning');
    const budgetWarning = document.getElementById('budgetWarning');
    
    // Сбрасываем предупреждения
    priceWarning.style.display = 'none';
    budgetWarning.style.display = 'none';
    
    // Проверка соответствия цене игрока
    if (enteredPrice < actualPrice) {
        priceWarning.style.display = 'block';
        priceWarning.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Offer too low!</strong> Player's market value is ${actualPrice} stars.
        `;
    } else if (enteredPrice > actualPrice) {
        priceWarning.style.display = 'block';
        priceWarning.style.backgroundColor = '#d1ecf1';
        priceWarning.style.borderColor = '#bee5eb';
        priceWarning.style.color = '#0c5460';
        priceWarning.innerHTML = `
            <i class="fas fa-info-circle me-2"></i>
            <strong>Generous offer!</strong> You're offering ${enteredPrice - actualPrice} stars above market value.
        `;
    } else {
        priceWarning.style.display = 'none';
        // Возвращаем стандартный стиль предупреждения
        priceWarning.style.backgroundColor = '';
        priceWarning.style.borderColor = '';
        priceWarning.style.color = '';
    }
    
    // Проверка бюджета
    checkBudget();
});

// Проверка бюджета
function checkBudget() {
    const manager = managers[currentManager];
    const enteredPrice = parseInt(document.getElementById('transferAmount').value) || 0;
    const budgetWarning = document.getElementById('budgetWarning');
    
    if (manager && enteredPrice > manager.budget) {
        budgetWarning.style.display = 'block';
        budgetWarning.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            <strong>Insufficient Stars!</strong> You have ${manager.budget} stars but need ${enteredPrice}.
            ${manager.budget === 0 ? 
                ' Study well to earn stars!' : 
                ` You need ${enteredPrice - manager.budget} more stars.`
            }
        `;
        return false;
    } else {
        budgetWarning.style.display = 'none';
        return true;
    }
}

// Обработка формы
document.getElementById('purchaseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer') || '{}');
    const actualPrice = parseInt(document.getElementById('actualPlayerPrice').value);
    const enteredPrice = parseInt(document.getElementById('transferAmount').value) || 0;
    const manager = managers[currentManager];
    
    // Проверка соответствия цене игрока
    if (enteredPrice < actualPrice) {
        alert(`Offer too low! ${selectedPlayer.name}'s market value is ${actualPrice} stars.`);
        return;
    }
    
    // Проверка бюджета
    if (!checkBudget()) {
        const neededStars = enteredPrice - manager.budget;
        alert(`Insufficient stars! You have ${manager.budget} stars but need ${enteredPrice}.${neededStars > 0 ? ` You need ${neededStars} more stars.` : ''}`);
        return;
    }
    
    // Обновляем бюджет менеджера после успешной покупки
    if (manager) {
        manager.budget -= enteredPrice;
        updateBudgetDisplay();
    }
    
    // Обновляем сообщение об успехе с именем игрока
    document.getElementById('successPlayerInfo').textContent = 
        `You have successfully purchased ${selectedPlayer.name} for ⭐ ${enteredPrice}`;
    
    // Показываем сообщение об успехе
    document.getElementById('successMessage').style.display = 'block';
});

function formatPrice(price) {
    // Форматируем цену в звёздах
    return `⭐ ${price}`;
}

function clearForm() {
    document.getElementById('purchaseForm').reset();
    document.getElementById('priceWarning').style.display = 'none';
    document.getElementById('budgetWarning').style.display = 'none';
    
    // Восстанавливаем значения по умолчанию
    selectManager('Vanya');
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer') || '{}');
    if (selectedPlayer.price) {
        document.getElementById('transferAmount').value = selectedPlayer.price;
    }
    
    // Устанавливаем дату по умолчанию (завтра)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.querySelector('input[name="effective_date"]').value = tomorrow.toISOString().split('T')[0];
}

function closeSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
    window.location.href = 'all_players.html';
}

