import React, { useContext } from "react";
import axios from "axios";
import UserTable from "../../components/adminPanel/UserTable";

import { StoreContext } from "../../utils/Store";
import cookie from "cookie";
import AdminLayout from "../../components/layouts/AdminLayout";

export default function users({ Users }) {
  const { state, dispatch } = useContext(StoreContext);

  const user = state.user;
  const token = state.jwt;
  return (
    <div className="flex">
      <AdminLayout>
        <div className="flex flex-col p-4">
          <UserTable Overview={Users} token={token} />
        </div>
      </AdminLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie);

  const Users = await axios
    .get(`${process.env.API}/admin/getUsers`, {
      headers: {
        Authorization: `Bearer ${cookies.jwt}`,
      },
    })
    .then((res) => res.data);

  return {
    props: { Users }, // will be passed to the page component as props
  };
}
