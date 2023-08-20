import Service from './Service';

class UserService extends Service {

    constructor(repo) {
        super(repo);
    }

    async addUser(user, data) {
        try {
            const { isPresent } = await this.repo.checkIfItExists({ username: data.username });
            if (isPresent) return new this.errorResponse('username already taken.', 403);

            if(data.email){
                const { isPresent: emailExists } = await this.repo.checkIfItExists({ email: data.email });
            if (emailExists) return new this.errorResponse('email already taken.', 403);
            }

            if(data.phone){
                const { isPresent: phoneExists } = await this.repo.checkIfItExists({ phone: data.phone });
                if (phoneExists) return new this.errorResponse('phone already taken.', 403);
            }

            data.password = this.repo.hashPassword(data.password);
            data.registeredBy = user.id;
            await this.repo.insert(data);
            return new this.successResponse({message:'user registered.'});
        } catch (err) {
            return new this.errorResponse()
        }
    }
    
    async changePassword(id, data) {
        try {
            let passcode = this.repo.hashPassword(data.password);
            return await this.repo.update(id, { password: passcode });
        } catch (err) {
            return new this.errorResponse()
        }
    }

    async signIn(data) {
        try {
            data.username = data.username.trim();
            const { isPresent, item } = await this.repo.checkIfItExists({ username: data.username });
            if (!isPresent)
                return new this.errorResponse('Incorrect username or password', 400);
            if (item.status != 'Active')
                return new this.errorResponse(item.status + ' Credential, Contact Admin', 402);
            const match = await this.repo.checkPasswordMatch(data.password, item.password)
            if (match) {
                const token = await this.repo.getUserToken(item);
                await this.repo.update(item._id, { token: token, no_attempts: 0 })
                return new this.successResponse({
                    message: 'User logged in successfully!',
                    access_token: token,
                    email: item.email,
                    username: item.username,
                    role: item.role,
                    changePassword: item.passwordFlag ?
                        item.passwordFlag : false,
                    fullname: item.full_name,
                    id: item._id
                }, 200)

            } else {
                const no_attempts = item.no_attempts + 1;
                if (no_attempts >= 7) {
                    await this.repo.update(item._id, {
                        no_attempts: no_attempts,
                        status: 'Locked'
                    });
                    return new this.errorResponse('You are Locked due to multiple wrong credential attempts', 400)
                } else {
                    await this.repo.update(item._id, { no_attempts: no_attempts })
                    return new this.errorResponse('Incorrect username or password', 400)
                }
            }
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async changeUserStatus(id, status) {
        try {
            return await this.repo.update(id, { status: status });
        } catch (error) {
            return new this.errorResponse();
        }
    }
    async logout(user) {
        try {
            const record = await this.repo.update(user.id, { token: '' });
            delete record.item
            return record
        } catch (error) {
            return new this.errorResponse();
        }
    }
};


export default UserService;