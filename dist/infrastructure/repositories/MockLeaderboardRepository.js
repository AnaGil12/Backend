"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLeaderboardRepository = void 0;
class MockLeaderboardRepository {
    async getChallengeLeaderboard(challengeId, limit = 50) {
        return {
            challengeId,
            entries: [],
            totalParticipants: 0,
            lastUpdated: new Date()
        };
    }
    async getCourseLeaderboard(courseId, limit = 50) {
        return {
            courseId,
            entries: [],
            totalParticipants: 0,
            lastUpdated: new Date()
        };
    }
    async getEvaluationLeaderboard(evaluationId, limit = 50) {
        return {
            evaluationId,
            entries: [],
            totalParticipants: 0,
            lastUpdated: new Date()
        };
    }
    async updateChallengeLeaderboard(challengeId) {
    }
    async updateCourseLeaderboard(courseId) {
    }
    async updateEvaluationLeaderboard(evaluationId) {
    }
    async getUserRank(userId, type, entityId) {
        return 1;
    }
    async getTopPerformers(type, entityId, limit) {
        return [];
    }
}
exports.MockLeaderboardRepository = MockLeaderboardRepository;
//# sourceMappingURL=MockLeaderboardRepository.js.map