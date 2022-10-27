import { PrismaClient } from "@prisma/client";

export default async function handler(req,res)
{
    const prisma = new PrismaClient();

    if(req.body.meth == "get")
    {
        const data = await prisma.notification.findMany({
            where: { userId: parseInt(req.body.id), Type: 'Task' },
          });

          res.status(201).json(data);
    }
    else if(req.body.meth == "del")
    {
        res.status(201).json(await prisma.notification.deleteMany({
            where: { userId: parseInt(req.body.id), Type: 'Task', message: req.body.message },
          }))
    }
    else
    {
        console.log(req.body.id);
        if (
            !(await prisma.notification.findFirst({
              where: { userId: parseInt(req.body.id), message: req.body.message },
            }))
          ) {
            res.status(201).json(
            await prisma.notification.create({
              data: { userId: parseInt(req.body.id), Type: 'Task', message: req.body.message,taskType: "Task",produceType:"Apple" },
            }));
          }
    }
}