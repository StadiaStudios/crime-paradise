// Robbery Constants
const ROBBERY_DURATION_SECONDS = 50; // Robbery takes 50 seconds
const ROBBERY_REWARD = 35000; // $35000 reward
const ROBBERY_LEVEL_REQUIRED = 10; // Level 10 required
const ROBBERY_COOLDOWN_MINUTES = 5; // NEW: 5 minute cooldown

// DOM Elements for Robbery Panel (from index.html)
const startRobberyBtn = document.getElementById('start-robbery-btn');
const robberyProgressBarContainer = document.getElementById('robbery-progress-container');
const robberyProgressBar = document.getElementById('robbery-progress-bar');
const robberyStatusText = document.getElementById('robbery-status-text');

/**
 * Starts a robbery attempt.
 */
function startRobbery() {
    playClickSound(); // Play click sound on starting robbery

    // Check if player meets the level requirement
    if (player.level < ROBBERY_LEVEL_REQUIRED) {
        addMessage(`You need to be at least Level ${ROBBERY_LEVEL_REQUIRED} to attempt a robbery in Riverhall.`, 'error');
        return;
    }

    // Check if a robbery is already active
    if (player.robbery.active) {
        addMessage('A robbery is already in progress. Please wait for it to finish.', 'error');
        return;
    }

    // Check if robbery is on cooldown
    if (player.robbery.cooldownEnd > Date.now()) {
        const remainingTime = player.robbery.cooldownEnd - Date.now();
        const minutes = Math.floor(remainingTime / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        addMessage(`Robbery is on cooldown. Please wait ${minutes}m ${seconds}s.`, 'error');
        return;
    }

    // Set robbery to active
    player.robbery.active = true;
    player.robbery.endTime = Date.now() + ROBBERY_DURATION_SECONDS * 1000; // Calculate end time

    addMessage('You started a robbery! Stay focused, it will take 50 seconds...', 'info');

    // Start the progress bar update interval
    if (player.robbery.intervalId) {
        clearInterval(player.robbery.intervalId);
    }
    player.robbery.intervalId = setInterval(updateRobberyProgress, 100); // Update every 100ms

    saveGame(); // Save game state
    updateRobberyUI(); // Update UI immediately
}

/**
 * Updates the robbery progress bar and status text.
 */
function updateRobberyProgress() {
    if (!player.robbery.active) {
        clearInterval(player.robbery.intervalId);
        player.robbery.intervalId = null;
        updateRobberyUI(); // Reset UI if somehow not active
        return;
    }

    const elapsed = Date.now() - (player.robbery.endTime - ROBBERY_DURATION_SECONDS * 1000); // Calculate elapsed time from start
    const progress = (elapsed / (ROBBERY_DURATION_SECONDS * 1000)) * 100;

    if (progress >= 100) {
        completeRobbery(); // Robbery finished
    } else {
        robberyProgressBar.style.width = `${progress}%`;
        const remainingSeconds = Math.ceil((player.robbery.endTime - Date.now()) / 1000);
        robberyProgressBar.textContent = `${Math.floor(progress)}% (${remainingSeconds}s remaining)`;
        robberyStatusText.textContent = `Robbery in progress...`;
    }
}

/**
 * Completes the robbery, grants reward, and sets cooldown.
 */
function completeRobbery() {
    clearInterval(player.robbery.intervalId);
    player.robbery.intervalId = null;

    player.robbery.active = false; // Robbery is no longer active

    // Check if granting reward would exceed the money limit
    if (player.money + ROBBERY_REWARD > player.moneyLimit) {
        const earnableMoney = player.moneyLimit - player.money;
        if (earnableMoney > 0) {
            player.money += earnableMoney;
            addMessage(`Robbery successful! You earned $${earnableMoney.toFixed(2)}, but hit your money limit of $${player.moneyLimit.toLocaleString('en-US')}!`, 'success');
        } else {
            addMessage(`Robbery successful! You would have earned $${ROBBERY_REWARD.toFixed(2)}, but your money is already at the limit of $${player.moneyLimit.toLocaleString('en-US')}!`, 'info');
        }
    } else {
        player.money += ROBBERY_REWARD;
        addMessage(`Robbery successful! You earned $${ROBBERY_REWARD.toFixed(2)}!`, 'success');
    }

    // NEW: Grant randomized misc items
    let itemsFound = [];
    miscItems.forEach(item => {
        const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity between 1 and 3
        const weightToAdd = quantity * (drugWeights[item.name] || 0);

        if (player.currentBackpackWeight + weightToAdd <= player.backpackLimit) {
            player.inventory[item.name] = (player.inventory[item.name] || 0) + quantity;
            player.currentBackpackWeight += weightToAdd;
            itemsFound.push(`${quantity} ${item.name}`);
        } else {
            addMessage(`Not enough backpack space for ${item.name}! You missed out on some loot.`, 'error');
        }
    });

    if (itemsFound.length > 0) {
        addMessage(`You also found: ${itemsFound.join(', ')}!`, 'success');
    } else {
        addMessage(`You couldn't carry any extra loot from the robbery.`, 'info');
    }


    // Set cooldown
    player.robbery.cooldownEnd = Date.now() + ROBBERY_COOLDOWN_MINUTES * 60 * 1000; // 5 minutes cooldown

    addMessage(`Robbery is now on cooldown for ${ROBBERY_COOLDOWN_MINUTES} minutes.`, 'info');

    saveGame(); // Save game state
    updateUI(); // Update main UI (money, etc.)
    updateRobberyUI(); // Update robbery panel UI

    // Start cooldown countdown
    if (player.robbery.intervalId) {
        clearInterval(player.robbery.intervalId);
    }
    player.robbery.intervalId = setInterval(updateRobberyCooldown, 1000);
}

/**
 * Updates the robbery cooldown display.
 */
function updateRobberyCooldown() {
    const remainingTime = player.robbery.cooldownEnd - Date.now();

    if (remainingTime <= 0) {
        clearInterval(player.robbery.intervalId);
        player.robbery.intervalId = null;
        addMessage('Robbery cooldown finished! You can attempt another robbery.', 'info');
        saveGame(); // Save when cooldown ends
        updateRobberyUI(); // Update UI to enable button
    } else {
        const minutes = Math.floor(remainingTime / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        robberyStatusText.textContent = `Cooldown: ${minutes}m ${seconds}s`;
        startRobberyBtn.disabled = true; // Keep button disabled during cooldown
    }
}

/**
 * Updates the robbery UI based on the current player.robbery state.
 * This function should be called when entering Riverhall or on game load.
 */
function updateRobberyUI() {
    if (player.location !== 'Riverhall') {
        // Only update if in Riverhall
        return;
    }

    if (player.robbery.active) {
        // Robbery is active, show progress bar
        startRobberyBtn.disabled = true;
        robberyProgressBarContainer.classList.remove('hidden');
        robberyProgressBar.style.width = `0%`; // Reset width initially
        robberyProgressBar.textContent = `0%`;
        robberyStatusText.textContent = 'Robbery in progress...';

        // Re-establish interval if game was loaded in active robbery state
        if (!player.robbery.intervalId && !isGamePaused) { // Only start if not already running and game not paused
            player.robbery.intervalId = setInterval(updateRobberyProgress, 100);
        }
        updateRobberyProgress(); // Initial update
    } else if (player.robbery.cooldownEnd > Date.now()) {
        // Robbery is on cooldown
        startRobberyBtn.disabled = true;
        robberyProgressBarContainer.classList.add('hidden');
        
        // Re-establish interval if game was loaded in cooldown state
        if (!player.robbery.intervalId && !isGamePaused) { // Only start if not already running and game not paused
            player.robbery.intervalId = setInterval(updateRobberyCooldown, 1000);
        }
        updateRobberyCooldown(); // Initial update
    } else {
        // Ready to rob
        startRobberyBtn.disabled = player.level < ROBBERY_LEVEL_REQUIRED;
        robberyProgressBarContainer.classList.add('hidden');
        robberyStatusText.textContent = player.level < ROBBERY_LEVEL_REQUIRED ? `Requires Level ${ROBBERY_LEVEL_REQUIRED}` : 'Ready to rob!';
        robberyProgressBar.style.width = `0%`;
        robberyProgressBar.textContent = `0%`;
    }

    // Add event listener for the robbery button
    startRobberyBtn.removeEventListener('click', startRobbery); // Prevent duplicates
    startRobberyBtn.addEventListener('click', startRobbery);
    startRobberyBtn.removeEventListener('mouseover', playHoverSound); // Prevent duplicates
    startRobberyBtn.addEventListener('mouseover', playHoverSound);
}

// Ensure updateRobberyUI is called when the DOM is fully loaded,
// and also when the location changes in game.js.
// game.js's initializeGame and updateUI will call this.
