// parseLog.js
module.exports = function parseUserError(error) {
    const prefix = "Program log: [USER-ERROR]";
    if (!log.includes(prefix)) return null;

    const content = log.slice(prefix.length).trim();
    const parts = content.split(" ");

    const user = parts[1];

    try {
        const message = parts.slice(1).join(" ");

        return {
            user,
            errorMessage: message,
        };
    } catch (err) {
        console.error("Failed to parse BigInt timestamp from log:", err);
        return null;
    }
};
