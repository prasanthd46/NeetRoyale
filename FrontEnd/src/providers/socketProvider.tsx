import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || socket) return;

    const init = async () => {
      const token = await getAccessTokenSilently();
      const newSocket = io("http://localhost:3001", {
        auth: { token },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("✅ Connected:", newSocket.id);
        setSocket(newSocket);
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ Connection error:", err.message);
      });
    };

    init();
  }, [getAccessTokenSilently, isAuthenticated, socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
