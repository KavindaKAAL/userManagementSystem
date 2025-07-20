const request = require('supertest');
const mongoose = require('mongoose');

const BASE_URL = "http://localhost:8082";

describe('Create a student -> Create a class -> Enroll the student into the class -> Update the student\'s name -> Unenroll the student from the class -> Delete the student', () => {

    let studentId;
    let classId;

    const studentPayload = {
        name: 'Lahiru',
        email: 'lahiru@gmail.com',
    };

    const classPayload = {
        name: 'Science101',
        subject: 'Science',
    };
    
    it('should create a new student', async () => {
        const res = await request(BASE_URL)
        .post('/api/v1/students')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(studentPayload);

        expect(res.statusCode).toBe(201);
        expect(mongoose.isValidObjectId(res.body.student._id)).toBe(true);
        expect(res.body.student.name).toBe('Lahiru'.toLowerCase());
        expect(res.body.student.email).toBe('lahiru@gmail.com'.toLowerCase());
        studentId = res.body.student._id;
    });

    it('should create a new class', async () => {
        const res = await request(BASE_URL)
        .post('/api/v1/classes')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(classPayload);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('class');
        classId = res.body.class._id;
    });

    it('should enroll the student in the class', async () => {
        const res = await request(BASE_URL)
        .put('/api/v1/students/enroll')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            student_id: studentId,
            class_id: classId,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.update_status.enrolledClasses).toContain(classId);
    });

    it("should update the student's name", async () => {
        const res = await request(BASE_URL)
        .put('/api/v1/students')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            _id: studentId,
            name: 'Kavinda',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.update.name).toBe('Kavinda'.toLowerCase());
    });

    it('should unenroll the student from the class', async () => {
        const res = await request(BASE_URL)
        .put('/api/v1/students/unenroll')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
            student_id: studentId,
            class_id: classId,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.update_status.enrolledClasses).not.toContain(classId);
    });

    it('should delete the student', async () => {
        const res = await request(BASE_URL)
        .delete(`/api/v1/students/${studentId}`)
        .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
    });

});
