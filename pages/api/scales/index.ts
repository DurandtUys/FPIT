import { PrismaClient } from "@prisma/client";

export default async function handler(req,res)
{
    const userId = parseInt(req.body.userId);
    const weightfull = parseInt(req.body.weightfull);
    const weightone = parseInt(req.body.weightone);
    const producetype = req.body.producetype;
    const description = req.body.description;
    const name = req.body.name;

    const prisma = new PrismaClient();

    const scale = await prisma.scale.create({
        data: {
          userId: userId,
          WeightTotal: weightfull,
          WeightIndividual: weightone,
          ProduceType: producetype,
          Name:name,
          Description:description
        },
      });
      await prisma.scale_Trend.create({
        data: {
          scale_id: scale.id,
          ProduceType: producetype,
          date: new Date(),
          weight: weightfull,
        },
      });
      
      const today = new Date();
      const expire = new Date();
      expire.setDate(expire.getDate() + 6);
      await prisma.trendForYear.create({
        data: {
          id: scale.id,
          userId: userId,
          ProduceType: producetype,
          AverageSalesAmountForYear: Array.from({ length: 366 }, (x) => 0),
          AmountSalesForYear: Array.from({ length: 366 }, (x) => 0),
          LastRestock: today,
          SaleDate: expire,
        },
    });

    res.status(200).json(userId);
}