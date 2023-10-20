import express from 'express';
import User from '../controller/user.js';
import UserSchema from '../validators/Joi/schemas/user.js';
import valMiddleware from '../validators/Joi/middleware.js';
import auth from '../middleware/auth/user_auth.js';

const router = express.Router();

router.get('/', auth(), User.getAll);

router.get('/detail/:id', auth(), User.get);

router.put('/update/:id', auth(), valMiddleware(UserSchema.updateUser), User.update);

router.put('status/:id', auth(), valMiddleware(UserSchema.updateUser), User.changeUserStatus);

router.put('/changePassword', auth(), valMiddleware(UserSchema.changePassword), User.changePassword);

router.post('/', auth(), valMiddleware(UserSchema.addUser), User.addUser);

router.post('/signin', valMiddleware(UserSchema.signIn), User.signIn);

router.post('/logout', auth(), valMiddleware(UserSchema.addUser), User.logout);

// router.delete('/:id', auth(), User.delete);

export default router;