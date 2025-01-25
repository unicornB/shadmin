import RemixIcon from "@/components/RemixIcon";
import { ColorPicker, Radio, RadioChangeEvent } from "antd"
import React from "react";

const CarouselSetting: React.FC = (props: any) => {
    const options = [
        { label: '内容', value: 'content' },
        { label: '样式', value: 'style' },
    ];
    const onChange = (e: RadioChangeEvent) => {
        const data = {
            ...props,
            setUp: e.target.value
        }
        if (props.onChangeData) {
            props.onChangeData(data)
        }
    }
    return (
        <div className="setting-box">
            <Radio.Group
                block
                options={options}
                defaultValue={props.setUp}
                optionType="button"
                buttonStyle="solid"
                onChange={onChange}
            />
            {
                props.setUp == "style" &&
                <div className="setting-style">
                    <div className="setting-style-item">
                        <div className="setting-style-item-title">轮播图样式</div>
                        <div className="setting-style-item-content">
                            <Radio.Group
                                block
                                optionType="button"
                                buttonStyle="solid"
                                defaultValue={props.imgConfig.type}
                                onChange={(e) => {
                                    const data = {
                                        ...props,
                                        imgConfig: {
                                            ...props.imgConfig,
                                            type: e.target.value
                                        }
                                    }
                                    if (props.onChangeData) {
                                        props.onChangeData(data)
                                    }
                                }}
                            >
                                {
                                    props.imgConfig.list.map((item: any, index: number) => {
                                        return (
                                            <Radio value={index} key={index}>
                                                <RemixIcon type={item.icon} size={20} color={props.imgConfig.type == index ? "#fff" : "#333"}></RemixIcon>
                                            </Radio>
                                        )
                                    })
                                }

                            </Radio.Group>
                        </div>
                    </div>
                    <div className="setting-style-item">
                        <div className="setting-style-item-title">指示器样式</div>
                        <div className="setting-style-item-content">
                            <Radio.Group
                                block
                                optionType="button"
                                buttonStyle="solid"
                                defaultValue={props.docConfig.type}
                                onChange={(e) => {
                                    const data = {
                                        ...props,
                                        docConfig: {
                                            ...props.docConfig,
                                            type: e.target.value
                                        }
                                    }
                                    if (props.onChangeData) {
                                        props.onChangeData(data)
                                    }
                                }}
                            >
                                {
                                    props.docConfig.list.map((item: any, index: number) => {
                                        return <Radio value={index} key={index}>
                                            <RemixIcon size={20} type={item.icon} color={props.docConfig.type == index ? "#fff" : "#333"}></RemixIcon>
                                        </Radio>
                                    })
                                }

                            </Radio.Group>
                        </div>
                    </div>
                    <div className="setting-style-item">
                        <div className="setting-style-item-title">指示器位置</div>
                        <div className="setting-style-item-content">
                            <Radio.Group
                                block
                                optionType="button"
                                buttonStyle="solid"
                                defaultValue={props.txtStyle.type}
                                onChange={(e) => {
                                    const data = {
                                        ...props,
                                        txtStyle: {
                                            ...props.txtStyle,
                                            type: e.target.value
                                        }
                                    }
                                    if (props.onChangeData) {
                                        props.onChangeData(data)
                                    }
                                }}
                            >
                                {
                                    props.txtStyle.list.map((item: any, index: number) => {
                                        return <Radio value={index} key={index}>
                                            <RemixIcon size={20} type={item.icon} color={props.txtStyle.type == index ? "#fff" : "#333"}></RemixIcon>
                                        </Radio>
                                    })
                                }

                            </Radio.Group>
                        </div>
                    </div>
                    <div className="setting-style-item">
                        <div className="setting-style-item-title">指示器颜色</div>
                        <div className="setting-style-item-content">
                            <ColorPicker defaultValue={props.dotColor.val} onChange={(e) => {
                                const data = {
                                    ...props,
                                    dotColor: {
                                        ...props.dotColor,
                                        val: e.toHexString()
                                    }
                                }
                                if (props.onChangeData) {
                                    props.onChangeData(data)
                                }
                            }} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default CarouselSetting