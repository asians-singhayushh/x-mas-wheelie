import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from './users';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const PORT = 3000;

const activeUsers: Record<string, string> = {};
const cursorPositions: Record<string, { x: number; y: number }> = {};
const spinResults: Record<string, string> = {}; // To store spin results for each user

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (authenticate(username, password)) {
        const token = uuidv4();
        activeUsers[username] = token;

        res.status(200).json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const username = Object.keys(activeUsers).find(user => activeUsers[user] === token);

    if (username) {
        socket.data.username = username;
        return next();
    }

    return next(new Error('Unauthorized'));
});

io.on('connection', (socket) => {
    const username = socket.data.username;

    socket.on('setCursorPosition', ({ x, y }) => {
        cursorPositions[username] = { x, y };
        io.emit('updateCursorPositions', cursorPositions);
    });

    socket.on('setSpinResult', (result: string) => {
        spinResults[username] = result;
        io.emit('spinResults', spinResults);
    });

    socket.on('fetchSpinResult', () => {
        socket.emit('spinResults', spinResults);
    });

    socket.on('spinStart', (winner: string) => {
        socket.broadcast.emit('spinStart', winner);
    });

    socket.on('resetWheel', () => {
        socket.broadcast.emit('resetWheel');
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        delete cursorPositions[username];
        io.emit('updateCursorPositions', cursorPositions);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
