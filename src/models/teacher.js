const mongoose = require("mongoose");
const Class = require('./class');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]

});

teacherSchema.pre('deleteOne',{document:true, query:false},async (next)=>{
    const teacherId = this._id;

    await Class.updateMany(
        {teacher:teacherId},
        {$unset:{teacher:teacherId}}
    );

    next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;