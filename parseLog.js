// parseLog.js
module.exports = function parseLog(log) {
    const prefix = "Program log: [FUND-ACTIVITY]";
    if (!log.includes(prefix)) return null;

    const content = log.slice(prefix.length).trim();
    const parts = content.split(" ");

    const fund = parts[0];
    const timestampStr = parts[1];
    const fundName = parts[2];

    try {
        const timestamp = BigInt(timestampStr); // Safe parsing as BigInt
        const message = parts.slice(3).join(" ");

        return {
            fund,
            fundName,
            logMessage: message,
            timestamp: timestamp.toString(), // Store as string in DB
        };
    } catch (err) {
        console.error("Failed to parse BigInt timestamp from log:", err);
        return null;
    }
};
