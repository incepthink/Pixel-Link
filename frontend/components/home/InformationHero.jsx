import React from "react";
import Image from "next/image";

import moduleStyles from "./InformationHero.module.css";

const styles = {
  highlighted: "text-blue-400",
  underlined: "underline decoration-4 decoration-blue-400",
}

export default function InformationHero() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 items-center px-12">
      <img src="/images/homepage/home_polygon.png" alt="JOKS" className="w-32 md:w-44" />
      <img src="/images/homepage/home_openSea.png" alt="JOKS" className="w-32 md:w-44" />
      <img src="/images/homepage/home_fantom.png" alt="JOKS" className="w-32 md:w-44" />
      <img src="/images/homepage/home_chainlink.png" alt="JOKS" className="w-32 md:w-44" />
    </div >
  );
}
