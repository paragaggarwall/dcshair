const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const loginauth = require('./routes/authroutes')
const authenticateToken = require('./middleware/auth');

const app = express();
app.use((req, res, next) => {
  console.log(">>>", req.method, req.originalUrl);
  next();
});
const PORT = process.env.PORT || 5252;
app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.json({ ok: true });
});
app.use(cors());
app.use(express.json());
app.use('/auth', loginauth)
app.use(authenticateToken)
app.use('/', routes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
