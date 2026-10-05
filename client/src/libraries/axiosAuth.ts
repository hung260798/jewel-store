import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { axiosAuth } from "./axiosConfig"; // Assuming you have your Axios instance configured correctly
import { useRefreshToken } from "./useRefreshToken";
import { AxiosInstance } from "axios";
// import { devLog } from "@/utils/log";

const useAxiosAuth = (instance: AxiosInstance = axiosAuth) => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();
  useEffect(() => {
    const requestIntercept = instance.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${session?.user.token}`;
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    const responseIntercept = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const response = error?.response;

          if (!response) {
            return Promise.reject(error);
          }

          const status = response.status;

          if (status !== 401) {
            return Promise.reject(error);
          }

          const data = response.data;
          const message = data.message;

          if (
            message === "refreshToken is not a valid Token" ||
            message === "refreshToken and id's not match!"
          ) {
            signOut();
            return;
          }

          const prevRequest = error.config;

          if (data === "Unauthorized" && !prevRequest.sent) {
            prevRequest.sent = true;
            await refreshToken();

            prevRequest.headers["Authorization"] =
              `Bearer ${session?.user?.token}`;
            return instance?.(prevRequest);
          }

          return Promise.reject(error);
        } catch (error) {
          Promise.reject(error);
        }
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      if (typeof requestIntercept === "number") {
        instance?.interceptors.request.eject(requestIntercept);
      }
      if (typeof responseIntercept === "number") {
        instance?.interceptors.response.eject(responseIntercept);
      }
    };
  }, [refreshToken, session]);

  return instance;
};

export default useAxiosAuth;
