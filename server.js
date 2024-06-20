const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const API_KEY = 'your_api_key'; // Replace with your actual API key
const STOCK_API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=1min&apikey=${API_KEY}`;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

setInterval(async () => {
  try {
    const response = await axios.get(STOCK_API_URL);
    const stockData = response.data;
    io.emit('stock data', stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}, 60000); // Fetch every minute

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
