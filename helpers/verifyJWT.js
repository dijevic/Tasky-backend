const jwt = require('jsonwebtoken');

const verifyJWT = async (token) => {

    const JWTVerified = await jwt.verify(token, process.env.PRIVATESECRETJWTKEY, (err, decoded) => {


        if (err) {
            return false
        } else {
            return decoded
        }
    })

    console.log(JWTVerified)


    return JWTVerified






}

module.exports = verifyJWT