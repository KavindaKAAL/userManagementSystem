const mongoose = require("mongoose");
const Student = require('./student');
const Teacher = require('./teacher');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}]

});

classSchema.pre('deleteOne', {document:true, query:false}, async function(next){
    const classId = this._id;

    await Student.updateMany(
        {enrolledClasses: classId},
        {$pull: {enrolledClasses: classId}}
    );

    await Teacher.updateOne(
        {assignedClasses: classId},
        {$pull: {assignedClasses: classId}}
    );

    next();
})

const Class = mongoose.model('Class', classSchema);

module.exports = Class;