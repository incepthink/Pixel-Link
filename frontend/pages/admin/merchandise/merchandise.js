import React, { useEffect, useState, useContext } from "react";

import axios from "axios";

import LeftNav from "../../../components/adminPanel/LeftNav";

import { StoreContext } from "../../../utils/Store";

import { useRouter } from "next/router";

export default function merchandise() {
  const { state, dispatch } = useContext(StoreContext);

  const [merchandise, setMerchandise] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pageNo, setPageNo] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const collectionID = useRouter().query.collectionID
    ? useRouter().query.collectionID
    : null;

  // console.log(collectionID);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/backend/merchandise/forTable?pageNo=${pageNo}&search=${search}&collectionID=${collectionID}`
      )
      .then((res) => {
        setMerchandise(res.data.merchs);
        setTotalPages(res.data.totalPages);
        setLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [pageNo, search, collectionID]);

  return (
    <div className="grid grid-cols-4">
      <LeftNav />
      <div className="col-span-4"></div>
    </div>
  );
}
