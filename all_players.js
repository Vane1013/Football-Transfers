async function getResponce() {
    let responce = await fetch("all_players.json")
    let content = await responce.text()
    content = JSON.parse(content)

    let node_for_insert = document.getElementById("node_for_insert")
    node_for_insert.innerHTML = '' // Очищаем контейнер

    // Определяем позиции на основе поля role (теперь на английском)
    const playersByPosition = {
        'goalkeeper': [],
        'defender': [],
        'midfielder': [],
        'forward': []
    }

    content.forEach(player => {
        const position = determinePosition(player);
        playersByPosition[position].push(player);
    });

    // Создаем секции для каждой позиции
    for (const [position, players] of Object.entries(playersByPosition)) {
        if (players.length > 0) {
            // Создаем заголовок секции
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'row mb-4';
            sectionHeader.innerHTML = `
                <div class="col-12">
                    <h2 class="position-title text-primary border-bottom pb-2">
                        ${getPositionTitle(position)} (${players.length})
                    </h2>
                </div>
            `;
            node_for_insert.appendChild(sectionHeader);

            // Создаем контейнер для карточек этой позиции
            const positionContainer = document.createElement('div');
            positionContainer.className = 'row mb-5';

            players.forEach((item) => {
                const formattedPrice = formatPrice(item.price);
                positionContainer.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card h-100 d-flex flex-column shadow-sm">
                        <div class="card-img-container position-relative">
                            <img class="card-img-top responsive-img mt-2" 
                                 src="${item.img}" 
                                 alt="${item.title}"
                                 style="height: 200px; object-fit: contain;">
                            <div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-primary">#${item.number}</span>
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.title}</h5>
                            <div class="player-info mb-2">
                                <small class="text-muted d-block">
                                    <i class="fas fa-shield-alt"></i> ${item.club}
                                </small>
                                <small class="text-muted d-block">
                                    <i class="fas fa-flag"></i> ${item.country}
                                </small>
                            </div>
                            <p class="card-text flex-grow-1">${item.description}</p>
                            
                            <!-- Блок с ценой -->
                            <div class="price-section mb-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-warning fw-bold fs-5">${formattedPrice}</span>
                                    <span class="text-muted small">Market Value</span>
                                </div>
                            </div>
                            
                            <input type="hidden" name="vendor_code" value="${item.vendor_code}">
                            <div class="mt-auto">
                                <button class="btn btn-success btn-sm w-100 buy-btn" 
                                        data-player-id="${item.id}"
                                        data-player-name="${item.title}"
                                        data-player-price="${item.price}"
                                        data-player-number="${item.number}"
                                        data-player-club="${item.club}">
                                    <i class="fas fa-shopping-cart"></i> Buy Player
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });

            node_for_insert.appendChild(positionContainer);
        }
    }

    // Добавляем обработчики событий для кнопок покупки
    addBuyButtonListeners();
}

function determinePosition(player) {
    // Просто используем поле role из JSON (теперь на английском)
    return player.role || 'forward';
}

function getPositionTitle(position) {
    const titles = {
        'goalkeeper': '⚽ Goalkeepers',
        'defender': '🛡️ Defenders',
        'midfielder': '🎯 Midfielders',
        'forward': '⚡ Forwards'
    };
    return titles[position] || position;
}

function formatPrice(price) {
    // Показываем звезду и число стоимости
    return `<span class="text-warning">⭐</span> ${price}`;
}

function addBuyButtonListeners() {
    // Обработчик для кнопок покупки
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('buy-btn') || e.target.closest('.buy-btn')) {
            const button = e.target.classList.contains('buy-btn') ? e.target : e.target.closest('.buy-btn');
            const playerId = button.getAttribute('data-player-id');
            const playerName = button.getAttribute('data-player-name');
            const playerPrice = button.getAttribute('data-player-price');
            const playerNumber = button.getAttribute('data-player-number');
            const playerClub = button.getAttribute('data-player-club');

            // Сохраняем данные игрока в localStorage для использования на странице покупки
            localStorage.setItem('selectedPlayer', JSON.stringify({
                id: playerId,
                name: playerName,
                price: playerPrice,
                number: playerNumber,
                club: playerClub
            }));

            // Перенаправляем на страницу покупки
            window.location.href = 'purchase_form.html';
        }
    });
}

getResponce();