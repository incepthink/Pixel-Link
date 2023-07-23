import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../utils/Store";
import { ethers } from "ethers";
import NFTABI from "../../../utils/NftApparelABI.json";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../../components/layouts/AdminLayout";
import TableComponent from "../../../components/adminPanel/TableComponent";

export default function merchandise() {
  const { state, dispatch } = useContext(StoreContext);

  const { jwt } = state;

  const [merchandise, setMerchandise] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pageNo, setPageNo] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [newMerch, setNewMerch] = useState({});

  const [collections, setCollections] = useState([]);
  const router = useRouter();

  const collectionID = useRouter().query.collectionID
    ? useRouter().query.collectionID
    : null;

  const getCollections = async () => {
    const res = await axios.get(`/backend/collections/`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    setCollections(res.data);
    setNewMerch({
      ...newMerch,
      collection_id: res?.data[0]?.id,
    });
  };

  const getContractInfo = async () => {
    let contractAddr = newMerch["contract_address"];
    let token_id = newMerch["token_id"];
    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      if (contractAddr.length === 42) {
        let contract = new ethers.Contract(contractAddr, NFTABI, providers);
        // let address = state.user.user_instace.wallet_address;

        let uri = await contract.uri(token_id);
        let contractData = await axios.get(uri);
        contractData = contractData.data;
        // console.log(contractData);
        let tmpCollection = newMerch;
        // tmpCollection["name"] = contractData["name"];
        // tmpCollection["description"] = contractData["description"];
        tmpCollection["nft_image_url"] = contractData["image"];
        // tmpCollection["website_link"] = contractData["external_url"];
        tmpCollection["contract_address"] = contractAddr;
        tmpCollection["token_id"] = token_id;
        setNewMerch(tmpCollection);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const getMerchEdit = async (id) => {
    const res = await axios.get(`/backend/merchandise/singleMerch/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    console.log(res);

    setNewMerch(res.data);
  };

  const deleteMerch = async (id) => {
    const res = await axios.delete(`/backend/merchandise/deleteMerch/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(res);
    setMerchandise(merchandise.filter((merch) => merch.id !== id));
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/backend/merchandise/forTable?pageNo=${pageNo}&search=${search}&collectionID=${collectionID}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        setMerchandise(res.data.merchs);
        setTotalPages(res.data.totalPages);
        getCollections();
        setLoading(false);

        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [pageNo, search, collectionID]);

  return (
    <div className="flex">
      <AdminLayout>
        <div className="p-4 text-white w-full container col-span-4 text-center mx-5  ">
          <div className=" font-bold justify-center flex items-center text-2xl text-custom-blue mb-5 ">
            Manage your Merchendise
          </div>
          <div className="flex justify-between">
            <div className=" flex-1 max-w-sm">
              <input
                className="p-2 border-2 bg-transparent border-custom-blue rounded-lg w-3/4 mr-2 placeholder-gray-200"
                type="text"
                placeholder="Search for a collection"
              ></input>
              <button
                className=" px-4 py-2 rounded-lg bg-custom-blue/90 hover:bg-custom-blue  transition-all"
                type="submit"
              >
                Search
              </button>
            </div>
            <Link href="merchandise/add">
              <button
                className=" px-4 py-2 rounded-lg bg-custom-blue/90 hover:bg-custom-blue transition-all"
                type="submit"
              >
                {" "}
                + Add Merchandise
              </button>
            </Link>
          </div>
          <div className="">
            {/* TABLE */}
            <div className="relative overflow-x-auto rounded-lg">
              <TableComponent keys={{
                "Merch Id": { type: "param", value: "id" },
                "Token Id": { type: "param", value: "token_id" },
                Name: { type: "param", value: "name" },
                Collection: { type: "param", value: "collection.name" },
                Manage: { type: "button", value: "Manage" },
                Edit: {
                  type: "button", value: "Edit", onClick: async (id) => {
                    router.push('/admin/merchandise/edit?id=' + id)
                  }
                },
                Delete: {
                  type: "button", value: "Delete", onClick: async (id) => {
                    deleteMerch(id);
                  }                    
                 },
              }} object={merchandise} />
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
