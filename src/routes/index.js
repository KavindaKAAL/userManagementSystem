const express = require('express');
const studentRoutes = require('./students');
const teachersRoutes = require('./teachers');
const classRoutes = require('./classes');

const router = express.Router();

router.use('/students',studentRoutes);
router.use('/classes', classRoutes);
router.use('/teachers', teachersRoutes);

module.exports = router;