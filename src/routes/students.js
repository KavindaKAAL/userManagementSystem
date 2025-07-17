const express = require('express');
const router = express.Router();
const {getStudents, createStudent, updateStudent, deleteStudent, getStudentById, enrollStudentToClass, unEnrollStudentFromClass} = require("../controllers/studentController");
const checkUnsupportedHttpMethods = require('../middleware/checkUnsupportedHttpMethods');
const { param, body,validationResult} = require('express-validator');

router.get('/',getStudents);
router.get('/:_id', [
    param('_id')
      .isMongoId()
      .withMessage('Invalid student ID format'),
  ],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: errors.array()[0].msg
      });
    }
    next();
  },getStudentById);
router.post('/',[
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body().custom(body => {
      const allowedFields = ['name', 'email'];
      const extraFields = Object.keys(body).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        throw new Error(`Extra fields are not allowed: ${extraFields.join(', ')}`);
      }
      return true;
    })
  ],createStudent);
router.put('/',[
    body('_id').isMongoId().withMessage('Invalid student ID'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body().custom(body => {
      const allowedFields = ['_id','name', 'email'];
      const extraFields = Object.keys(body).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        throw new Error(`Extra fields are not allowed: ${extraFields.join(', ')}`);
      }
      return true;
    })
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Bad Request', message: errors.array()[0].msg});
    }
    next();
  },updateStudent);
router.delete('/:_id',
    [param('_id').isMongoId().withMessage('Invalid student ID')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Bad Request', details: errors.array()[0].msg });
    }
    next();
  },deleteStudent);
router.put('/enroll',enrollStudentToClass);
router.put('/unenroll',unEnrollStudentFromClass);

// for unsupported HTTP methods
router.all('/', checkUnsupportedHttpMethods);
router.all('/:_id', checkUnsupportedHttpMethods);
router.all('/enroll', checkUnsupportedHttpMethods);
router.all('/unenroll', checkUnsupportedHttpMethods);

module.exports = router;