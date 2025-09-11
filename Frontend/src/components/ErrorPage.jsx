import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Something went wrong 🚨
      </h1>
      <p className="text-gray-700">
        {error?.statusText || error?.message || "Unexpected error occurred"}
      </p>
    </div>
  );
};

export default ErrorPage;
