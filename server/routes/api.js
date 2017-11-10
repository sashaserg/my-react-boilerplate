import express from 'express';

import user from './api/user';
import auth from './api/auth';

const router = express.Router();


router.use('/user', user );
router.use('/auth', auth );


export default router;
