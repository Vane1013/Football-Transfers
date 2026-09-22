// ============================================
// Модальное окно покупки с Моуринью
// ============================================

function showBuyModal(itemName, itemPrice, itemType = 'player') {
    let modal = document.getElementById('buyModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'buyModal';
        modal.className = 'buy-modal-overlay';
        modal.innerHTML = `
            <div class="buy-modal-content">
                <div class="buy-modal-img-wrapper">
                    <img src="photos/mourinho.png" alt="José Mourinho" class="buy-modal-img">
                </div>
                <h3 class="buy-modal-title">Transfer Request Sent!</h3>
                <p class="buy-modal-text"></p>
                <p class="buy-modal-message"></p>
                <button class="buy-modal-btn" onclick="closeBuyModal()">
                    <i class="fas fa-handshake me-2"></i>Understood
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeBuyModal();
        });
    }

    modal.querySelector('.buy-modal-text').innerHTML = `<strong>${itemName}</strong> — ⭐ ${itemPrice}`;
    modal.querySelector('.buy-modal-message').innerHTML =
        `Please contact the <strong>President of the Football Federation</strong> to approve this ${itemType} transfer.`;

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

// Универсальный обработчик для всех .buy-btn
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.buy-btn');
    if (!btn) return;

    // Останавливаем отправку формы (если где-то осталась)
    e.preventDefault();
    e.stopPropagation();

    // Тип предмета по URL
    const path = window.location.pathname.toLowerCase();
    let itemType = 'player';
    if (path.includes('coaches'))   itemType = 'coach';
    else if (path.includes('retro')) itemType = 'legend player';
    else if (path.includes('stadiums')) itemType = 'stadium';

    const playerName  = btn.getAttribute('data-player-name');
    const playerPrice = btn.getAttribute('data-player-price');

    showBuyModal(playerName, playerPrice, itemType);
});
