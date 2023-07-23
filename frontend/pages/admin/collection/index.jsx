import React, { useContext, useState } from "react";
import { StoreContext } from "../../../utils/Store";
import axios from "axios";
import cookie from "cookie";
import { ethers } from "ethers";
import NFTABI from "../../../utils/NftApparelABI.json";
import AdminLayout from "../../../components/layouts/AdminLayout";
import Link from "next/link";
import TableComponent from "../../../components/adminPanel/TableComponent";
import { useRouter } from "next/router";
import notify from "../../../utils/notify";

export default function index({ collections }) {
  const [newCollection, setNewCollection] = useState({});

  const { state, dispatch } = useContext(StoreContext);

  const { user } = state;

  const { jwt } = state;
  const router = useRouter();
  const getCollection = async (id) => {
    try {
      const res = await axios.get(`/backend/collections/byId/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setNewCollection(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getContractInfo = async (contractAddr) => {
    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      console.log(contractAddr.length);
      if (contractAddr.length === 42) {
        let contract = new ethers.Contract(contractAddr, NFTABI, providers);
        // let address = state.user.user_instace.wallet_address;

        let uri = await contract.uri(1);
        let contractData = await axios.get(uri);
        contractData = contractData.data;
        // console.log(contractData);
        let tmpCollection = newCollection;
        tmpCollection["name"] = contractData["name"];
        tmpCollection["description"] = contractData["description"];
        tmpCollection["image"] = contractData["image"];
        tmpCollection["website_link"] = contractData["external_url"];
        tmpCollection["contract_address"] = contractAddr;
        setNewCollection(tmpCollection);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const validate = () => {
    // console.log(newCollection);
    // console.log(Object.keys(newCollection).length);
    let validity = Object.keys(newCollection).length === 7;
    return validity;
  };

  return (
    <div className="flex">
      <AdminLayout>
        <div className="text-white container col-span-4 flex flex-col justify-start text-center ">
          <div className=" font-bold justify-center flex items-center text-2xl text-custom-blue ">
            Manage your collections
          </div>

          <div className="p-5  w-full h-5/6  ">
            <div className="flex justify-between">
              <div className=" flex-1 max-w-sm">
                <input
                  className="p-2 border-2 border-custom-blue bg-transparent rounded-lg w-3/4 mr-2"
                  type="text"
                  placeholder="Search for a collection"
                ></input>
                <button
                  className=" px-4 py-2 rounded-lg text-white bg-custom-blue/90 hover:bg-custom-blue transition-all"
                  type="submit"
                >
                  Search
                </button>
              </div>
              <Link href="collection/add">
                <button
                  className=" px-4 py-2 rounded-lg text-white bg-custom-blue/90 hover:bg-custom-blue transition-all"
                  type="submit"
                >
                  {" "}
                  + Add Collection
                </button>
              </Link>
            </div>
            { /* 
              * TABLE 
            */ }
            <div className="relative overflow-x-auto rounded-lg">
              {/* <table class="w-full text-sm text-left text-slate-200  mt-10 ">
                <thead class="text-xs text-slate-700 uppercase bg-gray-300 rounded-lg text-center ">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      ID
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Contract Address
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Collection Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Delete
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Feature
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Sponsor
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr class="bg-gray-100   hover:bg-gray-200  text-slate-800 text-center">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {collection.id}
                      </th>
                      <td class="px-6 py-4">
                        {collection.contract_address.slice(0, 6)}...
                        {collection.contract_address.slice(-6)}
                      </td>
                      <td class="px-4  py-4">{collection.name}</td>

                      <td class="px-6 py-4 ">
                        <button
                          className="  text-center bg-slate-300 px-2 py-2 hover:bg-slate-400 rounded-md shadow-sm"
                          onClick={async () => {
                            await axios.post(
                              "/backend/collections/deleteCollection",
                              {
                                data: {
                                  id: collection.id,
                                },
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              }
                            );

                            collections.splice(
                              collections.findIndex(
                                (c) => c.id === collection.id
                              ),
                              1
                            );
                          }}
                        >
                          Remove
                        </button>
                      </td>
                      <td class="px-6 py-4 ">
                        <div className="text-sm ">
                          <button
                            className="  text-center bg-slate-300 px-2 py-2 hover:bg-slate-400 rounded-md shadow-sm"
                            onClick={async () => {
                              const { data } = await axios.post(
                                `/backend/collections/toggleFeatured`,
                                {
                                  collection_id: collection.id,
                                },
                                {
                                  headers: {
                                    Authorization: `Bearer ${jwt}`,
                                  },
                                }
                              );
                              console.log(data);
                            }}
                          >
                            Feature
                          </button>
                        </div>
                      </td>
                      <td class="px-6 py-4 ">
                        <button
                          className="  text-center bg-slate-300 px-2 py-2 hover:bg-slate-400 rounded-md shadow-sm"
                          onClick={async () => {
                            const { data } = await axios.post(
                              `/backend/collections/toggleSponsored/`,
                              {
                                collection_id: collection.id,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              }
                            );
                            console.log(data);
                          }}
                        >
                          Sponsor
                        </button>
                      </td>

                      <td class="px-6 py-4 ">
                        <Link href={`collection/edit?id=${collection.id}`}>
                          <button
                            onClick={async () => {
                              await getCollection(collection.id);
                            }}
                            className="  text-center bg-slate-300 px-2 py-2 hover:bg-slate-400 rounded-md shadow-sm"
                          >
                            Edit
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
              {/* // * id contract collection, delete, feature, sponsor, edit */}
              <TableComponent keys={{
                Id: { type: "param", value: "id" },
                Contract: { type: "param", value: "contract_address" },
                Name: { type: "param", value: "name" },
                Delete: {
                  type: "button", value: "Remove", onClick: async (id) => {
                    try {
                      const response = await axios.post(
                        "/backend/collections/deleteCollection",
                        {
                          data: {
                            id: id,
                          },
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${jwt}`,
                          },
                        }
                      );
                      notify(response.data.message, "success");
                    } catch (err) {
                      console.log(err);
                      if (err?.response?.data?.message) {
                        notify(err?.response?.data?.message, 'error');
                      } else {
                        notify(err.message, 'error');
                      }
                      return false;
                    }
                  },
                },
                Feature: { type: "button", value: "Feature" },
                Sponsor: { type: "button", value: "Sponsor" },
                Edit: {
                  type: "button", value: "Edit", onClick: async (id) => {
                    router.push('/admin/collection/edit?id=' + id)
                  }
                },
              }} object={collections} />
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie);

  const collections = await axios.get(`${process.env.API}/collections/`, {
    headers: {
      cookie: cookies.jwt,
    },
  });

  console.log(collections);
  return {
    props: {
      collections: collections.data,
    },
  };
}
