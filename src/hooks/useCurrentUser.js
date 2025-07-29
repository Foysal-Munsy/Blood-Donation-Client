import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useCurrentUser() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get("/get-user")
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch(() => {
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, [user?.email]);

  return { currentUser, loading };
}
