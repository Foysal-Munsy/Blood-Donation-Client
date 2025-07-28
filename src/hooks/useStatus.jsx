import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useStatus() {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user) {
      setLoading(true);
      axiosSecure.get("/get-user-status").then((res) => {
        setStatus(res.data.status);
        setLoading(false);
      });
    }
  }, [user]);

  return { status, loading };
}
