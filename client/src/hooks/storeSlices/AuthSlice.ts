import { axiosClient } from "@/libraries/axiosConfig";
import { message } from "antd";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import router from "next/router";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthSlice, LoginInfo } from "./SliceTypes";

export const useAuthStore = create<AuthSlice>()(
  devtools(
    persist(
      (set, get) => {
        return {
          auth: null,
          login: async ({ email, password }: LoginInfo) => {
            try {
              const response = await axiosClient.post(`/customers/login`, {
                email: email,
                password: password,
              });
              if (response.data.token) {
                router.push("/");
                set({ auth: response.data }, false, {
                  type: "auth/login-success",
                });
                // await get().dataFromToken({ token: response.data.token });
              } else {
                message.error("Login unsuccessfully!!");
              }
            } catch {
              set({ auth: null }, false, { type: "auth/login-error" });
              // throw new Error("Login failed");
              throw message.error("Account's not found", 1.5);
            }
          },
          nextLogin: async ({ email, password }: LoginInfo) => {
            try {
              await signIn("credentials", {
                username: email,
                password: password,
              });
            } catch (error) {
              console.error(error);
            }
          },
          dataFromToken: async (token: string) => {
            try {
              const auth = get().auth;
              if (auth?.token && auth?.refreshToken) {
                const response = await axiosClient.get(
                  `/customers/login/profile`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const user = response.data;
                if (user._id) {
                  //lastActivity
                  await axiosClient.patch(`/customers/${user._id}`, {
                    lastActivity: new Date(),
                  });
                  set({ auth: { ...auth, payload: user } }, false, {
                    type: "auth/login-success",
                  });
                }
              }
            } catch (error: unknown) {
              console.error("An error occurred:", error);
              if (error instanceof AxiosError) {
                if (error?.response?.data?.oke === false) {
                  const auth = get().auth;
                  if (!auth) return;
                  const newToken = await axiosClient.post(
                    `/customers/refreshToken`,
                    {
                      id: auth.userId,
                      refreshToken: auth?.refreshToken,
                    }
                  );
                  auth.token = newToken.data.accessToken;
                  message.success("Logging in successfully!!!", 1.5);
                  set({ auth: { ...auth } }, false, {
                    type: "auth/login-success",
                  });
                }
              }
              // Handle error
            }
          },
          logout: async () => {
            // Use the loginData in the logout function
            const { auth } = get();
            if (auth?.payload?._id) {
              axiosClient.patch(`/customers/${auth.payload._id}`, {
                lastActivity: new Date(),
              });
            }
            router.push("/");
            localStorage.clear();
            return set({ auth: null }, false, { type: "auth/logout-success" });
          },
        };
      },
      {
        name: "shopWeb-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

//persist ( DUY TRÌ TRẠNG THÁI CỦA STORE'STATE qua các lần TẢI LẠI, STATE KHÔNG THAY ĐỔI KHI F5)
// Zustand's persist is another optional package that can be used
// to persist your store's state across page reloads or browser sessions.

// With persist, you can store your store's state in localStorage, sessionStorage,
// or any other custom storage solution. This way, when the user refreshes or closes the page,
// the state is automatically restored when the page is reopened.

// Devtools
// Usage with a plain action store, it will log actions as "setState"
