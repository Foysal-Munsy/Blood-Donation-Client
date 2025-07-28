import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);
  // console.log("🚀 ~ useAxiosSecure ~ accessToken:", user.accessToken);
  const instance = axios.create({
    baseURL: "http://localhost:5001",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  return instance;
};

export default useAxiosSecure;
