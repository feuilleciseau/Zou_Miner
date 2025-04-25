let wallet = 0.15;

const miners = [
    {
        name: 'Raspberry Pi',
        price: 0.1,
        miningRate: 0.005,
        size: 1
    },
    {
        name: 'Desktop Computer',
        price: 0.5,
        miningRate: 0.02,
        size: 2
    },
    {
        name: 'Rig GPU',
        price: 2,
        miningRate: 0.08,
        size: 3
    },
    {
        name: 'Asic Miner',
        price: 8,
        miningRate: 0.32,
        size: 5
    },
    {
        name: 'Mining Farm',
        price: 20,
        miningRate: 0.8,
        size: 10
    },
    {
        name: 'Data Center',
        price: 50,
        miningRate: 2,
        size: 20
    },
    {
        name: 'Supercomputer',
        price: 100,
        miningRate: 4,
        size: 30
    },
    {
        name: 'Quantum Miner',
        price: 200,
        miningRate: 8,
        size: 50
    }
];

const locations = [
    {
        name: 'Bedroom',
        price: 0,
        capacity: 5
    },
    {
        name: 'Garage',
        price: 5,
        capacity: 10
    },
    {
        name: 'Apartment',
        price: 15,
        capacity: 20
    },
    {
        name: 'House',
        price: 30,
        capacity: 35
    },
    {
        name: 'Hangar',
        price: 60,
        capacity: 60
    },
    {
        name: 'Factory',
        price: 100,
        capacity: 90
    },
    {
        name: 'Technology Campus',
        price: 150,
        capacity: 120
    },
    {
        name: 'Space Center',
        price: 250,
        capacity: 200
    }
];

let currentLocation = locations[0];
let ownedMiners = [];
let totalSizeUsed = 0;

// Update the wallet display
function updateWalletDisplay() {
    document.getElementById('zc-amount').textContent = wallet.toFixed(3);
    displayAvailableMiners();
    displayAvailableLocations();
}

// Update the mining rate display
function updateMiningRateDisplay() {
    let totalMiningRate = ownedMiners.reduce((total, miner) => total + miner.miningRate, 0);
    document.getElementById('current-mining-rate').textContent = totalMiningRate.toFixed(3);
}

// Update the current location display
function updateLocationDisplay() {
    document.getElementById('location-name').textContent = currentLocation.name;
    document.getElementById('total-capacity').textContent = currentLocation.capacity;
    document.getElementById('used-capacity').textContent = totalSizeUsed;

    // Calculate the percentage of used capacity
    const capacityPercent = (totalSizeUsed / currentLocation.capacity) * 100;
    const capacityBar = document.getElementById('capacity-bar');
    capacityBar.style.width = capacityPercent + '%';
    capacityBar.setAttribute('aria-valuenow', capacityPercent);

    // Change the color of the bar based on the percentage
    capacityBar.classList.remove('bg-success', 'bg-warning', 'bg-danger');
    if (capacityPercent < 50) {
        capacityBar.classList.add('bg-success');
    } else if (capacityPercent < 80) {
        capacityBar.classList.add('bg-warning');
    } else {
        capacityBar.classList.add('bg-danger');
    }
}

// Display the owned miners
function updateOwnedMinersDisplay() {
    const container = document.getElementById('owned-miners-container');
    container.innerHTML = '';
    if (ownedMiners.length === 0) {
        container.innerHTML = '<p>You do not own any miners.</p>';
        return;
    }
    ownedMiners.forEach((miner, index) => {
        const minerCard = document.createElement('div');
        minerCard.className = 'col-6 col-md-3 mb-2';
        const sellPrice = (miner.price * 0.5).toFixed(2);
        minerCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body p-2">
                    <h5 class="card-title text-center">${miner.name}</h5>
                    <p class="card-text text-center">Production : ${miner.miningRate} Zc/s</p>
                    <p class="card-text text-center">Size : ${miner.size}</p>
                    <p class="card-text text-center">Selling price : ${sellPrice} Zc</p>
                </div>
                <div class="card-footer text-center p-1">
                    <button class="btn btn-sm btn-danger" onclick="sellMiner(${index})">
                        Sell
                    </button>
                </div>
            </div>
        `;
        container.appendChild(minerCard);
    });
}

// Display the available miners
function displayAvailableMiners() {
    const container = document.getElementById('miners-container');
    container.innerHTML = '';
    miners.forEach((miner, index) => {
        const canAfford = wallet >= miner.price;
        const hasSpace = (totalSizeUsed + miner.size) <= currentLocation.capacity;
        const minerCard = document.createElement('div');
        minerCard.className = 'col-6 col-md-3 mb-2';
        minerCard.innerHTML = `
            <div class="card h-100 ${canAfford && hasSpace ? '' : 'opacity-50'}">
                <div class="card-body p-2">
                    <h5 class="card-title text-center">${miner.name}</h5>
                    <p class="card-text text-center">Price : <strong>${miner.price} Zc</strong></p>
                    <p class="card-text text-center">Production : ${miner.miningRate} Zc/s</p>
                    <p class="card-text text-center">Size : ${miner.size}</p>
                </div>
                <div class="card-footer text-center p-1">
                    <button class="btn btn-sm btn-primary" onclick="buyMiner(${index})" ${canAfford && hasSpace ? '' : 'disabled'}>
                        Buy
                    </button>
                </div>
            </div>
        `;
        container.appendChild(minerCard);
    });
}

// Display the available locations
function displayAvailableLocations() {
    const container = document.getElementById('locations-container');
    container.innerHTML = '';
    locations.forEach((location, index) => {
        if (location !== currentLocation) {
            const canAfford = wallet >= location.price;
            const isLarger = location.capacity > currentLocation.capacity;
            const hasEnoughSpace = location.capacity >= totalSizeUsed;
            if (isLarger) {
                const locationCard = document.createElement('div');
                locationCard.className = 'col-6 col-md-3 mb-2';
                locationCard.innerHTML = `
                    <div class="card h-100 ${canAfford && hasEnoughSpace ? '' : 'opacity-50'}">
                        <div class="card-body p-2">
                            <h5 class="card-title text-center">${location.name}</h5>
                            <p class="card-text text-center">Price : <strong>${location.price} Zc</strong></p>
                            <p class="card-text text-center">Capacity : ${location.capacity}</p>
                        </div>
                        <div class="card-footer text-center p-1">
                            <button class="btn btn-sm btn-${canAfford && hasEnoughSpace ? 'primary' : 'secondary'}" onclick="buyLocation(${index})" ${canAfford && hasEnoughSpace ? '' : 'disabled'}>
                                Buy
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(locationCard);
            }
        }
    });
}

// Function to buy a miner
function buyMiner(minerIndex) {
    const miner = miners[minerIndex];
    if (wallet >= miner.price && (totalSizeUsed + miner.size) <= currentLocation.capacity) {
        wallet -= miner.price;
        // Create a copy of the miner to avoid shared references
        const ownedMiner = Object.assign({}, miner);
        ownedMiners.push(ownedMiner);
        totalSizeUsed += ownedMiner.size;
        updateWalletDisplay();
        updateOwnedMinersDisplay();
        updateLocationDisplay();
        updateMiningRateDisplay();
    } else {
        alert("You don't have enough Zc or enough space !");
    }
}

// Function to sell a miner
function sellMiner(minerIndex) {
    const miner = ownedMiners[minerIndex];
    const sellPrice = miner.price * 0.5;
    wallet += sellPrice;
    totalSizeUsed -= miner.size;
    ownedMiners.splice(minerIndex, 1);
    updateWalletDisplay();
    updateOwnedMinersDisplay();
    updateLocationDisplay();
    updateMiningRateDisplay();
}

// Function to buy a location
function buyLocation(locationIndex) {
    const location = locations[locationIndex];
    if (wallet >= location.price) {
        if (location.capacity >= totalSizeUsed) {
            if (location.capacity > currentLocation.capacity) {
                wallet -= location.price;
                currentLocation = location;
                updateWalletDisplay();
                updateLocationDisplay();
                displayAvailableLocations();
            } else {
                alert('You cannot buy a location smaller than or equal to your current location.');
            }
        } else {
            alert('You have too many miners for this location.');
        }
    } else {
        alert("You don't have enough Zc !");
    }
}

// Mining logic
function startMining() {
    setInterval(() => {
        let totalMiningRate = ownedMiners.reduce((total, miner) => total + miner.miningRate, 0);
        wallet += totalMiningRate;
        updateWalletDisplay();
    }, 1000);
}

// Game initialization
function initGame() {
    updateWalletDisplay();
    updateLocationDisplay();
    updateOwnedMinersDisplay();
    updateMiningRateDisplay();
    displayAvailableMiners();
    displayAvailableLocations();
    startMining();
}

// Start the game when the page is loaded
window.onload = initGame;
