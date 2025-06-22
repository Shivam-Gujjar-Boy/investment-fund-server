const express = require('express');
const dotenv = require('dotenv');
const { Connection, PublicKey } = require('@solana/web3.js');
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const connectDB = require('./config/database');
const parseLog = require('./parseLog');
const parseError = require('./parseError');
const parseUserError = require('./parseUserError');
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
        const fundErrors = logs.filter((log) => log.includes('[FUND-ERROR]'));
        const userErrors = logs.filter((log) => log.includes('[USER-ERROR]'));

        for (const log of fundLogs) {
            const parsed = parseLog(log);
            if (!parsed) {
                continue;
            }

            const {fund, fundName, logMessage, timestamp} = parsed;
            const signature = loginfo.signature;

            const newEntry = {logMessage, timestamp, signature};

            try {
                await FundLogs.findOneAndUpdate(
                    {fund},
                    {fundName},
                    {$push: {logs: newEntry}},
                    {upsert: true, new: true}
                );

                console.log('emit hone wala hai log');
                io.emit('fund_activity', {
                    fund,
                    fundName,
                    ...newEntry,
                });

                console.log('Logged activity:', fund, logMessage);
            } catch (err) {
                console.error('Failed to store activity log:', err);
            }
        }

        for (const error of fundErrors) {
            const parsed = parseError(error);
            if (!parsed) {
                continue;
            }

            const {fund, user, errorMessage} = parsed;
            const newEntry = {errorMessage};

            try {
                console.log('emit hone wala hai error');
                io.emit('fund_error', {
                    fund,
                    user,
                    ...newEntry,
                });

                console.log('Logged error:', fund, errorMessage);
            } catch (err) {
                console.error('Failed to store activity log:', err);
            }
        }

        for (const userError of userErrors) {
            const parsed = parseUserError(error);
            if (!parsed) {
                continue;
            }

            const {user, errorMessage} = parsed;
            const newEntry = {errorMessage};

            try {
                console.log('emit hone wala hai user error');
                io.emit('user_error', {
                    user,
                    ...newEntry,
                });

                console.log('Logged error:', errorMessage);
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
const uploadProposal = require('./routes/uploadProposal');
const uploadUserData = require('./routes/uploadUserData');
app.use('/api/activity', activityRoutes);
app.use('/api/funds/', fundRoutes);
app.use('/api/govSymbol', govSymbolRoutes);
app.use('/api', uploadProposal);
app.use('/api/upload', uploadUserData);
