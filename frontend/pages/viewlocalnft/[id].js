import axios from "axios";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { StoreContext } from "../../utils/Store";
import LoadingModal from "../../components/Modal/LoadingModal";
import ClaimNft from "../../components/claimNft/ClaimNft";
import ClaimWithWalletModal from "../../components/Modal/ClaimWithWalletModal";
import AddWalletModal from "../../components/Modal/AddWalletModal";
import notify from '../../utils/notify';

export default function ViewLocalNft({ product }) {
  const { state, dispatch } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isNftClaimedToWallet, setIsNftClaimedToWallet] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [userWallet, setUserWallet] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  console.log("product", product);

  const router = useRouter();

  const jwt = state.jwt;
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

  const onClaimToWallet = async () => {
    if (!state.user) {
      notify("Please sign in to claim this NFT", "info");
      return;
    }
    // console.log(state.user)

    if (!state?.user?.wallet_address) {
      setShowAddWalletModal(true);
      return;
    }

    setIsLoading(true);
    try {
      let res = await axios.post(`${process.env.API}/localnft/claimtowallet`, {
        user_id: state.user.id,
        nft_id: product.merchandise.id,
        wallet_address: state.user.wallet_address,
        toDelete: true,
      });
      console.log("SUCCESS", res);
      setTransactionHash(res.data.transactionHash);
      setUserWallet(res.data.wallet_address);
      setIsNftClaimedToWallet(true);
      notify("NFT claimed successfully!", "success");
    } catch (err) {
      if (err?.response?.data?.message) {
        notify(err?.response?.data?.message, 'error');
      } else {
        notify(err.message, 'error');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-screen w-full  font-gothom_pro  ">
      <AddWalletModal
        showModal={showAddWalletModal}
        setshowModal={setShowAddWalletModal}
      />
      <ClaimWithWalletModal
        showModal={isNftClaimedToWallet}
        setShowModal={setIsNftClaimedToWallet}
        userWallet={userWallet}
        transactionHash={transactionHash}
        onConfirm={(e) => router.push("/user/myNfts")}
      />
      <LoadingModal showModal={isLoading} />

      <ClaimNft
        product={product.merchandise}
        onClaimToWallet={onClaimToWallet}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data: product } = await axios.get(
    `${process.env.API}/localnft/getLocalNftById/${id}`
  );

  console.log("Product", product);

  return {
    props: {
      product,
    },
  };
}