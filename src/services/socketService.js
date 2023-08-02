import UserRepo from '../interface/user';
import CustomerRepo from '../interface/customer';
import { io } from '../../bootstrap/server';

class SocketNotification {

	constructor() { }

	async send(action, user, data) {
		try {

		} catch (err) {
			return {
				error: true
			}
		}
	}

	async sendToCustomer(eventName, customerId, payload) {
		try {
			const {item:customer} = await CustomerRepo.checkIfItExists({_id:customerId});
			if(!customer||!customer.socket) return;
			const ws= Array.from(io.clients).find(socket=>socket.id==customer.socket);
				if(ws) ws.send(JSON.stringify({event: eventName,data: payload}));
		} catch (err) {
			return {
				error: true
			}
		}
	}

	async broadcast(eventName, payload) {
		try {
			Array.from(io.clients).forEach((ws) => {
                ws.send(JSON.stringify({
                    event: eventName,
                    data: payload
                }));
            })
		} catch (err) { 
			console.log(err);
		}
	}
	async notifyBranchUsers(eventName, payload,branch) {
		try {
			const users = await UserRepo.getCompleteData({branch});
			users.forEach(user=>{
				const ws= Array.from(io.clients).find(socket=>socket.id==user.socket);
				if(ws) ws.send(JSON.stringify({event: eventName,data: payload}));
			});
		} catch (err) { }
	}
}

export default new SocketNotification();