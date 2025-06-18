import jwt from 'jsonwebtoken'

const secret = 'secret'
const options = {
    expiresIn: 15 * 60 // 15 min
}

export function generateToken(
    userId,
    username,
    role
) {
    const timestamp = Date.now()

    const payload = {
        sub: userId,
        iat: timestamp,
        name: username,
        role: role
    }

    const token = jwt.sign(payload, secret, options)

    return token
}

export function verifyToken(
    jwtTokenString
) {
    try {
        return jwt.verify(jwtTokenString, secret, options)
    } catch(err) {
        return null
    }
}
