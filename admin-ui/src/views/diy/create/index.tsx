import { Flex, Layout, Tabs, TabsProps } from "antd"
const { Header, Content, Sider } = Layout;

import '@/assets/styles/diy.scss'
import RemixIcon from "@/components/RemixIcon";
import { SortableEvent } from 'sortablejs'
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { baseComponents, IComponent } from './components'
const Page: React.FC = () => {

    const [state, setState] = useState<any[]>([]);
    const [centerState, setCenterState] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    useEffect(() => {
        setState(baseComponents)
    })
    useEffect(() => {
        if (selectedIndex > -1) {
            console.log('selectedIndex', selectedIndex)
            console.log(centerState[selectedIndex])
        }
    }, [selectedIndex])
    const wrapper = () => {
        return (
            <div className="wrapper" id="dragLeft">
                <div className="tips">基础组件</div>
                <div className="dragArea list-group">
                    <ReactSortable
                        group={{
                            name: "list-group-item",
                            pull: "clone",
                            put: false,
                        }}
                        list={state}
                        setList={setState}
                        sort={false}
                        forceFallback={true}
                    >
                        {state.map((item: any, index: number) => (
                            <div className="list-group-item" key={'1_' + index}>
                                <div className="position" style={{ display: 'none' }}>释放鼠标将组建添加到此处</div>
                                <div className="conter">
                                    <RemixIcon type={item.icon} color="#0256ff"></RemixIcon>
                                    <p>{item.name}</p>
                                </div>
                            </div>
                        ))}
                    </ReactSortable>


                </div>
                <div className="tips">基础组件</div>
                <div className="dragArea list-group">
                    <ReactSortable
                        group={{
                            name: "list-group-item",
                            pull: "clone",
                            put: false,
                        }}
                        list={state}
                        setList={setState}
                        sort={false}
                        forceFallback={true}
                    >
                        {state.map((item: any, index: number) => (
                            <div className="list-group-item" key={'1_' + index}>
                                <div className="position" style={{ display: 'none' }}>释放鼠标将组建添加到此处</div>
                                <div className="conter">
                                    <RemixIcon type={item.icon} color="#0256ff"></RemixIcon>
                                    <p>{item.name}</p>
                                </div>
                            </div>
                        ))}
                    </ReactSortable>


                </div>
                <div className="tips">基础组件</div>
                <div className="dragArea list-group">
                    <ReactSortable
                        group={{
                            name: "list-group-item",
                            pull: "clone",
                            put: false,
                        }}
                        list={state}
                        setList={setState}
                        sort={false}
                        forceFallback={true}
                    >
                        {state.map((item: any, index: number) => (
                            <div className={"list-group-item"} key={'1_' + index}>
                                <div className="position" style={{ display: 'none' }}>释放鼠标将组建添加到此处</div>
                                <div className="conter">
                                    <RemixIcon type={item.icon} color="#0256ff"></RemixIcon>
                                    <p>{item.name}</p>
                                </div>
                            </div>
                        ))}
                    </ReactSortable>


                </div>
            </div>
        )
    }
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '组件库',
            children: wrapper(),
        },
        {
            key: '2',
            label: '我的组件',
            children: 'Content of Tab Pane 2',
        },

    ];
    const onDragChange = (evt: SortableEvent) => {
        console.log("onDragChange", evt)

    }
    const onDragAdd = (evt: SortableEvent) => {
        console.log("onDragAdd", evt)
        const id = evt.item.dataset.id
        console.log("onDragAdd id", id)
        setSelectedIndex(evt.newIndex!)
    }

    const onListChange = (newState: any[]) => {
        console.log("onListChange", newState)
        setCenterState(newState)
    }
    const onDragEnd = (evt: SortableEvent) => {
        console.log("onDragEnd", evt)
        setSelectedIndex(evt.newIndex!)
    }
    const onDragSort = (evt: SortableEvent) => {
        console.log("onDragSort", evt)
    }
    const onDragSelect = (evt: SortableEvent) => {
        console.log("onDragSelect", evt)
        setSelectedIndex(evt.newIndex!)
    }
    const getComponent = (item: IComponent) => {
        return (
            <item.setting {...item} onChangeData={onChangeData} />
        )
    }
    const onChangeData = (data: any) => {
        console.log("onChangeData", data)
        centerState[selectedIndex] = data
        setCenterState([...centerState])
    }
    return (
        <div className="diy-page" style={{ height: '100vh' }}>
            <Layout>
                <Header style={{
                    background: '#0256ff', padding: 0
                }}>
                    <Flex justify="space-between">
                        <div style={{ marginLeft: '20px' }}>首页设计</div>
                        <div style={{ marginRight: '20px' }}>首页设计</div>
                    </Flex>
                </Header>
                <Layout className="diy-layout">
                    <Sider width={300} theme="light" className="diy-sider-left">
                        <div>
                            <Tabs defaultActiveKey="1" items={items} />
                        </div>
                    </Sider>
                    <Content style={{ flex: 1, height: "100%" }}>
                        <div className="diy-content">
                            <div className="scrollCon">
                                <div className="diy-content-box">
                                    <div className="scroll-box">
                                        <ReactSortable
                                            className="dragArea list-group"
                                            group={{ name: "list-group-item", pull: 'clone' }}
                                            list={centerState}
                                            setList={onListChange}
                                            onEnd={onDragEnd}
                                            onSort={onDragSort}
                                            onSelect={onDragSelect}
                                            onClone={(e) => console.log("onClone", e)}
                                            onAdd={(e) => onDragAdd(e)}
                                            onChange={(e) => onDragChange(e)}
                                        >
                                            {
                                                centerState.map((item: IComponent, index: number) => {
                                                    return (
                                                        <div key={'c_' + index} onClick={() => setSelectedIndex(index)} className={"list-group-item" + (selectedIndex == index ? " active" : "")}>
                                                            <item.type />
                                                            <div className="delete-box" style={{ display: selectedIndex == index ? "block" : "none" }}>
                                                                <div className="handleType">
                                                                    <div>
                                                                        <RemixIcon type="ri-arrow-up-s-line" size={20} color={index == 0 ? "#ccc" : "#fff"} />
                                                                    </div>
                                                                    <div>
                                                                        <RemixIcon type="ri-arrow-down-s-line" size={20} color={centerState.length == 1 ? "#ccc" : "#fff"} />
                                                                    </div>
                                                                    <div>
                                                                        <RemixIcon type="ri-add-box-line" size={20} color="#fff" />
                                                                    </div>
                                                                    <div>
                                                                        <RemixIcon type="ri-heart-3-line" size={20} color="#fff" />
                                                                    </div>
                                                                    <div>
                                                                        <RemixIcon type="ri-delete-bin-line" size={20} color="#fff" />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </ReactSortable>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Content>
                    <Sider width={300} theme="light" className="diy-sider-right">
                        {
                            selectedIndex > -1 &&
                            getComponent(centerState[selectedIndex])
                        }
                    </Sider>
                </Layout>

            </Layout>
        </div >
    )
}
export default Page