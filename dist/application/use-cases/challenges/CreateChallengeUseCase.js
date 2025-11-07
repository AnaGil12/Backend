"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChallengeUseCase = void 0;
const User_1 = require("../../../domain/entities/User");
class CreateChallengeUseCase {
    constructor(challengeRepository, courseRepository) {
        this.challengeRepository = challengeRepository;
        this.courseRepository = courseRepository;
    }
    async execute(request, userId, userRole) {
        // Verify course exists
        const course = await this.courseRepository.findById(request.courseId);
        if (!course) {
            throw new Error(`Course not found: ${request.courseId}. Please create the course first or use an existing course ID.`);
        }
        // ADMIN can create challenges for any course
        // PROFESSOR can create challenges only for courses where they are listed as professor
        if (userRole !== User_1.UserRole.ADMIN) {
            if (course.professorIds.length > 0 && !course.professorIds.includes(userId)) {
                throw new Error('Unauthorized: Only course professors can create challenges. Make sure you are added as a professor to this course.');
            }
        }
        // Validate test cases
        if (!request.testCases || request.testCases.length === 0) {
            throw new Error('At least one test case is required');
        }
        // Create challenge with createdBy
        const challengeData = {
            ...request,
            testCases: request.testCases.map((testCase, index) => ({
                ...testCase,
                order: index + 1
            }))
        };
        return await this.challengeRepository.create(challengeData, userId);
    }
}
exports.CreateChallengeUseCase = CreateChallengeUseCase;
//# sourceMappingURL=CreateChallengeUseCase.js.map