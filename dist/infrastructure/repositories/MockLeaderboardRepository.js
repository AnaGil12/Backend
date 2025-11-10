"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockLeaderboardRepository = void 0;
class MockLeaderboardRepository {
    async getChallengeLeaderboard(challengeId, limit = 50) {
        // Mock implementation
        return {
            challengeId,
            entries: [],
            totalParticipants: 0,
            lastUpdated: new Date()
        };
    }
    async getCourseLeaderboard(courseId, limit = 50) {
        // Mock implementation
        return {
            courseId,
            entries: [],
            totalParticipants: 0,
            lastUpdated: new Date()
        };
    }
    async getEvaluationLeaderboard(evaluationId, limit = 50) {
        // Mock implementation
        return {
            evaluationId,
            entries: [],
            totalParticipants: 0,
            lastUpdated: new Date()
        };
    }
    async updateChallengeLeaderboard(challengeId) {
        // Mock implementation - would update leaderboard in real scenario
    }
    async updateCourseLeaderboard(courseId) {
        // Mock implementation - would update leaderboard in real scenario
    }
    async updateEvaluationLeaderboard(evaluationId) {
        // Mock implementation - would update leaderboard in real scenario
    }
    async getUserRank(userId, type, entityId) {
        // Mock implementation
        return 1;
    }
    async getTopPerformers(type, entityId, limit) {
        // Mock implementation
        return [];
    }
}
exports.MockLeaderboardRepository = MockLeaderboardRepository;
//# sourceMappingURL=MockLeaderboardRepository.js.map