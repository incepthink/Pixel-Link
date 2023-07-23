import React from 'react'
import GenericModal from './GenericModal'

const styles = {
    button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

const OrderModal = ({ token, txhash, setShowModal, showModal, onConfirm }) => {
    console.log(token);
    console.log(txhash);
    if (showModal)
        return (
            <GenericModal heading={"claimed"} setshowModal={setShowModal}>
                <div>
                    <div className='w-full grid grid-cols-5'>
                        <img src={token.nft_image_url} alt="" className='col-span-2 p-2 object-center object-cover' />
                        <div className='px-4 col-span-3 flex flex-col justify-center'>
                            <h1 className='text-xl font-semibold'>Your Order is Placed!</h1>
                            <h2 className='text-sm py-2'>
                                Your NFT is burned  and this new NFT is minted into your wallet, proving your ownership over this collectible merchandise. You will soon recieve an email with the shipment details.
                            </h2>
                            <a className='text-custom-blue text-xs text-right pr-2 underline' href={`https://polygonscan.com/tx/${txhash}`} target="_blank">Tranaction on Polygonscan</a>
                        </div>
                    </div>
                    <div className='mt-12 flex items-center justify-center'>
                        <button
                            onClick={() => {
                                console.log(onConfirm);
                                if (onConfirm) {
                                    onConfirm();
                                }
                            }}
                            className={styles.button}>
                            View My NFTs
                        </button>
                    </div>
                </div>
            </GenericModal>
        )
    else return <></>
}

export default OrderModal