const express = require('express');
const router = express.Router();
const {getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherById} = require("../controllers/teacherController");
const checkUnsupportedHttpMethods = require('../middleware/checkUnsupportedHttpMethods');

router.get('/',getTeachers);
router.get('/:_id',getTeacherById);
router.post('/',createTeacher);
router.put('/',updateTeacher);
router.delete('/:_id',deleteTeacher);

// for unsupported HTTP methods
router.all('/', checkUnsupportedHttpMethods);
router.all('/:_id', checkUnsupportedHttpMethods);

module.exports = router;