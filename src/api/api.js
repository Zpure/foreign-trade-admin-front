import request from '../common/js/request'

// let base_uri = 'http://admin.zcpure.com/api/admin';

export const requestLogin = params => {
    return request({
        url: '/login',
        method: 'post',
        data: params
    })
};

export const addUser = params => {
    return request({
        url: '/user/add',
        method: 'post',
        data: params
    })
};
export const getUserPage = params => {
    return request({
        url: '/user/page',
        method: 'get',
        params
    })
};
export const removeUser = params => {
    return request({
        url: '/user/remove',
        method: 'post',
        data: params
    })
};


export const addCustomer = params => {
    return request({
        url: '/customer/add',
        method: 'post',
        data: params
    })
};
export const getCustomerPage = params => {
    return request({
        url: '/customer/page',
        method: 'get',
        params
    })
};
export const updateCustomer = params => {
    return request({
        url: '/customer/update',
        method: 'post',
        data: params
    })
};


export const addSupplier = params => {
    return request({
        url: '/supplier/add',
        method: 'post',
        data: params
    })
};
export const stopSupplier = params => {
    return request({
        url: '/supplier/stop/' + params.code,
        method: 'post',
    })
};
export const startSupplier = params => {
    return request({
        url: '/supplier/start/' + params.code,
        method: 'post',
    })
};
export const stopSupplierGoods = params => {
    return request({
        url: '/supplier/stop/goods/' + params.id,
        method: 'post',
    })
};
export const startSupplierGoods = params => {
    return request({
        url: '/supplier/stop/goods/' + params.id,
        method: 'post',
    })
};
export const getSupplierPage = params => {
    return request({
        url: '/supplier/page',
        method: 'get',
        params
    })
};
export const getSupplierDetailPage = params => {
    return request({
        url: '/supplier/detail/page',
        method: 'get',
        params
    })
};
export const getSupplierDetail = params => {
    return request({
        url: '/supplier/detail/' + params.code,
        method: 'get',
    })
};
export const addSupplierGoods = params => {
    return request({
        url: '/supplier/add-goods',
        method: 'post',
        data: params
    })
};

export const getBrandPage = params => {
    return request({
        url: '/brand/page',
        method: 'get',
        params
    })
};
export const addBrand = params => {
    return request({
        url: '/brand/add',
        method: 'post',
        data: params
    })
};

export const getModelPage = params => {
    return request({
        url: '/model/page',
        method: 'get',
        params
    })
};
export const addModel = params => {
    return request({
        url: '/model/add',
        method: 'post',
        data: params
    })
};

export const updateModel = params => {
    return request({
        url: '/model/update',
        method: 'post',
        data: params
    })
};

export const getUserList = params => {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
};

export const getCategory = params => {
    return request({
        url: '/category',
        method: 'get',
    })
};

export const getCategoryRoot = params => {
    return request({
        url: '/category/child/root',
        method: 'get',
    })
};

export const getCategoryChild = params => {
    return request({
        url: '/category/child/' + params.id,
        method: 'get',
    })
};
export const addCategory = params => {
    return request({
        url: '/category/add',
        method: 'post',
        data: params
    })
};

export const getGoodsPage = params => {
    return request({
        url: '/goods/page',
        method: 'get',
        params
    })
};
export const getGoodsDetail = params => {
    return request({
        url: '/goods/' + params.code,
        method: 'get',
    })
};
export const addGoods = params => {
    return request({
        url: '/goods/add',
        method: 'post',
        data: params
    })
};
export const onSaleGoods = params => {
    return request({
        url: '/goods/on-sale/' + params.code,
        method: 'post',
    })
};
export const offSaleGoods = params => {
    return request({
        url: '/goods/off-sale/' + params.code,
        method: 'post',
    })
};


export const addOrder = params => {
    return request({
        url: '/order/add',
        method: 'post',
        data: params
    })
};
export const updateOrder = params => {
    return request({
        url: '/order/update',
        method: 'post',
        data: params
    })
};
export const getOrderPage = params => {
    return request({
        url: '/order/page',
        method: 'get',
        params
    })
};
export const getOrderDetailPage = params => {
    return request({
        url: '/order/detail/page',
        method: 'get',
        params
    })
};
export const getOrderDetail = params => {
    return request({
        url: '/order/detail/' + params.code,
        method: 'get',
    })
};
export const confirmOrderStatus = params => {
    return request({
        url: '/order/confirm/' + params.code,
        method: 'post',
    })
};
export const distributionOrderStatus = params => {
    return request({
        url: '/order/distribution/' + params.code,
        method: 'post',
    })
};
export const deliveryOrderStatus = params => {
    return request({
        url: '/order/delivery/' + params.code,
        method: 'post',
    })
};
export const receiptOrderStatus = params => {
    return request({
        url: '/order/receipt/' + params.code,
        method: 'post',
    })
};
export const successOrderStatus = params => {
    return request({
        url: '/order/success/' + params.code,
        method: 'post',
    })
};


export const distributionOrder = params => {
    return request({
        url: '/order/distribution',
        method: 'post',
        data: params
    })
};
export const getDistributionDetail = params => {
    return request({
        url: '/order/distribution/detail',
        method: 'get',
        params
    })
};
export const getDistributionPage = params => {
    return request({
        url: '/order/distribution/query',
        method: 'get',
        params
    })
};
export const updateDistributionOrder = params => {
    return request({
        url: '/order/distribution/update',
        method: 'post',
        data: params
    })
};


