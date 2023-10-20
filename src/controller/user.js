import Controller from './Controller';
import UserRepo from '../interface/user.js';
import UserService from '../services/user.js';

const user_service = new UserService(UserRepo);

class UserController extends Controller {

    constructor(service) {
        super(service);
    }

    async addUser(req, res) {
        const response = await user_service.addUser(req.user, req.body);
        return res.status(response.statusCode).send(response);
    }
    async getUserWallet(req, res) {
        const response = await user_service.getUserWallet(req.user);
        return res.status(response.statusCode).send(response);
    }
    async addWaletPin(req, res) {
        const response = await user_service.addwalletPin(req.user.id, { walletPin: req.body.walletPin });
        return res.status(response.statusCode).send(response);
    }
    async checkWaletPin(req, res) {
        const response = await user_service.checkWalletPin(req.user.id, { walletPin: req.body.walletPin });
        return res.status(response.statusCode).send(response);
    }
    async changeWalletPin(req, res) {
        const response = await user_service.changeWalletPin(req.user.id, { walletPin: req.body.walletPin });
        return res.status(response.statusCode).send(response);
    }
    async changePassword(req, res) {
        const response = await user_service.changePassword(req.user.id, req.body);
        return res.status(response.statusCode).send(response);
    }
    async signIn(req, res) {
        const response = await user_service.signIn(req.body);
        return res.status(response.statusCode).send(response);
    }
    async logout(req, res) {
        const response = await user_service.logout(req.user);
        return res.status(response.statusCode).send(response);
    }
    async changeUserStatus(req, res) {
        const response = await user_service.changeUserStatus(req.params.id);
        return res.status(response.statusCode).send(response);
    }
};

export default new UserController(user_service);