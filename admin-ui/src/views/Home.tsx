import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import { useStoreTrigger } from "@/common/hooks";
import { Avatar, Breadcrumb, Button, Dropdown, Flex, Layout, MenuProps, Popover, Space, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MainMenu from '@/components/MainMenu';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import logo from '@/assets/images/logo.png';
import { removeToken } from '@/common/utils/auth';
const { Header, Content, Footer, Sider } = Layout;
const Home: React.FC = () => {
    //const [collapsed, setCollapsed] = useState(false);
    const collapsed = useSelector((state: RootState) => state.menu.collapsed);
    const breadcrumbData = useSelector((state: RootState) => state.menu.breadcrumbData);
    const StoreTrigger = useStoreTrigger(); // 触发store更新
    const currentRoute = useLocation();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const siderStyle: React.CSSProperties = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
    };
    const content = (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <div>
                <Button size="small" type="text" onClick={() => logout()} >个人资料</Button>
            </div>
            <div>
                <Button size="small" type="text" onClick={() => logout()} >退出登录</Button>
            </div>
        </Space>
    );
    useEffect(() => {
        if (currentRoute.pathname === '/') {
            setTimeout(() => {
                navigate("/dashboard")
            }, 300);
        }
    })
    const setCollapsed = (value: boolean) => {
        StoreTrigger.dispatch({
            type: "setCollapsed",
            collapsed: value
        })
    }
    const toggleCollapsed = () => {
        //setCollapsed(!collapsed);
        StoreTrigger.dispatch({
            type: "setCollapsed",
            collapsed: !collapsed
        })
    }
    const logout = () => {
        removeToken();
        navigate("/login");
    }
    return (
        <Layout style={{ minHeight: '100vh' }} hasSider>
            <Sider style={siderStyle} collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {
                    !collapsed && <div className="logo">
                        <img src={logo} alt="logo" />
                        <span>星辰移动开发平台</span>
                    </div>
                }
                {
                    collapsed && <div className="logo" style={{ justifyContent: "center" }}>
                        <img src={logo} alt="logo" />
                    </div>
                }
                <MainMenu />
            </Sider>
            <Layout style={{ marginInlineStart: 200 }}>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                }}>

                    <Flex gap="middle" align="center" justify='space-between'>
                        <Flex align="center">
                            <Button type="text" onClick={toggleCollapsed}>
                                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            </Button>
                            <Breadcrumb items={breadcrumbData} />
                        </Flex>
                        <Flex>
                            <div style={{ marginRight: '30px' }}>
                                <Popover content={content} placement="bottom" trigger="hover" >
                                    <Avatar style={{ backgroundColor: "#f56a00", verticalAlign: 'middle' }} size="large" gap={4}>
                                        测试
                                    </Avatar>

                                </Popover>
                            </div>
                        </Flex>
                    </Flex>

                </Header>
                <Content style={{ margin: '16px 16px', backgroundColor: '#f1f1f1' }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Home;