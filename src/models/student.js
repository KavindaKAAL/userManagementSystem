const mongoose = require("mongoose");
const Class = require('./class');
 
const studentSchema = new mongoose.Schema({
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
    enrolledClasses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]

});

studentSchema.pre('deleteOne', {document:true, query:false},async function(next){
    const studentId = this._id;

    await Class.updateMany(
        {students:studentId},
        {$pull:{students:studentId}}
    );
    next();
})
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;