"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCourseRepository = void 0;
class MockCourseRepository {
    constructor() {
        this.courses = [];
        this.courseStudents = [];
    }
    async findById(id) {
        return this.courses.find(c => c.id === id) || null;
    }
    async create(courseData) {
        const course = {
            id: `course-${Date.now()}`,
            ...courseData,
            studentIds: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.courses.push(course);
        return course;
    }
    async update(id, courseData) {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1)
            return null;
        const updatedCourse = {
            ...this.courses[index],
            ...courseData,
            updatedAt: new Date()
        };
        this.courses[index] = updatedCourse;
        return updatedCourse;
    }
    async delete(id) {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1)
            return false;
        this.courses.splice(index, 1);
        return true;
    }
    async findAll(limit = 50, offset = 0) {
        return this.courses.slice(offset, offset + limit);
    }
    async findByProfessorId(professorId) {
        return this.courses.filter(c => c.professorIds.includes(professorId));
    }
    async findByStudentId(studentId) {
        return this.courses.filter(c => c.studentIds.includes(studentId));
    }
    async findByPeriod(period) {
        return this.courses.filter(c => c.period === period);
    }
    async findByCode(code) {
        return this.courses.find(c => c.code === code) || null;
    }
    async enrollStudent(courseId, studentId) {
        const courseStudent = {
            courseId,
            studentId,
            enrolledAt: new Date()
        };
        this.courseStudents.push(courseStudent);
        const course = this.courses.find(c => c.id === courseId);
        if (course && !course.studentIds.includes(studentId)) {
            course.studentIds.push(studentId);
        }
        return courseStudent;
    }
    async unenrollStudent(courseId, studentId) {
        const index = this.courseStudents.findIndex(cs => cs.courseId === courseId && cs.studentId === studentId);
        if (index === -1)
            return false;
        this.courseStudents.splice(index, 1);
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            course.studentIds = course.studentIds.filter((id) => id !== studentId);
        }
        return true;
    }
    async getEnrolledStudents(courseId) {
        return this.courseStudents.filter(cs => cs.courseId === courseId);
    }
    async isStudentEnrolled(courseId, studentId) {
        return this.courseStudents.some(cs => cs.courseId === courseId && cs.studentId === studentId);
    }
}
exports.MockCourseRepository = MockCourseRepository;
//# sourceMappingURL=MockCourseRepository.js.map