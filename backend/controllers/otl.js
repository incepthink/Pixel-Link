const crypto = require("crypto");
const {
    merchandise,
    collections,
    localnfts,
    otl_claimables,
  } = require("../models");
const {getTokenBalanceOfAdmin} = require("../controllers/localnfts");

const algorithm = "aes-256-cbc"; 

const Securitykey = Buffer.from(process.env.SECURITY_KEY_STRING, "hex");
const initVector = Buffer.from(process.env.INIT_VECTOR_STRING, "hex");  

exports.createLink = async(req, res) => {
    const {email, merchId} = req.body
    console.log(email, merchId);

    try{
      let nft = await merchandise.findOne({
        where: {
          id: merchId,
        },
      });
      if (!nft) {
        return res.status(400).json({msg: 'Nft does not exist'});
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }

    try{
      //* Getting otl_claimable instance
      //* Finding by user_id not possible as account might not be created
      let otl_claimable_inst = await otl_claimables.findOne({
        where: {
          email: email,
          nft_id: merchId,
        },
      });

      let otl_claimable;
      if (otl_claimable_inst){
        //* updating number => number+1
        console.log("Updating Entry");
        otl_claimable = await otl_claimables.update(
          {
            number: otl_claimable_inst.dataValues.number + 1,
          },
          {
            where: {
              email: email,
              nft_id: merchId,
            },
          }
        );
      } else{
        console.log("Creating New Entry");
        //* creating new entry
        otl_claimable = await otl_claimables.create({
          email: email,
          nft_id: merchId,
          number: 1,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }

    const details = {
        email: email,
        merchId: merchId,
    }
    const detailsString = JSON.stringify(details);
    let encryptedDetails;
    try {
      const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
      encryptedDetails = cipher.update(detailsString, "utf-8", "hex");
      encryptedDetails += cipher.final("hex");
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
    
    const link = `${process.env.LINK}/otl/${encryptedDetails}`//todo change link
    console.log("Encrypted link: " + link);

    res.status(200).json({link : link})
}

exports.claim = async(req,res) => {
  const {user_email, user_id} = req.body;
  const {details} = req.query;
  let decryptedDetails;
  try{
    decryptedDetails = decrypDetails(details);
  } catch (err){
    console.log(err);
    return res.status(400).json(err);
  }

  try{
    const data = JSON.parse(decryptedDetails);
    const merchId = data.merchId;
    const email = data.email;
    
    //* Checking if both the emails match
    if(user_email !== email){
      console.log("different email addresses:", email, user_email);
      return res.status(400).json({msg: "You've signed in with the wrong email address"});
    }

    //* Checking if the nft exists and getting contract_address
    let nft = await merchandise.findOne({
      where: {
        id: merchId,
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
      return res.status(400).json({msg: 'Nft does not exist'});
    }
    
    //* Getting otl_claimable instance
    let otl_claimable_inst = await otl_claimables.findOne({
      where: {
        email: email,
        nft_id: merchId,
      },
    });
    
    if(!otl_claimable_inst.dataValues.user_id){
      //* Updating all user_ids
      let idUpdater = await otl_claimables.update(
        {
          user_id: user_id,
        },
        {
          where: {
            email: email
          },
        }
      );
    }

    if(!otl_claimable_inst){
      return res.status(400).json({msg: "Invalid Link- No instance in database"});
    }

    let otl_claimable;
    //* New users (otl users) shouldnot have an instance of claimed localnft
    if (otl_claimable_inst.dataValues.number < 1){
      return res.status(400).json({msg: "Merch Already Claimed"});
    } else{
      //* Check if there is enough balance
      let balanceOfToken = await getTokenBalanceOfAdmin(
        nft.dataValues.collection.dataValues.contract_address,
        nft.dataValues.token_id
      );
      console.log('Token Balance ==>', balanceOfToken);
      if (balanceOfToken <= 0){
        return res.status(400).json({msg: "Owner accound does not have enough tokens to claim"});
      }
      
      // //* Updating Entry For OTL_Claimables table
      otl_claimable = await otl_claimables.update(
        {
          number: otl_claimable_inst.dataValues.number - 1,
        },
        {
          where: {
            user_id: user_id,
            nft_id: merchId,
          },
        }
      );
      
      //* Finding localnft instance and updating/creating it
      let localnft_inst = await localnfts.findOne({
        where: {
          user_id: user_id,
          nft_id: merchId,
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
          nft_id: merchId,
          number: 1,
        });
      }
      return res.status(200).json({ message: 'Nft claimed', localnft });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
}

exports.getDetails = async(req,res) => {
  const {details} = req.query;
  let decryptedDetails;
  try{
    decryptedDetails = decrypDetails(details);
  } catch (err){
    console.log(err);
    return res.status(400).json(err);
  }

  try {
    const data = JSON.parse(decryptedDetails);
    const merchId = data.merchId;
    const merch = await merchandise.findByPk(merchId, {
          include: [
          {
              model: collections,
              as: "collection",
              attributes: ["id", "contract_address", "name","type"],
          },
      ],
    });
    if (!merchandise) {
      console.log("Merch not found");
      return res.status(400).json({ msg: "Merch not found for ID" });
    }
    return res.status(200).json({merch : merch});
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
}

const decrypDetails = (details) => {
  console.log(details);
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  let decryptedDetails = decipher.update(details, "hex", "utf-8");
  decryptedDetails += decipher.final("utf8");
  return decryptedDetails;
}
