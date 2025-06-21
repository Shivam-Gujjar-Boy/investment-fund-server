// parseLog.js
module.exports = function parseError(error) {
    const prefix = "Program log: [FUND-ERROR]";
    if (!log.includes(prefix)) return null;

    const content = log.slice(prefix.length).trim();
    const parts = content.split(" ");

    const fund = parts[0];
    const user = parts[1];

    try {
        const message = parts.slice(2).join(" ");

        return {
            fund,
            user,
            errorMessage: message,
        };
    } catch (err) {
        console.error("Failed to parse BigInt timestamp from log:", err);
        return null;
    }
};
