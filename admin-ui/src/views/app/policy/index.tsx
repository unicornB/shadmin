import { Button, Card, Flex, message } from "antd"
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { useEffect, useState } from "react"
import MaterialPicker from "@/components/MaterialPicker"
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { SysFile } from "@/common/typings/sys_file"
import { getConfigInfo, updateByKey } from "@/common/service/api/config"
import { EnumConfigKeys } from "@/common/enum"
let insertFn: any; // 插入图片方法
const Page: React.FC = () => {
    const [currentEditor, setCurrentEditor] = useState<string>(EnumConfigKeys.AppUserAgreeMent)
    const [loading, setLoading] = useState<boolean>(false)
    //用户协议部分
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    // 编辑器内容
    const [html, setHtml] = useState('')
    const [fileType, setFileType] = useState<string>('image')
    useEffect(() => {
        setLoading(true)
        getAppUserAgreement()
        getAppPrivacyPolicy()
        setLoading(false)
    }, [])

    const toolbarConfig: Partial<IToolbarConfig> = {

    }

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        MENU_CONF: {
            uploadImage: {
                customBrowseAndUpload(insert: any) {
                    setCurrentEditor(EnumConfigKeys.AppUserAgreeMent)
                    insertFn = insert
                    setFileType('image')
                    setOpenPicker(true)
                }
            },
            uploadVideo: {
                customBrowseAndUpload(insert: any) {
                    setCurrentEditor(EnumConfigKeys.AppUserAgreeMent)
                    insertFn = insert
                    setFileType('video')
                    setOpenPicker(true)
                }
            }
        }
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    const [openPicker, setOpenPicker] = useState(false)
    const onCancle = () => {
        currentEditor && console.log(currentEditor)
        setOpenPicker(false)
    }
    const onSuccess = (files: SysFile[]) => {
        setOpenPicker(false)
        if (insertFn && files.length > 0) {
            console.log('插入图片')
            files.forEach((file) => {
                insertFn(file.host + "/" + file.filePath)
            })
        }
    }
    const getAppUserAgreement = async () => {
        const { data, error } = await getConfigInfo(EnumConfigKeys.AppUserAgreeMent)
        if (!error) {
            setHtml(data?.data.configValue || '')
        }
    }
    const getAppPrivacyPolicy = async () => {
        const { data, error } = await getConfigInfo(EnumConfigKeys.AppPrivacyPolicy)
        if (!error) {
            setPHtml(data?.data.configValue || '')
        }
    }
    //隐私协议部分
    const [pEditor, setPEditor] = useState<IDomEditor | null>(null)
    // 编辑器内容
    const [pHtml, setPHtml] = useState('')
    const pToolbarConfig: Partial<IToolbarConfig> = {

    }
    useEffect(() => {
        return () => {
            if (pEditor == null) return
            pEditor.destroy()
            setPEditor(null)
        }
    }, [editor])
    // 编辑器配置
    const pEditorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        MENU_CONF: {
            uploadImage: {
                customBrowseAndUpload(insert: any) {
                    setCurrentEditor(EnumConfigKeys.AppUserAgreeMent)
                    insertFn = insert
                    setFileType('image')
                    setOpenPicker(true)
                }
            },
            uploadVideo: {
                customBrowseAndUpload(insert: any) {
                    setCurrentEditor(EnumConfigKeys.AppUserAgreeMent)
                    insertFn = insert
                    setFileType('video')
                    setOpenPicker(true)
                }
            }
        }
    }
    const saveConfig = async () => {
        let parmas = {
            configKey: EnumConfigKeys.AppUserAgreeMent,
            configValue: html
        }
        let parmas1 = {
            configKey: EnumConfigKeys.AppPrivacyPolicy,
            configValue: pHtml
        }
        const res = await Promise.all([
            updateByKey(parmas),
            updateByKey(parmas1),
        ])
        if (res.every(item => !item.error)) {
            message.success('保存成功')
        } else {
            message.error('保存失败')
        }
    }
    return (
        <div>
            <Flex wrap gap="small">
                <div style={{ flex: 1, width: "50%" }}>
                    <Card title="用户协议" bordered={false} loading={loading}>
                        <Toolbar
                            editor={editor}
                            defaultConfig={toolbarConfig}
                            mode="default"
                            style={{ borderBottom: '1px solid #ccc' }}
                        />
                        <Editor
                            defaultConfig={editorConfig}
                            value={html}
                            onCreated={setEditor}
                            onChange={(editor) => setHtml(editor.getHtml())}
                            mode="default"
                            style={{ height: '500px', overflowY: 'hidden' }}
                        />
                    </Card>
                </div>
                <div style={{ flex: 1, width: "50%" }}>
                    <Card title="隐私协议" bordered={false} loading={loading}>
                        <Toolbar
                            editor={pEditor}
                            defaultConfig={pToolbarConfig}
                            mode="default"
                            style={{ borderBottom: '1px solid #ccc' }}
                        />
                        <Editor
                            defaultConfig={pEditorConfig}
                            value={pHtml}
                            onCreated={setPEditor}
                            onChange={(editor) => setPHtml(editor.getHtml())}
                            mode="default"
                            style={{ height: '500px', overflowY: 'hidden' }}
                        />
                    </Card>
                </div>
            </Flex>
            <Flex justify="center" style={{ marginTop: 20 }}>
                <Button type="primary" onClick={() => saveConfig()}>保存</Button>
            </Flex>
            <MaterialPicker open={openPicker} onCancel={onCancle} fileType={fileType} limit={13} onSuccess={onSuccess} />
        </div>
    )
}
export default Page