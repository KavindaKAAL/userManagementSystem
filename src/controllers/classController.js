const mongoose = require("mongoose");

const Student = require('../models/student');
const Class = require('../models/class');
const Teacher = require('../models/teacher');
const logger = require('../../logger');
const { validationResult } = require('express-validator');

const getClasses = async (req,res)=>{
    try{
        const classes = await Class.find()
        .populate('teacher')
        .populate('students');
        res.status(200).json(classes);
    }catch(error){
        logger.error('Error retrieving students', error);
        res.status(500).json({message:'Error retrieving classes'});
    }
};

const getClassById = async (req,res)=>{
    try{
        const class_ = await Class.findById(req.params._id)
        .populate('teacher')
        .populate('students');
        if (!class_){
            logger.info('Class not found');
            return res.status(404).json({message: 'Class not found'})
        }
        res.status(200).json(class_);
    }catch(error){
        logger.error('Error retrieving class', error);
        res.status(500).json({message: 'Error retrieving class'})
    }
};

const createClass = async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                    logger.error("Bad Request",errors.array() );
                    return res.status(400).json({ error: 'Bad Request', message: errors.array()[0].msg});
                }
        const newClass = await Class.create(req.body);
        logger.info("Class created successfully");
        res.status(201).json({message: 'Class created successfully', class: newClass});
    }catch(error){
        if (error.code === 11000 && error.keyPattern?.name) {
            logger.error("Class creation failed - duplicate name", error);
            return res.status(409).json({
                error: 'Conflict',
                message: 'A class with this name already exists.',
            });
        }

        logger.error("Error creating class", error);
        res.status(500).json({message: 'Error creating calss'})
    }
};

const updateClass = async (req,res)=>{

    const filter = req.body._id;
    const update = req.body;
    delete update._id; 

    try{
        const class_ = await Class.findById(filter);
        if (!class_) {
            logger.info(`Class with ID ${filter} does not exist.`)
            return res.status(404).json({
                error: 'Not Found',
                message: `Class with ID ${filter} does not exist.`,
            });
        }
        const updatedStatus = await Class.findByIdAndUpdate(filter, 
            {$set:update},
            {new:true}
        );
        logger.info(`Class having id ${filter} is successfully updated.`);
        res.status(200).json({message: `Class having id ${filter} is successfully updated.`, update: updatedStatus});
    }catch(error){
        res.status(500).json({message: 'Error updating class.'})
    }
    
};

const deleteClass = async (req,res)=>{
    try{
        const deletionStatus = await Class.findByIdAndDelete(req.params._id);
        if (!deletionStatus){
            return res.status(404).json({message: 'Class not found'})
        }
        res.status(200).json({message: `Class having id ${req.params._id} is successfully deleted.`});
    }catch(error){
        logger.error('Error deleting class',error)
        res.status(500).json({message: 'Error deleting class', error: error.message })
    }
};

const assignTeacherToClass = async (req,res)=>{
    try{
        const classId = req.body.class_id;
        const teacherId = req.body.teacher_id;
        const update_class = {classes:classId};
        const update_teacher = {teacher:teacherId};

        if (!mongoose.isValidObjectId(teacherId) || !mongoose.isValidObjectId(classId)) {
                logger.info('Invalid teacherId ID or class ID');
                return res.status(400).json({ message: 'Invalid teacherId ID or class ID' });
        };
        
        const teacher = await Teacher.findById(teacherId);
        const course = await Class.findById(classId);
        
        if (!teacher) {
            logger.info('Teacher not found');
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        if (!course) {
            logger.info('Class not found');
            return res.status(404).json({ message: 'Class not found' });
        };

            
        const session = await mongoose.startSession();
        session.startTransaction();

        try{
            const class_update = await Class.findByIdAndUpdate(classId,
                {$set:update_teacher},
                {new:true}
            );

            await Teacher.findByIdAndUpdate(teacherId,
                {$addToSet:update_class},
                {new:true}
            );

            await session.commitTransaction();
            session.endSession();
            console.log("Transaction complete")
            res.status(200).json({message: 'Successfully assigned.', update_status: class_update})
        }catch(error){
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction failed.",error);
            res.status(500).json({message: 'Error assigning teacher.', error: err.message})
        }
    }catch(err){
        logger.error("Assignment failed",err);
        res.status(500).json({message: 'Error assigning teacher.', error: err.message })
    }
};

const unAssignTeacherFromClass = async (req,res)=>{
    try{
        const classId = req.body.class_id;
        const teacherId = req.body.teacher_id;
        const update_class = {classes:classId};
        const update_teacher = {teacher:teacherId};

        if (!mongoose.isValidObjectId(teacherId) || !mongoose.isValidObjectId(classId)) {
                logger.info('Invalid teacherId ID or class ID');
                return res.status(400).json({ message: 'Invalid teacherId ID or class ID' });
        };
        
        const teacher = await Teacher.findById(teacherId);
        const course = await Class.findById(classId);
        
        if (!teacher) {
            logger.info('Teacher not found');
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        if (!course) {
            logger.info('Class not found');
            return res.status(404).json({ message: 'Class not found' });
        };


        const session = await mongoose.startSession();
        session.startTransaction();

        try{
            const class_update = await Class.findByIdAndUpdate(classId,
                {$unset:update_teacher},
                {new:true}
            );

            await Teacher.findByIdAndUpdate(teacherId,
                {$pull:update_class},
                {new:true}
            );

            await session.commitTransaction();
            session.endSession();
            console.log("Transaction complete")
            res.status(200).json({message: 'Successfully unassigned.', update_status: class_update})
        }catch(error){
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction failed.",error);
            res.status(500).json({message: 'Error unassigning teacher.'})
        }
    }catch(err){
        res.status(500).json({message: 'Error unassigning teacher.' })
    }
}

module.exports = {getClasses, getClassById, createClass, updateClass, deleteClass, assignTeacherToClass, unAssignTeacherFromClass};