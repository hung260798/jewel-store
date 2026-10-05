import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Grid } from "antd";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import style from "./index.module.css";
import useLayer from "@/hooks/ui/layer";

const { useBreakpoint } = Grid;

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const setGlobalLoading = useLayer((s) => s.setGlobalLoading);
  const screens = useBreakpoint();
  const user = session?.user;
  if (!user) {
    const onLogin = async (values: any) => {
      setGlobalLoading(true);
      const messageLoading = message.loading("Đăng nhập ...");
      const { email, password } = values;
      const res = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
        callbackUrl: "/",
      });
      if (res?.ok) {
        messageLoading();
        // message.success("Đăng nhập thành công !!!");
        router.push("/");
      } else {
        messageLoading();
        message.error("Đăng nhập không thành công !!!");
      }
      setTimeout(() => {
        setGlobalLoading(false);
      }, 1000);
    };
    return (
      <div className={`${style.root}`}>
        <div className={style.brand}>
          <div className={style.title}>JewelShop</div>
          <div className={style.slogan}>Nâng tầm thời trang của bạn</div>
        </div>
        <div>
          <Form
            title="login-form"
            name="basic"
            className={`login-form ${style.form__border}`}
            initialValues={{ remember: true }}
            onFinish={onLogin}
            onFinishFailed={(errorInfo: any) => {
              console.log("Failed:", errorInfo);
            }}
            autoComplete="off">
            <div className="text-center py-2">
              <h3 className="text-lg mb-3">Đăng nhập tài khoản</h3>
            </div>
            <Form.Item
              layout={screens.lg ? "horizontal" : "vertical"}
              labelCol={
                screens.lg
                  ? {
                      span: 7,
                    }
                  : undefined
              }
              wrapperCol={
                screens.lg
                  ? {
                      span: 16,
                    }
                  : undefined
              }
              label="Email:"
              name="email"
              rules={[
                { type: "email" },
                { required: true, message: "Please input your username!" },
              ]}
              className="font-semibold">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                className="p-2 bg-[rgba(255,255,255,.75)]"
              />
            </Form.Item>
            <Form.Item
              layout={screens.lg ? "horizontal" : "vertical"}
              labelCol={
                screens.lg
                  ? {
                      span: 7,
                    }
                  : undefined
              }
              wrapperCol={
                screens.lg
                  ? {
                      span: 16,
                    }
                  : undefined
              }
              label="Mật khẩu:"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              className="font-semibold">
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                className="p-2 bg-[rgba(255,255,255,.75)]"
              />
            </Form.Item>
            <Form.Item className="text-center py-3">
              <Button
                htmlType="submit"
                className="login-form-button bg-slate-800 text-white p-2 font-semibold">
                Đăng nhập
              </Button>
              <br />
              <span>Hoặc</span>
              <br />
              <Link
                href="/dang-ky"
                className="p-2 font-semibold">
                Đăng ký ngay!
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  } else {
    router.push("/");
    return null;
  }
  // return !user && <Login />;
}
