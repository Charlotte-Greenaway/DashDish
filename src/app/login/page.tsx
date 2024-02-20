import LoginSection from "../components/loginComponent";
const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-green-50">
      <h1 className="text-4xl font-bold text-green-800 mb-10">Login or Sign Up</h1>
      <LoginSection/>
    </div>
  );
};

export default Login;