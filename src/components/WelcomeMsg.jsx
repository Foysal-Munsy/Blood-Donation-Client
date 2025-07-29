import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useCurrentUser from "../hooks/useCurrentUser";
export default function WelcomeMsg() {
  const { user } = useContext(AuthContext);

  const { currentUser, loading } = useCurrentUser();

  // if (loading || !currentUser) return null;
  if (loading) return <p>loading...</p>;
  // console.log("🚀 ~ WelcomeMsg ~ currentUser:", currentUser);

  return (
    <div>
      {user && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 text-center overflow-hidden rounded-md shadow-md mb-6">
          <p className="text-sm md:text-base font-medium animate-pulse">
            Welcome back, <span className="font-bold">{currentUser.name}</span>!
            <span className="ml-2 hidden sm:inline">
              Your role is {currentUser.role}.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
