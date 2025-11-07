"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSubmissionUseCase = void 0;
const Submission_1 = require("../../../domain/entities/Submission");
class ProcessSubmissionUseCase {
    constructor(submissionRepository, runnerService, leaderboardRepository) {
        this.submissionRepository = submissionRepository;
        this.runnerService = runnerService;
        this.leaderboardRepository = leaderboardRepository;
    }
    async execute(submissionId) {
        // Get submission
        const submission = await this.submissionRepository.findById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }
        // Update status to RUNNING
        await this.submissionRepository.update(submissionId, {
            status: Submission_1.SubmissionStatus.RUNNING
        });
        try {
            // Execute code using runner service
            const runnerResult = await this.runnerService.executeCode({
                language: submission.language,
                code: submission.code,
                timeLimit: 1500, // Default time limit, should come from challenge
                memoryLimit: 256, // Default memory limit, should come from challenge
                testCases: [] // Should come from challenge test cases
            });
            // Update submission with results
            const updateData = {
                status: runnerResult.status,
                score: runnerResult.score,
                timeMsTotal: runnerResult.timeMsTotal,
                memoryKbTotal: runnerResult.memoryKbTotal,
                testCaseResults: runnerResult.testCaseResults.map(tc => ({
                    ...tc,
                    status: tc.status
                }))
            };
            if (runnerResult.errorMessage) {
                updateData.errorMessage = runnerResult.errorMessage;
            }
            const updatedSubmission = await this.submissionRepository.update(submissionId, updateData);
            if (!updatedSubmission) {
                throw new Error('Failed to update submission');
            }
            // Update leaderboards
            await this.leaderboardRepository.updateChallengeLeaderboard(submission.challengeId);
            await this.leaderboardRepository.updateCourseLeaderboard(submission.courseId);
            const submissionResult = {
                submissionId: updatedSubmission.id,
                status: updatedSubmission.status,
                score: updatedSubmission.score,
                timeMsTotal: updatedSubmission.timeMsTotal,
                memoryKbTotal: updatedSubmission.memoryKbTotal,
                testCaseResults: updatedSubmission.testCaseResults
            };
            if (updatedSubmission.errorMessage) {
                submissionResult.errorMessage = updatedSubmission.errorMessage;
            }
            return submissionResult;
        }
        catch (error) {
            // Update submission with error
            await this.submissionRepository.update(submissionId, {
                status: Submission_1.SubmissionStatus.RUNTIME_ERROR,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
}
exports.ProcessSubmissionUseCase = ProcessSubmissionUseCase;
//# sourceMappingURL=ProcessSubmissionUseCase.js.map