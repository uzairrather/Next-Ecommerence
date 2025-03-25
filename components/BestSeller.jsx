import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {

        const { products  } = useAppContext()
    
  return (
    <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">
            Best{" "}
            <span className="font-medium text-green-500">Sellers</span>
          </p>
          <div className="w-28 h-0.5 bg-green-500 mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {products.slice(3, 8).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <button className="px-8 py-2 mb-16 border rounded text-gray-900/70 hover:bg-green-500
         hover:text-white transition font-semibold">
          See more
        </button>
      </div>
    </div>
  );
};

export default BestSeller;
