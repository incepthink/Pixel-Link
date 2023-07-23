import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { StoreContext } from "../../../utils/Store";
import axios from "axios";
import AdminLayout from "../../../components/layouts/AdminLayout";
import Link from "next/link";
import AlertModal from "../../../components/Modal/AlertModal";

const edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState({});
  const [collection, setCollection] = useState({
    id:"",
    name: "",
    contract_address: "",
    blockchain: "",
    website_link: "",
    image: "",
    description: "",
  });
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState("");

  const { state, dispatch } = useContext(StoreContext);

  const { user, jwt } = state;
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

  useEffect(async () => {
    if (id) {
      const fetchedData = await axios.get(`/backend/collections/byId/${id}`);
      setCollection({
        id: fetchedData.data.id,
        name: fetchedData.data.name,
        contract_address: fetchedData.data.contract_address,
        blockchain: fetchedData.data.blockchain,
        website_link: fetchedData.data.website_link,
        image: fetchedData.data.image,
        description: fetchedData.data.description,
      });
      console.log(fetchedData.data);
    }
  }, [id]);

  const validate = () => {
    console.log(collection);
    if (collection?.name.length == 0) {
      return { success: false, error: "Please provide a name!" };
    }
    if (collection?.contract_address.length == 0) {
      return { success: false, error: "Please provide the Contract Address" };
    }
    if (collection?.contract_address.length !== 42) {
      return { success: false, error: "Invalid Contract Address" };
    }

    return { success: true, error: "" };
  };

  const editCollection = async (e) => {
    e.preventDefault();
    try {
      let valid = validate(collection);
      if (valid.success) {
        const data = await axios.post("/backend/collections/editCollection", {
          ...collection,
        });
        console.log(data);
        setShowSuccessModal(true);
      } else {
        setErrorText(valid.error);
        setShowAlertModal(true);
        console.log("Fill all the fields");
      }
    } catch (err) {
      console.log(err.response.data);
      if (err?.response?.data) {
        // console.log(err.response.data);
        setErrorText(err.response.data);
        setShowAlertModal(true);
      } else {
        setErrorText("Sorry something went wrong");
        setShowAlertModal(true);
      }
    }
  };

  return (
    <div className="flex text-gray-800">
      {/* {AletModalComponent()} */}
      <AlertModal
        showModal={showAlertModal}
        setShowModal={setShowAlertModal}
        text={errorText}
        type="error"
      />
      <AlertModal
        showModal={showSuccessModal}
        setShowModal={setShowSuccessModal}
        text="Collection Updated Successfully"
        type="success"
        onConfirm={() => {
          router.push("/admin/collection");
        }}
      />
      <AdminLayout>
        <div className=" container col-span-4  justify-center mt-4 mx-5  ">
          <div className=" font-bold  text-2xl text-custom-blue mb-10">
            Edit Collection
          </div>

          <div className="  ">
            <form onSubmit={editCollection}>
              <div className="flex flex-wrap justify-start">
                <div className="text-left mb-5 mr-2 w-[18rem]">
                  <label className="text-white text-sm font-bold mb-2">
                    Collection Name
                  </label>
                  <input
                    className="shadow border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Name"
                    value={collection.name}
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="text-left mb-5 mr-2 w-[18rem]">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Blockchain
                  </label>

                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Enter Website URL"
                    value={collection.blockchain}
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        blockchain: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="text-left mb-5 mr-2 w-[18rem]">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Contract Address
                  </label>

                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Enter Contract Address"
                    value={collection.contract_address}
                    onChange={async (e) => {
                      setCollection({
                        ...collection,
                        contract_address: e.target.value,
                      });
                      // await getContractInfo(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-start">
                <div className="text-left mb-5 mr-2 w-[18rem]">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Image URL
                  </label>

                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Logo Image URL"
                    value={collection.image}
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        image: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="text-left mb-5 mr-2 w-[18rem]">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Description
                  </label>

                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Etner description"
                    value={collection.description}
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="text-left mb-5 mr-2 w-[18rem]">
                  <label className="text-white text-sm font-bold mb-2 mt-2">
                    Website Link
                  </label>

                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Enter Website URL"
                    value={collection.website_link}
                    onChange={(e) =>
                      setCollection({
                        ...collection,
                        website_link: e.target.value,
                      })
                    }
                  />
                </div>

                {/* <label className="text-white bg-transparent text-sm font-bold mb-2 mt-2">
                    Count of NFTs
                  </label>
  
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    value={collection.count}
                    onChange={(e) => {
                      setCollection({
                        ...collection,
                        count: e.target.value,
                      });
                    }}
                  ></input> */}

                {/* Submit */}
              </div>
              <div>
                <Link href="/admin/collection">
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
      </AdminLayout>
    </div>
  );
};

export default edit;
