import { Prisma } from "@prisma/client";
import prisma from "../db";
import { comaprepasswords, createJWT, hashpassword } from "../module/auth";


export const createNewUser = async (req: any, res: any) => {
    const detail: Prisma.UserCreateInput[] | Prisma.UserUncheckedCreateInput[] | any = {
        username: req.body.username
    }
    const usercheck = await prisma.user.findUnique({
        where: detail
    })

    if (usercheck) {
        res.json({ message: "user alredy exist" })
        return
    }

    let users: Prisma.UserCreateInput[] | Prisma.UserUncheckedCreateInput[] | any =
    {
        username: req.body.username,
        password: await hashpassword(req.body.password)
    }

    const user = await prisma.user.create({
        data: users,
    })

    const token = createJWT(user)
    res.json({ token })
}

export const signin = async (req: any, res: any) => {

    const user = await prisma.user.findUnique({
        where: { username: req.body.username }
    })

    const isValid = await comaprepasswords(req.body.password, user.password)

    if (!isValid) {
        res.status(401)
        res.json({ message: "Wrong username & password" })
        return
    }
    req.session.user = user;
    const token = createJWT(user)
    res.json({ token })
}