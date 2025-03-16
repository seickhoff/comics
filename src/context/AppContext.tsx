// import { createContext, useContext, useState, ReactNode } from "react";
// import { loginUser, User } from "../services/userService";
// import { useLoading } from "../hooks/useLoading"; // Import the custom hook

// type AppState = {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   login: () => void; // Method to trigger the login action
//   loading: boolean; 
// };

// const AppContext = createContext<AppState | undefined>(undefined);

// export const AppProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const { loading, startLoading, stopLoading } = useLoading(); // Use the loading state

//   // Function to handle user login using the service layer
//   const login = async () => {
//     try {
//       startLoading(); // Start the loading spinner
//       const loggedInUser = await loginUser(); // Call the service to "log in"
//       setUser(loggedInUser);
//     } catch (error) {
//       console.error("Login failed:", error);
//     } finally {
//       stopLoading(); // Stop the loading spinner once done
//     }
//   };

//   return (
//     <AppContext.Provider value={{ user, setUser, login, loading }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within an AppProvider");
//   }
//   return context;
// };


import { createContext, useContext, useState, ReactNode } from "react";

type User = { id: string; name: string } | null;

type AppState = {
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(false); // Manage loading state here

  return (
    <AppContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
