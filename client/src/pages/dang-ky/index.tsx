import { Card, Col, Grid, message, Row } from "antd";
import axios from "axios";
import { ReactNode, useState } from "react";
import style from "./index.module.css";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { API_URL } from "@/constants/URLS";
import { useAuthStore } from "@/hooks/storeSlices/AuthSlice";
import { devLog, logError, printError } from "@/utils/log";
import { User } from "@/utils/types";
import { WithTimeStamp } from "@/utils/types/entityTypes";
import {
  // PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  UploadProps as AntdUploadProps,
  Button,
  Form,
  Upload,
  UploadFile,
} from "antd";
import { RcFile } from "antd/es/upload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import { MyCustomAntdInput } from "../test";
// import { useAuthStore } from "@/hooks/useAuthStore";

const { useBreakpoint } = Grid;

function Register() {
  const [file, setFile] = useState<RcFile | null>(null);
  const screen = useBreakpoint();
  const { login } = useAuthStore((state) => state);
  const [registerForm] = Form.useForm();
  const displayError = (err: unknown) => {
    message.error(printError(err));
    logError(err);
  };
  const handleCreate = (record: WithTimeStamp<User>) => {
    // return devLog("record", record);
    record.createdDate = new Date().toISOString();
    axios
      .post(`${API_URL}/customers`, record)
      .then((res) => {
        const { _id, firstName, lastName, email, password } = res.data.result;
        // // axios
        // //   .patch(`${API_URL}/customers/${_id}`, {
        // //     createdBy: {
        // //       customerId: _id,
        // //       firstName: firstName,
        // //       lastName: lastName,
        // //     },
        // //   })
        // //   .catch(logError);
        if (file?.uid && file?.type) {
          const formData = new FormData();
          formData.append("file", file);
          axios
            .post(`${API_URL}/upload/customers/${_id}/image`, formData)
            .catch(displayError);
        }
        login({ email, password });
        message.success("Đăng ký thành công !!", 1.5);
      })
      .catch(displayError);
  };
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const formCard = (
    <div className={`${style.myInlineStyle} flex justify-center h-full`}>
      <Card
        title={<div className="flex justify-center">Đăng ký</div>}
        variant="outlined"
        style={{
          width: "100%",
          // margin: screen.sm ? "5% 2%" : "0 0",
          maxWidth: screen.xl ? "100%" : "500px",
          overflow: "hidden",
          height: screen.lg ? "100%" : undefined,
        }}>
        <Form
          className={`container ${style.form}`}
          form={registerForm}
          name="registerForm"
          onFinish={handleCreate}
          onFinishFailed={logError}
          // labelCol={screen.xl ? { span: 6 } : undefined}
          // wrapperCol={screen.xl ? { span: 14 } : undefined}
          layout="vertical"
          style={{ width: " 100%" }}>
          <div className={`row`}>
            <Form.Item
              name="firstName"
              hasFeedback
              rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
              style={{
                width: "calc(100% - 0px)",
              }}>
              <MyCustomAntdInput
                placeHolder="Tên"
                className="w-full"
                required
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              hasFeedback
              rules={[{ required: true, message: "Vui lòng nhập họ của bạn" }]}>
              <MyCustomAntdInput
                placeHolder="Họ"
                className="w-full"
                required
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn",
                },
              ]}>
              <MyCustomAntdInput
                placeHolder="Email"
                className="w-full"
                required
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ",
                },
              ]}>
              <MyCustomAntdInput
                placeHolder="Địa chỉ"
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}>
              <MyCustomAntdInput
                placeHolder="Mật khẩu"
                className="w-full"
                type="password"
                required
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
              ]}>
              <MyCustomAntdInput
                placeHolder="Số điện thoại"
                className="w-full"
                required
              />
            </Form.Item>
            {/* <Form.Item
              hasFeedback
              name="birthday"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
            >
              <DatePicker
                placement="bottomLeft"
                format="DD/MM/YYYY"
                placeholder="Nhập ngày sinh"
                size="large"
              />
            </Form.Item> */}
            {/* <Form.Item name="file">
              <UploadInput
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                onRemove={() => {
                  setFile(null);
                }}
                style={{ width: "100%" }}
              >
                <div className="h-32 w-full bg-slate-200 opacity-30 flex flex-col justify-center items-center border border-dashed border-gray-700 hover:border-blue-500 rounded-md cursor-pointer hover:opacity-55 transition-all duration-500">
                  <PictureOutlined style={{ fontSize: "2.75rem" }} />
                  <div>
                    {file !== null
                      ? file.name.slice(0, 30)
                      : "Chọn 1 ảnh đại diện"}
                  </div>
                </div>
              </UploadInput>
            </Form.Item> */}
          </div>
          <div className="flex flex-col flex-nowrap lg:flex-row lg:justify-between lg:items-center">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full lg:w-fit"
              size={screen.lg ? "middle" : "large"}>
              Đăng ký
            </Button>
            <Button
              type="link"
              htmlType="button"
              className="w-full lg:w-fit mt-3 lg:m-0 lg:shrink truncate"
              size={screen.lg ? "middle" : "large"}
              onClick={() => {
                router.push("/dang-nhap");
              }}>
              Đăng nhập
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
  if (!user) {
    return (
      <>
        <div className={`${style.container} pb-[0]`}>
          <Row style={{ height: "100%" }}>
            <Col
              span={16}
              className={`${style.column} h-full`}>
              <div className={style.brand}>
                <div className={style.title}>JewelShop</div>
                <div className={style.slogan}>Nâng tầm thời trang của bạn</div>
              </div>
            </Col>
            <Col span={8}>{formCard}</Col>
          </Row>
        </div>
        {/* //small screen */}
        <div className={style.container2}>{formCard}</div>
      </>
    );
  } else {
    router.replace("/");
    return null;
  }
}

export default Register;

type State = { file?: UploadFile; fileList: UploadFile[] };

type UploadInpupProps = AntdUploadProps & {
  id?: string;
  value?: State;
  onChange?: (value: State) => void;
  children?: ReactNode;
};

export const UploadInput = (props: UploadInpupProps) => {
  const { id, value = {} as State, onChange, children, ...uploadProps } = props;
  const [state, setState] = useState<State | undefined>();
  const triggerChange = (newFileList: State) => {
    onChange?.(newFileList ?? value ?? state);
  };
  return (
    <Upload
      beforeUpload={() => false}
      onChange={(info) => {
        devLog("info", info);
        setState({ file: info.file, fileList: info.fileList });
        triggerChange({ file: info.file, fileList: info.fileList });
      }}
      fileList={value?.fileList || state?.fileList}
      listType="text"
      id={id}
      {...uploadProps}>
      {children ?? <Button icon={<UploadOutlined />} />}
    </Upload>
  );
};


import { Input } from "antd";
import { ComponentProps } from "react";

type MyCustomAntdInputProps = {
  placeHolder?: string;
  type?: string;
  className?: string;
} & ComponentProps<typeof Input>;

const MyCustomAntdInput = ({
  placeHolder,
  type,
  className,
  ...props
}: MyCustomAntdInputProps) => {
  if (type === "password") {
    return (
      <Input.Password
        placeholder={placeHolder}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Input
      placeholder={placeHolder}
      className={className}
      type={type}
      {...props}
    />
  );
};
