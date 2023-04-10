import prisma from "../db"



export const Confidsetup = async (req, res) => {
    try {
        const data = await prisma.config.findUnique({
            where: {
                Shop_name: req.body.Shop_name,
                Client_id: req.body.Client_id,
                Client_scrt: req.body.Client_scrt,
                token: req.body.token,
            }
        })
        if (!data) {
            await prisma.config.create({
                data: {
                    Shop_name: req.body.Shop_name,
                    Client_id: req.body.Client_id,
                    Client_scrt: req.body.Client_scrt,
                    token: req.body.token,
                    User: { connect: { id: req.session.user.id } }
                }
            })
            res.json({ message: "config setup done" })
        } else {
            res.json({ message: "Config details already exist" })
        }
    } catch (error) {
        res.json({ error })
    }
}

export const Configupdate = async (req, res) => {
    try {
        const data = await prisma.config.findFirst({
            where: {
                userId: req.session.user.id
            }
        })
        if (data) {
            const update = await prisma.config.update({
                where: {
                    Client_scrt: data.Client_scrt
                },
                data: req.body
            })
            if (update) {
                res.json({ message: "Config info updated" })
            }
        } else {
            res.json({ message: "something wrong in payload data" })
        }
    } catch (error) {
        res.json({ error })
    }
}