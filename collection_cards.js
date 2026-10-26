async function getResponce() {
    let responce = await fetch("collection_cards.json")
    let content = await responce.text()
    content = JSON.parse(content)

    let node_for_insert = document.getElementById("node_for_insert")
    node_for_insert.innerHTML = ''

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'row mb-5';

    content.forEach((item) => {
        cardsContainer.innerHTML += `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
            <div class="card h-100 d-flex flex-column shadow-sm collection-card">
                <div class="card-img-container position-relative">
                    <img class="card-img-top responsive-img mt-2" 
                         src="${item.img}" 
                         alt="${item.title}"
                         style="height: 200px; object-fit: contain; border-radius: 10px;">
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge collection-badge">
                            <i class="fas fa-gem me-1"></i>COLLECTION
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
                    </div>
                    <p class="card-text flex-grow-1">${item.description}</p>
                    
                    <div class="price-section mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold fs-5">
                                <i class="fas fa-star"></i> ${item.price}
                            </span>
                            <span class="small">Legendary Value</span>
                        </div>
                    </div>
                    
                    <input type="hidden" name="vendor_code" value="${item.vendor_code}">
                    <div class="mt-auto">
                        <button class="btn btn-collection btn-sm w-100 buy-btn" 
                                data-player-id="${item.id}"
                                data-player-name="${item.title}"
                                data-player-price="${item.price}"
                                data-player-number="${item.number}"
                                data-player-club="${item.club}">
                            <i class="fas fa-gem me-2"></i> Claim Card
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    node_for_insert.appendChild(cardsContainer);
}

getResponce();
