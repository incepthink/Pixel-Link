const { localnfts, merchandise, user, collections } = require('../models');
const { ethers } = require('ethers');
const NFTABI = require('../resouces/NftApparelABI.json');
const { Op } = require("sequelize");

// TODO: Add check if contract actually owns the nft
exports.claimLocalNft = async (req, res) => {
  const { user_id, nft_id, price } = req.body;

  if (!user_id || !nft_id) {
    res.status(500).json({ message: 'Missing user_id or nft_id' });
  }
  try {
    let user_inst = await user.findOne({
      where: {
        id: user_id,
      },
    });

    console.log(user_inst.dataValues.email);

    if (!user_inst) {
      res.status(500).json({ message: 'User does not exist' });
    }

    let nft = await merchandise.findOne({
      where: {
        id: nft_id,
      },
      include: [
        {
          model: collections,
          as: 'collection',
          attributes: ['contract_address'],
        },
      ],
    });
    if (!nft) {
      res.status(500).json({ message: 'Nft does not exist' });
      return;
    } else if (nft.dataValues.collection.dataValues.type !== 'CLAIMANDSHIP') {
      res.status(500).json({ message: 'Nft is not claimable' });
      return;
    }
      
    let balanceOfToken = await this.getTokenBalanceOfAdmin(
      nft.dataValues.collection.dataValues.contract_address,
      nft.dataValues.token_id
    );
    console.log('Token Balance ==>', balanceOfToken);
    if (balanceOfToken <= 0)
      throw { message: 'Owner accound does not have enough tokens to claim' };

    console.log(user_id, nft_id);
    let localnft_inst = await localnfts.findOne({
      where: {
        user_id: user_id,
        nft_id: nft_id,
      },
    });
    let localnft = null;
    if (localnft_inst) {
      console.log('NFT EXISTS', localnft_inst);
      localnft = await localnfts.update(
        {
          number: localnft_inst.dataValues.number + 1,
        },
        {
          where: {
            id: localnft_inst.dataValues.id,
          },
        }
      );
    } else {
      localnft = await localnfts.create({
        user_id: user_id,
        nft_id: nft_id,
        number: 1,
      });
    }
    res.status(200).json({ message: 'Nft claimed', localnft });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// TODO: Add check if contract actually owns the nft
exports.claimlNftToWallet = async (req, res) => {
  const { user_id, nft_id, wallet_address, toDelete, price } = req.body;
  console.log('claim nft', user_id, nft_id, price);

  try {
    if(price == 0) {
      return res.status(500).json({message : "Please enter a valid price in ApeX"})
    }
    let user_inst = await user.findOne({
      where: {
        id: user_id,
      },
    });

    if (!user_inst) {
      res.status(500).json({ message: 'User does not exist' });
      return;
    }
    // if (!user_inst.dataValues.wallet_address) {
    //     res.status(500).json({ message: 'User Has No Wallet Connected' });
    //     return;
    //   }
    // console.log("user Exits", user_inst)

    let nft = await merchandise.findOne({
      where: {
        id: nft_id,
      },
      include: [
        {
          model: collections,
          as: 'collection',
          attributes: ['contract_address', 'type'],
        },
      ],
    });
    console.log("nft Exits",nft.dataValues)
    if (!nft) {
      res.status(500).json({ message: 'Nft does not exist' });
    } else if (nft.dataValues.collection.dataValues.type !== 'CLAIMANDSHIP') {
      console.log(nft.dataValues.collection.dataValues.type);
      res.status(500).json({ message: 'Nft is not claimable' });
      return;
    }

    let balanceOfToken = await this.getTokenBalanceOfAdmin(
      nft.dataValues.collection.dataValues.contract_address,
      nft.dataValues.token_id
    );

    console.log('Token Balance =>', balanceOfToken);
    if (balanceOfToken <= 0)
      throw { message: 'Owner accound does not have enough tokens to claim, please contact admin' };

    let ts = await this.claimTokenFromAdmin(
      nft.dataValues.collection.dataValues.contract_address,
      nft.dataValues.token_id,
      wallet_address
    );

    if(toDelete) {
      let localNft_inst = await localnfts.findOne({
        where: {
          user_id: user_id,
          nft_id: nft_id,
        },
      });

      if( localNft_inst.dataValues.number > 1) {
        await localnfts.update(
          {
            number: localNft_inst.dataValues.number - 1,
          },
          {
            where: {
              id: localNft_inst.dataValues.id,
            },
          }
        );
      } else {
        await localnfts.destroy({
          where: {
            id: localNft_inst.dataValues.id,
          },
        });
      }
    }

    res.status(200).json(ts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getNftsOfUser = async (req, res) => {
  const user_id = req.params.user_id;
  console.log('getLocalNft', user_id);

  try {
    let nfts = await localnfts.findAll({
      where: {
        user_id: user_id,
        number: {
          [Op.gt]: 0,
        }
      },
      include: [
        {
          model: merchandise,
          as: 'merchandise',
        },
      ],
    });
    console.log(nfts.dataValues);
    res.status(200).json(nfts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getLocalNftById = async (req, res) => {
  const id = req.params.id;
  console.log('getLocalNft', id);

  try {
    let nfts = await localnfts.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: merchandise,
          as: 'merchandise',
          include: [
            {
              model: collections,
              as: 'collection',
              attributes: ['contract_address','type'],
            },
          ]
        },
      ],
    });
    console.log("localNFT",nfts);
    res.status(200).json(nfts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getLocalNftByNftId = async (req, res) => {
  const id = req.params.id;
  console.log('getLocalNft', id);

  try {
    let nfts = await localnfts.findOne({
      where: {
        nft_id: id,
      },
      include: [
        {
          model: merchandise,
          as: 'merchandise',
          include: [
            {
              model: collections,
              as: 'collection',
              attributes: ['contract_address','type'],
            },
          ]
        },
      ],
    });
    console.log("localNFT",nfts);
    res.status(200).json(nfts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.getTokenBalanceOfAdmin = async (address, token_id) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://polygon-rpc.com'
  );
  const contract = new ethers.Contract(address, NFTABI, provider);
  const tx = await contract.balanceOf(process.env.OWNER_ADDRESS, token_id);
  // const receipt = await tx.wait();
  console.log('Tokens', tx.toNumber());
  return tx.toNumber();
};

exports.claimTokenFromAdmin = async (address, token_id, userAddress) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-rpc.com'
    );
    const signer = new ethers.Wallet(process.env.OWNER_PV_KEY, provider);
    const contract = new ethers.Contract(address, NFTABI, signer);
    const tx = await contract.safeTransferFrom(
      process.env.OWNER_ADDRESS,
      userAddress,
      token_id,
      1,
      '0x',
      {
        gasLimit: 1000000,
        gasPrice: ethers.utils.parseUnits('60', 'gwei'),
      }
    );
    console.log(tx);
    const receipt = await tx.wait();
    console.log('Tokens', receipt);
    return receipt;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// const burnNft = async () => {
//   try {
//     const providers = new ethers.providers.Web3Provider(
//       window.ethereum,
//       'any'
//     );
//     const contract = new ethers.Contract(
//       product.collection.contract_address,
//       NFTABI,
//       providers.getSigner(user.user_instance.wallet_address)
//     );
//     const tx = await contract.burnAndClaim(product.token_id);
//     const receipt = await tx.wait();
//     console.log("BURN",receipt);
//     return receipt;
//   } catch (error) {
//     throw {
//         type: 'contract',
//         error: error
//     }
//   }
// }
