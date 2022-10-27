import { NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import node from '@tensorflow/tfjs-node';

export default async function handler(req, res) {

  const prediction =  await predict(req.body.id,req.body.type,req.body.file);

  const prisma = new PrismaClient();

  async function predict(id: number, type: string, file: string) {
    let model1;
    try{
    model1 = await tf.loadLayersModel(
      'file://./pages/api/model/' +
        type +
        '-model/model.json'
    );
    } catch(error){
      throw new NotFoundException('Model not found');
    }
    //const model = await mobilenet.load();
    const imagePath = file;
    const image = fs.readFileSync(imagePath);
    const imagetensor = node.node.decodeImage(image, 3);
    const im = tf.image.resizeBilinear(imagetensor, [180, 180]) as tf.Tensor3D;
    //const predictions = await model.classify(im);
    const prediction = model1.predict(
      im.reshape([1, 180, 180, 3])
    ) as tf.Tensor;
    const result = prediction.dataSync();
    let max = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[max] < result[i]) {
        max = i;
      }
    }

    getproduce(max, result, type);

    const answer = getproduce(max, result, type);
    if (answer.prediction.includes('rotten')) {
      const message = 'Please remove all ' + answer.prediction;
      if (
        (await getTasksMessage(id, message)) == null ||
        ((await getTasksMessage(id, message)) != null &&
          (await getTasksMessage(id, message)).message !=
            message)
      ) {
              await createTask(id, message,'expire',type);
      }
    }
    return answer;
  }

  function getproduce(num: number, arr, classname: string) {
    let other = 0;
    if (num % 2 == 0) {
      other = num + 1;
    } else {
      other = num - 1;
    }
    const total = Math.abs(arr[num]) + Math.abs(arr[other]);
    const convidence = (arr[num] / total) * 100;
    const result = getType(num, classname);
    if (Math.abs(arr[num] - arr[other]) < 1) {
      return {
        prediction: result + ' ' + classname,
        message: 'bad looking produce',
        convidence: convidence,
      };
    } else {
      return {
        prediction: result + ' ' + classname,
        message: result + ' ' + classname,
        convidence: convidence,
      };
    }
  }

  function getType(num: number, type: string) {
    switch (type) {
      case 'apple': {
        if (num == 0) return 'rotten';
        else return 'fresh';
      }
      default: {
        if (num == 1) return 'rotten';
        else return 'fresh';
      }
    }
  }

  async function getTasksMessage(id: number, message: string) {
    
    return await this.prisma.notification.findFirst({
      where: { userId: +id, Type: 'Task', message: message },
    });
  }

  async function createTask(id: number, message: string,tasktype:string,produceType:string) {
    if((await prisma.user.findUnique({where:{id:id}})== null))
    {
      throw new NotFoundException('No such id exists');
    }
    if (
      !(await prisma.notification.findFirst({
        where: { userId: +id, message: message },
      }))
    ) {
      return await prisma.notification.create({
        data: { userId: +id, Type: 'Task', message: message,taskType: tasktype,produceType:produceType },
      });
    } else return null;
  }
  
  res.status(201).json(prediction);
}