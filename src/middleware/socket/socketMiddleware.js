import jwt from 'jsonwebtoken';
import config from 'config';
import url from 'url';

export default async(info, next) => {
    let query = url.parse(info.req.url, true).query;
    if (!query.token) {
        return next(false, 403, 'Token Not Found');
    } else {
        let token = query.token;
        jwt.verify(token, config.get('secret_key'), (err, decoded) => {
            if (err) {
                return next(false, 403, 'Not valid token');
            } else {
                info.req.user = {
                    id: decoded.id
                };
                next(true);
            }
        })
    }
}