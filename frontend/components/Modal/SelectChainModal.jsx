import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import GenericModal from './GenericModal'
import notify from '../../utils/notify'
import { ethers } from 'ethers';


const styles = {
  button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

const SelectChainModal = ({showModal,setShowModal}) => {
    const router = useRouter()
    const [option, setOption] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Option ", option);
        if(option === "" || option === "Select...") {
            notify("Please Select Valid Option", "error");
        }
    }


    const changeToZksync = async () => {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('No metamask');
        notify('Please use a browser with Metamask', 'info');
        return;
      }
    
      const chainId = 1101;
      const requrestNetworkSuccess = await requestNetwork(chainId);
      if (!requrestNetworkSuccess) {
        console.log("Not able to change network");
        return;
      }
    
      
    };

    const changeToGnosis = async () => {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('No metamask');
        notify('Please use a browser with Metamask', 'info');
        return;
      }
    
      const chainId = 100;
      const requrestNetworkSuccess = await requestNetwork(chainId);
      if (!requrestNetworkSuccess) {
        console.log("Not able to change network");
        return;
      }
    
      
    };

    const changeToPolygon = async () => {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('No metamask');
        notify('Please use a browser with Metamask', 'info');
        return;
      }
    
      const chainId = 137;
      const requrestNetworkSuccess = await requestNetwork(chainId);
      if (!requrestNetworkSuccess) {
        console.log("Not able to change network");
        return;
      }
      
    };
    const changeToEthereum = async () => {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('No metamask');
        notify('Please use a browser with Metamask', 'info');
        return;
      }
    
      const chainId = 1;
      const requrestNetworkSuccess = await requestNetwork(chainId);
      if (!requrestNetworkSuccess) {
        console.log("Not able to change network");
        return;
      }
      
    };

    const requestNetwork = async (chainId) => {
      console.log(window.ethereum.networkVersion);
      if (window.ethereum.networkVersion !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(chainId) }]
          });
          setShowModal(false)
        } catch (err) {
            // This error code indicates that the chain has not been added to MetaMask
          console.log(err);
          // if (err.code === 4902) {
          //   await window.ethereum.request({
          //     method: 'wallet_addEthereumChain',
          //     params: [
          //       {
          //         chainName: 'ZKsynx',
          //         chainId: ethers.utils.hexValue(chainId),
          //         nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
          //         rpcUrls: ['https://polygon-rpc.com/']
          //       }
          //     ]
          //   });
          // } else {
          //   notify(err.message, 'error');
          //   return false;
          // }
        }
      }
      return true;
    }


    if (showModal) {
      return (
        <GenericModal heading="Select Chain" setshowModal={setShowModal} onClose={() => router.push('/user/myNfts')}>
          <div className='w-full flex flex-wrap justify-center gap-5'>
            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToEthereum()}>
            <img src='https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo.png' width="50px"/>
            </div>
            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToPolygon()}>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Polygon_Blockchain_Matic_Logo.svg/880px-Polygon_Blockchain_Matic_Logo.svg.png' width="50px"/>
            </div>
            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToEthereum()}>
            <img src='https://lite.zksync.io/images/logo-no-letters.svg' width="50px"/>
            </div>
            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToZksync()}>
            <img src='https://l2beat.com/icons/polygonzkevm.png' width="50px"/>
            </div>
            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToGnosis()}>
            <img src='https://images.ctfassets.net/t3wqy70tc3bv/6ibSou9KOCjwRMOviQ4op0/bd40955a44009d5e7a35376fb4c0a248/Aatar_green_white.png' width="50px"/>
            </div>

            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToGnosis()}>
            <img src='https://w7.pngwing.com/pngs/985/407/png-transparent-near-protocol-near-coin-cryptocoin-exchange-coins-crypto-blockchain-cryptocurrency-logo-glyph-icon.png' width="50px"/>
            </div>

            <div className='bg-black rounded-full p-2 cursor-pointer' onClick={()=> changeToGnosis()}>
            <img src='https://pbs.twimg.com/profile_images/1597775748580134914/bLhE1aY1_400x400.jpg' width="50px"/>
            </div>

            <div className='bg-white rounded-full p-2 cursor-pointer' onClick={()=> changeToGnosis()}>
            <img src='https://w7.pngwing.com/pngs/98/456/png-transparent-filecoin-fil-coin-cryptocoin-exchange-coins-crypto-blockchain-cryptocurrency-logo-glyph-icon.png' width="50px"/>
            </div>
            
            
          </div>
        </GenericModal>
      );
    } else return <div></div>;
}

export default SelectChainModal