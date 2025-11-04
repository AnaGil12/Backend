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
exports.MongoUserRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const User_1 = require("../../domain/entities/User");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: Object.values(User_1.UserRole), required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const UserModel = mongoose_1.default.model('User', UserSchema);
class MongoUserRepository {
    async findById(id) {
        const user = await UserModel.findById(id);
        return user ? this.mapToUser(user) : null;
    }
    async findByEmail(email) {
        const user = await UserModel.findOne({ email });
        return user ? this.mapToUser(user) : null;
    }
    async create(userData) {
        const user = new UserModel({
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const savedUser = await user.save();
        return this.mapToUser(savedUser);
    }
    async update(id, userData) {
        const user = await UserModel.findByIdAndUpdate(id, { ...userData, updatedAt: new Date() }, { new: true });
        return user ? this.mapToUser(user) : null;
    }
    async delete(id) {
        const result = await UserModel.findByIdAndDelete(id);
        return !!result;
    }
    async findAll(limit = 50, offset = 0) {
        const users = await UserModel.find()
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 });
        return users.map(user => this.mapToUser(user));
    }
    async findByRole(role) {
        const users = await UserModel.find({ role });
        return users.map(user => this.mapToUser(user));
    }
    mapToUser(userDoc) {
        return {
            id: userDoc._id.toString(),
            email: userDoc.email,
            password: userDoc.password,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            role: userDoc.role,
            isActive: userDoc.isActive,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt
        };
    }
}
exports.MongoUserRepository = MongoUserRepository;
//# sourceMappingURL=MongoUserRepository.js.map