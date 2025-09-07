import logo from "../../assets/logo.svg";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlesubmit = async () => {
    const res = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: Email,
        password,
      }),
    });
    const data = await res.json();
    console.log(data.data);
    if (res.ok) {
      toast.success("User registered successfully");
      setEmail("");
      setPassword("");
      navigate("/");
    } else {
      toast.error(data.message || "Registration failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col pb-10 items-center justify-start gap-[10px]">
      <div className="p-[30px] lg:p-[35px] w-full flex items-center ">
        <img src={logo} alt="Logo" className="w-32" />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl rounded-xl p-8 flex flex-col items-center justify-center gap-4"
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Sign in</h2>

        <input
          type="email"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          >
            {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
          </button>
        </div>
        <button
          onClick={handlesubmit}
          type="submit"
          className="w-full mt-4 p-3 bg-[#0a66c2] text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
        >
          Sign In
        </button>
        <p className="mt-4 text-gray-600">
          I do not have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
