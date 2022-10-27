import {PrismaClient} from "@prisma/client"
import bcrypt from 'bcrypt';
import fs from 'fs'

export default async function handler(req,res)
{
    const newUser = "export const User = [{\nid:0\n}\n]";
    fs.writeFileSync('./data/users.ts', newUser);
    res.status(200).json();
}