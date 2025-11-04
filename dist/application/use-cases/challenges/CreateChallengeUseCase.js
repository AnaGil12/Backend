"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChallengeUseCase = void 0;
class CreateChallengeUseCase {
    constructor(challengeRepository, courseRepository) {
        this.challengeRepository = challengeRepository;
        this.courseRepository = courseRepository;
    }
    async execute(request, userId) {
        const course = await this.courseRepository.findById(request.courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        if (!course.professorIds.includes(userId)) {
            throw new Error('Unauthorized: Only course professors can create challenges');
        }
        if (!request.testCases || request.testCases.length === 0) {
            throw new Error('At least one test case is required');
        }
        const challengeData = {
            ...request,
            testCases: request.testCases.map((testCase, index) => ({
                ...testCase,
                order: index + 1
            }))
        };
        return await this.challengeRepository.create(challengeData);
    }
}
exports.CreateChallengeUseCase = CreateChallengeUseCase;
//# sourceMappingURL=CreateChallengeUseCase.js.map