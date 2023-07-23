import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function index() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios.get("/backend/collections/").then((res) => {
      setCollections(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <div className="p-2">
      <div className="flex flex-col justify-center text-center">
        <h1>
          <span className="text-teal-800 text-4xl font-bold">Collections</span>
        </h1>

        <div className="flex flex-col mt-10 justify-center text-center">
          {collections.map((collection) => {
            return (
              <div className="flex flex-col justify-center text-center border-2 hover:cursor-pointer">
                <Link
                  href={{
                    pathname: "/catalog/",
                    query: {
                      collection: collection.id,
                    },
                  }}
                >
                  <div className="bg-slate-300 rounded-lg flex flex-col lg:flex-row lg:justify-between">
                    <img
                      src={
                        collection.image
                          ? collection.image
                          : "https://via.placeholder.com/200"
                      }
                      alt={collection.name}
                    />
                    <div className="flex flex-col justify-center text-center">
                      <h1 className="text-2xl font-bold">{collection.name}</h1>

                      <p className="text-sm">{collection.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
