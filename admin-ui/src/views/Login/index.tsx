import { ChangeEvent, useEffect, useState } from 'react';
import styles from './Login.module.scss'

import { Button, Form, FormInstance, Input, Space } from 'antd';
import { LoginRequest } from '@/common/typings/auth';
import { fetchLogin } from "@/common/service/api";
import { setToken, setMenu } from '@/common/utils/auth';
import React from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useNavigate } from "react-router-dom";
import { getBrowser, getOS } from '@/common/utils/os';
import loginBg from '@/assets/images/login_bg.png';
import loginImg from '@/assets/images/login.png';
const Login = () => {
    const [form] = useForm();
    const navigate = useNavigate();
    useEffect(() => {
        // initLoginBg();
        // window.onresize = function () { initLoginBg() };
        form.setFieldsValue({
            username: 'test5',
            password: '123456',
        });
    }, []);
    interface SubmitButtonProps {
        form: FormInstance;
    }
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const usernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    const login = async (values: any) => {
        values.os = getOS();
        values.browser = getBrowser();
        const loginInfo: LoginRequest = values as LoginRequest;
        setLoading(true);
        const { data, error } = await fetchLogin(loginInfo)
        setLoading(false);
        if (!error) {
            setToken(data.data.token);
            setMenu(data.data.menu);
            window.onresize = null;
            navigate("/");
        }
    }
    const onFinish = (values: any) => {
        login(values);
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }
    const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children }) => {
        const [submittable, setSubmittable] = useState<boolean>(false);
        // Watch all values
        const values = Form.useWatch([], form);
        useEffect(() => {
            form
                .validateFields({ validateOnly: true })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));

        }, [form, values]);

        return (
            <Button size="large" loading={loading} type="primary" className={styles.loginBtn} block htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };
    return (
        <div className={styles.loginPage} style={{ backgroundImage: `url(${loginBg})` }}>
            {/* 存放背景 */}
            {/* <canvas id="canvas" style={{ display: "block" }}></canvas> */}
            <div className={styles.loginBox}>
                <img src={loginImg} alt="logo" className={styles.loginImg} />
                <div className={styles.form}>
                    <h3 className={styles.title}>星辰移动开发平台</h3>
                    <Form

                        form={form}
                        name="validateOnly"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <div>
                            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                                <Form.Item name="username" label={null} rules={[{ required: true }]}>
                                    <Input size="large" placeholder="请输入用户名" value={username} onChange={usernameChange} />
                                </Form.Item>
                                <Form.Item name="password" label={null} rules={[{ required: true }]}>
                                    <Input.Password size="large" placeholder="请输入密码" value={password} onChange={passwordChange} />
                                </Form.Item>
                                <SubmitButton form={form}>登录</SubmitButton>
                                {/* <Button size="large" type="primary" className="loginBtn" block onClick={login}>登录</Button> */}
                            </Space>
                        </div>
                    </Form>
                </div>

            </div>
        </div>
    )
}
export default Login