import { AuthContext } from "../../providers/AuthProvider";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function Profile() {
  const { currentUser } = useCurrentUser();
  console.log("🚀 ~ Profile ~ currentUser:", currentUser);

  return <div>Profile</div>;
}
