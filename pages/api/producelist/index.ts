import { PrismaClient } from "@prisma/client";

export default async function handler(req,res)
{
    const prisma = new PrismaClient();

    const id = parseInt(req.body.id);

    const allScales = await getAllProduce(id);
    const trenddata = await trendData(id);
    const produceList =[];
    for(let i = 0; i < trenddata.length; i++)
    {
      let ProduceStatus = 'good';
      
      ProduceStatus = await checkFreshness(id,trenddata[i])
      const retVal = {
        id:allScales[i].id,
        name: allScales[i].Name,
        ProduceType:allScales[i].ProduceType,
        individualWeight: allScales[i].WeightIndividual,
        fullWeight: allScales[i].WeightTotal,
        expireDate: trenddata[i].SaleDate,
        lastRestock:trenddata[i].LastRestock,
        produceStatus: ProduceStatus
      }
      produceList.push(retVal)
    }

    async function checkFreshness(id:number,trenddata: { id?: number; userId?: number; ProduceType: any; AverageSalesAmountForYear?: number[]; AmountSalesForYear?: number[]; SaleDate: any; LastRestock: any; })
    {
      let ProduceStatus = 'good';
      const today = new Date();
      if(trenddata.LastRestock == null)
      {
        return 'good'
      }
        if(today.getDate() < trenddata.SaleDate.getDate())
        {
          ProduceStatus = 'good';
        }
        else
        {
          if(today.getDate() == trenddata.SaleDate.getDate())
          {
            ProduceStatus = 'about to expire';
          }
          else
          {
            if(today.getDate() > trenddata.SaleDate.getDate())
          {
            
            ProduceStatus = 'expired';
          }
          }
          
        }
        const taskExpired = await getTasks(id);
        let expiretask = false;
        for(let i = 0; i<taskExpired.length;i++)
        {
            if(taskExpired[i].produceType == trenddata.ProduceType )
            {
              if(taskExpired[i].taskType == 'expire')
              {
                expiretask = true;
              }
            }
        }
        if(expiretask == true)
        {
          ProduceStatus = 'expired';
        }
        
        return ProduceStatus;
    }

    async function getAllProduce(id: number) 
    {
        return await prisma.scale.findMany({ where: { userId: id } });
    }

    async function getTasks(id: number) 
    {
        return await prisma.notification.findMany({
          where: { userId: +id, Type: 'Task' },
        });
    }

    async function trendData(id: number) 
    {
        return await prisma.trendForYear.findMany({ where: { userId: id } });
    }

    res.status(201).json(produceList);
}