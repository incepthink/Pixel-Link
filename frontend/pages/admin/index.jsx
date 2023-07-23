import React, { useContext, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

import LeftNav from "../../components/adminPanel/LeftNav";
import UserTable from "../../components/adminPanel/UserTable";
import { StoreContext } from "../../utils/Store";

import { useRouter } from "next/router";

import cookie from "cookie";
import AdminLayout from '../../components/layouts/AdminLayout';



export default function index({ Overview }) {
  const { state, dispatch } = useContext(StoreContext);

  const user = state.user;
  const token = state.jwt;




  return (
    <div className="flex">
      <AdminLayout>
        <div className="col-span-4 flex flex-col p-4  ">
          <UserTable Overview={Overview} token={token} />

          <div className=" grid grid-cols-2 grid-rows-2 gap-2 m-10">
            <Link href="/admin/users">
              <div className=" p-4 bg-gray-200 rounded-lg flex flex-col text-center">
                <div className="font-bold text-3xl text-teal-400 border-b-2">
                  Products Count: {Overview.merchandiseCount}
                </div>
              </div>
            </Link>
            <Link href="/admin/merchandise">
              <div className="p-4 bg-gray-200 rounded-lg flex flex-col text-center">
                <div className="font-bold text-3xl text-teal-400 border-b-2">
                  Orders Count: {Overview.ordersCount}
                </div>
              </div>
            </Link>
            <Link href="/admin/orders">
              <div className="p-4 bg-gray-200 rounded-lg flex flex-col text-center">
                <div className="font-bold text-3xl text-teal-400 border-b-2">
                  Shipping Count: {Overview.shippingCount}
                </div>
              </div>
            </Link>
            <Link href="/admin/shipping">
              <div className="p-4 bg-gray-200 rounded-lg flex flex-col text-center">
                <div className="font-bold text-3xl text-teal-400 border-b-2">
                  Collections Count: {Overview.collectionCount}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  if (!context.req.headers.cookie) {
    console.log("Cookeies not found")
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  // console.log(context.req.headers.cookie);

  const cookies = cookie.parse(context.req.headers.cookie);

  const Overview = cookies.jwt
    ? await axios
      .get(`${process.env.API}/admin/`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => res.data)
    : {};

  // console.log("overview",Overview);
  return {
    props: { Overview }, // will be passed to the page component as props
  };
}
