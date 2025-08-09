// Game State
let player = {
    money: 1000,
    moneyLimit: 326799, // New: Money limit
    inventory: {}, // drugName: quantity (Backpack)
    // trunkInventory: {}, // REMOVED: This will now be part of each car object
    location: 'Downtown',
    day: 1,
    currentMarketPrices: {},
    lab: {
        growingDrug: [null, null], // Now an array to hold two growing drugs
        harvestQuantity: [0, 0], // Quantities for each slot
        growthIntervalId: [null, null], // Intervals for each slot
        autoDayIntervalId: null // Interval for automatic day progression
    },
    nextDayCooldownEnd: 0,
    nextDayCooldownIntervalId: null,
    backpackLimit: 5000, // Backpack limit in kg
    currentBackpackWeight: 0, // Current weight in backpack
    backpackLevel: 1,
    labLevel: 1,
    level: 1, // New: Player level
    // Each car in the 'cars' array will now have its own trunkInventory and currentTrunkWeight
    cars: [], // Array to store owned cars: [{id: 'car1', name: 'Sedan', trunkLimit: 1000, icon: 'path/to/icon.png', trunkInventory: {}, currentTrunkWeight: 0}, ...]
    // currentTrunkWeight: 0, // REMOVED: This will now be part of the active car object
    ecstasySoldTotal: 0, // New: Track total Ecstasy sold
    specialCarUnlocked: false, // New: Flag for special car unlock (Lord Stang)
    mazdaSpeedProtegeUnlocked: false, // NEW: Flag for 2003 MazdaSpeed Protege unlock
    robbery: { // NEW: Robbery state
        active: false,
        endTime: 0,
        cooldownEnd: 0,
        intervalId: null // Interval for active robbery progress
    }
};

// Drug weights in kg per unit (Increased weights)
const drugWeights = {
    'Weed': 1, // Increased from 80
    'Cocaine': 200, // Increased from 120
    'Ecstasy': 20, // Increased from 30
    'Heroin': 70, // Increased from 60
    'DMT': 70, // New: Weight for DMT
    'Water': 10, // New: Weight for Water
    'Doxycycline': 5, // New: Weight for Doxycycline
    'Money Bag': 0, // New: Money Bag has no weight
    'Glock W Switch': 25, // New: Weight for Glock W Switch
    'Switch Material': 1, // New: Weight for Switch Material
    'Samsung TV': 50, // NEW: Weight for Samsung TV
    'PlayStation 5': 15, // NEW: Weight for PlayStation 5
    'Radio': 5 // NEW: Weight for Radio
};

// Placeholder image URLs for all icons - UPDATED CAR ICON PATHS
const iconUrls = {
    'dollar': 'assets/cash.png',
    'wallet': 'assets/cash.png', // Used for player money display
    'location': 'assets/location.png',
    'market_chart': 'assets/locations/marketval.png',
    'inventory_boxes': 'assets/backpack.png',
    'messages_bell': 'assets/messages.png',
    'travel_plane': 'assets/travel.png',
    'lab_flask': 'assets/locations/TheLab.png',
    'grow_seedling': 'https://placehold.co/20x20/000000/FFFFFF?text=G',
    'Weed': 'assets/bag-of-weed.png',
    'Cocaine': 'assets/bag-of-coke.png',
    'Ecstasy': 'assets/ecstasy-pill.png',
    'Heroin': 'assets/heroine-bag.png',
    'DMT': 'assets/dmt.png', // New: Icon for DMT
    'Water': 'assets/materials/water.png', // New: Icon for Water
    'Doxycycline': 'assets/materials/doxycycline.png',
    'Money Bag': 'assets/money-bag.png', // New: Icon for Money Bag
    'Glock W Switch': 'weapons/glock-w-switch.png', // New: Icon for Glock W Switch
    'Switch Material': 'assets/materials/switch.png', // New: Icon for Switch Material
    'backpack_upgrade_icon': 'assets/backpack.png', // New icon for backpack upgrades
    'lab_upgrade_icon': 'assets/locations/lab.png', // New icon for lab upgrades
    'garage': 'assets/icons/garage.png', // New icon for garage
    'dealership': 'assets/dealership.png', // New icon for dealership
    // Updated car icon paths to just 'cars/'
    'car_impala': 'cars/impala.png',
    'car_mustang_red': 'cars/mustang-red.png', // Specific color for Mustang
    'car_mustang_gray': 'cars/mustang.png', // Specific color for Mustang
    'car_van': 'cars/van.png',
    'car_infiniti_red': 'cars/infiniti-red.png', // Specific color for Infiniti
    'car_infiniti_black': 'cars/infiniti.png', // Specific color for Infiniti
    'car_special': 'cars/special-car.png', // New icon for the special car
    'car_camaro': 'cars/2000camaro.png', // NEW: 2000s Camaro icon
    'car_mazdaspeed_protege': 'cars/mazda-protege.png', // NEW: 2003 MazdaSpeed Protege icon
    'car_charger_hellcat': 'cars/hellcat.png', // NEW: Placeholder icon for 2020 Dodge Charger Hellcat
    'car_bmw_e36': 'cars/bmwe36.png', // NEW: BMW E36 icon
    'player_level_icon': 'assets/lvl.png', // NEW: Icon for player level
    'Samsung TV': 'assets/misc/samsung-tv.png', // NEW: Icon for Samsung TV
    'PlayStation 5': 'assets/misc/ps5.png', // NEW: Icon for PlayStation 5
    'Radio': 'assets/misc/images.jfif' // NEW: Icon for Radio
};

// Car definitions - Updated with 5000 storage for all and corrected icon paths
const cars = [
    { id: 'sedan', name: 'Impala', price: 10000, trunkLimit: 9000, icon: iconUrls.car_impala, colors: [], unbuyable: false }, // No color choice
    { id: 'mustang', name: 'Mustang', price: 25000, trunkLimit: 9000, icon: iconUrls.car_mustang_red, colors: ['red', 'gray'], unbuyable: false }, // Default icon, colors available
    { id: 'van', name: 'Van', price: 40000, trunkLimit: 15000, icon: iconUrls.car_van, colors: [], unbuyable: false }, // No color choice
    { id: 'infiniti', name: 'Infiniti', price: 35000, trunkLimit: 12000, icon: iconUrls.car_infiniti_red, colors: ['red', 'black'], unbuyable: false }, // New car with color choice
    { id: '300ex-quad', name: '300Ex Quad', price: 15000, trunkLimit: 7000, icon: 'cars/300ex-quad.png', colors: [], unbuyable: false }, // NEW: 300Ex Quad car
    { id: '2000s-camaro', name: '2000s Camaro', price: 30000, trunkLimit: 10000, icon: iconUrls.car_camaro, colors: [], unbuyable: false }, // NEW: 2000s Camaro
    { id: 'charger-hellcat', name: '2020 Dodge Charger Hellcat', price: 145000, trunkLimit: 18000, icon: iconUrls.car_charger_hellcat, colors: [], unbuyable: false }, // NEW: 2020 Dodge Charger Hellcat
    { id: 'bmw-e36', name: 'BMW E36', price: 50000, trunkLimit: 10000, icon: iconUrls.car_bmw_e36, colors: [], unbuyable: false }, // NEW: BMW E36
    // New special unlockable car (Lord Stang)
    { id: 'mystery-machine', name: 'Lord Stang', price: 0, trunkLimit: 10000, icon: iconUrls.car_special, colors: [], unbuyable: true, unlocked: false },
    // NEW: 2003 MazdaSpeed Protege - Unlocked at Level 10
    { id: 'mazdaspeed-protege', name: '2003 MazdaSpeed Protege', price: 0, trunkLimit: 15000, icon: iconUrls.car_mazdaspeed_protege, colors: [], unbuyable: true, unlockedAtLevel: 10 }
];

const drugs = [
    { name: 'Weed', icon: iconUrls.Weed, growCost: 1000, growTimeSeconds: 30, growYield: 10, requiredLabLevel: 1 },
    { name: 'Cocaine', icon: iconUrls.Cocaine, growCost: 2000, growTimeSeconds: 90, growYield: 16, requiredLabLevel: 3 }, // Changed requiredLabLevel
    { name: 'Ecstasy', icon: iconUrls.Ecstasy, growCost: 3000, growTimeSeconds: 75, growYield: 15, requiredLabLevel: 2 }, // Changed requiredLabLevel
    { name: 'Heroin', icon: iconUrls.Heroin, growCost: 4000, growTimeSeconds: 120, growYield: 30, requiredLabLevel: 4 },
    { name: 'DMT', icon: iconUrls.DMT, growCost: 0, growTimeSeconds: 60, growYield: 1, requiredLabLevel: 6, craftable: true }, // New: DMT, craftable
    { name: 'Money Bag', icon: iconUrls['Money Bag'], fixedPrice: 20000 }, // Updated: Money Bag is now buyable/sellable at fixed price
    { name: 'Glock W Switch', icon: iconUrls['Glock W Switch'], craftable: true, requiredLabLevel: 7 } // New: Glock W Switch, craftable at Lab Level 7
];

// New: Materials for crafting
const materials = [
    { name: 'Water', price: 50, icon: iconUrls.Water, weight: 10 },
    { name: 'Doxycycline', price: 150, icon: iconUrls.Doxycycline, weight: 5 },
    { name: 'Switch Material', price: 50, icon: iconUrls['Switch Material'], weight: 1 } // New: Switch Material
];

// NEW: Miscellaneous items found during robberies, only sellable in Riverhall
const miscItems = [
    { name: 'Samsung TV', price: 1000, icon: iconUrls['Samsung TV'], sellableInRiverhallOnly: true },
    { name: 'PlayStation 5', price: 1000, icon: iconUrls['PlayStation 5'], sellableInRiverhallOnly: true },
    { name: 'Radio', price: 3000, icon: iconUrls['Radio'], sellableInRiverhallOnly: true }
];


// New: Craftable drug recipes
const craftableDrugs = [
    { name: 'DMT', requiredMaterials: { 'Water': 2, 'Doxycycline': 3 }, craftTimeSeconds: 25, craftYield: 1, requiredLabLevel: 6 }, // Changed DMT craft time to 25 seconds
    { name: 'Glock W Switch', requiredMaterials: { 'Switch Material': 2 }, craftTimeSeconds: 10, craftYield: 2, requiredLabLevel: 7 } // New: Glock W Switch recipe
];

const locations = {
    'Downtown': {
        description: 'Bustling city center, high demand for everything.',
        prices: {
            'Weed': 25,
            'Cocaine': 180,
            'Ecstasy': 60,
            'Heroin': 350,
            'DMT': 700, // New: DMT price
            'Money Bag': 20000, // Fixed price for Money Bag
            'Glock W Switch': 0, // Not sold here
            'Samsung TV': 0, // NEW: Not sold here
            'PlayStation 5': 0, // NEW: Not sold here
            'Radio': 0 // NEW: Not sold here
        }
    },
    'The Docks': {
        description: 'Gritty port area, cheap imports, but risky.',
        prices: {
            'Weed': 15,
            'Cocaine': 120,
            'Ecstasy': 40,
            'Heroin': 250,
            'DMT': 500, // New: DMT price
            'Money Bag': 20000, // Fixed price for Money Bag
            'Glock W Switch': 0, // Not sold here
            'Samsung TV': 0, // NEW: Not sold here
            'PlayStation 5': 0, // NEW: Not sold here
            'Radio': 0 // NEW: Not sold here
        }
    },
    'Uptown': {
        description: 'Wealthy district, high prices, but tight security.',
        prices: {
            'Weed': 40,
            'Cocaine': 250,
            'Ecstasy': 90,
            'Heroin': 500,
            'DMT': 1000, // New: DMT price
            'Money Bag': 20000, // Fixed price for Money Bag
            'Glock W Switch': 0, // Not sold here
            'Samsung TV': 0, // NEW: Not sold here
            'PlayStation 5': 0, // NEW: Not sold here
            'Radio': 0 // NEW: Not sold here
        }
    },
    'The Projects': {
        description: 'Low-income housing, low prices, but desperate buyers.',
        prices: {
            'Weed': 10,
            'Cocaine': 80,
            'Ecstasy': 25,
            'Heroin': 180,
            'DMT': 400, // New: DMT price
            'Money Bag': 20000, // Fixed price for Money Bag
            'Glock W Switch': 800, // New: Glock W Switch price, only sold here
            'Samsung TV': 0, // NEW: Not sold here
            'PlayStation 5': 0, // NEW: Not sold here
            'Radio': 0 // NEW: Not sold here
        }
    },
    'The Lab': { // New location for the lab
        description: 'A secret lab for growing your own supply. No market here!',
        prices: { // No buying/selling in the lab
            'Weed': 0,
            'Cocaine': 0,
            'Ecstasy': 0,
            'Heroin': 0,
            'DMT': 0,
            'Money Bag': 0, // No buying/selling in the lab
            'Glock W Switch': 0, // Not sold here
            'Samsung TV': 0, // NEW: Not sold here
            'PlayStation 5': 0, // NEW: Not sold here
            'Radio': 0 // NEW: Not sold here
        }
    },
    'The Shop': { // New location for the shop
        description: 'A place to upgrade your gear and lab.',
        prices: {} // No buying/selling in the shop
    },
    'The Garage': { // New location for the garage
        description: 'Your personal garage to store vehicles and stash.',
        prices: {} // No buying/selling in the garage
    },
    'Dealership': { // Renamed from 'The Dealership'
        description: 'Where you can buy new rides to expand your trunk space!',
        prices: {} // No buying/selling in the dealership
    },
    'Materials Shop': { // Renamed from 'The Materials Shop'
        description: 'A specialized shop for raw materials.',
        prices: {} // No buying/selling of drugs here
    },
    'Riverhall': { // NEW: Riverhall city for robberies
        description: 'A shadowy district ripe for lucrative robberies.',
        prices: {
            'Weed': 0, // No regular market for drugs
            'Cocaine': 0,
            'Ecstasy': 0,
            'Heroin': 0,
            'DMT': 0,
            'Money Bag': 0,
            'Glock W Switch': 0,
            'Samsung TV': 1000, // NEW: Sell price for Samsung TV
            'PlayStation 5': 1000, // NEW: Sell price for PlayStation 5
            'Radio': 3000 // NEW: Sell price for Radio
        }
    }
};

const backpackUpgrades = [
    { level: 1, limit: 5000, cost: 0, description: "Basic backpack." },
    { level: 2, limit: 5200, cost: 5000, description: "Larger backpack, double capacity." },
    { level: 3, limit: 5500, cost: 5350, description: "Industrial backpack, massive capacity." },
    { level: 4, limit: 8500, cost: 10000, description: "Cargo backpack, ultimate capacity." }
];

const labUpgrades = [
    { level: 1, cost: 0, unlocks: ['Weed'], description: "Basic lab for growing Weed." },
    { level: 2, cost: 5000, unlocks: ['Ecstasy'], description: "High-tech lab, unlocks Ecstasy." },    
    { level: 3, cost: 20000, unlocks: ['Cocaine'], description: "Advanced lab, unlocks Cocaine." },
    { level: 4, cost: 30000, unlocks: ['Heroin'], description: "State-of-the-art lab, unlocks Heroin." },
    { level: 5, cost: 5000, unlocks: [], description: "Ultimate lab, allows growing 2 drugs simultaneously." }, // New 5th stage
    { level: 6, cost: 40000, unlocks: ['DMT'], description: "Specialized lab, unlocks DMT crafting." }, // New: Lab Level 6 for DMT
    { level: 7, cost: 15000, unlocks: ['Glock W Switch'], description: "Advanced manufacturing, unlocks Glock W Switch crafting." } // New: Lab Level 7 for Glock W Switch
];

// DOM Elements
const playerMoneyEl = document.getElementById('player-money');
const playerLocationEl = document.getElementById('player-location');
const currentDayEl = document.getElementById('current-day');
const marketTableBody = document.querySelector('#market-table tbody');
const inventoryTableBody = document.querySelector('#inventory-table tbody');
const messageLog = document.getElementById('message-log');
const nextDayBtn = document.getElementById('next-day-btn');
const locationSelect = document.getElementById('location-select');
const travelBtn = document.getElementById('travel-btn');
const goToGarageBtn = document.getElementById('go-to-garage-btn'); // New garage button
// Removed: const goToMaterialsShopBtn = document.getElementById('go-to-materials-shop-btn'); // New: Materials Shop button
const currentWeightEl = document.getElementById('current-weight');
const maxWeightEl = document.getElementById('max-weight');
const playerLevelEl = document.getElementById('player-level'); // New: Player Level Display

// Lab specific DOM elements
const growDrugSelect1 = document.getElementById('grow-drug-select-1'); // For first slot
const startGrowBtn1 = document.getElementById('start-grow-btn-1'); // For first slot
const currentGrowthStatusEl1 = document.getElementById('current-growth-status-1'); // For first slot
const progressBarContainer1 = document.getElementById('progress-bar-container-1'); // For first slot
const progressBar1 = document.getElementById('progress-bar-1'); // For first slot

const growDrugSelect2 = document.getElementById('grow-drug-select-2'); // For second slot
const startGrowBtn2 = document.getElementById('start-grow-btn-2'); // For second slot
const currentGrowthStatusEl2 = document.getElementById('current-growth-status-2'); // For second slot
const progressBarContainer2 = document.getElementById('progress-bar-container-2'); // For second slot
const progressBar2 = document.getElementById('progress-bar-2'); // For second slot

const labControlsSlot2 = document.getElementById('lab-controls-slot2'); // Container for second slot controls
const labSlot2Container = document.getElementById('lab-slot-2-container'); // Container for the entire second lab slot

// Navbar Lab Progress Elements
const labProgressNav1 = document.getElementById('lab-progress-nav-1'); // For first slot in navbar
const labProgressTextNav1 = document.getElementById('lab-progress-text-1'); // For first slot text in navbar
const labProgressBarNav1 = document.getElementById('lab-progress-bar-nav-1'); // For first slot progress bar in navbar

const labProgressNav2 = document.getElementById('lab-progress-nav-2'); // For second slot in navbar
const labProgressTextNav2 = document.getElementById('lab-progress-text-2'); // For second slot text in navbar
const labProgressBarNav2 = document.getElementById('lab-progress-bar-nav-2'); // For second slot progress bar in navbar

// Shop specific DOM elements
const backpackLevelEl = document.getElementById('backpack-level');
const backpackLimitDisplayEl = document.getElementById('backpack-limit-display');
const backpackNextUpgradeInfoEl = document.getElementById('backpack-next-upgrade-info');
const upgradeBackpackBtn = document.getElementById('upgrade-backpack-btn');
const labLevelEl = document.getElementById('lab-level');
const labUnlockedDrugsEl = document.getElementById('lab-unlocked-drugs');
const labNextUpgradeInfoEl = document.getElementById('lab-next-upgrade-info');
const upgradeLabBtn = document.getElementById('upgrade-lab-btn');

// Garage specific DOM elements
const garagePanel = document.getElementById('garage-panel');
const carListEl = document.getElementById('car-list');
const sellCarBtn = document.getElementById('sell-car-btn'); // New sell car button

// Dealership specific DOM elements
const dealershipPanel = document.getElementById('dealership-panel'); // New dealership panel
const carShopListEl = document.getElementById('car-shop-list'); // Container for cars in the dealership

// New: Materials Shop specific DOM elements
const materialsShopPanel = document.getElementById('materials-shop-panel');
const materialsTableBody = document.getElementById('materials-table-body');

// NEW: Riverhall Robbery Panel DOM elements
const riverhallPanel = document.getElementById('riverhall-panel');

// Trunk Management Modal DOM elements
const trunkManagementModal = document.getElementById('trunk-management-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalDrugSelect = document.getElementById('modal-drug-select');
const modalQuantityInput = document.getElementById('modal-quantity-input');
const modalPutBtn = document.getElementById('modal-put-btn');
const modalRemoveBtn = document.getElementById('modal-remove-btn');
const modalCurrentTrunkWeight = document.getElementById('modal-current-trunk-weight');
const modalMaxTrunkWeight = document.getElementById('modal-max-trunk-weight');
const modalTrunkItemsList = document.getElementById('modal-trunk-items');

let activeCarForTrunk = null; // To keep track of which car's trunk is being managed

// Sell Car Modal DOM elements
const sellCarModal = document.getElementById('sell-car-modal');
const sellModalCloseBtn = document.getElementById('sell-modal-close-btn');
const sellCarSelect = document.getElementById('sell-car-select');
const sellSelectedCarBtn = document.getElementById('sell-selected-car-btn');
const sellCarValueEl = document.getElementById('sell-car-value');

// Car Color Selection Modal DOM elements
const colorSelectionModal = document.getElementById('color-selection-modal');
const colorModalCloseBtn = document.getElementById('color-modal-close-btn');
const colorButtonsContainer = document.getElementById('color-buttons-container'); // New container for dynamic buttons
let carToBuyForColorSelection = null; // Stores the car object temporarily

// References to the main content panels
const marketPanel = document.getElementById('market-panel');
const infoPanel = document.getElementById('info-panel');
const labPanel = document.getElementById('lab-panel');
const shopPanel = document.getElementById('shop-panel'); // New shop panel


// Welcome Screen Elements
const welcomeScreen = document.getElementById('welcome-screen');
const startGameBtn = document.getElementById('start-game-btn');
const navbar = document.getElementById('navbar');
const mainGameContent = document.getElementById('main-game-content');

// Audio elements for background music
const downtownMusic = document.getElementById('downtown-music');
const docksMusic = document.getElementById('docks-music');
const labMusic = document.getElementById('lab-music');

// Sound effect elements
const clickSfx = document.getElementById('click-sfx');
const hoverSfx = document.getElementById('hover-sfx');

// Master volume control (now in settings modal)
const masterVolumeSlider = document.getElementById('master-volume-slider');
const sfxVolumeSlider = document.getElementById('sfx-volume-slider'); // New SFX volume slider

// Pause/Settings Menu DOM elements
const pauseMenuModal = document.getElementById('pause-menu-modal');
const pauseModalCloseBtn = document.getElementById('pause-modal-close-btn');
const resumeGameBtn = document.getElementById('resume-game-btn');
const gameVersionDisplay = document.getElementById('game-version-display');

// Game Version Constant
const GAME_VERSION = '1.0.0'; // Define your game version here

// Global variable to track pause state
let isGamePaused = false;

// Function to play click sound
function playClickSound() {
    // Reset and play to allow rapid clicks
    clickSfx.currentTime = 0;
    clickSfx.play().catch(e => console.warn("Click sound autoplay prevented:", e));
}

// Function to play hover sound
function playHoverSound() {
    // Reset and play to allow rapid hovers
    hoverSfx.currentTime = 0;
    hoverSfx.play().catch(e => console.warn("Hover sound autoplay prevented:", e));
}

// Function to stop all background music
function stopAllMusic() {
    downtownMusic.pause();
    downtownMusic.currentTime = 0;
    docksMusic.pause();
    docksMusic.currentTime = 0;
    labMusic.pause();
    labMusic.currentTime = 0;
}

/**
 * Updates the volume for all audio elements (music and SFX).
 */
function updateAllAudioVolumes() {
    const masterVolume = parseFloat(masterVolumeSlider.value);
    const sfxVolume = parseFloat(sfxVolumeSlider.value);

    // Set volume for music tracks based on master volume
    downtownMusic.volume = masterVolume;
    docksMusic.volume = masterVolume;
    labMusic.volume = masterVolume;

    // Set volume for sound effects based on master volume AND SFX volume
    clickSfx.volume = masterVolume * sfxVolume;
    hoverSfx.volume = masterVolume * sfxVolume;

    // Only play music if the game is not paused
    if (!isGamePaused) {
        // Since themes are removed, only Downtown music will play
        downtownMusic.play().catch(e => console.warn("Downtown music autoplay prevented:", e));
    }
}

/**
 * Toggles the pause/settings menu visibility and pauses/resumes game intervals.
 */
function togglePauseMenu() {
    playClickSound(); // Play sound when opening/closing menu
    if (isGamePaused) {
        // Resume game
        pauseMenuModal.classList.add('hidden');
        isGamePaused = false;
        
        // Resume auto-day progression
        if (!player.lab.autoDayIntervalId) { // Only re-set if not already running
            player.lab.autoDayIntervalId = setInterval(nextDay, 10 * 60 * 1000); // 10 minutes
        }

        // Resume next day cooldown if active
        if (player.nextDayCooldownEnd > Date.now() && !player.nextDayCooldownIntervalId) {
            player.nextDayCooldownIntervalId = setInterval(updateNextDayButtonCooldown, 1000);
        }

        // Resume lab growth intervals
        renderLab(); // Calling renderLab will re-establish intervals if drugs are growing
        updateAllAudioVolumes(); // Resume music playback

        // NEW: Resume robbery cooldown interval if active
        if (player.robbery.cooldownEnd > Date.now() && !player.robbery.intervalId) {
            player.robbery.intervalId = setInterval(updateRobberyCooldown, 1000);
        }
        // NEW: Resume active robbery progress if active
        if (player.robbery.active && !player.robbery.intervalId) {
            player.robbery.intervalId = setInterval(updateRobberyProgress, 100);
        }

    } else {
        // Pause game
        pauseMenuModal.classList.remove('hidden');
        isGamePaused = true;

        // Pause all active intervals
        clearInterval(player.lab.autoDayIntervalId);
        player.lab.autoDayIntervalId = null; // Clear reference

        clearInterval(player.nextDayCooldownIntervalId);
        player.nextDayCooldownIntervalId = null; // Clear reference

        player.lab.growthIntervalId.forEach((id, index) => {
            if (id) {
                clearInterval(id);
                player.lab.growthIntervalId[index] = null; // Clear reference
            }
        });
        stopAllMusic(); // Pause music when menu is open

        // NEW: Pause robbery interval if active
        if (player.robbery.intervalId) {
            clearInterval(player.robbery.intervalId);
            player.robbery.intervalId = null;
        }
    }
    addSoundListeners(); // Re-add listeners for modal elements
}


// --- Game Functions ---

/**
 * Saves the current game state to localStorage.
 */
function saveGame() {
    try {
        localStorage.setItem('drugDealerSimulatorSave', JSON.stringify(player));
        addMessage('Game saved!', 'info');
    } catch (e) {
        console.error("Error saving game:", e);
        addMessage('Failed to save game.', 'error');
    }
}

/**
 * Loads the game state from localStorage.
 * If no saved game is found, initializes a new game.
 */
function loadGame() {
    try {
        const savedGame = localStorage.getItem('drugDealerSimulatorSave');
        if (savedGame) {
            const loadedPlayer = JSON.parse(savedGame);

            // Deep merge for nested objects and new properties
            player = {
                ...player, // Start with default player structure
                ...loadedPlayer, // Overlay with loaded data
                // Ensure moneyLimit is loaded, use default if not present in old save
                moneyLimit: loadedPlayer.moneyLimit !== undefined ? loadedPlayer.moneyLimit : 326799,
                lab: { 
                    growingDrug: loadedPlayer.lab.growingDrug || [null, null], // Ensure it's an array
                    harvestQuantity: loadedPlayer.lab.harvestQuantity || [0, 0], // Ensure it's an array
                    growthIntervalId: [null, null], // Always reset intervals on load
                    autoDayIntervalId: null 
                }, 
                currentMarketPrices: { ...(player.currentMarketPrices || {}), ...(loadedPlayer.currentMarketPrices || {}) },
                // Ensure new properties for cars and trunk exist
                cars: loadedPlayer.cars || [],
                // trunkInventory: loadedPlayer.trunkInventory || {}, // REMOVED: Now per car
                // currentTrunkWeight: loadedPlayer.currentTrunkWeight || 0, // REMOVED: Now per car
                ecstasySoldTotal: loadedPlayer.ecstasySoldTotal || 0, // Load new property
                specialCarUnlocked: loadedPlayer.specialCarUnlocked || false, // Load new property
                mazdaSpeedProtegeUnlocked: loadedPlayer.mazdaSpeedProtegeUnlocked || false, // NEW: Load new property
                level: loadedPlayer.level || 1, // Load new player level property
                robbery: { // NEW: Load robbery state, reset intervalId
                    active: loadedPlayer.robbery?.active || false,
                    endTime: loadedPlayer.robbery?.endTime || 0,
                    cooldownEnd: loadedPlayer.robbery?.cooldownEnd || 0,
                    intervalId: null // Always reset intervals on load
                }
            };

            // After loading, update trunkLimit and icon for existing cars based on the 'cars' array definition
            // Also, ensure each car has its own trunkInventory and currentTrunkWeight
            player.cars.forEach(ownedCar => {
                const carDefinition = cars.find(c => c.id === ownedCar.id);
                if (carDefinition) {
                    ownedCar.trunkLimit = carDefinition.trunkLimit; // Update the trunkLimit
                    // If the loaded car doesn't have a specific icon (e.g., from an older save), assign a default
                    if (!ownedCar.icon) {
                        ownedCar.icon = carDefinition.icon; 
                    }
                }
                // Initialize trunkInventory and currentTrunkWeight for each car if they don't exist
                ownedCar.trunkInventory = ownedCar.trunkInventory || {};
                ownedCar.currentTrunkWeight = ownedCar.currentTrunkWeight || 0;

                // Ensure all drugs and materials are initialized in the car's trunkInventory
                [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
                    if (ownedCar.trunkInventory[item.name] === undefined) {
                        ownedCar.trunkInventory[item.name] = 0;
                    }
                });
            });

            // Ensure timestamps are numbers, not strings from JSON
            if (player.nextDayCooldownEnd) {
                player.nextDayCooldownEnd = Number(player.nextDayCooldownEnd);
            }
            player.lab.growingDrug.forEach((drug, index) => {
                if (drug && drug.startTime) {
                    player.lab.growingDrug[index].startTime = Number(drug.startTime);
                }
            });
            // NEW: Ensure robbery timestamps are numbers
            if (player.robbery.endTime) {
                player.robbery.endTime = Number(player.robbery.endTime);
            }
            if (player.robbery.cooldownEnd) {
                player.robbery.cooldownEnd = Number(player.robbery.cooldownEnd);
            }


            // Ensure new properties for upgrades exist if loading an old save
            if (player.backpackLevel === undefined) player.backpackLevel = 1;
            if (player.labLevel === undefined) player.labLevel = 1;

            addMessage('Game loaded!', 'info');
        } else {
            addMessage('No saved game found. Starting new game.', 'info');
            // Initialize inventory for all drugs AND materials AND misc items
            [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
                player.inventory[item.name] = 0;
                // player.trunkInventory[item.name] = 0; // REMOVED: Now per car
            });
            generateMarketPrices(); // Generate initial prices for a new game
        }
    } catch (e) {
        console.error("Error loading game:", e);
        addMessage('Failed to load game. Starting new game.', 'error');
        // Reset player to initial state if load fails
        player = {
            money: 1000,
            moneyLimit: 326799, // Ensure moneyLimit is set on reset
            inventory: {},
            // trunkInventory: {}, // REMOVED: Now per car
            location: 'Downtown',
            day: 1,
            currentMarketPrices: {},
            lab: { growingDrug: [null, null], harvestQuantity: [0, 0], growthIntervalId: [null, null], autoDayIntervalId: null },
            nextDayCooldownEnd: 0,
            nextDayCooldownIntervalId: null,
            backpackLimit: 5000,
            currentBackpackWeight: 0,
            backpackLevel: 1,
            labLevel: 1,
            level: 1, // Reset player level
            cars: [], // Ensure cars array is empty on reset
            // currentTrunkWeight: 0, // REMOVED: Now per car
            ecstasySoldTotal: 0, // Reset new property
            specialCarUnlocked: false, // Reset new property
            mazdaSpeedProtegeUnlocked: false, // NEW: Reset new property
            robbery: { // NEW: Reset robbery state
                active: false,
                endTime: 0,
                cooldownEnd: 0,
                intervalId: null
            }
        };
        // Initialize inventory for all drugs AND materials AND misc items on reset
        [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
            player.inventory[item.name] = 0;
            // player.trunkInventory[item.name] = 0; // REMOVED: Now per car
        });
        generateMarketPrices(); // Generate initial prices for a reset game
    }
}

/**
 * Initializes the game state and UI. This function is called AFTER the welcome screen is dismissed.
 */
function initializeGame() {
    loadGame(); // Attempt to load game first, which now handles initial price generation/loading

    // Set game version display
    gameVersionDisplay.textContent = GAME_VERSION;

    // Populate location select (ensure it's always populated even if loaded)
    // Clear existing options first to prevent duplicates on re-initialization
    locationSelect.innerHTML = ''; 
    for (const loc in locations) {
        // Exclude 'The Garage' from the travel dropdown
        // The Materials Shop is now only accessible via the dropdown, not a direct button
        if (loc !== 'The Garage') { 
            const option = document.createElement('option');
            option.value = loc;
            option.textContent = loc;
            locationSelect.appendChild(option);
        }
    }
    locationSelect.value = player.location; // Set current location

    // Populate grow drug select based on lab level
    updateGrowDrugSelect();

    updateUI();
    renderMarket(); // Render market with loaded/initial prices
    renderLab(); // Call new render function for lab, which will restart intervals if needed
    renderShop(); // Render shop initially
    renderGarage(); // Render garage initially
    renderDealership(); // Render dealership initially
    renderMaterialsShop(); // New: Render materials shop initially
    updateNavbarLabProgress(); // Initial update for navbar progress
    addSoundListeners(); // Add sound listeners after UI is rendered
    updateAllAudioVolumes(); // Update all audio volumes based on current slider values

    // Re-establish cooldowns/intervals after loading
    if (player.nextDayCooldownEnd > Date.now()) {
        nextDayBtn.disabled = true;
        player.nextDayCooldownIntervalId = setInterval(updateNextDayButtonCooldown, 1000);
        updateNextDayButtonCooldown();
    } else {
        nextDayBtn.disabled = false;
        nextDayBtn.innerHTML = `Next Day <i class="fas fa-forward ml-2"></i>`;
    }

    // Start automatic day progression (every 10 minutes)
    if (player.lab.autoDayIntervalId) {
        clearInterval(player.lab.autoDayIntervalId);
    }
    player.lab.autoDayIntervalId = setInterval(nextDay, 10 * 60 * 1000); // 10 minutes

    // Check for MazdaSpeed Protege unlock on game load/init
    checkMazdaSpeedProtegeUnlock();

    // NEW: Initialize robbery UI and re-establish intervals if active
    updateRobberyUI();
}

/**
 * Updates all UI elements based on the current player state.
 */
function updateUI() {
    // Use image file icons for money and location
    // Updated to display money as current/limit
    playerMoneyEl.innerHTML = `<img src="${iconUrls.wallet}" alt="Wallet" class="icon-img mr-1"> $${player.money.toFixed(2)} / ${player.moneyLimit.toLocaleString('en-US')}`;
    playerLocationEl.innerHTML = `<img src="${iconUrls.location}" alt="Location" class="icon-img mr-1"> ${player.location}`;
    currentDayEl.textContent = `Day ${player.day}`;
    // UPDATED: Use player_level_icon from iconUrls
    playerLevelEl.innerHTML = `<img src="${iconUrls.player_level_icon}" alt="Level" class="icon-img mr-1"> Level ${player.level}`; 
    renderInventory();

    // Reset all column classes and hidden state first to avoid conflicts
    marketPanel.classList.add('hidden');
    labPanel.classList.add('hidden');
    shopPanel.classList.add('hidden');
    garagePanel.classList.add('hidden'); // Hide garage panel
    dealershipPanel.classList.add('hidden'); // Hide dealership panel
    materialsShopPanel.classList.add('hidden'); // New: Hide materials shop panel
    riverhallPanel.classList.add('hidden'); // NEW: Hide Riverhall panel
    infoPanel.classList.add('hidden');

    marketPanel.classList.remove('md:col-span-2', 'md:col-start-1');
    labPanel.classList.remove('md:col-span-2', 'md:col-start-1');
    shopPanel.classList.remove('md:col-span-2', 'md:col-start-1');
    garagePanel.classList.remove('md:col-span-2', 'md:col-start-1'); // Remove classes for garage
    dealershipPanel.classList.remove('md:col-span-2', 'md:col-start-1'); // Remove classes for dealership
    materialsShopPanel.classList.remove('md:col-span-2', 'md:col-start-1'); // New: Remove classes for materials shop
    riverhallPanel.classList.remove('md:col-span-2', 'md:col-start-1'); // NEW: Remove classes for Riverhall
    infoPanel.classList.remove('md:col-span-1', 'md:col-start-1', 'md:col-start-3');


    // Control panel visibility and layout based on location
    if (player.location === 'The Lab') {
        labPanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        labPanel.classList.add('md:col-span-2', 'md:col-start-1'); // Lab takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
    } else if (player.location === 'The Shop') {
        shopPanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        shopPanel.classList.add('md:col-span-2', 'md:col-start-1'); // Shop takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
    } else if (player.location === 'The Garage') { // New condition for garage
        garagePanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        garagePanel.classList.add('md:col-span-2', 'md:col-start-1'); // Garage takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
    } else if (player.location === 'Dealership') { // New condition for dealership (renamed)
        dealershipPanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        dealershipPanel.classList.add('md:col-span-2', 'md:col-start-1'); // Dealership takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
    } else if (player.location === 'Materials Shop') { // New: Materials Shop condition (renamed)
        materialsShopPanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        materialsShopPanel.classList.add('md:col-span-2', 'md:col-start-1'); // Materials Shop takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
    } else if (player.location === 'Riverhall') { // NEW: Riverhall panel condition
        riverhallPanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        riverhallPanel.classList.add('md:col-span-2', 'md:col-start-1'); // Riverhall takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
        updateRobberyUI(); // NEW: Update robbery UI when in Riverhall
    }
    else {
        marketPanel.classList.remove('hidden');
        infoPanel.classList.remove('hidden');

        marketPanel.classList.add('md:col-span-2', 'md:col-start-1'); // Market takes first 2 columns
        infoPanel.classList.add('md:col-span-1', 'md:col-start-3'); // Info takes the 3rd column
    }
    addSoundListeners(); // Re-add sound listeners after UI updates
}

/**
 * Generates new market prices for all drugs based on location.
 * Prices are now randomized within a realistic range.
 */
function generateMarketPrices() {
    // Combine drugs and miscItems for price generation
    const allTradableItems = [...drugs, ...miscItems]; // NEW: Include miscItems

    allTradableItems.forEach(item => {
        // Handle "Money Bag" with a fixed price
        if (item.name === 'Money Bag') {
            player.currentMarketPrices[item.name] = item.fixedPrice;
            return; // Skip random fluctuation for Money Bag
        }

        // NEW: Handle items only sellable in Riverhall
        if (item.sellableInRiverhallOnly) {
            if (player.location === 'Riverhall') {
                player.currentMarketPrices[item.name] = item.price; // Use fixed price for selling in Riverhall
            } else {
                player.currentMarketPrices[item.name] = 0; // Not tradable elsewhere
            }
            return;
        }

        const basePriceForLocation = locations[player.location].prices[item.name];
        if (basePriceForLocation !== undefined) { // Only generate if drug is traded in this location
            // Special handling for Glock W Switch to maintain its fixed price display in The Projects
            if (item.name === 'Glock W Switch' && player.location === 'The Projects') {
                player.currentMarketPrices[item.name] = 800; // Fixed price for display
                return;
            }

            // Add a random fluctuation: +/- 20% of the base price
            const fluctuation = (Math.random() * 0.4 - 0.2); // Random number between -0.2 and +0.2
            let newPrice = basePriceForLocation * (1 + fluctuation);

            // Ensure price doesn't go too low (e.g., minimum $5)
            newPrice = Math.max(newPrice, 5);

            player.currentMarketPrices[item.name] = parseFloat(newPrice.toFixed(2));
        }
    });
}

/**
 * Renders the current market prices in the market table.
 */
function renderMarket() {
    marketTableBody.innerHTML = ''; // Clear existing rows
    const isInSpecialLocation = player.location === 'The Lab' || player.location === 'The Shop' || player.location === 'The Garage' || player.location === 'Dealership' || player.location === 'Materials Shop'; // Riverhall now has a sell section

    if (isInSpecialLocation) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" class="text-center text-gray-400 py-4">No market operations here.</td>`;
        marketTableBody.appendChild(row);
        nextDayBtn.style.display = 'none'; // Hide the "Next Day" button
        return;
    } else {
        nextDayBtn.style.display = 'inline-block'; // Show the "Next Day" button
    }

    // Combine drugs and miscItems for rendering the market
    const allTradableItems = [...drugs, ...miscItems]; // NEW: Include miscItems

    allTradableItems.forEach(item => {
        const price = player.currentMarketPrices[item.name]; // Use price from player state
        const stock = player.inventory[item.name];

        // Only display items that have a price greater than 0 in the current location
        // OR if it's a misc item and we are in Riverhall (where it's only sellable)
        if (price > 0 || (item.sellableInRiverhallOnly && player.location === 'Riverhall')) {
            // If in Riverhall, only show misc items for selling, hide buy button
            const isMiscItemInRiverhall = item.sellableInRiverhallOnly && player.location === 'Riverhall';
            const buyButtonHtml = isMiscItemInRiverhall ? '' : `<button class="btn btn-success btn-buy" data-item="${item.name}" data-price="${price}">Buy</button>`;
            const sellButtonHtml = `<button class="btn btn-danger btn-sell" data-item="${item.name}" data-price="${price}">Sell</button>`;
            const quantityInputHtml = `<input type="number" min="1" value="1" class="input-field w-24 quantity-input" data-item="${item.name}">`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-bold flex items-center justify-center">${item.icon ? `<img src="${item.icon}" alt="${item.name} icon" class="icon-img mr-2">` : ''}${item.name}</td>
                <td class="text-yellow-300">${isMiscItemInRiverhall ? `Sell: $${price.toFixed(2)}` : `$${price.toFixed(2)}`}</td>
                <td>${stock}</td>
                <td>
                    ${buyButtonHtml}
                    ${sellButtonHtml}
                </td>
                <td>${quantityInputHtml}</td>
            `;
            marketTableBody.appendChild(row);
        }
    });

    // Attach event listeners to new buy/sell buttons (use data-item instead of data-drug)
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.onclick = (event) => { playClickSound(); handleBuy(event); };
        button.onmouseover = playHoverSound;
    });
    document.querySelectorAll('.btn-sell').forEach(button => {
        button.onclick = (event) => { playClickSound(); handleSell(event); };
        button.onmouseover = playHoverSound;
    });
    // Attach event listeners to quantity inputs (use data-item instead of data-drug)
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.onmouseover = playHoverSound;
        input.onchange = playClickSound; // Play sound when value changes
    });
}

/**
 * Renders the player's current inventory and updates backpack weight display.
 */
function renderInventory() {
    inventoryTableBody.innerHTML = ''; // Clear existing rows
    let totalInventoryCount = 0;
    player.currentBackpackWeight = 0; // Reset current weight before recalculating

    // Combine drugs, materials, and miscItems for inventory display
    const allItems = [...drugs, ...materials, ...miscItems]; // NEW: Include miscItems

    allItems.forEach(item => {
        const quantity = player.inventory[item.name] || 0; // Ensure it's 0 if not present
        if (quantity > 0) {
            totalInventoryCount += quantity;
            // Only add weight if the item has a weight defined
            player.currentBackpackWeight += quantity * (drugWeights[item.name] || 0); // Add weight of each item

            const itemIconHtml = item.icon ? `<img src="${item.icon}" alt="${item.name} icon" class="icon-img mr-2">` : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-bold flex items-center justify-center">${itemIconHtml}${item.name}</td>
                <td>${quantity}</td>
            `;
            inventoryTableBody.appendChild(row);
        }
    });

    if (totalInventoryCount === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2" class="text-center text-gray-400">Your stash is empty!</td>`;
        inventoryTableBody.appendChild(row);
    }

    // Update backpack weight display
    currentWeightEl.textContent = `${player.currentBackpackWeight}kg`;
    maxWeightEl.textContent = `${player.backpackLimit}kg`;
}

/**
 * Adds a message to the message log.
 * @param {string} message - The message to add.
 * @param {string} type - 'success', 'error', 'info' (for styling).
 */
function addMessage(message, type = 'info') {
    const p = document.createElement('p');
    p.textContent = `[Day ${player.day}] ${message}`;
    if (type === 'success') p.classList.add('text-green-300');
    if (type === 'error') p.classList.add('text-red-300');
    if (type === 'info') p.classList.add('text-blue-300');
    messageLog.prepend(p); // Add to top
    // Keep log from getting too long
    if (messageLog.children.length > 50) {
        messageLog.removeChild(messageLog.lastChild);
    }
}

/**
 * Handles the 'Buy' button click.
 * @param {Event} event - The click event.
 */
function handleBuy(event) {
    const itemName = event.target.dataset.item; // Changed from data-drug to data-item
    const pricePerUnit = parseFloat(event.target.dataset.price);
    const quantityInput = document.querySelector(`.quantity-input[data-item="${itemName}"]`); // Changed to data-item
    const quantity = parseInt(quantityInput.value);

    // Prevent buying DMT or Glock W Switch from the market
    if (itemName === 'DMT') {
        addMessage('DMT cannot be bought from the market. It must be crafted in the lab.', 'error');
        return;
    }
    if (itemName === 'Glock W Switch') {
        addMessage('Glock W Switch cannot be bought. It is a special item.', 'error');
        return;
    }
    // NEW: Prevent buying misc items
    if (miscItems.some(item => item.name === itemName)) {
        addMessage(`${itemName} cannot be bought. It can only be acquired through robberies.`, 'error');
        return;
    }

    if (isNaN(quantity) || quantity <= 0) {
        addMessage('Please enter a valid quantity to buy.', 'error');
        return;
    }

    const totalCost = pricePerUnit * quantity;
    const weightToAdd = quantity * (drugWeights[itemName] || 0);

    if (player.money < totalCost) {
        addMessage(`Not enough money to buy ${quantity} units of ${itemName}. You need $${(totalCost - player.money).toFixed(2)} more.`, 'error');
        return;
    }

    if (player.currentBackpackWeight + weightToAdd > player.backpackLimit) {
        addMessage(`Not enough backpack space! Buying ${quantity} units of ${itemName} would exceed your limit by ${(player.currentBackpackWeight + weightToAdd) - player.backpackLimit}kg.`, 'error');
        return;
    }

    player.money -= totalCost;
    player.inventory[itemName] = (player.inventory[itemName] || 0) + quantity; // Ensure initialization
    player.currentBackpackWeight += weightToAdd; // Update backpack weight
    addMessage(`Bought ${quantity} units of ${itemName} for $${totalCost.toFixed(2)}.`, 'success');
    saveGame(); // Save after state change
    updateUI();
    renderMarket(); // Re-render market to update "Your Stock"
}

/**
 * Handles the 'Sell' button click.
 * @param {Event} event - The click event.
 */
function handleSell(event) {
    const itemName = event.target.dataset.item; // Changed from data-drug to data-item
    let pricePerUnit = parseFloat(event.target.dataset.price); // Use let as price might be adjusted for Glock W Switch
    const quantityInput = document.querySelector(`.quantity-input[data-item="${itemName}"]`); // Changed to data-item
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        addMessage('Please enter a valid quantity to sell.', 'error');
        return;
    }

    if (player.inventory[itemName] < quantity) {
        addMessage(`You don't have enough ${itemName} to sell that quantity. You only have ${player.inventory[itemName]}.`, 'error');
        return;
    }

    // Special handling for "Glock W Switch"
    if (itemName === 'Glock W Switch') {
        if (player.location !== 'The Projects') {
            addMessage('Glock W Switch can only be sold in The Projects.', 'error');
            return;
        }
        // Price for Glock W Switch is fixed at $800 in The Projects
        pricePerUnit = 800;
    }

    // NEW: Special handling for misc items (Samsung TV, PS5, Radio)
    const miscItem = miscItems.find(item => item.name === itemName);
    if (miscItem && miscItem.sellableInRiverhallOnly) {
        if (player.location !== 'Riverhall') {
            addMessage(`${itemName} can only be sold in Riverhall.`, 'error');
            return;
        }
        pricePerUnit = miscItem.price; // Use the fixed selling price for these items
    }

    let totalRevenue = pricePerUnit * quantity;
    const weightToRemove = quantity * (drugWeights[itemName] || 0);

    // For "Money Bag", ensure fixed selling price from its definition
    if (itemName === 'Money Bag') {
        const moneyBagDefinition = drugs.find(d => d.name === 'Money Bag');
        totalRevenue = moneyBagDefinition.fixedPrice * quantity; 
    }

    // Check if selling would exceed the money limit
    if (player.money + totalRevenue > player.moneyLimit) {
        addMessage(`Selling ${quantity} units of ${itemName} would exceed your money limit of $${player.moneyLimit.toLocaleString('en-US')}. You can only earn $${(player.moneyLimit - player.money).toFixed(2)} more.`, 'error');
        return;
    }

    player.money += totalRevenue;
    player.inventory[itemName] -= quantity;
    player.currentBackpackWeight -= weightToRemove; // Update backpack weight

    // New: Check for special car unlock condition (Lord Stang)
    if (itemName === 'Ecstasy' && !player.specialCarUnlocked) {
        player.ecstasySoldTotal += quantity;
        if (player.ecstasySoldTotal >= 10) {
            const specialCar = cars.find(car => car.id === 'mystery-machine'); // Corrected ID
            if (specialCar && !player.cars.some(c => c.id === specialCar.id)) {
                // When adding a new car, initialize its trunkInventory and currentTrunkWeight
                player.cars.push({
                    id: specialCar.id,
                    name: specialCar.name,
                    price: specialCar.price,
                    trunkLimit: specialCar.trunkLimit,
                    icon: specialCar.icon,
                    trunkInventory: {}, // Initialize new car's trunk inventory
                    currentTrunkWeight: 0 // Initialize new car's trunk weight
                });
                // Ensure all drugs and materials are initialized in the new car's trunkInventory
                const newCar = player.cars[player.cars.length - 1];
                [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
                    newCar.trunkInventory[item.name] = 0;
                });

                player.specialCarUnlocked = true;
                addMessage(`Congratulations! You've sold enough Ecstasy to unlock the legendary ${specialCar.name}! It has been added to your garage!`, 'success');
                renderGarage(); // Update garage display immediately
            }
        }
    }

    addMessage(`Sold ${quantity} units of ${itemName} for $${totalRevenue.toFixed(2)}.`, 'success');
    saveGame(); // Save after state change
    updateUI();
    renderMarket(); // Re-render market to update "Your Stock"
}

/**
 * Advances the game to the next day.
 */
function nextDay() {
    // Cooldown check for Next Day button (only applies to manual click)
    if (event && event.type === 'click' && player.nextDayCooldownEnd > Date.now()) {
        addMessage('The "Next Day" button is on cooldown. Please wait.', 'error');
        return;
    }

    // Prevent day progression if game is paused
    if (isGamePaused) {
        addMessage('Cannot advance day while game is paused.', 'error');
        return;
    }

    player.day++;

    // Set cooldown for 1 minute (60 seconds) for manual click
    if (event && event.type === 'click') {
        player.nextDayCooldownEnd = Date.now() + (1 * 60 * 1000); // 1 minute
        nextDayBtn.disabled = true;

        // Start cooldown countdown
        if (player.nextDayCooldownIntervalId) {
            clearInterval(player.nextDayCooldownIntervalId);
        }
        player.nextDayCooldownIntervalId = setInterval(updateNextDayButtonCooldown, 1000);
        updateNextDayButtonCooldown(); // Initial call
    }


    generateMarketPrices(); // Generate new prices when passing a new day
    renderMarket(); // Re-render market with new prices
    updateUI();
    renderLab(); // Update lab display after day change
    addMessage(`Day ${player.day} begins! New prices are in.`, 'info'); // Changed message to reflect price change
    handleRandomEvent(); // Random events still happen
    checkMazdaSpeedProtegeUnlock(); // NEW: Check for MazdaSpeed Protege unlock on day change
    saveGame();
}

/**
 * Handles traveling to a new location.
 */
function handleTravel() {
    playClickSound(); // Play click sound on travel
    const newLocation = locationSelect.value;
    if (newLocation === player.location) {
        addMessage('You are already in this location!', 'info');
        return;
    }

    // Travel to special locations is free
    let travelCost = 0; 

    // Show loading screen immediately
    document.getElementById('loading-screen').classList.remove('hidden');

    setTimeout(() => {
        player.money -= travelCost;
        player.location = newLocation;
        addMessage(`Traveled to ${newLocation} for $${travelCost.toFixed(2)}.`, 'info');
        generateMarketPrices(); // Update prices for the new location
        renderMarket(); // Re-render market with new prices and updated stock
        saveGame(); // Save after state change
        updateUI(); // Update UI to reflect new location and panel visibility
        renderShop(); // Re-render shop in case upgrades changed
        renderGarage(); // Re-render garage in case cars or trunk changed
        renderDealership(); // Re-render dealership in case cars were bought
        renderMaterialsShop(); // New: Re-render materials shop
        updateGrowDrugSelect(); // Update growable drugs in lab
        updateNavbarLabProgress(); // Update navbar lab progress after travel
        updateAllAudioVolumes(); // Update background music after travel
        updateRobberyUI(); // NEW: Update robbery UI after travel

        // Hide loading screen after everything is updated
        document.getElementById('loading-screen').classList.add('hidden');
    }, 3000); // 3-second delay for teleporting
}

/**
 * Handles going to the garage.
 */
function goToGarage() {
    playClickSound();
    if (player.location === 'The Garage') {
        addMessage('You are already in your garage!', 'info');
        return;
    }

    // Show loading screen immediately
    document.getElementById('loading-screen').classList.remove('hidden');

    setTimeout(() => {
        player.location = 'The Garage';
        addMessage('You arrived at your garage!', 'info');
        saveGame();
        updateUI();
        renderGarage(); // Render the garage content
        updateAllAudioVolumes(); // Update background music after going to garage
        // Hide loading screen after everything is updated
        document.getElementById('loading-screen').classList.add('hidden');
    }, 3000); // 3-second delay for teleporting
}

/**
 * New: Handles going to the materials shop.
 * This function is no longer directly called by a button in the main UI,
 * but the location can still be accessed via the dropdown.
 */
function goToMaterialsShop() {
    // This function is kept for completeness if you decide to re-add a direct button
    // or if internal game logic needs to programmatically send the player here.
    // It's not currently hooked up to a button in the main UI as per request.
    playClickSound();
    if (player.location === 'Materials Shop') { // Renamed location
        addMessage('You are already at the materials shop!', 'info');
        return;
    }

    // Show loading screen immediately
    document.getElementById('loading-screen').classList.remove('hidden');

    setTimeout(() => {
        player.location = 'Materials Shop'; // Renamed location
        addMessage('You arrived at the Materials Shop!', 'info');
        saveGame();
        updateUI();
        renderMaterialsShop(); // Render the materials shop content
        updateAllAudioVolumes(); // Update background music
        // Hide loading screen after everything is updated
        document.getElementById('loading-screen').classList.add('hidden');
    }, 3000); // 3-second delay for teleporting
}

/**
 * Triggers a random event.
 */
function handleRandomEvent() {
    // Random events only happen when not in 'The Lab', 'The Shop', 'The Garage', or 'Dealership' or 'Materials Shop' or 'Riverhall'
    if (player.location === 'The Lab' || player.location === 'The Shop' || player.location === 'The Garage' || player.location === 'Dealership' || player.location === 'Materials Shop' || player.location === 'Riverhall' || isGamePaused) { // NEW: Exclude Riverhall
        return; // Also prevent random events if game is paused
    }

    const eventChance = Math.random(); // 0 to 1

    if (eventChance < 0.2) { // 10% chance of police raid
        const drugAffected = drugs[Math.floor(Math.random() * drugs.length)].name;
        // Money Bag can now be affected by police raids
        
        if (player.inventory[drugAffected] > 0) {
            const lostQuantity = Math.floor(player.inventory[drugAffected] * 0.15); // Fixed 15% loss
            const weightLost = lostQuantity * (drugWeights[drugAffected] || 0);

            player.inventory[drugAffected] -= lostQuantity;
            if (player.inventory[drugAffected] < 0) player.inventory[drugAffected] = 0; // Ensure no negative stock
            player.currentBackpackWeight -= weightLost; // Update backpack weight
            if (player.currentBackpackWeight < 0) player.currentBackpackWeight = 0; // Ensure no negative weight

            addMessage(`Police raid! You lost ${lostQuantity} units of ${drugAffected}!`, 'error');
            saveGame(); // Save after state change
        }
    } else if (eventChance < 0.2) { // 10% chance of good deal
        const drugAffected = drugs[Math.floor(Math.random() * drugs.length)].name;
        // Money Bag can now be affected by good deals

        const oldPrice = player.currentMarketPrices[drugAffected]; // Use player.currentMarketPrices
        if (oldPrice !== undefined) {
            player.currentMarketPrices[drugAffected] = oldPrice * 0.7; // Fixed 30% discount
            addMessage(`Hot tip! ${drugAffected} is going cheap today! Price dropped to $${player.currentMarketPrices[drugAffected].toFixed(2)}!`, 'success');
            renderMarket(); // Update market immediately
            saveGame(); // Save after state change
        }
    } else if (eventChance < 0.25) { // 5% chance of mugging
        const lostMoney = Math.floor(player.money * 0.1); // Fixed 10% loss
        if (lostMoney > 0) {
            player.money -= lostMoney;
            if (player.money < 0) player.money = 0;
            addMessage(`You got mugged! Lost $${lostMoney.toFixed(2)}!`, 'error');
            saveGame(); // Save after state change
        }
    } else if (eventChance < 0.3) { // 5% chance of finding money
        const foundMoney = 100; // Fixed $100 gain
        // Check if finding money would exceed the money limit
        if (player.money + foundMoney > player.moneyLimit) {
            const earnableMoney = player.moneyLimit - player.money;
            if (earnableMoney > 0) {
                player.money += earnableMoney;
                addMessage(`You found $${earnableMoney.toFixed(2)} on the street, but hit your money limit of $${player.moneyLimit.toLocaleString('en-US')}!`, 'info');
            } else {
                addMessage(`You found money on the street, but your money is already at the limit of $${player.moneyLimit.toLocaleString('en-US')}!`, 'info');
            }
        } else {
            player.money += foundMoney;
            addMessage(`You found $${foundMoney.toFixed(2)} on the street! Lucky you!`, 'success');
        }
        saveGame(); // Save after state change
    }
    updateUI();
}

/**
 * Renders the lab section UI based on current growth status.
 */
function renderLab() {
    // Slot 1
    if (player.lab.growingDrug[0]) {
        document.getElementById('lab-controls-slot1').style.display = 'none'; 
        progressBarContainer1.classList.remove('hidden'); 
        startGrowBtn1.disabled = true; 
        growDrugSelect1.disabled = true; 
    
        // Only start interval if game is not paused
        if (!isGamePaused) {
            if (player.lab.growthIntervalId[0]) {
                clearInterval(player.lab.growthIntervalId[0]);
            }
            player.lab.growthIntervalId[0] = setInterval(() => updateLabProgressBar(0), 100); 
        }
        updateLabProgressBar(0); 
    } else {
        document.getElementById('lab-controls-slot1').style.display = 'block'; 
        progressBarContainer1.classList.add('hidden'); 
        currentGrowthStatusEl1.textContent = 'Nothing is currently growing.';
        startGrowBtn1.disabled = false; 
        growDrugSelect1.disabled = false; 

        if (player.lab.growthIntervalId[0]) {
            clearInterval(player.lab.growthIntervalId[0]);
            player.lab.growthIntervalId[0] = null;
        }
    }

    // Slot 2 - Only visible if lab level is 5 or higher
    if (player.labLevel >= 5) {
        labSlot2Container.classList.remove('hidden'); // Show the entire second slot container
        if (player.lab.growingDrug[1]) {
            document.getElementById('lab-controls-slot2').style.display = 'none'; 
            progressBarContainer2.classList.remove('hidden'); // Ensure progress bar container is visible
            startGrowBtn2.disabled = true; 
            growDrugSelect2.disabled = true; 

            // Only start interval if game is not paused
            if (!isGamePaused) {
                if (player.lab.growthIntervalId[1]) {
                    clearInterval(player.lab.growthIntervalId[1]);
                }
                player.lab.growthIntervalId[1] = setInterval(() => updateLabProgressBar(1), 100); 
            }
            updateLabProgressBar(1); 
        } else {
            document.getElementById('lab-controls-slot2').style.display = 'block'; 
            progressBarContainer2.classList.add('hidden'); // Ensure progress bar container is hidden
            currentGrowthStatusEl2.textContent = 'Nothing is currently growing.';
            startGrowBtn2.disabled = false; 
            growDrugSelect2.disabled = false; 

            if (player.lab.growthIntervalId[1]) {
                clearInterval(player.lab.growthIntervalId[1]);
                player.lab.growthIntervalId[1] = null;
            }
        }
    } else {
        labSlot2Container.classList.add('hidden'); // Hide the entire second slot container
        // Also ensure any ongoing growth in slot 2 is cleared if lab level drops below 5 (shouldn't happen in normal play)
        if (player.lab.growingDrug[1]) {
            clearInterval(player.lab.growthIntervalId[1]);
            player.lab.growthIntervalId[1] = null;
            player.lab.growingDrug[1] = null;
            player.lab.harvestQuantity[1] = 0;
        }
    }

    updateNavbarLabProgress(); // Update navbar progress whenever lab state changes
    addSoundListeners(); // Re-add sound listeners after lab panel changes
}

/**
 * Updates the progress bar for the drug lab for a specific slot.
 * @param {number} slotIndex - The index of the lab slot (0 or 1).
 */
function updateLabProgressBar(slotIndex) {
    const growingDrug = player.lab.growingDrug[slotIndex];
    if (!growingDrug) {
        renderLab(); // Reset if somehow called without growing drug
        return;
    }

    const progressBarEl = slotIndex === 0 ? progressBar1 : progressBar2;
    const currentGrowthStatusEl = slotIndex === 0 ? currentGrowthStatusEl1 : currentGrowthStatusEl2;

    const elapsed = Date.now() - growingDrug.startTime;
    const progress = (elapsed / growingDrug.duration) * 100;

    if (progress >= 100) {
        // Growth complete
        const drugName = growingDrug.name;
        const harvestQuantity = player.lab.harvestQuantity[slotIndex];
        const weightToAdd = harvestQuantity * (drugWeights[drugName] || 0);

        if (player.currentBackpackWeight + weightToAdd > player.backpackLimit) {
            addMessage(`Your ${drugName} harvest in slot ${slotIndex + 1} is ready, but you don't have enough backpack space! You need ${(player.currentBackpackWeight + weightToAdd) - player.backpackLimit}kg more space. Harvest failed!`, 'error');
        } else {
            player.inventory[drugName] = (player.inventory[drugName] || 0) + harvestQuantity; // Ensure initialization
            player.currentBackpackWeight += weightToAdd; // Update backpack weight
            addMessage(`Your ${drugName} harvest in slot ${slotIndex + 1} is ready! You gained ${harvestQuantity} units.`, 'success');
        }

        player.lab.growingDrug[slotIndex] = null; // Reset lab slot
        player.lab.harvestQuantity[slotIndex] = 0;
        clearInterval(player.lab.growthIntervalId[slotIndex]); // Stop updating
        player.lab.growthIntervalId[slotIndex] = null;
        renderLab(); // Update UI to show controls again
        updateUI(); // Ensure all UI elements, including inventory, are updated
        renderMarket(); // Refresh market table to show updated "Your Stock"
        saveGame(); // Save after growth completion
    } else {
        progressBarEl.style.width = `${progress}%`;
        const remainingSeconds = Math.ceil((growingDrug.duration - elapsed) / 1000);
        progressBarEl.textContent = `${Math.floor(progress)}% (${remainingSeconds}s remaining)`;
        currentGrowthStatusEl.textContent = `Growing ${drugName}...`; // Corrected to show drug name
    }
    updateNavbarLabProgress(); // Update navbar progress with every tick
}

/**
 * Updates the progress bar in the navigation bar.
 */
function updateNavbarLabProgress() {
    // Handle Slot 1 progress display
    if (player.lab.growingDrug[0]) {
        labProgressNav1.classList.remove('hidden');
        const elapsed = Date.now() - player.lab.growingDrug[0].startTime;
        const progress = (elapsed / player.lab.growingDrug[0].duration) * 100;
        labProgressTextNav1.textContent = `${player.lab.growingDrug[0].name} (Slot 1): ${Math.floor(progress)}%`;
        labProgressBarNav1.style.width = `${progress}%`;
    } else {
        labProgressNav1.classList.add('hidden');
    }

    // Handle Slot 2 progress display (only if lab level is 5 or higher)
    if (player.labLevel >= 5 && player.lab.growingDrug[1]) {
        labProgressNav2.classList.remove('hidden');
        const elapsed = Date.now() - player.lab.growingDrug[1].startTime;
        const progress = (elapsed / player.lab.growingDrug[1].duration) * 100;
        labProgressTextNav2.textContent = `${player.lab.growingDrug[1].name} (Slot 2): ${Math.floor(progress)}%`;
        labProgressBarNav2.style.width = `${progress}%`;
    } else {
        labProgressNav2.classList.add('hidden');
    }
}


/**
 * Updates the grow drug select options based on the player's lab level.
 */
function updateGrowDrugSelect() {
    // Exclude drugs with fixedPrice (like Money Bag) and miscItems from growing options
    const availableDrugsToGrow = drugs.filter(drug => player.labLevel >= drug.requiredLabLevel && !drug.fixedPrice && !miscItems.some(item => item.name === drug.name)); 

    // Update for slot 1
    growDrugSelect1.innerHTML = ''; // Clear existing options
    if (availableDrugsToGrow.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No drugs available to grow (Upgrade Lab)';
        growDrugSelect1.appendChild(option);
        startGrowBtn1.disabled = true;
    } else {
        availableDrugsToGrow.forEach(drug => {
            const option = document.createElement('option');
            option.value = drug.name;
            let optionText = `${drug.name}`;
            if (drug.craftable) {
                const recipe = craftableDrugs.find(cd => cd.name === drug.name);
                if (recipe) {
                    const materialsList = Object.entries(recipe.requiredMaterials)
                        .map(([mat, qty]) => `${qty} ${mat}`)
                        .join(', ');
                    optionText = `${drug.name} (Craft: ${materialsList}, Yield: ${recipe.craftYield}, Time: ${recipe.craftTimeSeconds}s)`;
                }
            } else {
                optionText = `${drug.name} (Cost: $${drug.growCost}, Yield: ${drug.growYield}, Time: ${drug.growTimeSeconds}s)`;
            }
            option.textContent = optionText;
            growDrugSelect1.appendChild(option);
        });
        startGrowBtn1.disabled = false;
    }

    // Update for slot 2 (if lab level is 5 or higher)
    growDrugSelect2.innerHTML = ''; // Clear existing options
    if (player.labLevel >= 5) {
        if (availableDrugsToGrow.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No drugs available to grow (Upgrade Lab)';
            growDrugSelect2.appendChild(option);
            startGrowBtn2.disabled = true;
        } else {
            availableDrugsToGrow.forEach(drug => {
                const option = document.createElement('option');
                option.value = drug.name;
                let optionText = `${drug.name}`;
                if (drug.craftable) {
                    const recipe = craftableDrugs.find(cd => cd.name === drug.name);
                    if (recipe) {
                        const materialsList = Object.entries(recipe.requiredMaterials)
                            .map(([mat, qty]) => `${qty} ${mat}`)
                            .join(', ');
                        optionText = `${drug.name} (Craft: ${materialsList}, Yield: ${recipe.craftYield}, Time: ${recipe.craftTimeSeconds}s)`;
                    }
                } else {
                    optionText = `${drug.name} (Cost: $${drug.growCost}, Yield: ${drug.growYield}, Time: ${drug.growTimeSeconds}s)`;
                }
                option.textContent = optionText;
                growDrugSelect2.appendChild(option);
            });
            startGrowBtn2.disabled = false;
        }
    }
}

/**
 * Handles starting the drug growing/crafting process in the lab for a specific slot.
 * @param {number} slotIndex - The index of the lab slot (0 or 1).
 */
function startGrowingDrug(slotIndex) {
    playClickSound(); // Play click sound on starting grow
    const selectedDrugName = (slotIndex === 0 ? growDrugSelect1 : growDrugSelect2).value;
    const drugToProcess = drugs.find(d => d.name === selectedDrugName);

    if (!drugToProcess) {
        addMessage('Please select a valid item to process.', 'error');
        return;
    }

    if (player.lab.growingDrug[slotIndex]) {
        addMessage(`Lab slot ${slotIndex + 1} is already busy processing. Please wait for the current batch to finish.`, 'error');
        return;
    }

    // Prevent starting new growth if game is paused
    if (isGamePaused) {
        addMessage('Cannot start processing while game is paused.', 'error');
        return;
    }

    let cost = drugToProcess.growCost;
    let duration = drugToProcess.growTimeSeconds * 1000;
    let yieldQuantity = drugToProcess.growYield;
    let messagePrefix = "growing";

    if (drugToProcess.craftable) {
        const recipe = craftableDrugs.find(cd => cd.name === drugToProcess.name);
        if (!recipe) {
            addMessage(`Crafting recipe for ${drugToProcess.name} not found.`, 'error');
            return;
        }

        // Check for materials
        for (const materialName in recipe.requiredMaterials) {
            const requiredQty = recipe.requiredMaterials[materialName];
            if ((player.inventory[materialName] || 0) < requiredQty) {
                addMessage(`Not enough ${materialName} to craft ${drugToProcess.name}. You need ${requiredQty} ${materialName}.`, 'error');
                return;
            }
        }

        // Consume materials
        for (const materialName in recipe.requiredMaterials) {
            const requiredQty = recipe.requiredMaterials[materialName];
            player.inventory[materialName] -= requiredQty;
            player.currentBackpackWeight -= requiredQty * (drugWeights[materialName] || 0);
        }
        
        cost = 0; // Crafting has material cost, not money cost
        duration = recipe.craftTimeSeconds * 1000;
        yieldQuantity = recipe.craftYield;
        messagePrefix = "crafting";
    } else {
        if (player.money < cost) {
            addMessage(`Not enough money to start ${messagePrefix} ${drugToProcess.name}. You need $${cost.toFixed(2)}.`, 'error');
            return;
        }
        player.money -= cost;
    }

    const potentialWeight = yieldQuantity * (drugWeights[drugToProcess.name] || 0);
    if (player.currentBackpackWeight + potentialWeight > player.backpackLimit) {
        addMessage(`Not enough backpack space for this harvest! You need at least ${potentialWeight}kg free.`, 'error');
        return;
    }

    player.lab.growingDrug[slotIndex] = {
        name: drugToProcess.name,
        cost: cost, // This cost is for display/record, actual money/materials consumed above
        yield: yieldQuantity,
        duration: duration,
        startTime: Date.now() // Record start time
    };
    player.lab.harvestQuantity[slotIndex] = yieldQuantity; // Store for easy access

    addMessage(`Started ${messagePrefix} ${drugToProcess.name} in lab slot ${slotIndex + 1}! It will be ready in ${duration / 1000} seconds.`, 'info');
    updateUI();
    renderLab(); // This will now start the interval for the progress bar
    saveGame(); // Save after starting growth
}

/**
 * Updates the "Next Day" button with cooldown information.
 */
function updateNextDayButtonCooldown() {
    const remainingTime = player.nextDayCooldownEnd - Date.now();
    if (remainingTime <= 0) {
        clearInterval(player.nextDayCooldownIntervalId);
        player.nextDayCooldownIntervalId = null;
        nextDayBtn.disabled = false;
        nextDayBtn.innerHTML = `Next Day <i class="fas fa-forward ml-2"></i>`;
        saveGame(); // Save when cooldown ends
    } else {
        const minutes = Math.floor(remainingTime / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        nextDayBtn.innerHTML = `Next Day (${minutes}m ${seconds}s) <i class="fas fa-forward ml-2"></i>`;
    }
}

/**
 * Renders the shop panel with upgrade information.
 */
function renderShop() {
    // Backpack Upgrades
    const currentBackpackUpgrade = backpackUpgrades.find(up => up.level === player.backpackLevel);
    const nextBackpackUpgrade = backpackUpgrades.find(up => up.level === player.backpackLevel + 1);

    backpackLevelEl.textContent = `Current Level: ${player.backpackLevel}`;
    backpackLimitDisplayEl.textContent = `Current Limit: ${player.backpackLimit}kg`;

    if (nextBackpackUpgrade) {
        backpackNextUpgradeInfoEl.textContent = `Next Upgrade: ${nextBackpackUpgrade.limit}kg for $${nextBackpackUpgrade.cost}`;
        upgradeBackpackBtn.disabled = player.money < nextBackpackUpgrade.cost;
        upgradeBackpackBtn.textContent = `Upgrade Backpack ($${nextBackpackUpgrade.cost})`;
    } else {
        backpackNextUpgradeInfoEl.textContent = 'Backpack is maxed out!';
        upgradeBackpackBtn.disabled = true;
        upgradeBackpackBtn.textContent = 'Max Level';
    }

    // Lab Upgrades
    const currentLabUpgrade = labUpgrades.find(up => up.level === player.labLevel);
    const nextLabUpgrade = labUpgrades.find(up => up.level === player.labLevel + 1);

    labLevelEl.textContent = `Current Level: ${player.labLevel}`;
    labUnlockedDrugsEl.textContent = `Unlocked: ${currentLabUpgrade.unlocks.join(', ')}`;
    if (player.labLevel === 5) {
        labUnlockedDrugsEl.textContent += ' (Two simultaneous grows!)';
    } else if (player.labLevel === 6) { // New: For Lab Level 6
        labUnlockedDrugsEl.textContent += ' (Two simultaneous grows, DMT crafting!)';
    } else if (player.labLevel === 7) { // New: For Lab Level 7
        labUnlockedDrugsEl.textContent += ' (Two simultaneous grows, DMT crafting, Glock W Switch crafting!)';
    }

    if (nextLabUpgrade) {
        let unlockText = nextLabUpgrade.unlocks.join(', ');
        if (nextLabUpgrade.level === 5) {
            unlockText = 'Two simultaneous grows';
        } else if (nextLabUpgrade.level === 6) { // New: For Lab Level 6
            unlockText = 'DMT crafting';
        } else if (nextLabUpgrade.level === 7) { // New: For Lab Level 7
            unlockText = 'Glock W Switch crafting';
        }
        labNextUpgradeInfoEl.textContent = `Next Upgrade: ${unlockText} for $${nextLabUpgrade.cost}`;
        upgradeLabBtn.disabled = player.money < nextLabUpgrade.cost;
        upgradeLabBtn.textContent = `Upgrade Lab ($${nextLabUpgrade.cost})`;
    } else {
        labNextUpgradeInfoEl.textContent = 'Lab is maxed out!';
        upgradeLabBtn.disabled = true;
        upgradeLabBtn.textContent = 'Max Level';
    }
    addSoundListeners(); // Re-add sound listeners after shop panel changes
}

/**
 * Handles upgrading the backpack.
 */
function upgradeBackpack() {
    playClickSound(); // Play click sound on upgrade
    const nextBackpackUpgrade = backpackUpgrades.find(up => up.level === player.backpackLevel + 1);

    if (nextBackpackUpgrade) {
        if (player.money >= nextBackpackUpgrade.cost) {
            player.money -= nextBackpackUpgrade.cost;
            player.backpackLevel = nextBackpackUpgrade.level;
            player.backpackLimit = nextBackpackUpgrade.limit;
            player.level++; // Increment player level
            addMessage(`Backpack upgraded to level ${player.backpackLevel}! New limit: ${player.backpackLimit}kg.`, 'success');
            addMessage(`You leveled up! Your current level is ${player.level}.`, 'info'); // Message for level up
            checkMazdaSpeedProtegeUnlock(); // NEW: Check for MazdaSpeed Protege unlock on level up
            saveGame();
            updateUI(); // Update UI for money and backpack limit and player level
            renderShop(); // Re-render shop for next upgrade info
        } else {
            addMessage(`Not enough money to upgrade backpack. You need $${nextBackpackUpgrade.cost - player.money} more.`, 'error');
        }
    } else {
        addMessage('Your backpack is already at max level!', 'info');
    }
}

/**
 * Handles upgrading the lab.
 */
function upgradeLab() {
    playClickSound(); // Play click sound on upgrade
    const nextLabUpgrade = labUpgrades.find(up => up.level === player.labLevel + 1);

    if (nextLabUpgrade) {
        if (player.money >= nextLabUpgrade.cost) {
            player.money -= nextLabUpgrade.cost;
            player.labLevel = nextLabUpgrade.level;
            player.level++; // Increment player level
            let messageText = `Lab upgraded to level ${player.labLevel}!`;
            if (nextLabUpgrade.level === 5) {
                messageText += ' You can now grow two drugs simultaneously!';
            } else if (nextLabUpgrade.level === 6) { // New: For Lab Level 6
                messageText += ` Unlocked: ${nextLabUpgrade.unlocks.join(', ')} crafting!`;
            } else if (nextLabUpgrade.level === 7) { // New: For Lab Level 7
                messageText += ` Unlocked: ${nextLabUpgrade.unlocks.join(', ')} crafting!`;
            }
            addMessage(messageText, 'success');
            addMessage(`You leveled up! Your current level is ${player.level}.`, 'info'); // Message for level up
            updateGrowDrugSelect(); // Update available drugs in lab
            checkMazdaSpeedProtegeUnlock(); // NEW: Check for MazdaSpeed Protege unlock on level up
            saveGame();
            updateUI(); // Update UI for money and player level
            renderShop(); // Re-render shop for next upgrade info
            renderLab(); // Re-render lab to show/hide second slot
        } else {
            addMessage(`Not enough money to upgrade lab. You need $${nextLabUpgrade.cost - player.money} more.`, 'error');
        }
    } else {
        addMessage('Your lab is already at max level!', 'info');
    }
}

/**
 * NEW: Checks if the 2003 MazdaSpeed Protege should be unlocked.
 * This is called on game initialization, level up, and day change.
 */
function checkMazdaSpeedProtegeUnlock() {
    const mazdaSpeedProtege = cars.find(car => car.id === 'mazdaspeed-protege');
    if (mazdaSpeedProtege && player.level >= mazdaSpeedProtege.unlockedAtLevel && !player.mazdaSpeedProtegeUnlocked) {
        // Check if the car is already in player's garage to prevent duplicates on load
        if (!player.cars.some(c => c.id === mazdaSpeedProtege.id)) {
            let initialDMTQuantity = 30; // Use let as it might be adjusted
            const dmtWeight = drugWeights['DMT'] || 0;
            let initialDMTWeight = initialDMTQuantity * dmtWeight;

            // Ensure the initial DMT quantity doesn't exceed the trunk limit
            if (initialDMTWeight > mazdaSpeedProtege.trunkLimit) {
                // Adjust initialDMTQuantity to fit if it exceeds the limit
                initialDMTQuantity = Math.floor(mazdaSpeedProtege.trunkLimit / dmtWeight);
                initialDMTWeight = initialDMTQuantity * dmtWeight;
                addMessage(`Warning: Initial DMT for MazdaSpeed Protege exceeds trunk limit. Only adding ${initialDMTQuantity} DMT.`, 'error');
            }

            player.cars.push({
                id: mazdaSpeedProtege.id,
                name: mazdaSpeedProtege.name,
                price: mazdaSpeedProtege.price,
                trunkLimit: mazdaSpeedProtege.trunkLimit,
                icon: mazdaSpeedProtege.icon,
                trunkInventory: {
                    'DMT': initialDMTQuantity // Add 30 DMT to the trunk
                }, 
                currentTrunkWeight: initialDMTWeight // Update trunk weight with DMT
            });
            // Ensure all other drugs and materials are initialized in the new car's trunkInventory
            const newCar = player.cars[player.cars.length - 1];
            [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
                if (newCar.trunkInventory[item.name] === undefined) {
                    newCar.trunkInventory[item.name] = 0;
                }
            });

            player.mazdaSpeedProtegeUnlocked = true;
            addMessage(`Amazing! You've reached Level ${player.level} and unlocked the legendary ${mazdaSpeedProtege.name}! It has been added to your garage with ${initialDMTQuantity} DMT in the trunk!`, 'success');
            renderGarage(); // Update garage display immediately
            saveGame(); // Save game after unlocking
        }
    }
}

/**
 * Renders the garage panel, displaying owned cars.
 */
function renderGarage() {
    carListEl.innerHTML = ''; // Clear existing cars

    if (player.cars.length === 0) {
        carListEl.innerHTML = '<p class="text-gray-400 text-center">You don\'t own any cars yet. Buy one from the Dealership!</p>';
        sellCarBtn.disabled = true; // Disable sell button if no cars
        return;
    } else {
        sellCarBtn.disabled = false; // Enable sell button if cars are owned
    }

    // Display owned cars
    player.cars.forEach(car => {
        const carDiv = document.createElement('div');
        // Increased image size and added styling for the car container
        carDiv.classList.add('bg-gray-700', 'p-6', 'rounded-lg', 'shadow-lg', 'flex', 'flex-col', 'items-center', 'space-y-4', 'border', 'border-gray-600');
        carDiv.innerHTML = `
            <img src="${car.icon}" alt="${car.name}" class="w-48 h-32 object-contain rounded-md border border-gray-500 p-2 bg-gray-600">
            <div>
                <h3 class="text-2xl font-bold text-white">${car.name}</h3>
                <p class="text-gray-400 text-lg">Trunk Capacity: ${car.trunkLimit}kg</p>
                <button class="btn btn-info btn-manage-trunk mt-3 w-full" data-car-id="${car.id}">Manage Trunk</button>
            </div>
        `;
        carListEl.appendChild(carDiv);
    });

    // Attach event listeners to new manage trunk buttons
    document.querySelectorAll('.btn-manage-trunk').forEach(button => {
        button.onclick = (event) => { 
            playClickSound(); 
            const carId = event.target.dataset.carId;
            showTrunkManagementModal(carId); 
        };
        button.onmouseover = playHoverSound;
    });
    addSoundListeners(); // Re-add sound listeners after garage panel changes
}

/**
 * Renders the dealership panel, displaying cars for sale.
 */
function renderDealership() {
    carShopListEl.innerHTML = ''; // Clear existing cars

    // Filter out unbuyable cars (like the special unlockable car and MazdaSpeed Protege)
    const buyableCars = cars.filter(car => !car.unbuyable);

    buyableCars.forEach(car => {
        const carDiv = document.createElement('div');
        // Increased image size and added styling for the car container
        carDiv.classList.add('bg-gray-700', 'p-6', 'rounded-lg', 'shadow-lg', 'flex', 'flex-col', 'items-center', 'space-y-4', 'border', 'border-gray-600');
        
        // Check if the player already owns this car
        const isOwned = player.cars.some(ownedCar => ownedCar.id === car.id);
        const buttonText = isOwned ? 'Owned' : `Buy ($${car.price})`;
        const buttonClass = isOwned ? 'btn-neutral' : 'btn-success';
        const buttonDisabled = isOwned || player.money < car.price;

        carDiv.innerHTML = `
            <img src="${car.icon}" alt="${car.name}" class="w-48 h-32 object-contain rounded-md border border-gray-500 p-2 bg-gray-600">
            <div>
                <h3 class="text-2xl font-bold text-white">${car.name}</h3>
                <p class="text-gray-400 text-lg">Trunk Capacity: ${car.trunkLimit}kg</p>
                <button class="btn ${buttonClass} btn-buy-car mt-3 w-full" data-car-id="${car.id}" ${buttonDisabled ? 'disabled' : ''}>${buttonText}</button>
            </div>
        `;
        carShopListEl.appendChild(carDiv);
    });

    // Attach event listeners to new buy car buttons
    document.querySelectorAll('.btn-buy-car').forEach(button => {
        button.onclick = (event) => { playClickSound(); buyCar(event); };
        button.onmouseover = playHoverSound;
    });
    addSoundListeners(); // Re-add sound listeners after dealership panel changes
}

/**
 * New: Renders the materials shop panel.
 */
function renderMaterialsShop() {
    materialsTableBody.innerHTML = ''; // Clear existing rows

    materials.forEach(material => {
        const stock = player.inventory[material.name] || 0; // Get current stock
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-bold flex items-center justify-center">${material.icon ? `<img src="${material.icon}" alt="${material.name} icon" class="icon-img mr-2">` : ''}${material.name}</td>
            <td class="text-yellow-300">$${material.price.toFixed(2)}</td>
            <td>${stock}</td>
            <td>
                <button class="btn btn-success btn-buy-material" data-material="${material.name}" data-price="${material.price}">Buy</button>
            </td>
            <td><input type="number" min="1" value="1" class="input-field w-24 quantity-input-material" data-material="${material.name}"></td>
        `;
        materialsTableBody.appendChild(row);
    });

    // Attach event listeners to new buy material buttons
    document.querySelectorAll('.btn-buy-material').forEach(button => {
        button.onclick = (event) => { playClickSound(); handleBuyMaterial(event); };
        button.onmouseover = playHoverSound;
    });
    document.querySelectorAll('.quantity-input-material').forEach(input => {
        input.onmouseover = playHoverSound;
        input.onchange = playClickSound; // Play sound when value changes
    });
    addSoundListeners(); // Re-add sound listeners after materials shop panel changes
}


/**
 * New: Handles buying materials from the materials shop.
 * @param {Event} event - The click event.
 */
function handleBuyMaterial(event) {
    const materialName = event.target.dataset.material;
    const pricePerUnit = parseFloat(event.target.dataset.price);
    const quantityInput = document.querySelector(`.quantity-input-material[data-material="${materialName}"]`);
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        addMessage('Please enter a valid quantity to buy.', 'error');
        return;
    }

    const totalCost = pricePerUnit * quantity;
    const weightToAdd = quantity * (drugWeights[materialName] || 0);

    if (player.money < totalCost) {
        addMessage(`Not enough money to buy ${quantity} units of ${materialName}. You need $${(totalCost - player.money).toFixed(2)} more.`, 'error');
        return;
    }

    if (player.currentBackpackWeight + weightToAdd > player.backpackLimit) {
        addMessage(`Not enough backpack space! Buying ${quantity} units of ${materialName} would exceed your limit by ${(player.currentBackpackWeight + weightToAdd) - player.backpackLimit}kg.`, 'error');
        return;
    }

    player.money -= totalCost;
    player.inventory[materialName] = (player.inventory[materialName] || 0) + quantity;
    player.currentBackpackWeight += weightToAdd;
    addMessage(`Bought ${quantity} units of ${materialName} for $${totalCost.toFixed(2)}.`, 'success');
    saveGame();
    updateUI();
    renderMaterialsShop(); // Re-render to update "Your Stock"
}


/**
 * Handles buying a car from the dealership.
 * @param {Event} event - The click event.
 */
function buyCar(event) {
    const carId = event.target.dataset.carId;
    const carToBuy = cars.find(car => car.id === carId);

    if (!carToBuy) {
        addMessage('Selected car not found.', 'error');
        return;
    }

    if (player.money < carToBuy.price) {
        addMessage(`Not enough money to buy the ${carToBuy.name}. You need $${(carToBuy.price - player.money).toFixed(2)} more.`, 'error');
        return;
    }

    if (player.cars.some(ownedCar => ownedCar.id === carId)) {
        addMessage(`You already own the ${carToBuy.name}!`, 'info');
        return;
    }

    // Check if the car has color options
    if (carToBuy.colors && carToBuy.colors.length > 0) {
        carToBuyForColorSelection = carToBuy; // Store the car for color selection
        showColorSelectionModal(carToBuy);
    } else {
        // No color choice needed, proceed with purchase
        finalizeCarPurchase(carToBuy, null); // Pass null for color
    }
}

/**
 * Displays the color selection modal for a specific car.
 * @param {object} car - The car object being purchased.
 */
function showColorSelectionModal(car) {
    document.getElementById('color-modal-car-name').textContent = car.name;
    colorButtonsContainer.innerHTML = ''; // Clear existing buttons

    car.colors.forEach(color => {
        const button = document.createElement('button');
        button.textContent = color.charAt(0).toUpperCase() + color.slice(1); // Capitalize first letter
        button.classList.add('btn', 'px-6', 'py-3');
        
        // Assign specific classes based on color for styling
        if (color === 'red') {
            button.classList.add('btn-danger');
        } else if (color === 'gray' || color === 'black') {
            button.classList.add('btn-neutral');
        } else {
            button.classList.add('btn-primary'); // Default for other colors if any
        }

        button.addEventListener('click', () => {
            playClickSound();
            finalizeCarPurchase(carToBuyForColorSelection, color);
        });
        button.addEventListener('mouseover', playHoverSound);
        colorButtonsContainer.appendChild(button);
    });

    colorSelectionModal.classList.remove('hidden');
    addSoundListeners(); // Re-add listeners for modal elements
}

/**
 * Finalizes the car purchase after color selection (if applicable).
 * @param {object} car - The car object to purchase.
 * @param {string|null} color - The chosen color ('red', 'gray'), or null if no color choice.
 */
function finalizeCarPurchase(car, color) {
    let finalCarIcon = car.icon; // Default to the car's original icon

    if (color) {
        // Construct the icon URL based on chosen color
        if (car.id === 'mustang') {
            finalCarIcon = color === 'red' ? iconUrls.car_mustang_red : iconUrls.car_mustang_gray;
        } else if (car.id === 'infiniti') {
            finalCarIcon = color === 'red' ? iconUrls.car_infiniti_red : iconUrls.car_infiniti_black;
        }
    }

    // Create a new car object to add to player.cars, including the chosen icon
    const purchasedCar = {
        id: car.id,
        name: car.name,
        price: car.price,
        trunkLimit: car.trunkLimit,
        icon: finalCarIcon, // Use the selected/default icon
        trunkInventory: {}, // Initialize new car's trunk inventory
        currentTrunkWeight: 0 // Initialize new car's trunk weight
    };

    // Ensure all drugs and materials are initialized in the new car's trunkInventory
    [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
        purchasedCar.trunkInventory[item.name] = 0;
    });

    player.money -= purchasedCar.price;
    player.cars.push(purchasedCar); // Add the car object to owned cars
    addMessage(`You bought a new ${purchasedCar.name} (${color ? color : 'default'}) for $${purchasedCar.price.toFixed(2)}!`, 'success');
    
    saveGame();
    updateUI();
    renderDealership(); // Re-render dealership to update button state
    renderGarage(); // Re-render garage to show new car
    closeColorSelectionModal(); // Close the modal if it was open
}

/**
 * Closes the color selection modal.
 */
function closeColorSelectionModal() {
    colorSelectionModal.classList.add('hidden');
    carToBuyForColorSelection = null; // Clear the stored car
    addSoundListeners(); // Re-add listeners for main game elements
}

/**
 * Displays the trunk management modal for a specific car.
 * @param {string} carId - The ID of the car whose trunk is being managed.
 */
function showTrunkManagementModal(carId) {
    activeCarForTrunk = player.cars.find(car => car.id === carId);
    if (!activeCarForTrunk) {
        addMessage('Error: Car not found for trunk management.', 'error');
        return;
    }

    // Populate drug select in modal (include materials and misc items now)
    modalDrugSelect.innerHTML = '';
    [...drugs, ...materials, ...miscItems].forEach(item => { // NEW: Include miscItems
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        modalDrugSelect.appendChild(option);
    });

    // Update trunk weight display in modal
    updateModalTrunkDisplay();

    trunkManagementModal.classList.remove('hidden');
    addSoundListeners(); // Re-add listeners for modal elements
}

/**
 * Updates the trunk weight display and lists items in the modal.
 */
function updateModalTrunkDisplay() {
    if (!activeCarForTrunk) return;

    // Use the active car's trunkInventory and currentTrunkWeight
    activeCarForTrunk.currentTrunkWeight = 0; // Recalculate current trunk weight
    modalTrunkItemsList.innerHTML = ''; // Clear existing list items

    let totalTrunkItems = 0;
    for (const itemName in activeCarForTrunk.trunkInventory) { // Iterate over active car's items
        const quantity = activeCarForTrunk.trunkInventory[itemName];
        if (quantity > 0) {
            totalTrunkItems++;
            activeCarForTrunk.currentTrunkWeight += quantity * (drugWeights[itemName] || 0);
            const listItem = document.createElement('li');
            listItem.textContent = `${itemName}: ${quantity} units`;
            modalTrunkItemsList.appendChild(listItem);
        }
    }

    if (totalTrunkItems === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Trunk is empty.';
        modalTrunkItemsList.appendChild(listItem);
    }

    modalCurrentTrunkWeight.textContent = `${activeCarForTrunk.currentTrunkWeight.toFixed(2)}kg`;
    modalMaxTrunkWeight.textContent = `${activeCarForTrunk.trunkLimit}kg`;
}


/**
 * Handles putting drugs/materials/misc items into the trunk from backpack via modal.
 */
function handlePutInTrunkModal() {
    playClickSound();
    const itemName = modalDrugSelect.value; // Can be drug or material or misc item
    const quantity = parseInt(modalQuantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        addMessage('Please enter a valid quantity to put in trunk.', 'error');
        return;
    }

    if (player.inventory[itemName] < quantity) {
        addMessage(`You don't have ${quantity} units of ${itemName} in your backpack.`, 'error');
        return;
    }

    const weightToStore = quantity * (drugWeights[itemName] || 0);

    // Use activeCarForTrunk's properties
    if (activeCarForTrunk.currentTrunkWeight + weightToStore > activeCarForTrunk.trunkLimit) {
        addMessage(`Not enough trunk space! Putting ${quantity} units of ${itemName} would exceed the trunk limit by ${((activeCarForTrunk.currentTrunkWeight + weightToStore) - activeCarForTrunk.trunkLimit).toFixed(2)}kg.`, 'error');
        return;
    }

    player.inventory[itemName] -= quantity;
    player.currentBackpackWeight -= weightToStore;
    activeCarForTrunk.trunkInventory[itemName] = (activeCarForTrunk.trunkInventory[itemName] || 0) + quantity; // Update active car's trunk
    activeCarForTrunk.currentTrunkWeight += weightToStore; // Update active car's trunk weight

    addMessage(`Put ${quantity} units of ${itemName} into the trunk.`, 'success');
    saveGame();
    updateUI(); // Updates backpack weight display
    updateModalTrunkDisplay(); // Updates modal display
}

/**
 * Handles removing drugs/materials/misc items from the trunk to backpack via modal.
 */
function handleRemoveFromTrunkModal() {
    playClickSound();
    const itemName = modalDrugSelect.value; // Can be drug or material or misc item
    const quantity = parseInt(modalQuantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        addMessage('Please enter a valid quantity to remove from trunk.', 'error');
        return;
    }

    // Use activeCarForTrunk's properties
    if (activeCarForTrunk.trunkInventory[itemName] < quantity) {
        addMessage(`You don't have ${quantity} units of ${itemName} in the trunk.`, 'error');
        return;
    }

    const weightToRetrieve = quantity * (drugWeights[itemName] || 0);

    if (player.currentBackpackWeight + weightToRetrieve > player.backpackLimit) {
        addMessage(`Not enough backpack space! Retrieving ${quantity} units of ${itemName} would exceed your backpack limit by ${((player.currentBackpackWeight + weightToRetrieve) - player.backpackLimit).toFixed(2)}kg.`, 'error');
        return;
    }

    activeCarForTrunk.trunkInventory[itemName] -= quantity; // Update active car's trunk
    activeCarForTrunk.currentTrunkWeight -= weightToRetrieve; // Update active car's trunk weight
    player.inventory[itemName] = (player.inventory[itemName] || 0) + quantity;
    player.currentBackpackWeight += weightToRetrieve;

    addMessage(`Removed ${quantity} units of ${itemName} from the trunk.`, 'success');
    saveGame();
    updateUI(); // Updates backpack weight display
    updateModalTrunkDisplay(); // Updates modal display
}

/**
 * Closes the trunk management modal.
 */
function closeTrunkManagementModal() {
    trunkManagementModal.classList.add('hidden');
    activeCarForTrunk = null; // Clear active car
    addSoundListeners(); // Re-add listeners for main game elements
}

/**
 * Displays the sell car modal.
 */
function showSellCarModal() {
    playClickSound();
    sellCarSelect.innerHTML = ''; // Clear existing options

    // Filter out unbuyable cars (like the special unlockable car and MazdaSpeed Protege)
    const sellableCars = player.cars.filter(car => car.id !== 'mystery-machine' && car.id !== 'mazdaspeed-protege');

    if (sellableCars.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No cars to sell.';
        sellCarSelect.appendChild(option);
        sellSelectedCarBtn.disabled = true;
        sellCarValueEl.textContent = 'Selling Price: $0';
    } else {
        sellableCars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.id;
            option.textContent = `${car.name} (Sell for $${(car.price * 0.75).toFixed(2)})`; // Sell for 75% of original price
            sellCarSelect.appendChild(option);
        });
        sellSelectedCarBtn.disabled = false;
        // Update selling price when modal opens based on first car
        updateSellCarValue();
    }
    sellCarModal.classList.remove('hidden');
    addSoundListeners(); // Re-add listeners for modal elements
}

/**
 * Updates the displayed selling price in the sell car modal.
 */
function updateSellCarValue() {
    const selectedCarId = sellCarSelect.value;
    // Find the car in the main 'cars' array to get its original price
    const carToSellDefinition = cars.find(car => car.id === selectedCarId);
    if (carToSellDefinition) {
        sellCarValueEl.textContent = `Selling Price: $${(carToSellDefinition.price * 0.75).toFixed(2)}`;
    } else {
        sellCarValueEl.textContent = 'Selling Price: $0';
    }
}

/**
 * Handles selling the selected car.
 */
function sellCar() {
    playClickSound();
    const selectedCarId = sellCarSelect.value;
    const carIndex = player.cars.findIndex(car => car.id === selectedCarId);

    if (carIndex === -1) {
    addMessage('Please select a car to sell.', 'error');
        return;
    }

    const carToSell = player.cars[carIndex];
    // Prevent selling the special car if it's the Mystery Machine or MazdaSpeed Protege
    if (carToSell.id === 'mystery-machine' || carToSell.id === 'mazdaspeed-protege') {
        addMessage(`You cannot sell the ${carToSell.name}!`, 'error');
        return;
    }

    const sellingPrice = carToSell.price * 0.75; // Sell for 75% of original price

    // Check if the car's trunk has any items by iterating its specific trunkInventory
    let trunkHasItems = false;
    for (const itemName in carToSell.trunkInventory) { // Check all items in THIS car's trunk
        if (carToSell.trunkInventory[itemName] > 0) {
            trunkHasItems = true;
            break;
        }
    }

    if (trunkHasItems) {
        addMessage(`Cannot sell ${carToSell.name}. Please empty its trunk first!`, 'error');
        return;
    }

    player.money += sellingPrice;
    player.cars.splice(carIndex, 1); // Remove the car from owned cars
    addMessage(`Sold your ${carToSell.name} for $${sellingPrice.toFixed(2)}.`, 'success');
    saveGame();
    closeSellCarModal(); // Close the modal
    updateUI(); // Update UI for money
    renderGarage(); // Re-render garage to reflect sold car
    renderDealership(); // Re-render dealership to make the car available for purchase again
}

/**
 * Closes the sell car modal.
 */
function closeSellCarModal() {
    sellCarModal.classList.add('hidden');
    addSoundListeners(); // Re-add listeners for main game elements
}


/**
 * Displays the welcome screen and hides the main game content.
 */
function showWelcomeScreen() {
    welcomeScreen.classList.remove('hidden');
    navbar.classList.add('hidden');
    mainGameContent.classList.add('hidden');
}

/**
 * Hides the welcome screen and displays the main game content.
 * Also starts the background music.
 */
function hideWelcomeScreen() {
    welcomeScreen.classList.add('hidden');
    navbar.classList.remove('hidden');
    mainGameContent.classList.remove('hidden');
    initializeGame(); // Initialize the game after the welcome screen is dismissed
}

/**
 * Adds sound listeners to all interactive elements.
 * This function is called after UI updates to ensure new elements also get listeners.
 */
function addSoundListeners() {
    // Add listeners to all buttons
    document.querySelectorAll('button').forEach(button => {
        // Remove existing listeners to prevent duplicates
        button.removeEventListener('click', playClickSound);
        button.removeEventListener('mouseover', playHoverSound);

        // Add new listeners
        button.addEventListener('click', playClickSound);
        button.addEventListener('mouseover', playHoverSound);
    });

    // Add listeners to all select elements
    document.querySelectorAll('select').forEach(select => {
        // Remove existing listeners to prevent duplicates
        select.removeEventListener('change', playClickSound);
        select.removeEventListener('mouseover', playHoverSound);

        // Add new listeners
        select.addEventListener('change', playClickSound); // Play click sound on selection change
        select.addEventListener('mouseover', playHoverSound);
    });

    // Add listeners to all input type="number" elements
    document.querySelectorAll('input[type="number"]').forEach(input => {
        // Remove existing listeners to prevent duplicates
        input.removeEventListener('change', playClickSound);
        input.removeEventListener('mouseover', playHoverSound);

        // Add new listeners
        input.addEventListener('change', playClickSound); // Play click sound when value changes
        input.addEventListener('mouseover', playHoverSound);
    });
}


// --- Event Listeners ---
// Note: For existing event listeners, I've wrapped the original function call
// with playClickSound() directly in the function definition where possible
// (e.g., handleTravel, startGrowingDrug, upgradeBackpack, upgradeLab).
// For others, I'll update them here.

nextDayBtn.addEventListener('click', (event) => { playClickSound(); nextDay(event); });
travelBtn.addEventListener('click', handleTravel); // handleTravel already calls playClickSound
goToGarageBtn.addEventListener('click', goToGarage); // New event listener for garage button
// Removed: goToMaterialsShopBtn.addEventListener('click', goToMaterialsShop); // Removed event listener for materials shop button

sellCarBtn.addEventListener('click', showSellCarModal); // New event listener for sell car button

// Updated startGrowBtn event listeners for multiple slots
startGrowBtn1.addEventListener('click', () => startGrowingDrug(0)); 
startGrowBtn2.addEventListener('click', () => startGrowingDrug(1)); 

upgradeBackpackBtn.addEventListener('click', upgradeBackpack); // upgradeBackpack already calls playClickSound
upgradeLabBtn.addEventListener('click', upgradeLab); // upgradeLab already calls playClickSound

// Event listener for the "Start Game" button on the welcome screen
startGameBtn.addEventListener('click', (event) => { playClickSound(); hideWelcomeScreen(event); });

// Modal event listeners
modalCloseBtn.addEventListener('click', closeTrunkManagementModal);
modalPutBtn.addEventListener('click', handlePutInTrunkModal);
modalRemoveBtn.addEventListener('click', handleRemoveFromTrunkModal);

// Sell Car Modal event listeners
sellModalCloseBtn.addEventListener('click', closeSellCarModal);
sellCarSelect.addEventListener('change', updateSellCarValue); // Update value when selection changes
sellSelectedCarBtn.addEventListener('click', sellCar);

// Color Selection Modal event listeners
colorModalCloseBtn.addEventListener('click', closeColorSelectionModal);

// Master volume slider event listener
masterVolumeSlider.addEventListener('input', handleMasterVolumeChange);
// New SFX volume slider event listener
sfxVolumeSlider.addEventListener('input', handleSfxVolumeChange);

// Pause menu event listeners
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        togglePauseMenu();
    }
});
pauseModalCloseBtn.addEventListener('click', togglePauseMenu);
resumeGameBtn.addEventListener('click', togglePauseMenu);


// Initialize the game by showing the welcome screen when the page loads
document.addEventListener('DOMContentLoaded', showWelcomeScreen);

// Add initial sound listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', addSoundListeners);