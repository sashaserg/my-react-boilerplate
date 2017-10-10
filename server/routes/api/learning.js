import express from 'express';
const router = express.Router();

import {startTrain} from '../../utils/train'
import {testNumber} from '../../utils/testResults'

router.post('/', function(req, res, next)
{
  const params = (req.body);

  if(params.start === 'true')
  {
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    console.log("| START LEARNING REQUESTED |");
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=");

    res.json({confirmation:true});
    startTrain();
  }
  else
  {
    res.json({confirmation:false});
  }
});

router.get('/', (req, res, next) =>
{
  const results = testNumber();

  res.json({confirmation: true, results: results});
});

export default router;
