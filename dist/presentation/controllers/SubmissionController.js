"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
class SubmissionController {
    constructor(submitSolutionUseCase, submissionRepository) {
        this.submitSolutionUseCase = submitSolutionUseCase;
        this.submissionRepository = submissionRepository;
    }
    async submitSolution(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const submission = await this.submitSolutionUseCase.execute(req.body, userId);
            res.status(201).json({
                success: true,
                data: submission
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to submit solution'
            });
        }
    }
    async getSubmissions(req, res) {
        try {
            const { userId, challengeId, courseId, status, language, limit = 50, offset = 0 } = req.query;
            const currentUserId = req.user?.userId;
            let submissions;
            if (userId && userId === currentUserId) {
                submissions = await this.submissionRepository.findByUserId(userId);
            }
            else if (challengeId) {
                submissions = await this.submissionRepository.findByChallengeId(challengeId);
            }
            else if (courseId) {
                submissions = await this.submissionRepository.findByCourseId(courseId);
            }
            else if (status) {
                submissions = await this.submissionRepository.findByStatus(status);
            }
            else if (language) {
                submissions = await this.submissionRepository.findByLanguage(language);
            }
            else {
                submissions = await this.submissionRepository.findRecentSubmissions(parseInt(limit), parseInt(offset));
            }
            res.status(200).json({
                success: true,
                data: submissions
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch submissions'
            });
        }
    }
    async getSubmissionById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Submission ID is required'
                });
                return;
            }
            const submission = await this.submissionRepository.findById(id);
            if (!submission) {
                res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: submission
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch submission'
            });
        }
    }
    async getMySubmissions(req, res) {
        try {
            const userId = req.user?.userId;
            const { challengeId, limit = 50, offset = 0 } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            let submissions;
            if (challengeId) {
                submissions = await this.submissionRepository.findByUserId(userId);
                submissions = submissions.filter(s => s.challengeId === challengeId);
            }
            else {
                submissions = await this.submissionRepository.findByUserId(userId);
            }
            // Apply pagination
            const startIndex = parseInt(offset);
            const endIndex = startIndex + parseInt(limit);
            const paginatedSubmissions = submissions.slice(startIndex, endIndex);
            res.status(200).json({
                success: true,
                data: paginatedSubmissions,
                pagination: {
                    total: submissions.length,
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user submissions'
            });
        }
    }
    async getSubmissionStats(req, res) {
        try {
            const { userId, challengeId } = req.query;
            const currentUserId = req.user?.userId;
            const targetUserId = userId || currentUserId;
            if (!targetUserId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const stats = await this.submissionRepository.getSubmissionStats(targetUserId, challengeId);
            res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch submission stats'
            });
        }
    }
}
exports.SubmissionController = SubmissionController;
//# sourceMappingURL=SubmissionController.js.map