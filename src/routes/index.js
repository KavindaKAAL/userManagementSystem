const express = require('express');
const studentRoutes = require('./students');
const teachersRoutes = require('./teachers');
const classRoutes = require('./classes');

const router = express.Router();

router.use('/students',studentRoutes);
router.use('/classes', classRoutes);
router.use('/teachers', teachersRoutes);


router.get('/health', (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

module.exports = router;