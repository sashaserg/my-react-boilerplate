import brain from 'brain.js'
import mnist from 'mnist';

const net = new brain.NeuralNetwork();
const set = mnist.set(0, 5);
const testSet = set.test;

net.fromJSON(require('./data/trainResults'));

function softmax(output)
{
  const maximum = output.reduce(function(p,c) { return p>c ? p : c; });
  const nominators = output.map(function(e) { return Math.exp(e - maximum); });
  const denominator = nominators.reduce(function (p, c) { return p + c; });
  const softmax = nominators.map(function(e) { return e / denominator; });

  let maxIndex = 0;
  softmax.reduce(function(p,c,i){if(p<c) {maxIndex=i; return c;} else return p;});
  let result = [];
  for (let i=0; i<output.length; i++)
  {
    if (i === maxIndex)
      result.push(1);
    else
      result.push(0);
  }
  return result;
}


function testNumber()
{
  const output = net.run(testSet[0].input);

  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log(testSet[0].output);
  console.log(softmax(output));
  console.log(output);
  console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

  return { "desired":testSet[0].output, "softReal":softmax(output), "real":output }
}

module.exports.testNumber = testNumber;