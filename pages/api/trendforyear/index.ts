import { NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export default async function handler(req,res)
{
    const prisma = new PrismaClient();

    let monthyValues;
    const amount = [];
    const average = [];
    const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let i = 0; i < 12; i++) {
      let calculateForMonthAmount = 0;
      let calculateForMonthAverage = 0;
      monthyValues = await getTrendsForItemAndMonth(req.body.id, req.body.item, i);
      if (monthyValues == null) throw new NotFoundException();
      for (let k = 0; k < months[i]; k++) {
        calculateForMonthAmount =
          calculateForMonthAmount + monthyValues.amountSalesForMonth[k];
        //console.log(calculateForMonthAmount);
        calculateForMonthAverage =
          calculateForMonthAverage + monthyValues.averageSalesForMonth[k];
      }

      amount.push(calculateForMonthAmount);
      average.push(calculateForMonthAverage);
    }

    async function getTrendsForItemAndMonth(id: number, producetype: string, month: number) 
    {
        const trendForItem = await getTrendsForItem(id, producetype);
        if (trendForItem == null) {
          return null;
        }
        const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //console.log(trendForItem);
        let total = 0;
        let i = 0;
        for (; i <= month - 1; i++) {
          total += months[i];
        }
        const amountSales = [];
        const average = [];
        for (let k = total; k < total + months[i]; k++) {
          amountSales.push(trendForItem.AmountSalesForYear[k]);
          average.push(trendForItem.AverageSalesAmountForYear[k]);
        }
        //console.log(average);
        return {
          id: trendForItem.id,
          produceType: trendForItem.ProduceType,
          amountSalesForMonth: amountSales,
          averageSalesForMonth: average,
          dateOfSale: trendForItem.SaleDate,
          lastRestock: trendForItem.LastRestock,
        };
    }

    async function getTrendsForItem(userid: number, item: string) 
    {
        return await prisma.trendForYear.findFirst({
          where: { userId: userid, ProduceType: item },
        });
    }

    res.status(201).json({id: req.body.id,
      produceType: req.body.item,
      averagesForMonths: average,
      amountsforMonths: amount});
}