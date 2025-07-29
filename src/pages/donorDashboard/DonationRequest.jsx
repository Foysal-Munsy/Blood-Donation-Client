import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function DonationRequest() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [donation, setDonation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get("/my-donation-request")
      .then((res) => setDonation(res.data))
      .catch((err) => {
        console.error("Error fetching foods:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);
  console.log(donation);

  return <div>DonationRequest</div>;
}
