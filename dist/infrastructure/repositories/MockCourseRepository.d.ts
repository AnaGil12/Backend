import { ICourseRepository } from '../../domain/repositories/ICourseRepository';
import { Course, CreateCourseRequest, UpdateCourseRequest, CourseStudent } from '../../domain/entities/Course';
export declare class MockCourseRepository implements ICourseRepository {
    private courses;
    private courseStudents;
    findById(id: string): Promise<Course | null>;
    create(courseData: CreateCourseRequest): Promise<Course>;
    update(id: string, courseData: UpdateCourseRequest): Promise<Course | null>;
    delete(id: string): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<Course[]>;
    findByProfessorId(professorId: string): Promise<Course[]>;
    findByStudentId(studentId: string): Promise<Course[]>;
    findByPeriod(period: string): Promise<Course[]>;
    findByCode(code: string): Promise<Course | null>;
    enrollStudent(courseId: string, studentId: string): Promise<CourseStudent>;
    unenrollStudent(courseId: string, studentId: string): Promise<boolean>;
    getEnrolledStudents(courseId: string): Promise<CourseStudent[]>;
    isStudentEnrolled(courseId: string, studentId: string): Promise<boolean>;
}
//# sourceMappingURL=MockCourseRepository.d.ts.map