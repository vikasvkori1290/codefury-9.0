import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

const DEFAULT_DEV_USER = {
  _id: "660000000000000000000001",
  name: "Developer",
  username: "developer",
  email: "dev@modelhub.dev",
  role: "developer",
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Default to dev user so testing and building is completely frictionless
  const [user, setUser] = useState(DEFAULT_DEV_USER);
  const [loading, setLoading] = useState(false);

  // Check if real user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      if (data?.user) {
        setUser(data.user);
      }
    } catch {
      // Retain fallback dev user during testing
      setUser(DEFAULT_DEV_USER);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    if (data?.token) localStorage.setItem("token", data.token);
    setUser(data?.user || DEFAULT_DEV_USER);
    return data;
  };

  const sendSignupOtp = async (name, email, password) => {
    const { data } = await API.post("/auth/send-signup-otp", { name, email, password });
    return data;
  };

  const verifySignupOtp = async (email, otp) => {
    const { data } = await API.post("/auth/verify-signup-otp", { email, otp });
    if (data?.token) localStorage.setItem("token", data.token);
    setUser(data?.user || DEFAULT_DEV_USER);
    return data;
  };

  const resendSignupOtp = async (email) => {
    const { data } = await API.post("/auth/resend-signup-otp", { email });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", { name, email, password });
    if (data?.token) localStorage.setItem("token", data.token);
    setUser(data?.user || DEFAULT_DEV_USER);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(DEFAULT_DEV_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        sendSignupOtp,
        verifySignupOtp,
        resendSignupOtp,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
