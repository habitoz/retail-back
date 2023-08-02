import messages from '../messages/errorMessages';

class ErrorResponse extends Error {
    constructor( message,status = 500) {
        message = message || messages[status];
        super(message);
      
        return {
            error: true,
            statusCode: status,
            message
        }
    }
}
export default ErrorResponse;