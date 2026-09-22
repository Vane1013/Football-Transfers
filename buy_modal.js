// ============================================
// Модальное окно покупки с Моуринью
// ============================================

function showBuyModal(itemName, itemPrice, itemType = 'player') {
    // Создаем модальное окно, если его нет на странице
    let modal = document.getElementById('buyModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'buyModal';
        modal.className = 'buy-modal-overlay';
        modal.innerHTML = `
            <div class="buy-modal-content">
                <div class="buy-modal-img-wrapper">
                    <img src="photos/king.jpg" alt="José Mourinho" class="buy-modal-img">
                </div>
                <h3 class="buy-modal-title">Transfer Request Sent!</h3>
                <p class="buy-modal-text">
                    <strong>${itemName}</strong> — ⭐ ${itemPrice}
                </p>
                <p class="buy-modal-message">
                    Please contact the <strong>President of the Football Federation</strong> to approve this ${itemType} transfer.
                </p>
                <button class="buy-modal-btn" onclick="closeBuyModal()">
                    <i class="fas fa-handshake me-2"></i>Understood
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        // Закрытие по клику на оверлей
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBuyModal();
            }
        });
    }

    // Обновляем содержимое
    modal.querySelector('.buy-modal-text').innerHTML = `<strong>${itemName}</strong> — ⭐ ${itemPrice}`;
    modal.querySelector('.buy-modal-message').innerHTML = 
        `Please contact the <strong>President of the Football Federation</strong> to approve this ${itemType} transfer.`;

    // Показываем
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.style.overflow = 'hidden';
}

function closeBuyModal() {
    const modal = document.getElementById('buyModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Универсальная функция для кнопок покупки
function handleBuyButtonClick(playerId, playerName, playerPrice, itemType = 'player') {
    showBuyModal(playerName, playerPrice, itemType);
}

// Автоматический обработчик для всех кнопок .buy-btn
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.buy-btn');
    if (!btn) return;

    // Определяем тип по классу или странице
    let itemType = 'player';
    if (window.location.pathname.includes('coaches')) itemType = 'coach';
    else if (window.location.pathname.includes('retro')) itemType = 'legend player';
    else if (window.location.pathname.includes('stadiums')) itemType = 'stadium';

    const playerName = btn.getAttribute('data-player-name');
    const playerPrice = btn.getAttribute('data-player-price');

    showBuyModal(playerName, playerPrice, itemType);
});
