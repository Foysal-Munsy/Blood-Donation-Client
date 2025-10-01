import Lottie from "lottie-react";
import { useContext } from "react";
import { BiEnvelope, BiKey } from "react-icons/bi";
import Title from "../components/Title";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import loginAnimation from "../assets/loginAnimation.json";
import PageTitle from "../components/PageTitle";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect path (default to "/")
  const from = location?.state || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const pass = form.pass.value;

    signIn(email, pass)
      .then(() => {
        Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Login Failed", "Invalid email or password.", "error");
      });
  };

  return (
    <div className="bg-background">
      <PageTitle title={"Login"} />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="title mt-5">
            <Title>Login Now</Title>
          </div>

          <div className="flex justify-between items-center gap-5 pt-8 flex-col lg:flex-row">
            <div className="login-form flex-1 w-full max-w-lg">
              <form
                onSubmit={handleSubmit}
                className="bg-cardBg border border-border p-5 flex flex-col gap-8 shadow rounded-lg"
              >
                {/* Email */}
                <div className="flex justify-start items-center">
                  <BiEnvelope className="text-3xl text-highlighted" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted transition-all duration-200 border-border text-text"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-start items-center">
                    <BiKey className="text-3xl text-highlighted" />
                    <input
                      className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted transition-all duration-200 border-border text-text"
                      type="password"
                      name="pass"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <p className="text-end text-[13px] text-highlighted cursor-pointer">
                    Forgot password?
                  </p>
                </div>

                {/* Register link */}
                <div className="p-1 flex gap-2 text-sm text-text opacity-80">
                  <span>Don't have an account?</span>
                  <Link
                    to="/registration"
                    className="text-highlighted hover:underline"
                  >
                    Register
                  </Link>
                </div>
                {/* Submit */}
                <input
                  type="submit"
                  value="Login Now"
                  className="cursor-pointer px-4 py-2 rounded-lg bg-cta text-btn-text font-semibold hover:shadow-md transition"
                />
              </form>
            </div>

            {/* Animation */}
            <div className="lottie flex-1 mx-20">
              <Lottie animationData={loginAnimation} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
