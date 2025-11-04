"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserRepository = void 0;
class MockUserRepository {
    constructor() {
        this.users = [];
    }
    async findById(id) {
        return this.users.find(u => u.id === id) || null;
    }
    async findByEmail(email) {
        return this.users.find(u => u.email === email) || null;
    }
    async create(userData) {
        const user = {
            id: `user-${Date.now()}`,
            ...userData,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(user);
        return user;
    }
    async update(id, userData) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1)
            return null;
        const updatedUser = {
            ...this.users[index],
            ...userData,
            updatedAt: new Date()
        };
        this.users[index] = updatedUser;
        return updatedUser;
    }
    async delete(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1)
            return false;
        this.users.splice(index, 1);
        return true;
    }
    async findAll(limit = 50, offset = 0) {
        return this.users.slice(offset, offset + limit);
    }
    async findByRole(role) {
        return this.users.filter(u => u.role === role);
    }
    async findActiveUsers() {
        return this.users.filter(u => u.isActive);
    }
    async validateCredentials(credentials) {
        const user = this.users.find(u => u.email === credentials.email);
        if (!user || !user.isActive)
            return null;
        return user;
    }
}
exports.MockUserRepository = MockUserRepository;
//# sourceMappingURL=MockUserRepository.js.map