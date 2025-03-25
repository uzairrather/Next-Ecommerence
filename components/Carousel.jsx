import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import Image from "next/image";

const sliderData = [
  {
    id: 1,
    title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
    offer: "Limited Time Offer 30% Off",
    buttonText1: "Buy now",
    buttonText2: "Find more",
    imgSrc: assets.header_headphone_image,
  },
  {
    id: 2,
    title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
    offer: "Hurry up only few lefts!",
    buttonText1: "Shop Now",
    buttonText2: "Explore Deals",
    imgSrc: assets.header_playstation_image,
  },
  {
    id: 3,
    title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
    offer: "Exclusive Deal 40% Off",
    buttonText1: "Order Now",
    buttonText2: "Learn More",
    imgSrc: assets.header_macbook_image,
  },
];

// Double the slides to create an infinite loop effect
const extendedSlides = [...sliderData, ...sliderData];

const HeaderSlider = () => {
  return (
    <div className="overflow-hidden relative w-full ">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-100%"] }} // Moves full width of all slides
        transition={{ repeat: Infinity, duration: sliderData.length * 17, ease: "linear" }} // Slow smooth transition
        style={{ display: "flex", width: "max-content" }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={index}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2]
             py-8 md:px-14 px-5  min-w-[100vw] mr-5 mt-8"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-green-500 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-2">
                <button className="md:px-10 px-7 md:py-2.5 py-2 bg-green-500 rounded-full text-white font-medium">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-2.5 font-medium">
                  {slide.buttonText2}
                  <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center ">
              <Image className="md:w-72 w-48" src={slide.imgSrc} alt={`Slide ${index + 1}`} />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeaderSlider;
