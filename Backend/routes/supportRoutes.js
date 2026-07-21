const express = require("express");
const { createTicket } = require("../controllers/supportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/ticket', authMiddleware, createTicket);

module.exports = router;
