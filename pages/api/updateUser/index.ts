import { PrismaClient } from "@prisma/client";
import fs from 'fs'

export default async function handler(req,res)
{
    const prisma = new PrismaClient();

    const Name = req.body.Name;
    const Surname = req.body.Surname;
    const Bio = req.body.Bio;
    const id = parseInt(req.body.id);

    console.log(id,Bio,Surname,Name);

    if((await prisma.user.findUnique({where:{id:id}}) == null))
    {
        res.status(500).json();
    }
    else
    {
        await prisma.user.update({
            where: { id: +id }, data: {Name:Name,Surname:Surname, Bio: Bio }
          });
          
        const newUser = "export const User = [{\nid:'" + id + "',\nname:'" + Name + "',\nsurname:'" + Surname
        + "',\nBio:'" + Bio  + "'\n}\n]";
        fs.writeFileSync('./data/users.ts', newUser);
          res.status(201).json();
    }
}