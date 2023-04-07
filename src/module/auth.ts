import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const comaprepasswords = (password, hashedpass) => {
    return bcrypt.compare(password, hashedpass)
}

export const hashpassword = (password) => {
    return bcrypt.hash(password, 10)
}

export const createJWT = (user) => {
    const Token = jwt.sign({
        id: user.id,
        username: user.username
    },
        process.env.JWT_SECRET
    )

    return Token;
}

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization


    if (!bearer) {
        res.status(401)
        res.json({ message: "Bearer token not provided " })
    }

    const [, token] = bearer.split(' ')

    if (!token) {
        res.status(4001)
        res.json({ message: "invalid bearer" })
        return
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        res.user = user
        next()
    } catch (e) {
        res.status(401)
        res.json({ message: "invalid bearer token" })
        return
    }
}

export const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next()
    } else {
        res.json({ message: "cookie expired " })
    }
}