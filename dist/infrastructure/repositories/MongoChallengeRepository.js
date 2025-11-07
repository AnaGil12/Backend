"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoChallengeRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Challenge_1 = require("../../domain/entities/Challenge");
const TestCaseSchema = new mongoose_1.Schema({
    challengeId: { type: String, required: false }, // Will be set after challenge creation
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    order: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
const ChallengeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: Object.values(Challenge_1.ChallengeDifficulty), required: true },
    tags: [{ type: String }],
    timeLimit: { type: Number, required: true },
    memoryLimit: { type: Number, required: true },
    status: { type: String, enum: Object.values(Challenge_1.ChallengeStatus), default: Challenge_1.ChallengeStatus.DRAFT },
    courseId: { type: String, required: true },
    createdBy: { type: String, required: true },
    testCases: [TestCaseSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const ChallengeModel = mongoose_1.default.model('Challenge', ChallengeSchema);
class MongoChallengeRepository {
    async findById(id) {
        const challenge = await ChallengeModel.findById(id);
        return challenge ? this.mapToChallenge(challenge) : null;
    }
    async create(challengeData, createdBy) {
        // Create challenge document first to get the ID
        const challenge = new ChallengeModel({
            ...challengeData,
            createdBy,
            testCases: challengeData.testCases.map(tc => ({
                ...tc,
                challengeId: '', // Temporary, will be updated after save
                createdAt: new Date()
            })),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Save to get the actual ID
        const savedChallenge = await challenge.save();
        const actualChallengeId = savedChallenge._id.toString();
        // Update testCases with the actual challengeId
        savedChallenge.testCases.forEach((tc) => {
            tc.challengeId = actualChallengeId;
        });
        await savedChallenge.save();
        return this.mapToChallenge(savedChallenge);
    }
    async update(id, challengeData) {
        const challenge = await ChallengeModel.findByIdAndUpdate(id, { ...challengeData, updatedAt: new Date() }, { new: true });
        return challenge ? this.mapToChallenge(challenge) : null;
    }
    async delete(id) {
        const result = await ChallengeModel.findByIdAndDelete(id);
        return !!result;
    }
    async findByCourseId(courseId) {
        const challenges = await ChallengeModel.find({ courseId });
        return challenges.map(challenge => this.mapToChallenge(challenge));
    }
    async findByStatus(status) {
        const challenges = await ChallengeModel.find({ status });
        return challenges.map(challenge => this.mapToChallenge(challenge));
    }
    async findByDifficulty(difficulty) {
        const challenges = await ChallengeModel.find({ difficulty });
        return challenges.map(challenge => this.mapToChallenge(challenge));
    }
    async findByTags(tags) {
        const challenges = await ChallengeModel.find({ tags: { $in: tags } });
        return challenges.map(challenge => this.mapToChallenge(challenge));
    }
    async findAll(limit = 50, offset = 0) {
        const challenges = await ChallengeModel.find()
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 });
        return challenges.map(challenge => this.mapToChallenge(challenge));
    }
    async search(query) {
        const challenges = await ChallengeModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        });
        return challenges.map(challenge => this.mapToChallenge(challenge));
    }
    mapToChallenge(challengeDoc) {
        return {
            id: challengeDoc._id.toString(),
            title: challengeDoc.title,
            description: challengeDoc.description,
            difficulty: challengeDoc.difficulty,
            tags: challengeDoc.tags,
            timeLimit: challengeDoc.timeLimit,
            memoryLimit: challengeDoc.memoryLimit,
            status: challengeDoc.status,
            courseId: challengeDoc.courseId,
            createdBy: challengeDoc.createdBy,
            testCases: challengeDoc.testCases.map(tc => ({
                id: tc._id.toString(),
                challengeId: tc.challengeId,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden,
                order: tc.order,
                createdAt: tc.createdAt
            })),
            createdAt: challengeDoc.createdAt,
            updatedAt: challengeDoc.updatedAt
        };
    }
}
exports.MongoChallengeRepository = MongoChallengeRepository;
//# sourceMappingURL=MongoChallengeRepository.js.map