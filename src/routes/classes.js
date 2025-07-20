const express = require('express');
const router = express.Router();
const {getClasses, createClass, updateClass, deleteClass, getClassById, assignTeacherToClass, unAssignTeacherFromClass} = require("../controllers/classController");
const checkUnsupportedHttpMethods = require('../middleware/checkUnsupportedHttpMethods');
const { param, body,validationResult} = require('express-validator');

router.get('/',getClasses);
router.get('/:_id', [
    param('_id')
      .isMongoId()
      .withMessage('Invalid class ID format'),
  ],(req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Bad Request',
          message: errors.array()[0].msg
        });
      }
      next();
    },getClassById);
router.post('/',[
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('subject').isString().notEmpty().withMessage('Subject is required'),
    body().custom(body => {
      const allowedFields = ['name', 'subject'];
      const extraFields = Object.keys(body).filter(key => !allowedFields.includes(key));
      if (extraFields.length > 0) {
        throw new Error(`Extra fields are not allowed: ${extraFields.join(', ')}`);
      }
      return true;
    })
  ],createClass);

router.put('/',[
    body('_id').isMongoId().withMessage('Invalid class ID'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('subject').optional().isString().withMessage('Name must be a string'),
    body().custom(body => {
      const allowedFields = ['_id','name', 'subject'];
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
  },updateClass);

router.delete('/:_id',[param('_id').isMongoId().withMessage('Invalid class ID')],
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Bad Request', details: errors.array()[0].msg });
    }
    next();
  },deleteClass);
router.put('/assignTeacher',assignTeacherToClass);
router.put('/unassignTeacher',unAssignTeacherFromClass);

router.all('/', checkUnsupportedHttpMethods);
router.all('/:_id', checkUnsupportedHttpMethods);
router.all('/assignTeacher', checkUnsupportedHttpMethods);
router.all('/unassignTeacher', checkUnsupportedHttpMethods);

module.exports = router;