const Teacher = require('../models/teacher');
const logger = require('../../logger');
const { validationResult } = require('express-validator');

const getTeachers = async (req,res)=>{
    try{
        const users = await Teacher.find()
        .populate('classes');
        res.status(200).json(users);
    }catch(error){
        logger.error('Error retrieving teachers', error);
        res.status(500).json({message:'Error retrieving teachers.'});
    }
};

const getTeacherById = async (req,res)=>{
    try{
        const user = await Teacher.findById(req.params._id)
        .populate('classes');
        if (!user){
            logger.info('Teacher not found');
            return res.status(404).json({message: 'Teacher not found'})
        }
        res.status(200).json(user);
    }catch(error){
        logger.error('Error retrieving teacher', error);
        res.status(500).json({message: 'Error retrieving teacher'})
    }
};

const createTeacher = async (req,res)=>{
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            logger.error("Bad Request",errors.array() );
            return res.status(400).json({ error: 'Bad Request', message: errors.array()[0].msg});
        }

        const newUser = await Teacher.create(req.body);
        logger.info("Teacher created successfully");
        res.status(201).json({message: 'Teacher created successfully', teacher: newUser});
    }catch(error){
        if (error.code === 11000 && error.keyPattern?.email) {
            logger.error("Error creating teacher",error);
            return res.status(409).json({
                error: 'Conflict',
                message: 'Teacher already exists in the system with this email',
            });
        }
        logger.error("Error creating teacher",error);
        res.status(500).json({message: 'Error creating teacher'})
    }
};

const updateTeacher = async (req,res)=>{

    const filter = req.body._id;
    const update = req.body;
    delete update._id;

    try{
        const teacher = await Teacher.findById(filter);
        if (!teacher) {
            logger.info(`Student with ID ${filter} does not exist.`)
            return res.status(404).json({
                error: 'Not Found',
                message: `Student with ID ${filter} does not exist.`,
            });
        }

        const updatedStatus = await Teacher.findByIdAndUpdate(filter, 
            {$set:update},
            {new:true}
        );
        logger.info(`Teacher having id ${filter} is successfully updated.`);
        res.status(200).json({message: `Teacher having id ${filter} is successfully updated.`, update: updatedStatus});
    }catch(error){
        logger.error('Error updating teacher.', error);
        res.status(500).json({message: 'Error updating teacher.'})
    }
    
};

const deleteTeacher = async (req,res)=>{
    try{
        const deletionStatus = await Teacher.findByIdAndDelete(req.params._id);
        if (!deletionStatus){
            logger.info('Teacher not found');
            return res.status(404).json({message: 'Teacher not found'})
        }
        logger.info(`Teacher having id ${req.params._id} is successfully deleted.`);
        res.status(200).json({message: `Teacher having id ${req.params._id} is successfully deleted.`});
    }catch(error){
        logger.error('Error deleting teacher',error)
        res.status(500).json({message: 'Error deleting teacher'})
    }
};

module.exports = {getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher};