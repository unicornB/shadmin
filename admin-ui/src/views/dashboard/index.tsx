import { Col, Row, Space } from "antd"
import { useState } from "react"
import CountUpCard from "./components/CountUpCard"
import ChartsCard from "./components/ChartsCard"
import { pieOptions, ringOptions, radarOptions, barOptions, lineOptions } from './data'
const Page: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)

    setTimeout(() => {
        setIsLoading(false)
    }, 800)
    return (
        <Space direction='vertical' size={12} style={{ display: 'flex' }}>
            <Row gutter={12}>
                <Col flex={1} key={1}>
                    <CountUpCard
                        loading={isLoading}
                        title="今日销售额"
                        color="#1890ff"
                        iconName="discount-percent-fill"
                        countNum={1000}
                    />
                </Col>
                <Col flex={1} key={1}>
                    <CountUpCard
                        loading={isLoading}
                        title="新增用户"
                        color="#fa541c"
                        iconName="discount-percent-fill"
                        countNum={1000}
                    />
                </Col>
                <Col flex={1} key={1}>
                    <CountUpCard
                        loading={isLoading}
                        title="昨日销售额"
                        color="#faad14"
                        iconName="discount-percent-fill"
                        countNum={1000}
                    />
                </Col>
                <Col flex={1} key={1}>
                    <CountUpCard
                        loading={isLoading}
                        title="今日活跃用户"
                        color="#13c2c2"
                        iconName="discount-percent-fill"
                        countNum={1000}
                    />
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={8}>
                    <ChartsCard loading={isLoading} options={pieOptions} height={300} />
                </Col>
                <Col span={8}>
                    <ChartsCard loading={isLoading} options={ringOptions} height={300} />
                </Col>
                <Col span={8}>
                    <ChartsCard loading={isLoading} options={radarOptions} height={300} />
                </Col>
            </Row>
            <Row gutter={12}>
                <Col span={12}>
                    <ChartsCard loading={isLoading} options={barOptions} height={350} />
                </Col>
                <Col span={12}>
                    <ChartsCard loading={isLoading} options={lineOptions} height={350} />
                </Col>
            </Row>
        </Space>
    )
}
export default Page