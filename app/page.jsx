'use client'
import React from "react";
import HeaderSlider from "@/app/components/HeaderSlider";
import HomeProducts from "@/app/components/HomeProducts";
import Banner from "@/app/components/Banner";
import NewsLetter from "@/app/components/NewsLetter";
import FeaturedProduct from "@/app/components/FeaturedProduct";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BestSeller from "@/app/components/BestSeller";
import Carousel from "@/app/components/Carousel";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32 bg-slate-300">
        <HeaderSlider />
        <HomeProducts />
        <Carousel/>
        <BestSeller/>
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
        
      </div>
      <Footer />
    </>
  );
};

export default Home;
