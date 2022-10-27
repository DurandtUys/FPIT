import { PrismaClient } from "@prisma/client";

export default async function handler(req,res)
{
    const prisma = new PrismaClient();
        const data = await prisma.trendForYear.findMany({
          where: { userId: +req.body.userid },
        });
        res.status(201).json(data);
}