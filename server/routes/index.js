import express from 'express';
const router = express.Router();

router.get('/*', function(req, res, next)
{
	if(req.params[0].split('/')[0] !== 'api')
	{
		res.render('index');
	}
	else
	{
		next();
	}
});

module.exports = router;
