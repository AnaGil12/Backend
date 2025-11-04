import { ILeaderboardRepository } from '../../domain/repositories/ILeaderboardRepository';
import { LeaderboardEntry, ChallengeLeaderboard, CourseLeaderboard, EvaluationLeaderboard } from '../../domain/entities/Leaderboard';
export declare class MockLeaderboardRepository implements ILeaderboardRepository {
    getChallengeLeaderboard(challengeId: string, limit?: number): Promise<ChallengeLeaderboard>;
    getCourseLeaderboard(courseId: string, limit?: number): Promise<CourseLeaderboard>;
    getEvaluationLeaderboard(evaluationId: string, limit?: number): Promise<EvaluationLeaderboard>;
    updateChallengeLeaderboard(challengeId: string): Promise<void>;
    updateCourseLeaderboard(courseId: string): Promise<void>;
    updateEvaluationLeaderboard(evaluationId: string): Promise<void>;
    getUserRank(userId: string, type: string, entityId: string): Promise<number>;
    getTopPerformers(type: string, entityId: string, limit: number): Promise<LeaderboardEntry[]>;
}
//# sourceMappingURL=MockLeaderboardRepository.d.ts.map