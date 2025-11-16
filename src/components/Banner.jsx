import { Link } from "react-router";
import animation from "../assets/blood donner.json";
import Lottie from "lottie-react";

const Banner = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-300 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col-reverse lg:flex-row items-center justify-between gap-10 py-12 lg:py-20 relative z-10">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold leading-tight text-text">
            Save Lives,{" "}
            <span className="text-highlighted dark:text-rose-400 animate-pulse">Join as a Donor!</span>
          </h1>
          <p className="text-lg max-w-md mx-auto lg:mx-0 text-text dark:text-slate-300">
            Every drop counts. Become a blood donor and give someone the gift of
            life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-6">
            <Link
              to="/search"
              className="px-7 py-3 md:rounded-full rounded-lg bg-cta text-btn-text font-semibold text-lg shadow-md hover:shadow-xl dark:shadow-rose-900/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              🔍 Search Donor
            </Link>
            <Link
              to="/registration"
              className="px-7 py-3 text-lg font-medium border-2 border-highlighted dark:border-rose-400 text-highlighted dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-300"
            >
              Become a Donor
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="max-w-[400px] sm:max-w-[450px] lg:max-w-[500px] drop-shadow-2xl">
            <Lottie animationData={animation} loop={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
