import Head from "next/head";
import axios from "axios";
// import Image from "next/image";
import Filters from "../../components/Filters";
import { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../utils/Store";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import NFTABI from "../../utils/NftApparelABI.json";
import styles from "../../components/Navbar.module.css";
import UserLayout from "../../components/layouts/UserLayout";
import TransparentButton from "../../utils/buttons/TransparentButton";
import TransferModal from "../../components/Modal/TransferModal";

export default function Catalog({ collectionList }) {
  const { state, dispatch } = useContext(StoreContext);
  const [transferClicked,setTransferClicked] = useState(false);
  console.log("USER", state.user);

  const router = useRouter();

  const [localNFTs, setLocalNFTs] = useState([]);

  const [myNFTs, setMyNFTs] = useState([]);

  const getOwnedTokens = async (contract_address, contract_id) => {
    // console.log(collection);
    // Promise.all(
    // collectionList.map(async (collection) => {
    // console.log(collection);
    try {
      // console.log(collection);
      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com"
      );
      let contract = new ethers.Contract(contract_address, NFTABI, provider);
      console.log(contract);
      let address = state.user.wallet_address;
      let tokens = await contract.tokensOfOwner(address);
      tokens = tokens.map((token) => token.toNumber());
      // console.log('TOKENS', tokens);
      tokens = tokens.map((t, i) => {
        return {
          id: t,
          contract_id: contract_id,
        };
      });
      // tokens = tokens.filter((t) => t.quantity > 0);
      // console.log("got tokens",tokens);
      return tokens;
      // setOwnedTokens(tokens);
    } catch (e) {
      console.log(e);
    }
    // })
    // );
  };

  const fetchMyNFTs = async () => {
    if (!state?.user?.wallet_address) return;
    console.log("Fetching");
    let tokens = [];

    await Promise.all(
      collectionList.map(async (collection) => {
        let gotTokens = await getOwnedTokens(
          collection.contract_address,
          collection.id
        );
        // console.log("__>>", gotTokens)
        tokens = tokens.concat(gotTokens);
      })
    );
    // let tokens = await getOwnedTokens();
    console.log("tokens request", tokens);
    try {
      // const allmyNFTs = await axios.post(
      //   `${process.env.API}/merchandise/getallbyIDs`,
      //   tokens
      // );
      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("chainId",chainId)
      let allmyNFTs= []
      if (chainId == "0x89") {
         allmyNFTs = [ {
          id: 15,
          nft_image_url: "https://hash-collect.s3.ap-south-1.amazonaws.com/fcea3c8c-9008-4772-9114-937bc2fe661d.jpeg",
          description: "Noun 1 is a member of the Nouns DAO",
          name: "NOUN#1 on ZKev",
          collection: {
            id:2,
            name:"Base Collection on Polygon ZK ev"
          }
        },
      
      ]
      } 
      if (chainId == "0x64") {
         allmyNFTs = [
        {
          id: 16,
          nft_image_url: "https://hash-collect.s3.ap-south-1.amazonaws.com/b923dd95-3df3-4b38-9d4d-b6fc12d08daf.jpeg",
          description: "Get a free pair of glasses at Nouns Conference",
          name: "Glasses Utility",
          collection: {
            id:3,
            name:"Gnosis Contract"
          }
        },
        // {
        //   id: 17,
        //   nft_image_url: "https://hash-collect.s3.ap-south-1.amazonaws.com/b923dd95-3df3-4b38-9d4d-b6fc12d08daf.jpeg",
        //   description: "Access to the Foxes Community Lounge",
        //   name: "Team Fox",
        //   collection: {
        //     id:3,
        //     name:"Gnosis Contract"
        //   }
        // },
        // {
        //   id: 18,
        //   nft_image_url: "https://hash-collect.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-07-23+at+02.05.08.jpeg",
        //   description: "Your ticket to Nouns Convention",
        //   name: "NOUNS Member",
        //   collection: {
        //     id:3,
        //     name:"Gnosis Contract"
        //   }
        // },
  
      
      
      ]
     } 
      console.log("MY NFTS", allmyNFTs);
      setMyNFTs(allmyNFTs);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyLocalNFTs = async () => {
    // console.log("tokens request",tokens,process.env.API );
    if (!state?.user?.id) return;
    try {
      const localnfts = await axios.get(
        `${process.env.API}/localnft/getNftsOfUser/${state.user.id}`
      );
      console.log("MY NFTS", localnfts.data);
      setLocalNFTs(localnfts.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMyNFTs();
    fetchMyLocalNFTs();
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    const offset = selectedPage * 28;
    router.push(`/catalog?collection=${collection.id}&pageNo=${selectedPage}`);
  };

  const MyNFTComponent = () => {
    return (
      <div className="w-full flex flex-wrap items-center  mx-auto ">
        {myNFTs.map((nft, index) => {
          if (nft)
            return (
              <div className=" mx-4 my-6">
                <div key={nft.id}>
                  {collectionItem(nft, false, false)}
                </div>
              </div>
            );
        })}
      </div>
    );
  };

  const LocalNFTComponent = () => {
    return (
      <div className="w-full flex flex-wrap items-center  mx-auto ">
        {localNFTs.map((nft, index) => {
          if (nft)
            return (
              <div className="mx-6 my-6">
                <Link
                  href={"/viewlocalnft/" + nft.id}
                  key={nft.merchandise?.id}
                >
                  {collectionItem(nft.merchandise, false, true)}
                </Link>
              </div>
            );
        })}
      </div>
    );
  };

  const collectionItem = (nft, heart, isLocal) => {
    return (
      <Link href={`/viewNFT/${nft.id}`}>
      <div className="bg-gray-800 rounded-lg cursor-pointer p-4 max-w-sm w-[320px]  flex flex-col justify-between items-center">
        <img
          src={nft?.nft_image_url}
          alt="img"
          className="w-[250px] h-[320px] object-center object-cover"
        />
        <div className=" w-full my-3">
          <h1 className="text-xl font-semibold tracking-wide  text-left w-full">
            {nft?.name}
          </h1>
          <h1 className="font-light  tracking-wide  text-left w-full text-sm text-gray-300 ">
            {nft?.['collection.name']}
          </h1>
        </div>
        <div className="mx-auto w-full flex justify-between items-center mt-2">
          {/* <button className="flex justify-around w-36 text-white py-3 px-3 md:px-4 border-[1px] border-white rounded-sm">
            <h1>{nft?.claimable ? <>Claim now</> : <>View</>}</h1>
            <h1>-{">"}</h1>
          </button> */}
          {/* <TransparentButton height="60" width="180" onClick={()=>setTransferClicked(true)}>
            
            View
          </TransparentButton> */}

          <img
            src={heart ? "/icons/heart.png" : "/icons/heart-outlined.png"}
            alt="img"
            className={heart ? "w-14" : "w-6"}
          />
        </div>
      </div>
      </Link>
    );
  };

  return (
    <div className="w-full h-full">
      <TransferModal showModal={transferClicked} setShowModal={setTransferClicked} />
      <div className="w-full h-[25vh] md:h-[26vh]  bg-cover flex justify-center items-end text-white">
        <div className="w-full  justify-center p-4 text-center">
          <h1 className={"text-2xl my-2 w-full " }>
            My Wallet
          </h1>
          <p>Explore your NFTs</p>
        </div>
      </div>

      <div className="w-full pt-12 text-white font-manrope px-4 md:px-10 lg:px-20 xl:px-36 min-h-screen">
        <div className="">
        </div>
        {myNFTs.length === 0 ? (
          <div className=" min-h-[400px]">
            <div className="flex items-center justify-center bg-custom-blue/20 p-16 my-4 rounded-lg">
              <h1 className="text-2xl text-custom-blue">
                No NFTs in your On-Chain Wallet
              </h1>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full py-8 block mx-auto ">
              {myNFTs.length ? <MyNFTComponent /> : null}
            </div>
          </>
        )}
        {/* <div className="">
          <h1 className="text-3xl text-custom-blue">Local Wallet</h1>
        </div> */}
        {/* {localNFTs.length === 0 ? (
          <div className=" min-h-[400px]">
            <div className="flex items-center justify-center bg-custom-blue/20 p-16 my-4 rounded-lg">
              <h1 className="text-2xl text-custom-blue">
                No NFTs in Local Wallet
              </h1>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full py-8">
              {localNFTs.length ? <LocalNFTComponent /> : null}
            </div>
          </>
        )} */}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // console.log(context.query);

  const pageNo = context.query.pageNo ? context.query.pageNo : 0;

  // const collection = await axios
  //   .get(`${process.env.API}/collections/byId/1`)
  //   .then((res) => res.data);

  // const results = await axios.get(
  //   `${process.env.API}/merchandise/getall/` + pageNo
  // );

  const allCollections = await axios.get(
    `${process.env.API}/collections/getallNames`
  );
  console.log(allCollections.data);

  return {
    props: {
      collectionList: allCollections.data,
    },
  };
}
