import axios from "axios";

const useAxiosPublic = () => {
  const instance = axios.create({
    baseURL: "http://localhost:5001",
  });

  return instance;
};

export default useAxiosPublic;
