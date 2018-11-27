import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import ManageUser from './views/user_manage/ManageUserTable.vue'
import CustomerUser from './views/user_manage/CustomerUserTable.vue'
import SupplierUser from './views/user_manage/SupplierUserTable.vue'

import GoodsBrand from './views/goods_manage/BrandTable.vue'
import GoodsModel from './views/goods_manage/ModelTable.vue'
import GoodsCategory from './views/goods_manage/CategoryTable.vue'
import GoodsList from './views/goods_manage/GoodsTable.vue'

import OrderList from './views/order_manage/OrderTable.vue'
import OrderDetail from './views/order_manage/OrderDetailTable.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/user/manage', component: ManageUser, name: '用户管理' },
            { path: '/user/customer', component: CustomerUser, name: '客户管理' },
            { path: '/user/supplier', component: SupplierUser, name: '供应商管理' },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
    /*{
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },*/
    {
        path: '/',
        component: Home,
        name: '商品管理',
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/goods/brand', component: GoodsBrand, name: '商品品牌' },
            { path: '/goods/model', component: GoodsModel, name: '商品型号' },
            { path: '/goods/category', component: GoodsCategory, name: '商品分类' },
            { path: '/goods', component: GoodsList, name: '商品信息' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/order', component: OrderList, name: '订单信息' },
            { path: '/order/detail/:code', component: OrderDetail, name: '订单详情', hidden: true },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;