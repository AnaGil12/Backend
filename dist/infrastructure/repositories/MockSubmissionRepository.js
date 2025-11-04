"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSubmissionRepository = void 0;
const Submission_1 = require("../../domain/entities/Submission");
class MockSubmissionRepository {
    constructor() {
        this.submissions = [];
    }
    async findById(id) {
        return this.submissions.find(s => s.id === id) || null;
    }
    async create(submissionData) {
        const submission = {
            id: `subm-${Date.now()}`,
            ...submissionData,
            status: Submission_1.SubmissionStatus.QUEUED,
            score: 0,
            timeMsTotal: 0,
            memoryKbTotal: 0,
            testCaseResults: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.submissions.push(submission);
        return submission;
    }
    async update(id, updates) {
        const index = this.submissions.findIndex(s => s.id === id);
        if (index === -1)
            return null;
        const updatedSubmission = {
            ...this.submissions[index],
            ...updates,
            updatedAt: new Date()
        };
        this.submissions[index] = updatedSubmission;
        return updatedSubmission;
    }
    async findByUserId(userId) {
        return this.submissions.filter(s => s.userId === userId);
    }
    async findByChallengeId(challengeId) {
        return this.submissions.filter(s => s.challengeId === challengeId);
    }
    async findByCourseId(courseId) {
        return this.submissions.filter(s => s.courseId === courseId);
    }
    async findByStatus(status) {
        return this.submissions.filter(s => s.status === status);
    }
    async findByLanguage(language) {
        return this.submissions.filter(s => s.language === language);
    }
    async findBestSubmissionByUserAndChallenge(userId, challengeId) {
        const userSubmissions = this.submissions.filter(s => s.userId === userId && s.challengeId === challengeId);
        if (userSubmissions.length === 0)
            return null;
        return userSubmissions.reduce((best, current) => {
            if (current.score > best.score)
                return current;
            if (current.score === best.score && current.timeMsTotal < best.timeMsTotal)
                return current;
            return best;
        });
    }
    async findRecentSubmissions(limit = 50, offset = 0) {
        return this.submissions
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(offset, offset + limit);
    }
    async getSubmissionStats(userId, challengeId) {
        let filteredSubmissions = this.submissions;
        if (userId) {
            filteredSubmissions = filteredSubmissions.filter(s => s.userId === userId);
        }
        if (challengeId) {
            filteredSubmissions = filteredSubmissions.filter(s => s.challengeId === challengeId);
        }
        const total = filteredSubmissions.length;
        const accepted = filteredSubmissions.filter(s => s.status === Submission_1.SubmissionStatus.ACCEPTED).length;
        const failed = filteredSubmissions.filter(s => s.status !== Submission_1.SubmissionStatus.ACCEPTED).length;
        const averageTime = total > 0 ? filteredSubmissions.reduce((sum, s) => sum + s.timeMsTotal, 0) / total : 0;
        return { total, accepted, failed, averageTime };
    }
}
exports.MockSubmissionRepository = MockSubmissionRepository;
//# sourceMappingURL=MockSubmissionRepository.js.map