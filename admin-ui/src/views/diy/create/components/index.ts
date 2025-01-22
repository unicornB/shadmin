
import settings from '../components-setting';
import Carousel from './Carousel';
import Images from './Images';
export interface IComponent {
    cid: string;
    type: any;
    name: string;
    icon: string;
    setting: any;
    order: number;
}
export const baseComponents: IComponent[] = [
    {
        cid: 'Carousel',
        type: Carousel,
        name: '轮播图',
        icon: 'ri-multi-image-fill',
        setting: settings.Carousel,
        order: 100,
        setUp: "style",
        isShow: {
            "title": "是否显示背景色",
            "val": 1
        },
        bgColor: {
            "title": "背景颜色(渐变)",
            "default": [
                {
                    "item": "#F62C2C"
                },
                {
                    "item": "#F96E29"
                }
            ],
            "color": [
                {
                    "item": "#F62C2C"
                },
                {
                    "item": "#F96E29"
                }
            ]
        },
        dotColor: {
            "title": "指示器颜色",
            "val": "#fff"
        },
        lrConfig: {
            "title": "左右边距",
            "val": 10,
            "min": 0
        },
        mbConfig: {
            "title": "页面间距",
            "val": 0,
            "min": 0
        },
        docConfig: {
            "cname": "swiper",
            "title": "指示器样式",
            "type": 0,
            "list": [
                {
                    "val": "圆形",
                    "icon": "ri-more-line"
                },
                {
                    "val": "直线",
                    "icon": "ri-separator"
                },
                {
                    "val": "数字",
                    "icon": "ri-list-ordered-2"
                },
                {
                    "val": "无指示器",
                    "icon": "ri-slash-commands-2"
                }
            ]
        },
        txtStyle: {
            "title": "指示器位置",
            "type": 2,
            "list": [
                {
                    "val": "居左",
                    "icon": "ri-align-left"
                },
                {
                    "val": "居中",
                    "icon": "ri-align-center"
                },
                {
                    "val": "居右",
                    "icon": "ri-align-right"
                }
            ]
        },
        imgConfig: {
            "cname": "docStyle",
            "title": "轮播图样式",
            "type": 0,
            "list": [
                {
                    "val": "圆角",
                    "icon": "ri-circle-line"
                },
                {
                    "val": "直角",
                    "icon": "ri-square-line"
                }
            ]
        },
    },
    {
        cid: 'Images',
        type: Images,
        name: '图片',
        icon: 'ri-image-fill',
        setting: settings.Images,
        order: 100,
        // h: 150,
    },
    {
        cid: 'Images',
        type: Images,
        name: '热区',
        icon: 'ri-fire-fill',
        setting: settings.Images,
        order: 100,
        // h: 150,
    },
    {
        cid: 'Images',
        type: Images,
        name: '图片',
        icon: 'ri-multi-image-fill',
        setting: settings.Images,
        order: 100,
        // h: 150,
    },
    {
        cid: 'Images',
        type: Images,
        name: '图片',
        icon: 'ri-multi-image-fill',
        setting: settings.Images,
        order: 100,
        // h: 150,
    },
    {
        cid: 'Images',
        type: Images,
        name: '图片',
        icon: 'ri-multi-image-fill',
        setting: settings.Images,
        order: 100,
        // h: 150,
    },
] as IComponent[];
const all = [...baseComponents];
export const getConfigById = (cid: string) => {
    return all.find((item) => item.cid === cid);
};