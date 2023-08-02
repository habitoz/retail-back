import UpdateLogsModel from '../models/updateLogs.js';

const UpdateLogs = new UpdateLogsModel().getInstance();

class UpdateLogsRepo {


    async insert(user, data, session) {
        return await UpdateLogs.create({ actor: user.id, actorName: user.name, ...data });
    }


    //write your logic in here
};

export default new UpdateLogsRepo(UpdateLogs);