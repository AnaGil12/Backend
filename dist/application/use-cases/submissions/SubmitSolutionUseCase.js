"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitSolutionUseCase = void 0;
class SubmitSolutionUseCase {
    constructor(submissionRepository, challengeRepository, courseRepository, jobQueueService) {
        this.submissionRepository = submissionRepository;
        this.challengeRepository = challengeRepository;
        this.courseRepository = courseRepository;
        this.jobQueueService = jobQueueService;
    }
    async execute(request, userId) {
        const challenge = await this.challengeRepository.findById(request.challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        const course = await this.courseRepository.findById(request.courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        const isEnrolled = await this.courseRepository.isStudentEnrolled(request.courseId, userId);
        if (!isEnrolled) {
            throw new Error('Unauthorized: You are not enrolled in this course');
        }
        if (challenge.status !== 'published') {
            throw new Error('Challenge is not available for submissions');
        }
        const submissionData = {
            ...request,
            userId
        };
        const submission = await this.submissionRepository.create(submissionData);
        await this.jobQueueService.addSubmissionJob({
            submissionId: submission.id,
            userId: submission.userId,
            challengeId: submission.challengeId,
            courseId: submission.courseId,
            language: submission.language,
            code: submission.code,
            timeLimit: challenge.timeLimit,
            memoryLimit: challenge.memoryLimit,
            testCases: challenge.testCases.map(tc => ({
                id: tc.id,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden
            }))
        });
        return submission;
    }
}
exports.SubmitSolutionUseCase = SubmitSolutionUseCase;
//# sourceMappingURL=SubmitSolutionUseCase.js.map