const { setupTestEnvironment, teardownTestEnvironment } = require('./testSetup');
const { clearDatabase } = require('../../src/utils/db');
const { getClasses, getClassById, createClass, updateClass, deleteClass, assignTeacherToClass, unAssignTeacherFromClass } = require('../../src/controllers/classController');
const httpMocks = require('node-mocks-http');
const Student = require('../../src/models/student');
const Class = require('../../src/models/class');
const Teacher = require('../../src/models/teacher');

// Connect to a new in-memory database before running any tests.
beforeAll(async ()=>{
    await setupTestEnvironment();

});

afterAll(async ()=>{
    await teardownTestEnvironment();
}); 

afterEach(async ()=>{
    await clearDatabase();
})

describe("class operations", ()=>{
    test("return classes in the system", async ()=>{
        await Class.create({ name: 'Maths-12', subject: 'Chemistry' });
        const classes = await Class.find();
        
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await getClasses(req,res);
        const res_data = res._getJSONData();

        expect({_id: res_data[0]._id, name:res_data[0].name , subject:res_data[0].subject}).toEqual({
                    _id: String(classes[0]._id),
                    name: 'Maths-12'.toLowerCase(),
                    subject: 'Chemistry'.toLowerCase(),

                });
    });

    test("return a specific class in the system", async ()=>{
    
        await Class.create({ name: 'Maths-12', subject: 'Chemistry' });
        const classes = await Class.find();

        const req = httpMocks.createRequest({method: 'GET',
            params: {_id:String(classes[0]._id)}});
        const res = httpMocks.createResponse();

        await getClassById(req,res);

        const res_data = res._getJSONData();

        expect({_id: res_data._id, name:res_data.name , subject:res_data.subject}).toEqual({
                    _id: String(classes[0]._id),
                    name: 'Maths-12'.toLowerCase(),
                    subject: 'Chemistry'.toLowerCase()
                })
    });

    test("register a class in the system", async ()=>{

        const req = httpMocks.createRequest({method: 'POST',
            body: { name: 'Maths-12', subject: 'Chemistry' }});
        const res = httpMocks.createResponse();

        await createClass(req,res);
        const res_data = res._getJSONData();

        expect({name:res_data.class.name , subject:res_data.class.subject}).toEqual({
            name: 'Maths-12'.toLowerCase(), 
            subject: 'Chemistry'.toLowerCase()
        })
    });

    test("update a class in the system", async ()=>{

        await Class.create({ name: 'Maths-12', subject: 'Chemistry' });
        const classes = await Class.find();

        class_id = String(classes[0]._id);

        const req = httpMocks.createRequest({method: 'POST',
            body: { _id: class_id , name: 'Bio-12', subject: 'Physics' }});
        const res = httpMocks.createResponse();

        await updateClass(req,res);

        const res_data = res._getJSONData().update;


        expect({_id: res_data._id, name:res_data.name , subject:res_data.subject}).toEqual({
                    _id: class_id,
                    name: 'Bio-12'.toLowerCase(),
                    subject: 'Physics'.toLowerCase()
                })
    });

    test("delete a class from the system", async ()=>{
    
        await Class.create({ name: 'Maths-12', subject: 'Chemistry' });
        const classes = await Class.find();

        class_id = String(classes[0]._id);

        const req = httpMocks.createRequest({method: 'DELETE',
            params: {_id:class_id}});
        const res = httpMocks.createResponse();

        await deleteClass(req,res);

        expect(res._getStatusCode()).toEqual(200);
    });

    // test("student enroll to a class", async ()=>{

    //     await Student.create({ name: 'Alice', email: 'alice@example.com' });
    //     await Class.create({ name: 'Maths 8', subject: 'Maths' });
    //     const users = await Student.find();
    //     const classes = await Class.find();

    //     const student_id = String(users[0]._id);
    //     const class_id = String(classes[0]._id);

    //     const req = httpMocks.createRequest({method: 'PUT',
    //         body: { student_id: student_id , class_id: class_id }});
    //     const res = httpMocks.createResponse();

    //     await enrollStudentToClass(req,res);
    //     const updated_classes = await Class.find();

    //     expect(res._getJSONData().update_status).toEqual(
    //         expect.objectContaining({
    //                 _id: student_id,
    //                 name: String(users[0].name).toLowerCase(),
    //                 email: String(users[0].email).toLowerCase(),
    //                 enrolledClasses: expect.arrayContaining([expect.any(String)]),
    //                 __v: expect.any(Number)
    //             })
                
    //         )
        
    //     expect(String(updated_classes[0].students[0])).toEqual(student_id);
    // });

    // test("student un-enroll from a class", async ()=>{

    //     await Student.create({ name: 'Alice', email: 'alice@example.com' });
    //     await Class.create({ name: 'Maths 8', subject: 'Maths' });
    //     const users = await Student.find();
    //     const classes = await Class.find();

    //     const student_id = String(users[0]._id);
    //     const class_id = String(classes[0]._id);

    //     const req = httpMocks.createRequest({method: 'PUT',
    //         body: { student_id: student_id , class_id: class_id }});
    //     const res = httpMocks.createResponse();

    //     await enrollStudentToClass(req,res);

    //     const req2 = httpMocks.createRequest({method: 'PUT',
    //         body: { student_id: student_id , class_id: class_id }});
    //     const res2 = httpMocks.createResponse();

    //     await unEnrollStudentFromClass(req2,res2);

    //     expect(res2._getJSONData().update_status.enrolledClasses).toEqual([]);

    //     const updated_classes = await Class.find();
    //     expect(updated_classes[0].students).toEqual([]);

    // });
});


