const express = require('express');
const dotenv = require('dotenv');
const { Connection, PublicKey } = require('@solana/web3.js');
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const connectDB = require('./config/database');
const parseLog = require('./parseLog');
const FundLogs = require('./models/FundLogs');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
app.use(express.json());

const connection = new Connection(process.env.RPC_URL, 'confirmed');
const programId = new PublicKey(process.env.PROGRAM_ID);

(async () => {
    // websocket log listener
    connection.onLogs(programId, async (loginfo) => {
        const logs = loginfo.logs;
        const fundLogs = logs.filter((log) => log.includes('[FUND-ACTIVITY]'));

        for (const log of fundLogs) {
            const parsed = parseLog(log);
            if (!parsed) {
                console.log('yaha aaya mai');
                continue;
            }

            console.log('yaha aaya mai 1');
            const {fund, logMessage, timestamp} = parsed;
            const signature = loginfo.signature;

            const newEntry = {logMessage, timestamp, signature};

            try {
                await FundLogs.findOneAndUpdate(
                    {fund},
                    {$push: {logs: newEntry}},
                    {upsert: true, new: true}
                );

                console.log('emit hone wala hai log');
                io.emit('fund_activity', {
                    fund,
                    ...newEntry,
                });

                console.log('Logged activity:', fund, logMessage);
            } catch (err) {
                console.error('Failed to store activity log:', err);
            }
        }
    }, 'confirmed');

    server.listen(process.env.PORT, () => console.log('Listening on port 5000'));
})();

// Routes
const activityRoutes = require('./routes/activityRoutes');
const fundRoutes = require('./routes/fundRoutes');
const govSymbolRoutes = require('./routes/govSymbolRoutes');
app.use('/api/activity', activityRoutes);
app.use('/api/funds/', fundRoutes);
app.use('/api/govSymbol', govSymbolRoutes);
