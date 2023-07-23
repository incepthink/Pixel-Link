import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../utils/Store";
import Image from "next/image";
import axios from "axios";
import { ethers } from "ethers";
import NFTABI from "../../utils/NftApparelABI.json";
import NFTClaimedABI from "../../utils/NftApparelClaimedABI.json";

import { useRouter } from "next/router";

export default function ConfirmationPage() {
  const { state, dispatch } = useContext(StoreContext);

  const [sku, setSku] = useState("");

  const router = useRouter();

  const user = state.user;

  const token = state.jwt;

  const addressID = state.addressID;

  const cart = state.cart;

  const [address, setAddress] = useState({});
  const [burnStatus, setBurnStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  console.log(cart[0]);

  // length of the cart variations
  // useEffect(() => {
  //   if (user.user_instance && token) {
  //     // console.log(cart);
  //     axios
  //       .get("/backend/shippings/shipping/" + addressID, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         setAddress(res.data);
  //       });
  //   }

  //   let tempSKU = "M" + cart[0].id;

  //   for (let i = 0; i < cart[0].variations.length; i++) {
  //     Object.keys(cart[0].variations[i]).map((key, index) => {
  //       // console.log(key);
  //       // console.log(cart[0].variations[i][key]);
  //       tempSKU +=
  //         "-" +
  //         cart[0].variations[i][key].id +
  //         cart[0].variations[i][key].options.value_id;
  //       console.log(tempSKU);
  //     });

  //     console.log(cart[0].variations[i]);
  //   }

  //   setSku(tempSKU);
  // }, []);

  const handleConfirm = async () => {
    if (user.user_instance && token) {
      const order = {
        user_id: user.id,
        address_id: addressID,
        cart: cart,
        sku: sku,
      };

      console.log(order);
      await burnNft();
      await axios
        .post("/backend/orders/createOrder", order, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          // dispatch({
          //   type: "EMPTY_CART",
          // });
          router.push("/orders");
        });
    }
  };

  const [NFTClaimedContract, setNFTClaimedContract] = useState("");
  const [NFTCONTRACT, setNFTCONTRACT] = useState("");
  const [tokenId, settokenId] = useState("");
 

  // useEffect(() => {
  //   if(cart&& cart[0])
  //   setNFTClaimedContract(cart[0]["contract_claim_address"])
  //   setNFTCONTRACT(cart[0]["contract_address"]);
  //   settokenId(cart[0]["token_id"])
  // }, []);
  
  
  const burnNft = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        NFTClaimedContract,
        NFTClaimedABI,
        signer
      );
      let address = state.user.user_instance.wallet_address;
      //Get ID and Ammount from state
      let transaction = await contract.claimNFT(address, tokenId, 1);
      // let transaction = await contract.claimNFT(address, 1, 1);
      setIsLoading(true);
      await transaction.wait();
      setIsLoading(false);
      console.log(transaction);
    } catch (e) {
      console.log(e);
    }
  };

  const allowBurn = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      let contract = new ethers.Contract(NFTCONTRACT, NFTABI, signer);
      // console.log(contract);
      let transaction = await contract.setApprovalForAll(
        NFTClaimedContract,
        true
      );
      setIsLoading(true);
      await transaction.wait();
      setIsLoading(false);
      setBurnStatus(true);
      console.log(transaction);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBurn = async () => {
    allowBurn();
  };

  return (
    <>
      {cart && (
        <div className="flex flex-col text-center mt-10">
          <p className="text-2xl font-bold">Confirmation Page</p>

          <div className="grid">
            {/* <div
              className={` grid gap-5 border-4  p-2 mt-4`}
            >
              <div className="gap-y-2 grid">
                <p className=" font-bold">Sr. No.</p>
                {cart.map((item, index) => {
                  return <p className="font-bold">{index + 1}</p>;
                })}
              </div>
              <div className="gap-y-2 grid">
                <p className=" font-bold">Token ID</p>
                {cart.map((item) => {
                  return <p className="font-bold">{item.product.token_id}</p>;
                })}
              </div>
              <div className="flex flex-col items-center">
                <p className=" font-bold">Picture</p>
                {cart.map((item) => {
                  return (
                    <Image
                      src={item.product.nft_image_url}
                      width={100}
                      height={100}
                      objectFit="contain"
                    />
                  );
                })}
              </div>
              <div className="grid gap-y-2">
                <p className=" font-bold">Collection</p>
                {cart.map((item) => {
                  return (
                    <p className="font-bold">{item.product.collection_id}</p>
                  );
                })}
              </div>

              {cart?.[0]&& cart[0].variations.map((item, index) => {
                return (
                  <div className="grid gap-y-2">
                    {Object.keys(item).map((key) => {
                      return (
                        <div className="grid gap-y-2">
                          <p className=" font-bold">{key}</p>
                          <p className="font-bold">{item[key].options.name}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              <div className="grid gap-y-2">
                <p className=" font-bold">SKU</p>

                <p className="font-bold">{sku}</p>
              </div>

            </div> */}
          </div>

          <div className="grid">
            <div className="grid-cols-2 gap-3 grid">
              <div className="flex flex-col border-2">
                <p className="text-xl font-bold">Shipping Address</p>

                <div className="grid grid-cols-2 p-2 ">
                  <div className="grid gap-5 border-4  p-2">
                    <p className=" font-bold">Sr. No.</p>
                    <p className=" font-bold">Country</p>
                    <p className=" font-bold">State</p>
                    <p className=" font-bold">City</p>
                    <p className=" font-bold">Address 1</p>
                    <p className=" font-bold">Address 2</p>
                  </div>
                  <div className="grid gap-5 border-4  p-2">
                    <p className=" text-sm">1</p>
                    <p className=" text-sm">{address.country}</p>
                    <p className=" text-sm">{address.state}</p>
                    <p className=" text-sm">{address.city}</p>
                    <p className=" text-sm">{address.street_address_1}</p>
                    <p className=" text-sm">{address.street_address_2}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center h-full">
                <button
                  className={`
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              isLoading && "bg-gray-500"
            } ${burnStatus && "hidden"}
                `}
                  onClick={handleBurn}
                >
                  {!isLoading ? <>Set Approval </> : <>Loading........</>}
                </button>
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                    !burnStatus && "hidden"
                  } ${isLoading && "bg-gray-500"}`}
                  onClick={handleConfirm}
                >
                  {!isLoading ? <>Confirm</> : <>Loading ........</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
