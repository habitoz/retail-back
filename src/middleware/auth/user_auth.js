
import config from 'config'
import jwt from 'jsonwebtoken'
export default () => async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        if (token) {
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
        } else {
            res.status(401).send({
                error: true,
                message: 'Unauthorized Access!'
            })
        }
    } catch (e) {
        console.log(e);
        res.status(401).send({
            error: true,
            message: 'Unauthorized Access!'
        })
    }
}