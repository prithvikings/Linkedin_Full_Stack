  import { createBrowserRouter, RouterProvider } from "react-router-dom";
  import Home from "./pages/Home";
  import Signup from "./pages/Signup";
  import Signin from "./pages/Signin";
  import { Toaster } from "react-hot-toast";
  import ProtectedRoute from "./utils/ProtectedRoute";
  import PublicRoute from "./utils/PublicRoute";   // 👈 import it

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
      path: "/signup",
      element: <PublicRoute><Signup /></PublicRoute>,  // 👈 wrapped
    },
    {
      path: "/signin",
      element: <PublicRoute><Signin /></PublicRoute>,  // 👈 wrapped
    },
    {
      path: "*",
      element: <div className="w-full h-screen flex items-center justify-center text-3xl font-bold">404 Not Found</div>,
    }
  ]);

  const App = () => {
    return (
      <>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </>
    );
  };

  export default App;
