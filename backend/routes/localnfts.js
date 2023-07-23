const express = require('express');
const router = express.Router();

const {
  claimLocalNft,
  claimlNftToWallet,
  getNftsOfUser,
  getLocalNftById,
  getLocalNftByNftId,
} = require('../controllers/localnfts');

const { authenticate, authenticateWithAdmin } = require('../middleware/user');

router.post('/claimwithemail', authenticate, claimLocalNft);
router.post('/claimtowallet', authenticate, claimlNftToWallet);
router.get('/getNftsOfUser/:user_id', getNftsOfUser);
router.get('/getLocalNftById/:id', getLocalNftById);
router.get('/getLocalNftByNftId/:id', getLocalNftByNftId);


module.exports = router;
