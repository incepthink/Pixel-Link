import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { StoreContext } from "../../../utils/Store";
import axios from "axios";
import AdminLayout from "../../../components/layouts/AdminLayout";
import Link from "next/link";
import AlertModal from "../../../components/Modal/AlertModal";
import LoadingModal from "../../../components/Modal/LoadingModal";

const edit = () => {
  const router = useRouter();
  const { id } = router.query;

  const { state, dispatch } = useContext(StoreContext);
  const { jwt } = state;
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

  const [loading, setLoading] = useState(false);

  const [merch, setMerch] = useState({});

  const [collections, setCollections] = useState([]);
  const [collectionIndex, setCollectionIndex] = useState(0);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(async () => {
    if (id) {
      const fetchedData = await axios.get(
        `/backend/merchandise/singleMerch/${id}`
      );
      console.log(fetchedData.data);
      setMerch({
        token_id: fetchedData.data.token_id,
        collection_id: fetchedData.data.collection_id,
        description: fetchedData.data.description,
        nft_image_url: fetchedData.data.nft_image_url,
        opensea_link: fetchedData.data.opensea_link,
        name: fetchedData.data.name,
        type: fetchedData.data.type,
        claimable: fetchedData.data.claimable,
        price: fetchedData.data.price,
      });
    }
  }, [id]);

  useEffect(() => {
    console.log(merch);
  }, [merch]);

  const getCollections = async () => {
    try {
      const res = await axios.get(`/backend/collections/`);
      if (res.data.length == 0) {
        setErrorText(
          "Sorry, No Collections found. Please add collection first."
        );
        setShowAlertModal(true);
      }
      setCollections(res.data);
    } catch (err) {
      setErrorText("Sorry, error getting collections");
      setShowAlertModal(true);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const editMerch = async (e) => {
    e.preventDefault();
    if (collections.length == 0) {
      setErrorText("Need atleast one collection");
      setShowAlertModal(true);
    }
    if (!String(merch.token_id).match(/^-?\d+$/)) {
      setErrorText("Enter valid tokenID");
      setShowAlertModal(true);
      return;
    }
    if (merch.name.length == 0) {
      setErrorText("Please give item a name!");
      setShowAlertModal(true);
      return;
    }
    setLoading(true);
    console.log(merch);
    try {
      const { data } = await axios.post("/backend/merchandise/editMerch", {
        ...merch,
        collection_id: collections[collectionIndex].id,
        id:id,
      });
      console.log(data);
      // Router.reload();
      setLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
      // console.log(err.response)
      if (err?.response?.data?.msg) {
        setErrorText(err.response.data);
        setShowAlertModal(true);
      } else {
        setErrorText("Sorry, an error occured!");
        setShowAlertModal(true);
      }
    }
  };

  return (
    <div className="flex text-gray-800">
      <AlertModal
        showModal={showAlertModal}
        setShowModal={setShowAlertModal}
        text={errorText}
        type="error"
      />
      <AlertModal
        showModal={showSuccessModal}
        setShowModal={setShowSuccessModal}
        text="Merchandise Updated Successfully"
        type="success"
        onConfirm={() => {
            router.push("/admin/merchandise");
          }}
      />
      <LoadingModal showModal={loading} />
      <AdminLayout>
        <div className=" w-full container   mx-5  ">
          <div className="flex flex-col ">
            <div className=" flex flex-col ">
              <div className=" font-bold  text-2xl text-custom-blue mb-10">
                Edit Merchandise
              </div>
              <form onSubmit={editMerch}>
                <div className="flex flex-wrap justify-start">
                  <div className="text-left mb-5 mr-2 w-[18rem]">
                    <label className="text-white text-sm font-bold mb-2 mt-2">
                      Select Contract
                    </label>

                    <select
                      value={collectionIndex}
                      className="shadow  border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                      onChange={(e) => setCollectionIndex(e.target.value)}
                    >
                      {collections.map((collection, i) => (
                        <option key={i} value={i}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left mb-5 mr-2 w-[18rem]">
                    <label className="text-white text-sm font-bold mb-2">
                      Token ID
                    </label>
                    <input
                      className="shadow appearance-none border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Enter Token ID"
                      value={merch.token_id}
                      onChange={(e) =>
                        setMerch({ ...merch, token_id: e.target.value })
                      }
                    />
                  </div>
                  <div className="text-left mb-5 mr-2 w-[18rem]">
                    <label className="text-white text-sm font-bold mb-2">
                      Name
                    </label>
                    <input
                      className="shadow appearance-none border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Name"
                      value={merch.name}
                      onChange={(e) =>
                        setMerch({ ...merch, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* <button
                      className='bg-slate-500 hover:bg-slate-700 text-white h-10 font-bold py-2 px-4 rounded transition-all'
                      type='button'
                      onClick = {fetchNFTData}
                      >
                      Fetch NFT Data
                    </button> */}
                <div className="flex flex-wrap justify-start">
                  <div className="text-left mb-5 mr-2 w-[18rem]">
                    <label className="text-white text-sm font-bold mb-2 mt-2">
                      Type
                    </label>

                    <select
                      value={merch.type}
                      className="shadow  border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                      onChange={(e) =>
                        setMerch({ ...merch, type: e.target.value })
                      }
                    >
                      <option key="0" value="thisrt">
                        T-Shirt
                      </option>
                      <option key="1" value="hoodie">
                        Hoodie
                      </option>
                      <option key="2" value="cap">
                        Cap
                      </option>
                      <option key="3" value="mug">
                        Mug
                      </option>
                      <option key="4" value="other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div className="text-left mb-5 mr-2 w-[18rem]">
                    <label className="text-white text-sm font-bold mb-2 mt-2">
                      Image URL
                    </label>

                    <input
                      className="shadow appearance-none border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Image URL"
                      value={merch.nft_image_url}
                      onChange={(e) =>
                        setMerch({
                          ...merch,
                          nft_image_url: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="text-left mb-5 mr-2 w-[18rem]">
                    <label className="text-white text-sm font-bold mb-2 mt-2">
                      OpenSea Link
                    </label>

                    <input
                      className="shadow appearance-none border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="OpenSea Link"
                      value={merch.opensea_link}
                      onChange={(e) =>
                        setMerch({
                          ...merch,
                          opensea_link: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="text-left mb-5 mr-2 w-1/2">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Description
                  </label>

                  <input
                    className="shadow appearance-none border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Description"
                    value={merch.description}
                    onChange={(e) =>
                      setMerch({
                        ...merch,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="text-left mb-5 mr-2 w-1/2">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Price
                  </label>

                  <input
                    className="shadow appearance-none border bg-transparent rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Description"
                    value={merch.price}
                    onChange={(e) =>
                      setMerch({
                        ...merch,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="text-left mb-5 mr-2 w-1/2">
                  <label className="text-white text-sm font-bold mb-2 mt-2 pr-3">
                    Claimable
                  </label>

                  <input
                    className="form-check-input  h-4 w-4 border border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="checkbox"
                    onChange={(e) =>
                      setMerch({
                        ...merch,
                        claimable: !merch.claimable,
                      })
                    }
                    checked={merch.claimable}
                  />
                </div>

                {/* Submit */}
                <div>
                  <Link href="/admin/merchandise">
                    <button className="bg-custom-blue/90 hover:bg-custom-blue text-white font-bold py-2 px-4 rounded transition-all mr-4">
                      Cancel
                    </button>
                  </Link>
                  <button
                    className="bg-custom-blue/90 hover:bg-custom-blue text-white font-bold py-2 px-4 rounded transition-all"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default edit;
