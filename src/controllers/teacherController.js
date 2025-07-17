const Teacher = require('../models/teacher');

const getTeachers = async (req,res)=>{
    try{
        const users = await Teacher.find()
        .populate('classes');
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message:'Error retrieving teachers.', error: error.message });
    }
};

const getTeacherById = async (req,res)=>{
    try{
        const user = await Teacher.findById(req.params._id)
        .populate('classes');
        if (!user){
            return res.status(404).json({message: 'Teacher not found'})
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: 'Error retrieving teacher', error: error.message })
    }
};

const createTeacher = async (req,res)=>{
    try{
        const newUser = await Teacher.create(req.body);
        res.status(201).json(newUser);
    }catch(error){
        res.status(400).json({message: 'Error creating teacher', error: error.message })
    }
};

const updateTeacher = async (req,res)=>{

    const filter = req.body._id;
    const update = req.body;

    try{
        const updatedStatus = await Teacher.findByIdAndUpdate(filter, 
            {$set:update},
            {new:true}
        );
        
        res.status(200).json({message: `Teacher having id ${filter} is successfully updated.`, update: updatedStatus});
    }catch(error){
        res.status(500).json({message: 'Error updating teacher or Teacher not found.', error: error.message })
    }
    
};

const deleteTeacher = async (req,res)=>{
    try{
        const deletionStatus = await Teacher.findByIdAndDelete(req.params._id);
        if (!deletionStatus){
            return res.status(404).json({message: 'Teacher not found'})
        }
        res.status(200).json({message: `Teacher having id ${req.params._id} is successfully deleted.`});
    }catch(error){
        res.status(500).json({message: 'Error deleting teacher', error: error.message })
    }
};

module.exports = {getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher};