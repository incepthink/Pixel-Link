import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFTSignable1155 from '../../utils/NFTSignable1155.json';

export default function NftSignatureBox({ tokenId, collectionAddress }) {
  const [signatures, setSignatures] = useState([]);
  const getSignatures = async () => {
    console.log('APPROVE', collectionAddress, tokenId);

    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      const contract = new ethers.Contract(
        collectionAddress,
        NFTSignable1155,
        providers
      );
      const tx = await contract.getSignatures(tokenId);
      console.log('signs', tx);
      setSignatures(tx);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await getSignatures();
    })();
  }, []);
  if (signatures.length > 0)
    return (
      <div className='w-full'>
        <div className='bg-custom-blue/20 p-4 md:p-8 md:pr-20 my-4 rounded-lg'>
          <div className=' text-lg font-bold mb-3'> This NFT is Signed by</div>
          {signatures.map((sign, ind) => (
            <div key={ind}>
              <div className='flex justify-between'>
                <div className='text-sky-300 font-semibold'>
                  {ind + 1}. {sign.name}
                </div>
                <div className='text-sky-200 underline cursor-pointer'>
                  <a
                    href={`https://polygonscan.com/address/${sign.wallet}`}
                    target='_blank'>
                    {' '}
                    {sign.wallet.slice(0, 4)}...
                    {sign.wallet.slice(-3)}
                  </a>
                </div>
              </div>
              <div className='text-sm font-light text-gray-200 ml-4'>
                {sign.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  else return <></>;
}
