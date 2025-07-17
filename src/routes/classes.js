const express = require('express');
const router = express.Router();
const {getClasses, createClass, updateClass, deleteClass, getClassById, assignTeacherToClass, unAssignTeacherFromClass} = require("../controllers/classController");
const checkUnsupportedHttpMethods = require('../middleware/checkUnsupportedHttpMethods');

router.get('/',getClasses);
router.get('/:_id',getClassById);
router.post('/',createClass);
router.put('/',updateClass);
router.delete('/:_id',deleteClass);
router.put('/assignTeacher',assignTeacherToClass);
router.put('/unassignTeacher',unAssignTeacherFromClass);

router.all('/', checkUnsupportedHttpMethods);
router.all('/:_id', checkUnsupportedHttpMethods);
router.all('/assignTeacher', checkUnsupportedHttpMethods);
router.all('/unassignTeacher', checkUnsupportedHttpMethods);

module.exports = router;