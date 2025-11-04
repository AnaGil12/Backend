"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeController = void 0;
class ChallengeController {
    constructor(createChallengeUseCase, challengeRepository) {
        this.createChallengeUseCase = createChallengeUseCase;
        this.challengeRepository = challengeRepository;
    }
    async createChallenge(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const challenge = await this.createChallengeUseCase.execute(req.body, userId);
            res.status(201).json({
                success: true,
                data: challenge
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create challenge'
            });
        }
    }
    async getChallenges(req, res) {
        try {
            const { courseId, status, difficulty, tags, limit = 50, offset = 0 } = req.query;
            let challenges;
            if (courseId) {
                challenges = await this.challengeRepository.findByCourseId(courseId);
            }
            else if (status) {
                challenges = await this.challengeRepository.findByStatus(status);
            }
            else if (difficulty) {
                challenges = await this.challengeRepository.findByDifficulty(difficulty);
            }
            else if (tags) {
                const tagArray = Array.isArray(tags) ? tags : [tags];
                challenges = await this.challengeRepository.findByTags(tagArray);
            }
            else {
                challenges = await this.challengeRepository.findAll(parseInt(limit), parseInt(offset));
            }
            res.status(200).json({
                success: true,
                data: challenges
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch challenges'
            });
        }
    }
    async getChallengeById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Challenge ID is required'
                });
                return;
            }
            const challenge = await this.challengeRepository.findById(id);
            if (!challenge) {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: challenge
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch challenge'
            });
        }
    }
    async updateChallenge(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Challenge ID is required'
                });
                return;
            }
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const challenge = await this.challengeRepository.update(id, req.body);
            if (!challenge) {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: challenge
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update challenge'
            });
        }
    }
    async deleteChallenge(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Challenge ID is required'
                });
                return;
            }
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const deleted = await this.challengeRepository.delete(id);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Challenge deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete challenge'
            });
        }
    }
    async searchChallenges(req, res) {
        try {
            const { q } = req.query;
            if (!q) {
                res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
                return;
            }
            const challenges = await this.challengeRepository.search(q);
            res.status(200).json({
                success: true,
                data: challenges
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to search challenges'
            });
        }
    }
}
exports.ChallengeController = ChallengeController;
//# sourceMappingURL=ChallengeController.js.map