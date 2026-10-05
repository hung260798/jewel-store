import { AxiosError } from "axios";

function logError(error: unknown) {
  if (error instanceof Error) {
    devLog(error.message);
  } else {
    devLog("Unknown error:", error);
  }
}

const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

const printError = (err: unknown) => {
  if (err instanceof AxiosError) {
    return printAxiosError(err);
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return "Lỗi không xác định";
  }
};

const printAxiosError = (err: AxiosError) => {
  if (err.response) {
    const data = err.response.data as any;
    const msgKeys = ["message", "error", "err"];
    for (const key of msgKeys) {
      const message = data?.[key];
      if (typeof message == "string" && message !== "") {
        return message;
      }
    }
    return "Đã nhận phản hồi, lỗi không xác định";
  } else if (err.request) {
    return "Không nhận được phản hồi";
  } else {
    return "Không thể gửi đề nghị";
  }
};

export { logError, devLog, printError };

type Fn = (...args: any[]) => void | Promise<void>;
type ErrHandler = (error: any) => void;

export function catchErr(fn: Fn, errHanler?: ErrHandler) {
  return async function (...args: unknown[]) {
    try {
      await fn(...args);
    } catch (error) {
      devLog(error);
      errHanler?.(error);
    }
  };
}
