module.exports = {
    generateUniqueId: (type) => {
        const prefix = type;
        const randomNumbers = Math.floor(Math.random() * 10000000000); // 10-digit random number
        
        const timestamp = Date.now(); // Current timestamp in milliseconds
        
        const uniqueId = `${prefix}${timestamp}${randomNumbers}`;
        return uniqueId;
    }
}
