import {PrismaClient} from "@prisma/client"
import bcrypt from 'bcrypt';
import {User} from '../../../data/users'
import fs from 'fs'

export default async function handler(req,res)
{
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({ where: { email: req.body.email} });

    if(user)
    {
        if ((await bcrypt.compare(req.body.password,user.password)) == false)
        { 
            res.status(400).send("Incorrect password");
        }
        else
        {
            const newUser = "export const User = [{\nid:" + user.id + "\n}\n]";
            fs.writeFileSync('./data/users.ts', newUser);
            res.status(200).json();
        }
    }
    else
    {
        res.status(404);
    }
}