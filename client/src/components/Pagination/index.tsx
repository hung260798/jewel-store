import { Pagination as AntdPagination } from "antd";
import style from "./style.module.css";
import { cn } from "@/utils/stringUtils";

const Pagination = (props: Parameters<typeof AntdPagination>[0]) => {
  return (
    <AntdPagination
      {...props}
      className={cn(style.root, props.className)}
    />
  );
};

export default Pagination;
