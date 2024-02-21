"use client";
import { signIn } from "next-auth/react";
const LoginSection = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center border border-gray-300 bg-white/30 p-8 rounded-lg">
        {/* Sign in with GitHub Button */}
        <button
          onClick={() => signIn("github")}
          className="mb-4 w-64 p-3 flex items-center justify-center bg-green-600 hover:bg-green-700 transition duration-200 rounded-lg shadow text-white font-semibold"
        >
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.841-2.339 4.687-4.566 4.935.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .267.18.578.688.48A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"
              clipRule="evenodd"
            />
          </svg>
          Sign in with GitHub
        </button>

        {/* Sign in with Google Button */}
        <button
          onClick={() => signIn("google")}
          className="mb-4 w-64 p-3 flex items-center justify-center bg-white border border-green-600 hover:bg-green-50 transition duration-200 rounded-lg shadow text-green-800 font-semibold"
        >
          <img
            className="w-6 h-6 mr-2"
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
          />
          Login with Google
        </button>

        {/* Sign in with Discord Button */}
        <button
          onClick={() => signIn("discord")}
          className="w-64 p-3 flex items-center justify-center bg-white border border-green-600 hover:bg-green-50 transition duration-200 rounded-lg shadow text-green-800 font-semibold"
        >
          <svg
            className="w-6 h-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 245 240"
          >
            <path d="M104.4 103.2c-8.3 0-15 7.3-15 16.4s6.7 16.4 15 16.4c8.3 0 15-7.3 15-16.4s-6.7-16.4-15-16.4zm36.2 0c-8.3 0-15 7.3-15 16.4s6.7 16.4 15 16.4 15-7.3 15-16.4-6.7-16.4-15-16.4z" />
            <path d="M0 120c0 53.2 42.2 96.4 94.4 96.4l6.5-23.2c-31-8.5-52.4-29.3-52.4-55.6h23.2c0 18.4 13.4 33.7 32.1 37.8l9.8-27.6c-22.8-6.1-38.9-18.6-38.9-35.4 0-22.2 17.8-39.9 39.9-39.9s39.9 17.8 39.9 39.9c0 16.8-16.1 29.3-38.9 35.4l9.8 27.6c18.7-4.1 32.1-19.4 32.1-37.8h23.2c0 26.3-21.5 47-52.4 55.6l6.5 23.2c52.2 0 94.4-43.2 94.4-96.4C240 66.8 197.8 24 145.6 24 93.4 24 51.2 66.8 51.2 120H0z" />
          </svg>
          Continue with Discord
        </button>
        <div className="text-sm text-gray-600 mt-4">
          By logging in, you agree to our
          <a
            href="/privacy-policy"
            target="_blank"
            className="text-green-600 hover:text-green-800 underline pl-1"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </>
  );
};

export default LoginSection;
