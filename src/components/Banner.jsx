import { Link } from "react-router";
import animation from "../assets/blood donner.json";

import Lottie from "lottie-react";
const Banner = () => {
  return (
    <section className="bg-contain bg-fixed">
      <div
        id="banner"
        className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between gap-8 py-8 lg:py-0"
      >
        <div className="text space-y-4  text-center md:text-start ">
          <h1 className="text-5xl font-bold">
            Join as a <span className="text-red-500"> Donor! </span>
          </h1>

          <Link
            to="/search"
            className="group relative inline-flex items-center justify-center px-6 py-3 md:rounded-full rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              🔍 Search Donor!
            </span>
          </Link>
        </div>
        <div className="max-w-[400px] ">
          <Lottie animationData={animation} loop={true} />
        </div>
      </div>
    </section>
  );
};

export default Banner;
