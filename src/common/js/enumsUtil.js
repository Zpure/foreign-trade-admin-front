const goodsStatus = {
    1: "上架",
    2: "下架",
};
const supplierGoodsStatus = {
    1: "正常状态",
    2: "停产",
};
const orderStatus = {
    1: "初始生成",
    2: "确认",
    3: "配货成功",
    4: "已发货",
    5: "已收货",
    10: "完结",
};

export default {
    formatterGoodsStatus: function(key) {
        const context = goodsStatus[key];
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatSupplierGoodsStatus: function(key) {
        const context = supplierGoodsStatus[key];
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatOrderStatus: function(key) {
        const context = orderStatus[key];
        return context == null || context == "" || context == "undefined" ? "" : context;
    },

};
