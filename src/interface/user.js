import BaseRepo from './BaseRepo';
import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
const User = new UserModel().getInstance();

class UserRepo extends BaseRepo {

    constructor(model) {
        super(model);
    }

    async search(query) {
        return await super.search(query);
    }
    async getById(id, query = {}, exclude = []) {
        return await super.getById(id, query, exclude);
    }
    async getOneByCondition(condition, query = {}, exclude = []) {
        return await super.getOneByCondition(condition, query, exclude);
    }
    async getAll(query) {
        return await super.getAll(query, '-token -password -updatedAt -createdAt -__v')
    }
    async checkIfItExists(condition, populate) {
        return await super.checkIfItExists(condition, populate);
    }
    async insert(data, session) {
        return await super.insert(data, session);
    }
    async update(id, data, session) {
        return await super.update(id, data, session)
    }
    async delete(id) {
        return await super.delete(id)
    }
    async insertByPush(condition, data, session) {
        return await super.insertByPush(condition, data, session);
    }
    async updateByCondition(condition, data, session) {
        return await super.updateByCondition(condition, data, session);
    }

    //write your logic in here
    hashPassword(password) {
        return bcrypt.hashSync(password, 8);
    }
    async checkPasswordMatch(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword)
    }
    async getUserToken(user) {

        const payload = {
            id: user._id,
            name: user.full_name,
            username: user.username,
            role: user.role,
        }
        return jwt.sign(payload, config.get('secret_key'), {
            expiresIn: '12h'
        });
    }
};

export default new UserRepo(User);