import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import GenericModal from './GenericModal'
import notify from '../../utils/notify'

const styles = {
  button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

const TransferModal = ({showModal,setShowModal}) => {
    const router = useRouter()
    const [option, setOption] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Option ", option);
        if(option === "" || option === "Select...") {
            notify("Please Select Valid Option", "error");
        }
    }
    if (showModal) {
      return (
        <GenericModal heading="Transfer" subheading="You need to select the chain to transfer the NFT" setshowModal={setShowModal} onClose={() => router.push('/user/myNfts')}>
          <div className='w-full'>
            <form onSubmit={handleSubmit} className='w-full mx-auto flex flex-col justify-center items-center'>
                <select onChange={(e) => {setOption(e.target.value)}} className='my-4 bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs'>
                    <option className="my-2" value="Select..." selected>Select</option>
                    <option className='my-2' value="ZK Sync">Zk Sync</option>
                    <option className='my-2' value="Gnosis">Gnosis</option>
                </select>
                <button 
                    className='bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs'
                >
                    Transfer now
                </button> 
            </form>
          </div>
        </GenericModal>
      );
    } else return <div></div>;
}

export default TransferModal