import messages from '../messages/successMessages';

class SuccessResponse {
    constructor( data = {},status = 200) {
      
        data.message = data.message || messages[status];
        return {
            error: false,
            statusCode: status,
            ...data
        }
    }
}
export default SuccessResponse;