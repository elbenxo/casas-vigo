const { Router } = require('express');

const router = Router();

router.post('/draft', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
