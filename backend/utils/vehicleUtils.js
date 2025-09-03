// utils/vehicleUtils.js

const getRequiredVehicleType = (items) => {
    let maxDimension = 0;
    const getMaxDimension = (sizeString) => {
        if (!sizeString || typeof sizeString !== 'string') {
            return 0;
        }
        const dimensions = sizeString.toLowerCase().split('x').map(Number);
        return Math.max(...dimensions.filter(num => !isNaN(num)));
    };

    if (Array.isArray(items)) {
        for (const item of items) {
            const itemMax = getMaxDimension(item.size);
            if (itemMax > maxDimension) {
                maxDimension = itemMax;
            }
        }
    }

    if (maxDimension >= 10) return 'Large Truck';
    if (maxDimension >= 5) return 'Small Truck';
    return 'Bike';
};

module.exports = { getRequiredVehicleType };