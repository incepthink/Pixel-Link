import React from "react";
import axios from "axios";
import TableComponent from "../../components/adminPanel/TableComponent";

export default function user({ Overview, token }) {
  return (
    <div className="text-white">
      <div className="font-bold text-3xl text-teal-400 border-b-2">Users</div>
      <div className="grid-cols-6  grid   p-4 border-4">
        <div className="p-4 ">User ID</div>
        <div className="p-4 col-span-3 ">Wallet Address</div>
        <div className="p-4 ">Admin</div>
        <div className="p-4 ">Make Admin?</div>
      </div>
      {Overview.users ? (
        // Overview.users.map((user, index) => {
        //   return (
        //     <div className="grid-cols-6  grid  p-4 border-4">
        //       <div className="p-4 ">{user.id}</div>
        //       <div className="p-4 col-span-3 ">
        //         {user.wallet_address}
        //       </div>
        //       <div className="p-4 ">
        //         {user.admin ? "True" : "False"}
        //       </div>
        //       <div
        //         className={`text-white text-center rounded-2xl p-4 ${
        //           !user.admin ? "bg-teal-500" : "bg-red-500"
        //         }`}
        //       >
        //         {user.admin ? (
        //           <button
        //             onClick={() => {
        //               axios.post(
        //                 `/backend/admin/removeAdmin/`,
        //                 {
        //                   user_id: user.id,
        //                 },
        //                 {
        //                   headers: {
        //                     Authorization: `Bearer ${Overview.jwt}`,
        //                   },
        //                 }
        //               );
        //             }}
        //           >
        //             Remove Admin
        //           </button>
        //         ) : (
        //           <button
        //             onClick={() => {
        //               axios.post(
        //                 `/backend/admin/makeAdmin/`,
        //                 {
        //                   user_id: user.id,
        //                 },
        //                 {
        //                   headers: {
        //                     Authorization: `Bearer ${Overview.jwt}`,
        //                   },
        //                 }
        //               );
        //             }}
        //           >
        //             Make Admin
        //           </button>
        //         )}
        //       </div>
        //     </div>
        //   );
        // })
        <TableComponent keys={{
          id: { type: "param", value: "id" },
          wallet_address: { type: "param", value: "wallet_address" },
          admin: { type: "param", value: "admin" },
        }} object={Overview.users} />
      ) : (
        <div>No users</div>
      )}
    </div>
  );
}
