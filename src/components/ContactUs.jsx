import Lottie from "lottie-react";
import animation from "../assets/Lottie red.json";

const ContactUs = () => {
  return (
    <section className="w-full bg-gradient-to-b from-red-50 via-rose-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-600">
            Contact Us
          </h2>
          <p className="mt-3 text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Have questions about donating blood or want to get involved? Reach
            out to us!
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Lottie Animation */}
          <div className="flex justify-center md:justify-start">
            <div className="max-w-[350px] sm:max-w-[400px] lg:max-w-[450px]">
              <Lottie animationData={animation} loop={true} />
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-rose-100 w-full">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                required
                rows="4"
                placeholder="Write your message..."
                className="w-full p-3 rounded-lg border border-rose-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
