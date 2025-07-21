const { setupTestEnvironment, teardownTestEnvironment } = require('./testSetup');
const { clearDatabase } = require('../../src/utils/db');
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, enrollStudentToClass, unEnrollStudentFromClass } = require('../../src/controllers/studentController');
const httpMocks = require('node-mocks-http');
const Student = require('../../src/models/student');
const Class = require('../../src/models/class');


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

describe("student operations", ()=>{
    test("Should return students in the system", async ()=>{
        await Student.create({ name: 'Alice', email: 'alice@example.com' });

        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await getStudents(req,res);
        
        expect(res._getJSONData()).toEqual(
            [expect.objectContaining({
                    _id: expect.any(String),
                    name: expect.any(String),
                    email: expect.any(String),
                    enrolledClasses: expect.any(Array),
                    __v: expect.any(Number)
                })]
                
            )
    });

    test("Should return a specific student in the system", async ()=>{
    
        await Student.create({ name: 'Alice', email: 'alice@example.com' });
        const users = await Student.find();

        const req = httpMocks.createRequest({method: 'GET',
            params: {_id:String(users[0]._id)}});
        const res = httpMocks.createResponse();

        await getStudentById(req,res);

        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                    _id: String(users[0]._id),
                    name: 'Alice'.toLowerCase(),
                    email: 'alice@example.com',
                    enrolledClasses: expect.any(Array),
                    __v: expect.any(Number)
                })
                
            )
    });

    test("Should register a student in the system", async ()=>{

        const req = httpMocks.createRequest({method: 'POST',
            body: { name: 'Alice', email: 'alice@example.com' }});
        const res = httpMocks.createResponse();

        await createStudent(req,res);

        expect(res._getJSONData()).toEqual(
                    expect.objectContaining({
                        message: "Student created successfully",
                        student: expect.objectContaining({
                        _id: expect.any(String),
                        name: "alice",
                        email: "alice@example.com",
                        enrolledClasses: expect.any(Array),
                        __v: expect.any(Number),
                    }),
            })
                
            )
    });

    test("Should update a student in the system", async ()=>{

        await Student.create({ name: 'Alice', email: 'alice@example.com' });
        const users = await Student.find();

        user_id = String(users[0]._id);

        const req = httpMocks.createRequest({method: 'POST',
            body: { _id: user_id , name: 'Bob', email: 'bob@example.com' }});
        const res = httpMocks.createResponse();

        await updateStudent(req,res);

        expect(res._getJSONData().update).toEqual(
            expect.objectContaining({
                    _id: user_id,
                    name: 'Bob'.toLowerCase(),
                    email: 'bob@example.com',
                    enrolledClasses: expect.any(Array),
                    __v: expect.any(Number)
                })
                
            )
    });

    test("Should delete a student from the system", async ()=>{
    
        await Student.create({ name: 'Alice', email: 'alice@example.com' });
        const users = await Student.find();
        user_id = String(users[0]._id);

        const req = httpMocks.createRequest({method: 'DELETE',
            params: {_id:user_id}});
        const res = httpMocks.createResponse();

        await deleteStudent(req,res);

        expect(res._getStatusCode()).toEqual(200);
    });

    test("Should student enroll to a class", async ()=>{

        await Student.create({ name: 'Alice', email: 'alice@example.com' });
        await Class.create({ name: 'Maths 8', subject: 'Maths' });
        const users = await Student.find();
        const classes = await Class.find();

        const student_id = String(users[0]._id);
        const class_id = String(classes[0]._id);

        const req = httpMocks.createRequest({method: 'PUT',
            body: { student_id: student_id , class_id: class_id }});
        const res = httpMocks.createResponse();

        await enrollStudentToClass(req,res);
        const updated_classes = await Class.find();

        expect(res._getJSONData().update_status).toEqual(
            expect.objectContaining({
                    _id: student_id,
                    name: String(users[0].name).toLowerCase(),
                    email: String(users[0].email).toLowerCase(),
                    enrolledClasses: expect.arrayContaining([expect.any(String)]),
                    __v: expect.any(Number)
                })
                
            )
        
        expect(String(updated_classes[0].students[0])).toEqual(student_id);
    });

    test("Should student un-enroll from a class", async ()=>{

        await Student.create({ name: 'Alice', email: 'alice@example.com' });
        await Class.create({ name: 'Maths 8', subject: 'Maths' });
        const users = await Student.find();
        const classes = await Class.find();

        const student_id = String(users[0]._id);
        const class_id = String(classes[0]._id);

        const req = httpMocks.createRequest({method: 'PUT',
            body: { student_id: student_id , class_id: class_id }});
        const res = httpMocks.createResponse();

        await enrollStudentToClass(req,res);

        const req2 = httpMocks.createRequest({method: 'PUT',
            body: { student_id: student_id , class_id: class_id }});
        const res2 = httpMocks.createResponse();

        await unEnrollStudentFromClass(req2,res2);

        expect(res2._getJSONData().update_status.enrolledClasses).toEqual([]);

        const updated_classes = await Class.find();
        expect(updated_classes[0].students).toEqual([]);

    });
});


