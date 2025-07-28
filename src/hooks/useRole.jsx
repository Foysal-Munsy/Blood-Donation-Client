import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useRole() {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user)
      axiosSecure("/get-user-role").then((res) => {
        setRole(res.data.role);
        setLoading(false);
      });
  }, [user]);
  return { role, loading };
}
