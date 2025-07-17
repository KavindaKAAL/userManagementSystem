const Student = require('../models/student');
const Class = require('../models/class');
const mongoose = require('mongoose');
const logger = require('../../logger');
const { validationResult } = require('express-validator');

const getStudents = async (req,res)=>{
    try{
        const users = await Student.find()
        .populate('enrolledClasses');
        res.status(200).json(users);
    }catch(error){
        logger.error('Error retrieving students', error);
        res.status(500).json({message:'Error retrieving students'});
    }
};

const getStudentById = async (req,res)=>{
    try{
        const user = await Student.findById(req.params._id)
        .populate('enrolledClasses');
        if (!user){
            logger.info('Student not found');
            return res.status(404).json({message: 'Student not found'})
        }
        res.status(200).json(user);
    }catch(error){
        logger.error('Error retrieving students', error);
        res.status(500).json({message: 'Error retrieving student'})
    }
};

const createStudent = async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error("Bad Request",errors.array() );
            return res.status(400).json({ error: 'Bad Request', message: errors.array()[0].msg});
        }
        const newUser = await Student.create(req.body);
        logger.info("Create a student");
        res.status(201).json({message: 'Student created successfully', student: newUser});
    }catch(error){
        if (error.code === 11000 && error.keyPattern?.email) {
            logger.error("Error creating student",error);
            return res.status(409).json({
                error: 'Conflict',
                message: 'User already exists in the system with this email',
            });
        }
        logger.error("Error creating student",error);
        res.status(500).json({message: 'Error creating student'})
    }
};

const updateStudent = async (req,res)=>{

    const filter = req.body._id;
    const update = req.body;
    delete update._id; 

    try{
        const student = await Student.findById(filter);
        if (!student) {
            logger.info(`Student with ID ${filter} does not exist.`)
            return res.status(404).json({
                error: 'Not Found',
                message: `Student with ID ${filter} does not exist.`,
            });
        }
        const updatedStatus = await Student.findByIdAndUpdate(filter, 
            {$set:update},
            {new:true}
        );
        logger.info(`Student having id ${filter} is successfully updated.`);
        res.status(200).json({message: `Student having id ${filter} is successfully updated.`, update: updatedStatus});
    }catch(error){
        logger.error('Error updating student.', error);
        res.status(500).json({message: 'Error updating student.'})
    }
    
};

const deleteStudent = async (req,res)=>{
    try{
        const deletionStatus = await Student.findByIdAndDelete(req.params._id);
        if (!deletionStatus){
            logger.info('Student not found');
            return res.status(404).json({message: 'Student not found'})
        }
        logger.info(`Student having id ${req.params._id} is successfully deleted.`);
        res.status(200).json({message: `Student having id ${req.params._id} is successfully deleted.`});
    }catch(error){
        logger.error('Error deleting student',error)
        res.status(500).json({message: 'Error deleting student'})
    }
};

const enrollStudentToClass = async (req,res)=>{
    try{
        const classId = req.body.class_id;
        const studentId = req.body.student_id;
        const update_enrolledClasses = {enrolledClasses:classId};
        const update_assignedStudents = {students:studentId};

        if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(classId)) {
            logger.info('Invalid student ID or class ID');
            return res.status(400).json({ message: 'Invalid student ID or class ID' });
        }

        const student = await Student.findById(studentId);
        const course = await Class.findById(classId);

        if (!student) {
            logger.info('Student not found');
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!course) {
            logger.info('Class not found');
            return res.status(404).json({ message: 'Class not found' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try{
            const student_update = await Student.findByIdAndUpdate(studentId,
                {$addToSet:update_enrolledClasses},
                {new:true}
            );

            await Class.findByIdAndUpdate(classId,
                {$addToSet:update_assignedStudents},
                {new:true}
            );

            await session.commitTransaction();
            session.endSession();
            logger.info("Successfully enrolled");
            res.status(200).json({message: 'Successfully enrolled', update_status: student_update})
        }catch(error){
            await session.abortTransaction();
            session.endSession();
            logger.error("Enrollment failed",error);
            res.status(500).json({message: 'Enrollment failed'})
        }

    }catch(err){
        logger.error("Enrollment failed",err);
        res.status(500).json({message: 'Enrollment failed'})
    }
};

const unEnrollStudentFromClass = async (req,res)=>{
    try{
        const classId = req.body.class_id;
        const studentId = req.body.student_id;
        const update_enrolledClasses = {enrolledClasses:classId};
        const update_assignedStudents = {students:studentId};

        if (!mongoose.isValidObjectId(studentId) || !mongoose.isValidObjectId(classId)) {
            return res.status(400).json({ message: 'Invalid student ID or class ID' });
        }

        const student = await Student.findById(studentId);
        const course = await Class.findById(classId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!course) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try{
            const student_update = await Student.findByIdAndUpdate(studentId,
                {$pull:update_enrolledClasses},
                {new:true}
            );

            await Class.findByIdAndUpdate(classId,
                {$pull:update_assignedStudents},
                {new:true}
            );

            await session.commitTransaction();
            session.endSession();
            logger.info("Successfully unenrolled");
            res.status(200).json({message: 'Successfully unenrolled.', update_status: student_update})
        }catch(error){
            await session.abortTransaction();
            session.endSession();
            logger.error("Unenrollment failed",error);
            res.status(500).json({message: 'Unenrollment failed'})
        }

    }catch(err){
        logger.error("Unenrollment failed",err);
        res.status(500).json({message: 'Unenrollment failed'})
    }
}


module.exports = {getStudents, getStudentById, createStudent, updateStudent, deleteStudent, enrollStudentToClass, unEnrollStudentFromClass};