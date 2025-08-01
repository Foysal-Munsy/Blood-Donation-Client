import axios from "axios";

const useAxiosPublic = () => {
  const instance = axios.create({
    baseURL: "https://blood-donation-server-sigma.vercel.app",
  });

  return instance;
};

export default useAxiosPublic;
