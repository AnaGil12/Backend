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
        // Verify challenge exists
        const challenge = await this.challengeRepository.findById(request.challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        // Verify course exists
        const course = await this.courseRepository.findById(request.courseId);
        if (!course) {
            throw new Error('Course not found');
        }
        // Check if user is enrolled in the course
        const isEnrolled = await this.courseRepository.isStudentEnrolled(request.courseId, userId);
        if (!isEnrolled) {
            throw new Error('Unauthorized: You are not enrolled in this course');
        }
        // Check if challenge is published
        if (challenge.status !== 'published') {
            throw new Error('Challenge is not available for submissions');
        }
        // Create submission
        const submissionData = {
            ...request,
            userId
        };
        const submission = await this.submissionRepository.create(submissionData);
        // Add to job queue for processing
        try {
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
        }
        catch (queueError) {
            // If the job queue is down (e.g., Redis unavailable), do not fail the submission creation.
            // The submission remains in QUEUED state and can be reprocessed later.
            // Intentionally swallowing the error to avoid returning 5xx to the client.
        }
        return submission;
    }
}
exports.SubmitSolutionUseCase = SubmitSolutionUseCase;
//# sourceMappingURL=SubmitSolutionUseCase.js.map