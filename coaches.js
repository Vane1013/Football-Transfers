async function getResponce() {
    let responce = await fetch("coaches.json")
    let content = await responce.text()
    content = JSON.parse(content)
    
    // Фильтруем только тренеров
    const coaches = content.filter(player => player.role === 'coach');

    let node_for_insert = document.getElementById("node_for_insert")
    node_for_insert.innerHTML = '' // Очищаем контейнер

    // Создаем секцию для тренеров
    if (coaches.length > 0) {
        const coachesContainer = document.createElement('div');
        coachesContainer.className = 'row mb-5';

        coaches.forEach((item) => {
            coachesContainer.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                <div class="card h-100 d-flex flex-column shadow-sm">
                    <div class="card-img-container position-relative">
                        <img class="card-img-top responsive-img mt-2" 
                             src="${item.img}" 
                             alt="${item.title}"
                             style="height: 200px; object-fit: contain;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge bg-danger">
                                <i class="fas fa-whistle"></i>
                            </span>
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
                            <small class="text-muted">
                                <i class="fas fa-whistle"></i> Coach
                            </small>
                        </div>
                        <p class="card-text flex-grow-1">${item.description}</p>
                        
                        <!-- Блок с ценой -->
                        <div class="price-section mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-warning fw-bold fs-5">
                                    <i class="fas fa-star text-warning"></i> ${item.price}
                                </span>
                                <span class="text-muted small">Coach Price</span>
                            </div>
                        </div>
                        
                        <input type="hidden" name="vendor_code" value="${item.vendor_code}">
                        <div class="mt-auto">
                            <button class="btn btn-danger btn-sm w-100 buy-btn" 
                                    data-player-id="${item.id}"
                                    data-player-name="${item.title}"
                                    data-player-price="${item.price}"
                                    data-player-number="${item.number}"
                                    data-player-club="${item.club}">
                                <i class="fas fa-shopping-cart me-2"></i> Hire Coach
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        node_for_insert.appendChild(coachesContainer);
    } else {
        node_for_insert.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-whistle fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No coaches available at the moment</h4>
            </div>
        `;
    }

    // Добавляем обработчики событий для кнопок покупки
    addBuyButtonListeners();
}

function addBuyButtonListeners() {
    // Обработчик для кнопок покупки
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-btn') || e.target.closest('.buy-btn')) {
            const button = e.target.classList.contains('buy-btn') ? e.target : e.target.closest('.buy-btn');
            const playerId = button.getAttribute('data-player-id');
            const playerName = button.getAttribute('data-player-name');
            const playerPrice = button.getAttribute('data-player-price');
            const playerNumber = button.getAttribute('data-player-number');
            const playerClub = button.getAttribute('data-player-club');
            
            // Сохраняем данные тренера в localStorage для использования на странице покупки
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