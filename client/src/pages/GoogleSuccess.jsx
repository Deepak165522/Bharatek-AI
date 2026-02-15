import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const GoogleSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAppContext();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);

       // 👇 Wait one tick before fetchUser
    setTimeout(async () => {
      await fetchUser();
      navigate("/");
    }, 100);

    } else {
      navigate("/login");
    }
  }, []);

  return <div className="text-white text-center mt-20">Logging you in...</div>;
};

export default GoogleSuccess;
