import Head from "next/head";

import Hero from "../components/home/Hero/Hero";
import Working from "../components/home/Working";
import Featured from "../components/home/Featured";
import SpecialCard from "../components/home/SpecialCard";
import Footer from "../components/Footer";
import NewArrivals from "../components/home/NewArrivals";
import BestSelling from "../components/home/BestSelling";
import ContactUs from "../components/home/ContactUs";
import HomeSections from "../components/home/HomeSections";

export default function Home() {
  return (
    <>
      <div className="max-w-screen flex flex-col items-center">
        <Hero />
        {/* <HomeSections /> */}
        {/* <Working /> */}
        {/* <Featured /> */}
        {/* <SpecialCard /> */}
        {/* <BestSelling /> */}
        {/* <ContactUs /> */}
      </div>
    </>
  );
}
