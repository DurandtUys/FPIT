// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable-next-line */
// react plugin used to create charts
import Trends from '../components/trends';
import { PrismaClient } from '@prisma/client';

export async function getServerSideProps() {

  const prisma = new PrismaClient();

  let trendData = await prisma.scale.findMany({ where: { userId: 1 } });

  trendData = JSON.parse(JSON.stringify(trendData));


  let count = 0;

    for(let x = 0;x < trendData.length;x++)
    {
      const expireDate = new Date(trendData[x].expireDate);
      if(expireDate < new Date())
      {
        trendData[x].produceStatus = "expired";
        count++;
      }
      else
      {
        trendData[x].produceStatus = "good";
      } 
    }

  const taskData = await prisma.notification.findMany({
    where: { userId: 1, Type: 'Task' },
  });

  const saleData = await prisma.trendForYear.findMany({
    where: { userId: 1 },
  });
  let sales = 0;
  let FruitVeg = 0;
  let PoultryMeat = 0;
  let Pastries = 0;

  for(let x = 0;x < saleData.length;x++)
  {
    for(let y = 0;y < saleData[x].AverageSalesAmountForYear.length;y++)
    {
      if(saleData[x].ProduceType == "Fresh Produce")
      {
        FruitVeg+=saleData[x].AverageSalesAmountForYear[y];
      }
      else if(saleData[x].ProduceType == "Poultry/Meat")
      {
        PoultryMeat+=saleData[x].AverageSalesAmountForYear[y];
      }
      else
      {
        Pastries+=saleData[x].AverageSalesAmountForYear[y];
      }
      sales += saleData[x].AverageSalesAmountForYear[y];
    }
  }

  return {
    props: {
      trendData,taskData,count,sales,FruitVeg,PoultryMeat,Pastries
    },
  };
}

export function Index({trendData,taskData,count,sales,FruitVeg,PoultryMeat,Pastries}) {
  return (
    <div className="px-4">
      <Trends dataInventory={trendData} dataTasks={taskData} expired={count} sales={sales} FruitVegCount={FruitVeg} PoultryMeatCount={PoultryMeat} PastriesCount={Pastries}></Trends>
    </div>
  );
}

export default Index;
