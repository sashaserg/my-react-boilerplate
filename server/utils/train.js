import brain from 'brain.js'
import mnist from 'mnist'
import fs from 'fs'


let net = new brain.NeuralNetwork();
const set = mnist.set(1000, 0);
const trainingSet = set.training;

async function startTrain()
{
  net.train(trainingSet,
    {
      errorThresh: 0.002,
      iterations: 20000,
      log: true,
      logPeriod: 1,
      learningRate: 0.3
    });

  const wstream = fs.createWriteStream('server/utils/data/trainResults.json', {flags: 'w', encoding: 'utf-8',mode: 0o666});

  wstream.on('error', (e) => { console.error(e); });
  wstream.write(JSON.stringify(net.toJSON(), null, 2));
  wstream.end();
}

module.exports.startTrain = startTrain;