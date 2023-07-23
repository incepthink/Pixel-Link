import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import AdminLayout from '../../../components/layouts/AdminLayout';
import { StoreContext } from '../../../utils/Store';
import { useRouter } from 'next/router';
import AlertModal from '../../../components/Modal/AlertModal';

const otl = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const { user, jwt } = state;
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

  const [email, setEmail] = useState("");
  const [merchId, setMerchId] = useState("");
  const [claimLink, setClaimLink] = useState(null);

  const [errorText, setErrorText] = useState('');
  const [isErrorModal, setIsErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(email, merchId);
    if (email.length === 0 || merchId.length === 0) {
      setErrorText('Complete the form');
      setIsErrorModal(true);
      return;
    }
    try {
      const { data } = await axios.post("/backend/otl/createLink", {
        email: email,
        merchId: merchId,
      });
      console.log(data);
      setClaimLink(data.link);
    } catch (err) {
      console.log(err);
      setErrorText(err?.response?.data?.msg);
      setIsErrorModal(true);
    }
  }

  const handleClaim = async (e) => {
    e.preventDefault();
    router.push(claimLink);
  }

  useEffect(() => {
    console.log(claimLink);
  }, [claimLink])

  return (
    <div className='w-full h-full flex'>
      <AlertModal
        showModal={isErrorModal}
        setShowModal={setIsErrorModal}
        text={errorText}
        type='error'
      />
      <AdminLayout>
        <div className="w-full flex flex-col items-center p-4">
          <form className="flex h-fit justify-center items-center p-4 " onSubmit={handleSubmit}>
            <div className="text-left mb-5 mr-2 w-[18rem]">
              <label className="text-custom-blue text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
            <div className="text-left mb-5 mr-2 w-[18rem]">
              <label className="text-custom-blue text-sm font-bold mb-2">
                Merch ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Name"
                value={merchId}
                onChange={(e) =>
                  setMerchId(e.target.value)
                }
              />
            </div>
            <button
              className="m-2 bg-custom-blue/90 hover:bg-custom-blue text-white font-bold py-2 px-4 rounded h-fit"
              type="submit"
            >
              Submit
            </button>
          </form>
          {
            claimLink ? <div className='flex justify-center items-center'>
              <button
                className="m-2 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded h-fit" onClick={handleClaim}>
                Claim
              </button>
              <div>
                <button
                  className="m-2 bg-white text-slate-700 font-bold py-2 px-4 rounded h-fit border-2 border-slate-700" onClick={() => {
                    navigator.clipboard.writeText(claimLink)
                  }}>
                  Copy Link
                </button>
              </div>
            </div> : null
          }
        </div>
      </AdminLayout>
    </div>
  )
}

export default otl