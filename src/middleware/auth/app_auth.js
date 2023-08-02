import jwt from 'jsonwebtoken'
import config from 'config'
export default () => async(req, res, next) => {
    try {

        if (config.get('unprotected_routes').includes(req.path)) {
            return next();
        }
        if (config.get('static_file_routes').find(route => req.path.includes(route))) {
            return next();
        }
        const token = req.header('Authorization').replace('Bearer ', '')
        jwt.verify(token, config.get('secret_key'), async function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: true,
                    message: 'Unauthorized Access!.'
                })
            } else {
                req.user = decoded;
                next()
            }
        })
    } catch (e) {
        res.status(401).send({
            error: true,
            message: 'Unauthorized Access!'
        })
    }
}