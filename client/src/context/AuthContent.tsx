import { UseMutationResult, useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";

type AuthContext = {
  signup: UseMutationResult<AxiosResponse, unknown, User>;
  login: UseMutationResult<{ token: string; user: User }, unknown, string>;
  user?: User;
  streamChat?: StreamChat;
};

const Context = createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(Context) as AuthContext;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = {
  id: string;
  name: string;
  image?: string;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User>();
  const [streamChat, setStreamChat] = useState<StreamChat | null>(null);

  const navigate = useNavigate();

  const signup = useMutation({
    mutationFn: (user: User) => {
      return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user);
    },
    onSuccess() {
      navigate("/login");
    },
  });

  const login = useMutation({
    mutationFn: (id: string) => {
      return axios
        .post(`${import.meta.env.VITE_SERVER_URL}/login`, { id })
        .then((res) => {
          return res.data as { token: string; user: User };
        });
    },
    onSuccess(data) {
      setUser(data.user);
      setToken(data.token);
    },
  });

  useEffect(() => {
    if (token == null || user == null) return;

    let isInterrupted = false;

    const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY);

    const connectPromise = chat.connectUser(user, token).then(() => {
      if (isInterrupted) return;

      if (chat.tokenManager.token === token && chat.userID === user.id) return;
      setStreamChat(chat);
    });
    return () => {
      isInterrupted = true;
      setStreamChat(null);
      connectPromise.then(() => {
        chat.disconnectUser();
      });
    };
  }, [token, user]);
  return (
    <Context.Provider value={{ signup, login, user, streamChat }}>
      {children}
    </Context.Provider>
  );
}
