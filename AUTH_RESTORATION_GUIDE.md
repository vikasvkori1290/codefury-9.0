# 🔐 Authentication Bypass & Restoration Reference Guide

This document records the exact changes made to temporarily bypass authentication for friction-free local testing and building, along with the **exact code snippets needed to restore full production authentication**.

---

## 📂 Summary of Modified Files

| File | Purpose | Temporary Change |
| :--- | :--- | :--- |
| [`server/middleware/auth.middleware.js`](file:///c:/devoloper/codefury%209.0/server/middleware/auth.middleware.js) | Backend API Route Guard | Injects fallback `DEV_FALLBACK_USER` instead of returning `401 Unauthorized`. |
| [`client/src/components/ProtectedRoute.jsx`](file:///c:/devoloper/codefury%209.0/client/src/components/ProtectedRoute.jsx) | Frontend Route Wrapper | Returns `children` directly without checking user login or redirecting to `/login`. |
| [`client/src/context/AuthContext.jsx`](file:///c:/devoloper/codefury%209.0/client/src/context/AuthContext.jsx) | Global Auth State | Initializes `user` with `DEFAULT_DEV_USER` and `loading = false`. |

---

## 1. `server/middleware/auth.middleware.js`

### 🟡 Current Temporary Code (Bypassed):
```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import mongoose from "mongoose";

// Default developer user for unauthenticated testing / development
const DEV_FALLBACK_USER = {
  _id: "660000000000000000000001",
  username: "developer",
  name: "Developer",
  email: "dev@modelhub.dev",
  role: "developer",
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token during testing/building phase, inject fallback developer user
  if (!token) {
    req.user = DEV_FALLBACK_USER;
    return next();
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const secret = process.env.JWT_SECRET || "codefury-local-development-secret";
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id);
      req.user = user || DEV_FALLBACK_USER;
    } else {
      req.user = DEV_FALLBACK_USER;
    }
    next();
  } catch {
    // If token invalid/expired during testing, proceed with fallback user
    req.user = DEV_FALLBACK_USER;
    next();
  }
};

export default protect;
```

### 🟢 Original Strict Production Code (To Restore):
```javascript
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import mongoose from "mongoose";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: "MongoDB is unavailable" });
    }
    const secret = process.env.JWT_SECRET || "codefury-local-development-secret";
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

export default protect;
```

---

## 2. `client/src/components/ProtectedRoute.jsx`

### 🟡 Current Temporary Code (Bypassed):
```javascript
import React from "react";

export const ProtectedRoute = ({ children }) => {
  // Authentication bypassed for testing & building purpose
  return children;
};

export default ProtectedRoute;
```

### 🟢 Original Strict Production Code (To Restore):
```javascript
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <span className="w-2 h-2 bg-[#ea580c] animate-pulse" />
          <span>Verifying authentication session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 3. `client/src/context/AuthContext.jsx`

### 🟡 Current Temporary Code (Bypassed):
```javascript
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
```

### 🟢 Original Strict Production Code (To Restore):
```javascript
import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const sendSignupOtp = async (name, email, password) => {
    const { data } = await API.post("/auth/send-signup-otp", { name, email, password });
    return data;
  };

  const verifySignupOtp = async (email, otp) => {
    const { data } = await API.post("/auth/verify-signup-otp", { email, otp });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const resendSignupOtp = async (email) => {
    const { data } = await API.post("/auth/resend-signup-otp", { email });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
```

---

## ⚡ Quick Restoration Command

Whenever you want to turn authentication back on, just say:
> **"Restore authentication now"** or **"Bring back authentication"**

I will instantly restore these 3 files to their production state.
