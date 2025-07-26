import { Link } from "react-router";
import animation from "../assets/blood donner.json";
import Lottie from "lottie-react";

const Banner = () => {
  return (
    <section className="bg-gradient-to-br from-red-50 via-rose-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between gap-10 py-12 lg:py-20">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Save Lives, <span className="text-red-600">Join as a Donor!</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-md mx-auto lg:mx-0">
            Every drop counts. Become a blood donor and give someone the gift of
            life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-6">
            <Link
              to="/search"
              className="px-7 py-3 md:rounded-full rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              🔍 Search Donor
            </Link>
            <Link
              to="/registration"
              className="px-7 py-3 text-lg font-medium border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              Become a Donor
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="max-w-[400px] sm:max-w-[450px] lg:max-w-[500px]">
            <Lottie animationData={animation} loop={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
