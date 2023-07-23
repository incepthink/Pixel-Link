import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import LeftNav from "../../components/adminPanel/LeftNav";

import TableComponent from "../../components/adminPanel/TableComponent";
import { StoreContext } from "../../utils/Store";
import { CSVLink } from "react-csv";
import AdminLayout from "../../components/layouts/AdminLayout";
import CSVDownloader from "../../components/others/CSVDownloader";

export default function orders() {
  const { state, dispatch } = useContext(StoreContext);

  const jwt = state.jwt;

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/backend/orders/", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setOrders(res.data);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchOrders();
  }, [jwt, loading]);

  const status_options = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "out for delivery", label: "Out for delivery" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div className="flex">
      <AdminLayout>
        <div className="text-white p-4 flex flex-col justify-start items-center w-full gap-y-16">
          {/* <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">NFT ID</th>
              <th className="px-4 py-2">USER ID</th>
              <th className="px-4 py-2">CREATION DATE</th>
              <th className="px-4 py-2">STATUS</th>
              <th className="px-4 py-2">ACTION</th>
            </tr>
          </thead>
          {orders.length > 0 ? (
            <tbody>
              {orders.map((order) => (
                <tr>
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.nft_id}</td>
                  <td className="border px-4 py-2">{order.user_id}</td>
                  <td className="border px-4 py-2">{order.createdAt}</td>
                  <td className="border px-4 py-2 gap-2">
                    <select
                      className="bg-white border border-gray-400 focus:outline-none focus:border-indigo-500 text-base px-4 py-2 pr-8 rounded shadow"
                      id={order.id + "status"}
                    >
                      {status_options.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          selected={order.status === option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="p-2 border-2 border-teal-400 rounded-lg w-1/2 bg-blue-400 text-white"
                      type="submit"
                      onClick={() => {
                        const status = document.getElementById(
                          order.id + "status"
                        ).value;
                        const order_id = order.id;

                        const updateOrder = async () => {
                          try {
                            const res = await axios.put(
                              `/backend/orders/updateOrder`,
                              {
                                status,
                                order_id,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              }
                            );
                            console.log(res.data);
                          } catch (e) {
                            console.log(e);
                          }
                        };
                        setLoading(false);
                        updateOrder();
                        setLoading(true);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className="p-2 border-2 border-teal-400 rounded-lg w-1/2 bg-red-300 text-white"
                      type="submit"
                      onClick={() => {
                        const order_id = order.id;

                        const deleteOrder = async () => {
                          try {
                            const res = await axios.delete(
                              `/backend/orders/deleteOrder`,
                              {
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                                data: {
                                  order_id,
                                },
                              }
                            );
                            console.log(res.data);
                          } catch (e) {
                            console.log(e);
                          }
                        };
                        setLoading(false);
                        deleteOrder();
                        setLoading(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="border px-4 py-2" colSpan="6">
                  No orders found
                </td>
              </tr>
            </tbody>
          )}
        </table> */}
          <TableComponent keys={{
            "Order Id": { type: "param", value: "order_id" },
            "NFT Id": { type: "param", value: "nft_id" },
            "User Id": { type: "param", value: "user_id" },
            "Creation Date": { type: "param", value: "createdAt" },
            "Status": { type: "param", value: "status" },
            "Action": { type: "param", value: "action" },
          }} object={orders} />
          <CSVDownloader api='/backend/orders/'/>
        </div>
      </AdminLayout>
    </div>
  );
}
