let upgradeData = [];

const mainCombinations = [
    "0-0", "1-0", "2-0", "3-0", "4-0",
    "0-1", "0-2", "0-3", "0-4"
];

const gridAreas = [
    "zero-zero", "one-zero", "two-zero", "three-zero", "four-zero",
    "zero-one", "zero-two", "zero-three", "zero-four"
];

const combinations = [
    "0-0",
    "0-1", "0-2", "0-3", "0-4",
    "1-0", "1-1", "1-2", "1-3", "1-4",
    "2-0", "2-1", "2-2", "2-3", "2-4",
    "3-0", "3-1", "3-2",
    "4-0", "4-1", "4-2"
];

function createUpgradeCards() {
    const container = document.getElementById("upgrades-container");
    mainCombinations.forEach((upgrade, index) => {
        const card = document.createElement("div");
        card.className = `card ${gridAreas[index]}`;
        card.innerHTML = `
        <h2>Upgrade ${upgrade}</h2>
        <div class="stat-input">
          <label for="price-${upgrade}">Price</label>
          <input type="number" id="price-${upgrade}" value="0">
        </div>
        <div class="stat-input">
          <label for="range-${upgrade}">Range</label>
          <input type="number" id="range-${upgrade}" value="0">
        </div>
        <div class="stat-input">
          <label for="damage-${upgrade}">Damage</label>
          <input type="number" id="damage-${upgrade}" value="0">
        </div>
        <div class="stat-input">
          <label for="cooldown-${upgrade}">Cooldown</label>
          <input type="number" id="cooldown-${upgrade}" value="0">
        </div>
      `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", createUpgradeCards);

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}

function getUpgradeStats(upgrade) {
    return {
        price: parseFloat(document.getElementById(`price-${upgrade}`).value) || 0,
        range: parseFloat(document.getElementById(`range-${upgrade}`).value) || 0,
        damage: parseFloat(document.getElementById(`damage-${upgrade}`).value) || 0,
        cooldown: parseFloat(document.getElementById(`cooldown-${upgrade}`).value) || 0
    };
}

function round(value) {
    return Math.round(value * 100) / 100; // round to 2 decimal places
}

function calculateUpgrades() {
    const upgradesOutput = document.getElementById("upgrades-output");
    upgradesOutput.innerHTML = "";
    upgradeData = [];

    combinations.forEach(comb => {
        const [top, bottom] = comb.split("-").map(Number);
        let totalStats = { price: 0, totalPrice: 0, range: 0, damage: 0, cooldown: 0 };
        let upgradePriceTop = 0, upgradePriceBottom = 0;

        // Get initial stats for 0-0 and assign them directly to totalStats
        const zeroZeroStats = getUpgradeStats("0-0");
        totalStats.price = zeroZeroStats.price;
        totalStats.totalPrice = zeroZeroStats.price; // Total price starts with 0-0 price
        totalStats.range = zeroZeroStats.range;
        totalStats.damage = zeroZeroStats.damage;
        totalStats.cooldown = zeroZeroStats.cooldown;

        // Calculate total for top path
        let prevTopStats = { ...zeroZeroStats }; // Initialize with 0-0 stats
        for (let i = 1; i <= top; i++) { // Start from 1 since 0-0 is already included
            const currentStats = getUpgradeStats(`${i}-0`);
            totalStats.price = currentStats.price;
            totalStats.totalPrice += currentStats.price;

            // Add only the difference between current and previous stats
            totalStats.range += currentStats.range - prevTopStats.range;
            totalStats.damage += currentStats.damage - prevTopStats.damage;
            totalStats.cooldown += currentStats.cooldown - prevTopStats.cooldown;

            // Update previous stats
            prevTopStats = { ...currentStats };

            if (i === top) upgradePriceTop = currentStats.price; // Only the price of the top path upgrade at this level
        }

        // Calculate total for bottom path
        let prevBottomStats = { ...zeroZeroStats }; // Initialize with 0-0 stats
        for (let i = 1; i <= bottom; i++) { // Start from 1 since 0-0 is already included
            const currentStats = getUpgradeStats(`0-${i}`);
            totalStats.price = currentStats.price;
            totalStats.totalPrice += currentStats.price;

            // Add only the difference between current and previous stats
            totalStats.range += currentStats.range - prevBottomStats.range;
            totalStats.damage += currentStats.damage - prevBottomStats.damage;
            totalStats.cooldown += currentStats.cooldown - prevBottomStats.cooldown;

            // Update previous stats
            prevBottomStats = { ...currentStats };

            if (i === bottom) upgradePriceBottom = currentStats.price; // Only the price of the bottom path upgrade at this level
        }


        let combinationHTML = ``;
        if (top >= 1 && bottom >= 1) {
            combinationHTML = `
            <p><strong>${comb}:</strong></p>
            <p>Top Path Price: ${round(upgradePriceTop)}</p>
            <p>Bottom Path Price: ${round(upgradePriceBottom)}</p>
            <p>Total Price: ${round(totalStats.totalPrice)}</p>
            <p>Range: ${round(totalStats.range)}</p>
            <p>Damage: ${round(totalStats.damage)}</p>
            <p>Cooldown: ${round(totalStats.cooldown)}</p>
            <hr>
            `;
        }
        else {
            combinationHTML = `
            <p><strong>${comb}:</strong></p>
            <p>Price: ${round(totalStats.price)}</p>
            <p>Total Price: ${round(totalStats.totalPrice)}</p>
            <p>Range: ${round(totalStats.range)}</p>
            <p>Damage: ${round(totalStats.damage)}</p>
            <p>Cooldown: ${round(totalStats.cooldown)}</p>
            <hr>
            `;
        }

        upgradesOutput.innerHTML += combinationHTML;

        upgradeData.push({
            combination: comb,
            topPathPrice: round(upgradePriceTop),
            bottomPathPrice: round(upgradePriceBottom),
            totalPrice: round(totalStats.price),
            range: round(totalStats.range),
            damage: round(totalStats.damage),
            cooldown: round(totalStats.cooldown)
        });
    });

    document.getElementById("results").scrollIntoView();
}

function exportFile() {
    let text = "";
    mainCombinations.forEach(upgrade => {
        const stats = getUpgradeStats(upgrade);
        text += `${upgrade}:\n`;
        text += `  Price: ${round(stats.price)}\n`;
        text += `  Range: ${round(stats.range)}\n`;
        text += `  Damage: ${round(stats.damage)}\n`;
        text += `  Cooldown: ${round(stats.cooldown)}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `towerPaths-${generateRandomString(8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

const fileInput = document.getElementById("fileInput");

function importFile() {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please import a valid .txt file.")
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const content = event.target.result;
        const lines = content.split("\n");
        let currentUpgrade = "";

        lines.forEach(line => {
            const matchUpgrade = line.match(/^(\d-\d):$/);
            const matchStat = line.match(/^\s+(Price|Range|Damage|Cooldown):\s+([\d.]+)/);

            if (matchUpgrade) {
                currentUpgrade = matchUpgrade[1];
            } else if (matchStat && mainCombinations.includes(currentUpgrade)) {
                const stat = matchStat[1].toLowerCase();
                const value = parseFloat(matchStat[2]);

                document.getElementById(`${stat}-${currentUpgrade}`).value = value;
            }
        });
    };
    reader.readAsText(file);
}