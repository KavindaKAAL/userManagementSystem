const express = require('express');
const router = express.Router();
const {getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherById} = require("../controllers/teacherController");
const checkUnsupportedHttpMethods = require('../middleware/checkUnsupportedHttpMethods');
const { param, body,validationResult} = require('express-validator');

router.get('/',getTeachers);
router.get('/:_id',
    [
        param('_id')
          .isMongoId()
          .withMessage('Invalid teacher ID format'),
      ],(req, res, next) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({
              error: 'Bad Request',
              message: errors.array()[0].msg
            });
          }
          next();
        },getTeacherById);

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
  ],createTeacher);

router.put('/',[
    body('_id').isMongoId().withMessage('Invalid teacher ID format'),
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
  ],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Bad Request', message: errors.array()[0].msg});
    }
    next();
  },updateTeacher);

router.delete('/:_id',
    [param('_id').isMongoId().withMessage('Invalid teacher ID format')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Bad Request', details: errors.array()[0].msg });
    }
    next();
  },deleteTeacher);

// for unsupported HTTP methods
router.all('/', checkUnsupportedHttpMethods);
router.all('/:_id', checkUnsupportedHttpMethods);

module.exports = router;