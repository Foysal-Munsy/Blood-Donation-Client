import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useCurrentUser() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user)
      axiosSecure.get("/get-user").then((res) => {
        setCurrentUser(res.data);
        setLoading(false);
      });
  }, [user]);

  return { currentUser, loading };
}
