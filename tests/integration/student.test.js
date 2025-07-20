const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Student = require('../../src/models/student');
const { initiate_app } = require("../../src/app");
const { clearDatabase, dropDatabase, closeDatabase } = require('../../src/utils/db');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  app = await initiate_app(uri);;
});

afterEach(async () => {
  await clearDatabase();;
});

afterAll(async () => {
  await dropDatabase();
  await closeDatabase();
  await mongoServer.stop();
});

describe('Student API', () => {
  it('should create a student successfully', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ name: 'Lahiru', email: 'lahiru@gmail.com' });

    expect(res.statusCode).toBe(201);
    expect(mongoose.isValidObjectId(res.body.student._id)).toBe(true);
    expect(res.body.student.name).toBe('Lahiru'.toLowerCase());
    expect(res.body.student.email).toBe('lahiru@gmail.com'.toLowerCase());
  });

  it('should recieve an error response as extra fields are not allowed', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ name: 'Lahiru', email: 'lahiru@gmail.com', age: 24 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Extra fields are not allowed: age');
  });

  it('should recieve an error response as student already exists in the system with the email', async () => {

    await Student.create({ name: 'Alice', email: 'lahiru@gmail.com' });

    const res = await request(app)
      .post('/api/v1/students')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ name: 'Lahiru', email: 'lahiru@gmail.com'});

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe("Conflict");
    expect(res.body.message).toBe('Student already exists in the system with this email');
  });

  it('should recieve error response as invalid JSON payload', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send("{ name: 'Lahiru', email: 'lahiru@gmail.com',}");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid JSON payload");
  });

  it('should recieve an array of students', async () => {

    await Student.create({ name: 'Alice', email: 'lahiru@gmail.com' });

    const res = await request(app)
      .get('/api/v1/students')
      .set('Accept', 'application/json');;

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
  });

  it('should recieve an specific student related to the id', async () => {
    await Student.create({ name: 'Alice', email: 'lahiru@gmail.com' });
    const students = await Student.find();
    const student_id = String(students[0]._id);
    
    const res = await request(app)
      .get(`/api/v1/students/${student_id}`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(student_id);
    expect(res.body.email).toBe('lahiru@gmail.com'.toLowerCase())
  });

  it('should recieve an error response as student not found due to not existence id', async () => {

    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/v1/students/${nonExistentId}`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Student not found");
  });

  it('should recieve an error response as invalid student id format', async () => {

    const invalidFormatId = "rtyuu"

    const res = await request(app)
      .get(`/api/v1/students/${invalidFormatId}`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid student ID format");
  });


});
