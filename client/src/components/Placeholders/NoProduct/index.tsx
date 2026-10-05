import React from "react";
import styles from "./styles.module.css";
import { cn } from "@/utils/stringUtils";

export default function NoProduct({ className = "" }: { className?: string }) {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.emptyMessage}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64">
          <path d="M32 0C14.355 0 0 14.355 0 32s14.355 32 32 32 32-14.355 32-32S49.645 0 32 0zm0 58C17.664 58 6 46.336 6 32S17.664 6 32 6s26 11.664 26 26-11.664 26-26 26z" />
          <path d="M32 14a2 2 0 00-2 2v12a2 2 0 004 0V16a2 2 0 00-2-2zm0 28a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        </svg>
        <h2 className="font-bold">Không tìm thấy sản phẩm</h2>
        <p>Vui lòng thử lại với từ khóa khác.</p>
      </div>
    </div>
  );
}
