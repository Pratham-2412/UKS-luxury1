import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("uksToken");
    
    if (token && token !== "undefined") {
      getMe()
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
          } else {
            throw new Error("Invalid user data");
          }
        })
        .catch(() => {
          localStorage.removeItem("uksToken");
          localStorage.removeItem("uksUser");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      localStorage.removeItem("uksToken"); // Clean up just in case it's "undefined"
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("uksToken", token);
    localStorage.setItem("uksUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("uksToken");
    localStorage.removeItem("uksUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};