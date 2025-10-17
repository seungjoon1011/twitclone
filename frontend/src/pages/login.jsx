import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
  const navigate = useNavigate();

  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = isEmail(formData.emailOrUsername)
        ? { email: formData.emailOrUsername, password: formData.password }
        : { username: formData.emailOrUsername, password: formData.password };

      await login(loginData);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl px-12 py-14">
          <h1 className="text-center mb-6">
            <span className="text-5xl text-brand">
              Twitter
            </span>
          </h1>

          <form className="form-group" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="emailOrUsername"
              placeholder="Email address or Username"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              className="mt-4"
              type="submit"
              disabled={
                loading || !formData.emailOrUsername || !formData.password
              }
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          {error && <p className="text-error">{error}</p>}

          <div className="flex items-center my-8">
            <div className="divider"></div>
            <span className="px-4 text-caption font-medium">OR</span>
            <div className="divider"></div>
          </div>

          <div className="form-group mb-8">
            <Button
              variant="secondary"
              icon={<FcGoogle className="w-6 h-6" />}
              onClick={() => handleSocialLogin("google")}
            >
              Continue with Google
            </Button>

            <Button
              variant="secondary"
              icon={<FaGithub className="w-6 h-6" />}
              onClick={() => handleSocialLogin("github")}
            >
              Continue with GitHub
            </Button>
          </div>

          <Link
            to="/forgot-password"
            className="block text-center text-base text-gray-600 hover:text-blue-500 transition-colors mt-8"
          >
            Forgot password?
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl px-12 py-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent font-semibold hover:from-blue-700 hover:to-sky-700 transition-all "
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center mt-8">
          <p className="mb-5 text-white/90 font-medium">Get the app.</p>
          <div className="flex justify-center space-x-4">
            <img
              src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
              alt="Twitter Logo"
              className="social-btn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;