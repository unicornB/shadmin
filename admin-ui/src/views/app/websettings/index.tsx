import { Card, Flex, Form, Input } from "antd";


const Page = () => {
    return (
        <Flex gap="small" vertical>
            <Card title="后台设置" bordered={false} style={{ width: '100%' }}>
                <Form>
                    <Form.Item label="后台标题">
                        <Input placeholder="请输入后台标题" style={{ width: 300 }} />
                    </Form.Item>
                    <Form.Item label="后台描述">
                        <Input.TextArea placeholder="请输入后台描述" style={{ width: 300 }} />
                    </Form.Item>
                </Form>
            </Card>
            <Card title="后台设置" bordered={false} style={{ width: '100%' }}>
                <Form>
                    <Form.Item label="后台标题">
                        <Input placeholder="请输入后台标题" style={{ width: 300 }} />
                    </Form.Item>
                    <Form.Item label="后台描述">
                        <Input.TextArea placeholder="请输入后台描述" />
                    </Form.Item>
                </Form>
            </Card>
        </Flex>
    );
}
export default Page;