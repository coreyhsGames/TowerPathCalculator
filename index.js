const combinations = [
    "0-0",
    "0-1", "0-2", "0-3", "0-4",
    "1-0", "1-1", "1-2", "1-3", "1-4",
    "2-0", "2-1", "2-2", "2-3", "2-4",
    "3-0", "3-1", "3-2",
    "4-0", "4-1", "4-2"
];

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

    combinations.forEach(comb => {
        const [top, bottom] = comb.split("-").map(Number);
        let totalStats = { price: 0, totalPrice: 0, range: 0, damage: 0, cooldown: 0 };
        let upgradePriceTop = 0, upgradePriceBottom = 0;

        // Calculate total for top path
        for (let i = 0; i <= top; i++) {
            const currentStats = getUpgradeStats(`${i}-0`);
            totalStats.price = currentStats.price;
            totalStats.totalPrice += currentStats.price;
            totalStats.range += currentStats.range;
            totalStats.damage += currentStats.damage;
            totalStats.cooldown += currentStats.cooldown;
            if (i === top) upgradePriceTop = currentStats.price; // Only the price of the top path upgrade at this level
        }

        // Calculate total for bottom path
        for (let i = 1; i <= bottom; i++) {
            const currentStats = getUpgradeStats(`0-${i}`);
            totalStats.price = currentStats.price;
            totalStats.totalPrice += currentStats.price;
            totalStats.range += currentStats.range;
            totalStats.damage += currentStats.damage;
            totalStats.cooldown += currentStats.cooldown;
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
    });
}