// "use client";
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface AuthUser {
//   email: string;
//   role: "Admin" | "Employee";
//   name: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   accessToken: string | null;
//   login: (token: string, refreshToken: string, role: string, email: string, name: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const role = localStorage.getItem("user_role");
//     const email = localStorage.getItem("user_email");
//     const name = localStorage.getItem("user_name");

//     if (token && role && email && name) {
//       setAccessToken(token);
//       setUser({ email, role: role as "Admin" | "Employee", name });
//     }
//   }, []);

//   const login = (token: string, refreshToken: string, role: string, email: string, name: string) => {
//     localStorage.setItem("access_token", token);
//     localStorage.setItem("refresh_token", refreshToken);
//     localStorage.setItem("user_role", role);
//     localStorage.setItem("user_email", email);
//     localStorage.setItem("user_name", name);

//     setAccessToken(token);
//     setUser({ email, role: role as "Admin" | "Employee", name });

//     if (role === "Admin") {
//       router.push("/admin/dashboard");
//     } else {
//       router.push("/employee/dashboard");
//     }
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     setAccessToken(null);
//     router.push("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, accessToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };


// "use client";
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface AuthUser {
//   user_id: number; // 🌟 Added user_id here
//   email: string;
//   role: "Admin" | "Employee";
//   name: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   accessToken: string | null;
//   login: (token: string, refreshToken: string, role: string, email: string, name: string, user_id: number) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const role = localStorage.getItem("user_role");
//     const email = localStorage.getItem("user_email");
//     const name = localStorage.getItem("user_name");
//     const storedId = localStorage.getItem("user_id"); // 🌟 Fetch stored ID

//     if (token && role && email && name && storedId) {
//       setAccessToken(token);
//       setUser({ user_id: Number(storedId), email, role: role as "Admin" | "Employee", name });
//     }
//   }, []);

//   const login = (token: string, refreshToken: string, role: string, email: string, name: string, user_id: number) => {
//     localStorage.setItem("access_token", token);
//     localStorage.setItem("refresh_token", refreshToken);
//     localStorage.setItem("user_role", role);
//     localStorage.setItem("user_email", email);
//     localStorage.setItem("user_name", name);
//     localStorage.setItem("user_id", String(user_id)); // 🌟 Store real User ID

//     setAccessToken(token);
//     setUser({ user_id, email, role: role as "Admin" | "Employee", name });

//     if (role === "Admin") {
//       router.push("/admin/dashboard");
//     } else {
//       router.push("/employee/dashboard");
//     }
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     setAccessToken(null);
//     router.push("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, accessToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };




// "use client";
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface AuthUser {
//   user_id: number; 
//   email: string;
//   role: "Admin" | "Employee";
//   name: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   accessToken: string | null;
//   login: (token: string, refreshToken: string, role: string, email: string, name: string, user_id: number) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const role = localStorage.getItem("user_role");
//     const email = localStorage.getItem("user_email");
//     const name = localStorage.getItem("user_name");
//     const storedId = localStorage.getItem("user_id"); 

//     if (token && role && email && name && storedId) {
//       setAccessToken(token);
//       setUser({ user_id: Number(storedId), email, role: role as "Admin" | "Employee", name });
//     }
//   }, []);

//   const login = (token: string, refreshToken: string, role: string, email: string, name: string, user_id: number) => {
//     localStorage.setItem("access_token", token);
//     localStorage.setItem("refresh_token", refreshToken);
//     localStorage.setItem("user_role", role);
//     localStorage.setItem("user_email", email);
//     localStorage.setItem("user_name", name);
//     localStorage.setItem("user_id", String(user_id)); 

//     setAccessToken(token);
//     setUser({ user_id, email, role: role as "Admin" | "Employee", name });

//     if (role === "Admin") {
//       router.push("/admin/dashboard");
//     } else {
//       router.push("/employee/dashboard");
//     }
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     setAccessToken(null);
//     router.push("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, accessToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };



"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  user_id: number; 
  email: string;
  role: "Admin" | "Employee";
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  login: (token: string, refreshToken: string, role: string, email: string, name: string, user_id: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    const storedId = localStorage.getItem("user_id"); 

    if (token && role && email && name && storedId) {
      setAccessToken(token);
      setUser({ user_id: Number(storedId), email, role: role as "Admin" | "Employee", name });
    }
  }, []);

  const login = (token: string, refreshToken: string, role: string, email: string, name: string, user_id: number) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_role", role);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_id", String(user_id)); 

    setAccessToken(token);
    setUser({ user_id, email, role: role as "Admin" | "Employee", name });

    if (role === "Admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/employee/dashboard");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};