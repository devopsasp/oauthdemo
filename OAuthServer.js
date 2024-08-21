//OAuthServer
// Import required modules
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Create an Express app
const app = express();
app.use(express.json());
// Set secret key for JWT
const secretKey = "my-secret-key";

// User database (in-memory for simplicity)
const users = [
  { id: 1, username: "john", password: bcrypt.hashSync("password", 10) },
  { id: 2, username: "jane", password: bcrypt.hashSync("password", 10) },
];

// Client database (in-memory for simplicity)
const clients = [
  { id: 1, clientId: "client1", clientSecret: "client1-secret" },
  { id: 2, clientId: "client2", clientSecret: "client2-secret" },
];

// Generate JWT token
function generateToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

// Verify JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
}

// Handle client registration
app.post("/register", (req, res) => {
  const { clientId, clientSecret } = req.body;
  const client = clients.find((c) => c.clientId === clientId);
  if (!client || client.clientSecret !== clientSecret) {
    return res.status(401).send("Invalid client credentials");
  }
  const user = users.find((u) => u.username === req.body.username);
  if (!user) {
    return res.status(404).send("User not found");
  }
  const token = generateToken(user);
  res.send({ token });
});

// Handle client login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Invalid username or password");
  }
  const token = generateToken(user);
  res.send({ token });
});

// Protect routes with JWT middleware
function authenticate(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send("Invalid token");
  }
  req.user = decoded;
  next();
}

// Protected route
app.get("/protected", authenticate, (req, res) => {
  res.send(`Hello, ${req.user.username}!`);
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
