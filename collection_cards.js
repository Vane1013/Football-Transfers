// ============================================
// Модальное окно покупки с Моуринью
// ============================================

function showBuyModal(itemName, itemPrice, itemType = 'player') {
    // Удаляем старую модалку, если была
    const existing = document.getElementById('buyModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'buyModal';
    modal.className = 'buy-modal-overlay';
    modal.innerHTML = `
        <div class="buy-modal-content">
            <div class="buy-modal-img-wrapper">
                <img src="photos/mourinho.png" alt="José Mourinho" class="buy-modal-img"
                     onerror="this.src='photos/mourinho.png'; this.style.opacity=0.5;">
            </div>
            <h3 class="buy-modal-title">Transfer Request Sent!</h3>
            <p class="buy-modal-text"><strong>${itemName}</strong> — ⭐ ${itemPrice}</p>
            <p class="buy-modal-message">
                Please contact the <strong>President of the Football Federation</strong> to approve this ${itemType} transfer.
            </p>
            <button type="button" class="buy-modal-btn" onclick="closeBuyModal()">
                <i class="fas fa-handshake me-2"></i>Understood
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // Клик по фону — закрыть
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeBuyModal();
    });

    // ESC — закрыть
    document.addEventListener('keydown', escClose);

    // Показать
    requestAnimationFrame(() => modal.classList.add('show'));
    document.body.style.overflow = 'hidden';
}

function closeBuyModal() {
    const modal = document.getElementById('buyModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
}

function escClose(e) {
    if (e.key === 'Escape') closeBuyModal();
}

// Универсальный обработчик для всех .buy-btn
document.addEventListener('click', function (e) {
    const btn = e.target.closest('.buy-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const path = window.location.pathname.toLowerCase();
    let itemType = 'player';
    if (path.includes('coaches'))         itemType = 'coach';
    else if (path.includes('retro'))      itemType = 'legend player';
    else if (path.includes('stadiums'))   itemType = 'stadium';
    else if (path.includes('collection')) itemType = 'legendary collection card';

    const playerName  = btn.getAttribute('data-player-name')  || 'Unknown';
    const playerPrice = btn.getAttribute('data-player-price') || '0';

    showBuyModal(playerName, playerPrice, itemType);
}, true);
