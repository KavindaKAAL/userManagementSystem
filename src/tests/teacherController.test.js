const { setupTestEnvironment, teardownTestEnvironment } = require('./testSetup');
const { clearDatabase } = require('../config/db');
const { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const httpMocks = require('node-mocks-http');
const Teacher = require('../models/teacher');


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

describe("teacher operations", ()=>{
    test("return teachers in the system", async ()=>{
        await Teacher.create({ name: 'Alice', email: 'alice@example.com' });

        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await getTeachers(req,res);
        
        expect(res._getJSONData()).toEqual(
            [expect.objectContaining({
                    _id: expect.any(String),
                    name: expect.any(String),
                    email: expect.any(String),
                    classes: expect.any(Array),
                    __v: expect.any(Number)
                })]
                
            )
    });

    test("return a specific teacher in the system", async ()=>{
    
        await Teacher.create({ name: 'Alice', email: 'alice@example.com' });
        const users = await Teacher.find();

        const req = httpMocks.createRequest({method: 'GET',
            params: {_id:String(users[0]._id)}});
        const res = httpMocks.createResponse();

        await getTeacherById(req,res);

        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                    _id: String(users[0]._id),
                    name: 'Alice'.toLowerCase(),
                    email: 'alice@example.com',
                    classes: expect.any(Array),
                    __v: expect.any(Number)
                })
                
            )
    });

    test("register a teacher in the system", async ()=>{

        const req = httpMocks.createRequest({method: 'POST',
            body: { name: 'Alice', email: 'alice@example.com' }});
        const res = httpMocks.createResponse();

        await createTeacher(req,res);

        expect(res._getJSONData()).toEqual(
            expect.objectContaining({
                    _id: expect.any(String),
                    name: 'Alice'.toLowerCase(),
                    email: 'alice@example.com',
                    classes: expect.any(Array),
                    __v: expect.any(Number)
                })
                
            )
    });

    test("update a teacher in the system", async ()=>{

        await Teacher.create({ name: 'Alice', email: 'alice@example.com' });
        const users = await Teacher.find();

        user_id = String(users[0]._id);

        const req = httpMocks.createRequest({method: 'POST',
            body: { _id: user_id , name: 'Bob', email: 'bob@example.com' }});
        const res = httpMocks.createResponse();

        await updateTeacher(req,res);

        expect(res._getJSONData().update).toEqual(
            expect.objectContaining({
                    _id: user_id,
                    name: 'Bob'.toLowerCase(),
                    email: 'bob@example.com',
                    classes: expect.any(Array),
                    __v: expect.any(Number)
                })
                
            )
    });

    test("delete a teacher from the system", async ()=>{
    
        await Teacher.create({ name: 'Alice', email: 'alice@example.com' });
        const users = await Teacher.find();
        user_id = String(users[0]._id);

        const req = httpMocks.createRequest({method: 'DELETE',
            params: {_id:user_id}});
        const res = httpMocks.createResponse();

        await deleteTeacher(req,res);

        expect(res._getStatusCode()).toEqual(200);
    });
});


