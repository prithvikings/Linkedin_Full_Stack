  import { createBrowserRouter, RouterProvider } from "react-router-dom";
  import Home from "./pages/Home";
  import Signup from "./pages/Signup";
  import Signin from "./pages/Signin";
  import { Toaster } from "react-hot-toast";
  import ProtectedRoute from "./utils/ProtectedRoute";
  import PublicRoute from "./utils/PublicRoute";   // 👈 import it
  import Profile from "./pages/Profile";
  import ErrorPage from "./components/ErrorPage";
  import Network from "./pages/Network";
import Navbar from "./components/Navbar";


  // Define routes using createBrowserRouter

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <PublicRoute><Signup /></PublicRoute>,  // 👈 wrapped
      errorElement: <ErrorPage />,
    },
    {
      path: "/signin",
      element: <PublicRoute><Signin /></PublicRoute>,  // 👈 wrapped
      errorElement: <ErrorPage />,
    },
    {
      path:"/profile/:id",
      element:<ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>,
      errorElement: <ErrorPage />,
    },
    {
      path: "/profile/network",
      element: <ProtectedRoute>
        <Navbar />
        <Network /></ProtectedRoute>,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <div className="w-full h-screen flex items-center justify-center text-3xl font-bold">404 Not Found</div>,
    },
    
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
