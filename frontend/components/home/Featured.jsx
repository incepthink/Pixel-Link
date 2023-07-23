import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Featured() {
  const [featured, setFeatured] = useState({});

  const [loading, setLoading] = useState(true);

  const getFeatured = async () => {
    const featured = await axios
      .get("/backend/collections/merchFromFeaturedCollection")
      .then((res) => {
        if (res.data.msg) {
          setLoading(false);
          return;
        }
        setFeatured(res.data);
        console.log(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getFeatured();
  }, []);

  return (
    <div className="flex flex-col lg:mt-28">
      <div className="flex flex-col justify-center text-center align-center">
        <h1 className="font-bold text-3xl font-gotham_pro text-center">
          Featured Products
        </h1>
      </div>

      <div className="lg:mt-24 grid grid-cols-3 gap-7 lg:mx-64">
        {loading ? (
          <div className="flex justify-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (["/images/catalogue/blueShirt.jpeg", "/images/catalogue/blackBear.jpeg", "/images/catalogue/blackGradient.jpeg"].map((i) => (
          <div className="flex flex-col justify-center">
            <div className="flex flex-col justify-center">
              <Image
                src={i}
                width={446}
                height={430}
                alt="merch"
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-xl font-gotham_pro text-center">
                Merchandise
              </h3>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-gotham_pro text-gray-400 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque euismod
              </span>
            </div>
          </div>
        ))
        )}
        {/*   featured.merch ? ( */}
        {/*   featured.merch.map((merch) => ( */}
        {/*     <div className="flex flex-col justify-center"> */}
        {/*       <div className="flex flex-col justify-center"> */}
        {/*         <Image */}
        {/*           src={merch.nft_image_url} */}
        {/*           width={446} */}
        {/*           height={430} */}
        {/*           alt={merch.name} */}
        {/*           className="rounded-lg" */}
        {/*         /> */}
        {/*       </div> */}
        {/*       <div className="flex flex-col justify-center"> */}
        {/*         <h3 className="font-bold text-xl font-gotham_pro text-center"> */}
        {/*           {featured.collection_name + " - " + merch.token_id} */}
        {/*         </h3> */}
        {/*       </div> */}
        {/*       <div className="flex flex-col justify-center"> */}
        {/*         <span className="text-sm font-gotham_pro text-gray-400 text-center"> */}
        {/*           {featured.description} */}
        {/*         </span> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   )) */}
        {/* ) : */}
        {/* <div className="flex flex-col col-span-1">
          <Image src="/images/homepage/stockPic.png" height={430} width={446} />
          <span className="text-lg font-gotham_pro font-semibold text-left">
            Stock T-Shirt
          </span>
          <span className="text-sm font-gotham_pro text-gray-400 text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            varius dolor eu tortor pulvinar pulvinar.
          </span>
        </div>
        <div className="flex flex-col col-span-1">
          <Image src="/images/homepage/stockPic.png" height={430} width={446} />
          <span className="text-lg font-gotham_pro font-semibold text-left">
            Stock T-Shirt
          </span>
          <span className="text-sm font-gotham_pro text-gray-400 text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            varius dolor eu tortor pulvinar pulvinar.
          </span>
        </div>
        <div className="flex flex-col col-span-1">
          <Image src="/images/homepage/stockPic.png" height={430} width={446} />
          <span className="text-lg font-gotham_pro font-semibold text-left">
            Stock T-Shirt
          </span>
          <span className="text-sm font-gotham_pro text-gray-400 text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            varius dolor eu tortor pulvinar pulvinar.
          </span>
        </div> */}
      </div>
    </div>
  );
}
