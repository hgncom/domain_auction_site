const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('A new client connected');

  // Send initial domain data to the client
  const initialDomains = [
    { id: 1, name: 'example.com', currentBid: 1000, endTime: new Date(Date.now() + 86400000).toISOString(), description: 'A premium .com domain', category: 'premium', minimumBidIncrement: 50, reservePrice: 1500 },
    { id: 2, name: 'mydomain.net', currentBid: 500, endTime: new Date(Date.now() + 172800000).toISOString(), description: 'Versatile .net domain', category: 'standard', minimumBidIncrement: 25, reservePrice: null },
  ];

  socket.send(JSON.stringify({ type: 'DOMAINS_UPDATE', domains: initialDomains }));

  // Handle messages from the client
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Handle the message (e.g., update domain data)
  });

  // Handle client disconnect
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');