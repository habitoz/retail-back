//import CredentialRepo from '../src/interfaces/credential';
import { v4 as uuidv4 } from 'uuid';

async function handleSocketConnection(ws,req) {
    ws.id=uuidv4();

    // await CredentialRepo.update(req.user.id, { socket: ws.id });
    //     await NotificationRepo.getCount({ receivers: req.user.id, read: false }).then(({ item }) => {
    //         ws.send(JSON.stringify({event:'Unread_Notifications',data:item }))
    //     }).catch(err => {
    //         // console.log(err);
    //     });

    ws.on('disconnect', async () => {
        // const user = await REDIS_SERVICE.getValue('user:' + req.user.id);
        // user.socket = '';
        // user.token = '';
        // await REDIS_SERVICE.setValue('user:' + req.user.id, user);
        // CredentialRepo.updateByCondition({ socket: socket.id }, { socket: '' });
    })
}

export default handleSocketConnection;
