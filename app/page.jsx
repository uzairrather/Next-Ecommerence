'use client'
import React from "react";
import HeaderSlider from "../components/HeaderSlider";
import HomeProducts from "../components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BestSeller from "@/components/BestSeller";
import Carousel from "@/components/Carousel";


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
