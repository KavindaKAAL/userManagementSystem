const mongoose = require("mongoose");

const Student = require('../models/student');
const Class = require('../models/class');
const Teacher = require('../models/teacher');

const getClasses = async (req,res)=>{
    try{
        const classes = await Class.find()
        .populate('teacher')
        .populate('students');
        res.status(200).json(classes);
    }catch(error){
        res.status(500).json({message:'Error retrieving classes', error: error.message });
    }
};

const getClassById = async (req,res)=>{
    try{
        const class_ = await Class.findById(req.params._id)
        .populate('teacher')
        .populate('students');
        if (!class_){
            return res.status(404).json({message: 'Class not found'})
        }
        res.status(200).json(class_);
    }catch(error){
        res.status(500).json({message: 'Error retrieving class', error: error.message })
    }
};

const createClass = async (req,res)=>{
    try{
        const newClass = await Class.create(req.body);
        res.status(201).json(newClass);
    }catch(error){
        res.status(400).json({message: 'Error creating calss', error: error.message })
    }
};

const updateClass = async (req,res)=>{

    const filter = req.body._id;
    const update = req.body;

    try{
        const updatedStatus = await Class.findByIdAndUpdate(filter, 
            {$set:update},
            {new:true}
        );
        
        res.status(200).json({message: `Class having id ${filter} is successfully updated.`, update: updatedStatus});
    }catch(error){
        res.status(500).json({message: 'Error updating class or Class not found.', error: error.message })
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
        res.status(500).json({message: 'Error deleting class', error: error.message })
    }
};

const assignTeacherToClass = async (req,res)=>{
    try{
        const classId = req.body.class_id;
        const teacherId = req.body.teacher_id;
        const update_class = {classes:classId};
        const update_teacher = {teacher:teacherId};

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
        res.status(500).json({message: 'Error assigning teacher.', error: err.message })
    }
};

const unAssignTeacherFromClass = async (req,res)=>{
    try{
        const classId = req.body.class_id;
        const teacherId = req.body.teacher_id;
        const update_class = {classes:classId};
        const update_teacher = {teacher:teacherId};

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
            res.status(500).json({message: 'Error unassigning teacher.', error: err.message})
        }
    }catch(err){
        res.status(500).json({message: 'Error unassigning teacher.', error: err.message })
    }
}

module.exports = {getClasses, getClassById, createClass, updateClass, deleteClass, assignTeacherToClass, unAssignTeacherFromClass};