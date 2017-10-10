import express from 'express';
import test from './api/test';
import learning from './api/learning';

const router = express.Router();


router.use('/test', test );
router.use('/learning', learning );


export default router;
