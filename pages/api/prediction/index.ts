import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import * as path from 'path';
import tfnode from '@tensorflow/tfjs-node';

export default async function handler(req,res)
{
    const file = req.body.file;
    const type = req.body.type;
    const id = req.body.id;

    let model1;
    try{
    model1 = await tf.loadLayersModel(
      'file://./libs/api/calculate-freshness/service/src/lib/model/' +
        type +
        '-model/model.json'
    );
    } catch(error){
      throw new NotFoundException('Model not found');
    }
    //const model = await mobilenet.load();
    const imagePath = file;
    const image = fs.readFileSync(imagePath);
    const imagetensor = tfnode.node.decodeImage(image, 3);
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

    this.getproduce(max, result, type);

    const answer = this.getproduce(max, result, type);
    if (answer.prediction.includes('rotten')) {
      const message = 'Please remove all ' + answer.prediction;
      if (
        (await this.taskService.getTasksMessage(id, message)) == null ||
        ((await this.taskService.getTasksMessage(id, message)) != null &&
          (await this.taskService.getTasksMessage(id, message)).message !=
            message)
      ) {
              await this.taskService.createTask(id, message,'expire',type);
      }
    }
    return answer;
}