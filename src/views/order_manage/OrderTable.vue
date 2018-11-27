<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.code" placeholder="订单编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="订单名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.customerCode" placeholder="下单客户编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.customerName" placeholder="下单客户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.status" placeholder="订单状态"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getOrder">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="orders"
                  height="500"
                  highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange"
                  @row-click="rowClick"
                  :expand-row-keys="entexpands"
                  :row-class-name="orderRowClassName"
                  style="width: 100%;">
            <!--<el-table-column type="expand" fixed="left">

                <template slot-scope="props">
                    &lt;!&ndash;工具条&ndash;&gt;
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        <el-form :inline="true" :model="detailFilters">
                            <el-form-item>
                                <el-input v-model="detailFilters.goodsCode" placeholder="商品编码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="detailFilters.goodsName" placeholder="商品名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="detailFilters.brandName" placeholder="商品品牌"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="detailFilters.modelName" placeholder="商品型号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="detailFilters.categoryName" placeholder="商品分类"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="detailFilters.status" placeholder="供应状态"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" v-on:click="getDetail">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-table :data="orderDetails" highlight-current-row>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="goodsCode" label="商品编码" width="120" sortable>
                        </el-table-column>
                        <el-table-column prop="goodsName" label="商品名称" width="120" sortable>
                        </el-table-column>
                        <el-table-column prop="categoryLinkName" label="全分类名称" width="120" sortable>
                        </el-table-column>
                        <el-table-column prop="brandName" label="商品品牌" width="120" :formatter="formatGoodsBrand">
                        </el-table-column>
                        <el-table-column prop="modelName" label="商品型号" width="120" :formatter="formatGoodsModel">
                        </el-table-column>
                        &lt;!&ndash;<el-table-column prop="mainImg" label="商品主图" width="120" sortable>
                            <template slot-scope="scope">
                                <el-button type="text" @click="dialogVisibleShow(scope.row.mainImg)">点击打开查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="otherImg" label="商品其他图" width="180" sortable>
                            <template slot-scope="scope">
                                <el-button type="text" @click="dialogVisibleShow(scope.row.otherImg)">点击打开查看</el-button>
                            </template>
                        </el-table-column>&ndash;&gt;
                        <el-table-column prop="price" label="单价" width="120">
                        </el-table-column>
                        <el-table-column prop="num" label="购买量" width="120">
                        </el-table-column>
                        <el-table-column prop="initDisNum" label="已分配数量" width="120">
                        </el-table-column>
                        <el-table-column prop="disNum" label="已拿货数量" width="120">
                        </el-table-column>
                    </el-table>
                    &lt;!&ndash;工具条&ndash;&gt;
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="prev, pager, next" @current-change="handleDetailCurrentChange" :page-size="20" :total="detailTotal" style="float:right;">
                        </el-pagination>
                    </el-col>
                </template>
            </el-table-column>-->
            <el-table-column prop="code" label="订单编码" width="120" fixed="left">
            </el-table-column>
            <el-table-column prop="name" label="订单名称" width="120">
            </el-table-column>
            <el-table-column prop="customerCode" label="客户信息" width="120" :formatter="formatCustomer">
            </el-table-column>
            <el-table-column prop="totalNum" label="下单数量" width="120" sortable>
            </el-table-column>
            <el-table-column prop="totalAmount" label="下单金额" width="120" sortable>
            </el-table-column>
            <el-table-column prop="totalInitDisNum" label="分配数数" width="120" sortable>
            </el-table-column>
            <el-table-column prop="totalDisNum" label="已配数量" width="120" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注信息" width="120" sortable>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="120" :formatter="formatOrderStatus">
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
                <template scope="scope" slot-scope="scope">
                    <el-button type="danger" size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button type="danger" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" v-show="scope.row.status == 1" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">确认订单
                    </el-button>
                    <el-button type="danger" v-show="scope.row.status == 2" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">配货成功
                    </el-button>
                    <el-button type="danger" v-show="scope.row.status == 3" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">发货
                    </el-button>
                    <el-button type="danger" v-show="scope.row.status == 4" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">收货
                    </el-button>
                    <el-button type="danger" v-show="scope.row.status == 5" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">完结
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="商品图片"
                :visible.sync="dialogImgVisible">
            <img :src="img" v-for="img in showImgList" style="width: 100%;height: auto">
        </el-dialog>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="下单客户">
                    <el-select filterable remote placeholder="请输入客户名"
                               v-model="customerSelectOne"
                               :remote-method="customerSelectSearch" :loading="customerSelectLoading"
                               @change="getCustomerSelect">
                        <el-option style="height:50px;" v-for="item in customerSelectList"
                                   v-bind:key="addForm.customerCode"
                                   value="item.name"
                                   :key="item.code" :label="item.name"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" autosize v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>
                <el-table :data="addForm.detailList">
                    <el-table-column prop="goodsCode" label="商品编码" width="180">
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称" width="180">
                    </el-table-column>
                    <el-table-column label="单价" width="180">
                        <template scope="scope">
                                <span v-if="true" class="cell-edit-input">
                                    <el-input-number v-model="scope.row.price"
                                                     size="small"
                                                     :step="0.1"
                                                     :min="0"
                                                     :max="10000"></el-input-number>
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="购买数量" width="180">
                        <template scope="scope">
                                <span v-if="true" class="cell-edit-input">
                                    <el-input-number v-model="scope.row.buyNum"
                                                     size="small"
                                                     :step="1"
                                                     :min="1"
                                                     :max="10000"></el-input-number>
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200" fixed="right">
                        <template scope="scope" slot-scope="scope">
                            <el-button type="danger" size="small"
                                       @click="removeOrderDetail(scope.$index, addForm.detailList)">移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="goodsFilters">
                        <el-form-item>
                            <el-input v-model="goodsFilters.code" placeholder="商品编码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.name" placeholder="商品名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.brandName" placeholder="品牌名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.modelName" placeholder="型号名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.status" placeholder="商品状态"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getGoods">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--商品列表-->
                <el-table :data="goodsList" highlight-current-row v-loading="goodsListLoading"
                          style="width: 100%;">
                    <el-table-column prop="code" label="编码" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="categoryLinkName" label="全分类名称" width="200" sortable>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌" width="120" :formatter="formatGoodsBrand">
                    </el-table-column>
                    <el-table-column prop="modelName" label="型号" width="120" :formatter="formatGoodsModel">
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template scope="scope" slot-scope="scope">
                            <el-button type="danger" size="small"
                                       @click="handleAddGoodsToOrder(scope.$index, scope.row, addForm.detailList)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination layout="prev, pager, next" @current-change="handleGoodsCurrentChange" :page-size="20"
                                   :total="goodsTotal" style="float:right;">
                    </el-pagination>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="订单编号" prop="code">
                    <el-input v-model="editForm.code" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="订单名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" autosize v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>
                <el-table :data="editForm.detailList">
                    <el-table-column prop="goodsCode" label="商品编码" width="180">
                    </el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" width="180">
                    </el-table-column>
                    <el-table-column label="单价" width="180">
                        <template scope="scope">
                                <span v-if="true" class="cell-edit-input">
                                    <el-input-number v-model="scope.row.price"
                                                     size="small"
                                                     :precision="2"
                                                     :step="0.1"
                                                     :min="0"
                                                     :max="10000"></el-input-number>
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="购买数量" width="180">
                        <template scope="scope">
                                <span v-if="true" class="cell-edit-input">
                                    <el-input-number v-model="scope.row.buyNum"
                                                     size="small"
                                                     :precision="0"
                                                     :step="1"
                                                     :min="1"
                                                     :max="10000"></el-input-number>
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200" fixed="right">
                        <template scope="scope" slot-scope="scope">
                            <el-button type="danger" size="small"
                                       @click="removeOrderDetail(scope.$index, editForm.detailList)">移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="goodsFilters">
                        <el-form-item>
                            <el-input v-model="goodsFilters.code" placeholder="商品编码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.name" placeholder="商品名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.brandName" placeholder="品牌名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.modelName" placeholder="型号名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="goodsFilters.status" placeholder="商品状态"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="getGoods">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--商品列表-->
                <el-table :data="goodsList" highlight-current-row v-loading="goodsListLoading"
                          style="width: 100%;">
                    <el-table-column prop="code" label="编码" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="categoryLinkName" label="全分类名称" width="200" sortable>
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌" width="120" :formatter="formatGoodsBrand">
                    </el-table-column>
                    <el-table-column prop="modelName" label="型号" width="120" :formatter="formatGoodsModel">
                    </el-table-column>
                    <el-table-column label="操作" width="100" fixed="right">
                        <template scope="scope" slot-scope="scope">
                            <el-button type="danger" size="small"
                                       @click="handleAddGoodsToOrder(scope.$index, scope.row, editForm.detailList)">添加
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination layout="prev, pager, next" @current-change="handleGoodsCurrentChange" :page-size="20"
                                   :total="goodsTotal" style="float:right;">
                    </el-pagination>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<style>
    .el-table .warning-row {
        background: #fdf019;
    }

    .el-table .error-row {
        background: #ff590e;
    }

    .el-table .success-row {
        background: #1700f9;
    }
</style>

<script>
    import {
        addOrder,
        confirmOrderStatus,
        distributionOrderStatus,
        deliveryOrderStatus,
        receiptOrderStatus,
        successOrderStatus,
        getCustomerPage,
        getGoodsPage,
        getOrderDetail,
        getOrderDetailPage,
        getOrderPage,
        updateOrder
    } from '../../api/api';
    import enumsUtil from "../../common/js/enumsUtil";

    export default {
        data() {
            return {
                filters: {
                    code: '',
                    name: '',
                    customerCode: '',
                    customerName: '',
                    status: null,
                },
                detailFilters: {
                    orderCode: '',
                    goodsCode: '',
                    goodsName: '',
                    brandName: '',
                    modelName: '',
                    categoryName: '',
                },
                expandOrder: {
                    code: '',
                    name: '',
                    phone: '',
                    email: '',
                    company: '',
                    country: '',
                    address: '',
                    website: '',
                    priority: 0,
                },
                orders: [],
                orderDetails: [],
                entexpands: [0],
                total: 0,
                page: 1,
                detailTotal: 0,
                detailPage: 1,
                listLoading: false,
                sels: [],//列表选中列

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    code: [
                        {required: true, code: '请输入编码', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, name: '请输入姓名', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, email: '请输入邮箱', trigger: 'blur'},
                    ],
                    priority: [
                        {required: true, priority: '请输入优先级', trigger: 'blur'}
                    ],
                },
                //新增界面数据
                addForm: {
                    customerCode: '',
                    name: '',
                    remark: '',
                    detailList: [],
                },


                editFormVisible: false,//新增界面是否显示
                editLoading: false,
                editFormRules: {},
                //新增界面数据
                editForm: {
                    code: '',
                    name: '',
                    remark: '',
                    detailList: [],
                },



                showImgList: [],
                dialogImgVisible: false,

                customerSelectList: [],
                customerSelectOne: '',
                customerSelectLoading: false,

                goodsFilters: {
                    code: '',
                    name: '',
                    brandName: '',
                    modelName: '',
                    status: '',
                },
                goodsList: [],
                goodsTotal: 0,
                goodsPage: 1,
                goodsListLoading: false,
                goodsSels: [],//列表选中列
            }
        },
        methods: {
            orderRowClassName(row, rowIndex) {
                if (row.status == 2) {
                    if (row.totalInitDisNum < row.totalNum) {
                        return 'warning-row';
                    } else {
                        if (row.totalDisNum < row.totalInitDisNum) {
                            return 'error-row';
                        } else {
                            return 'success-row';
                        }
                    }

                }
                return '';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getSupplier();
            },
            handleDetailCurrentChange(val) {
                this.detailPage = val;
                this.getDetail();
            },
            //获取用户列表
            getOrder() {
                let para = Object.assign({}, this.filters);
                if (this.filters.status == '') {
                    para.status = null;
                }
                this.listLoading = true;
                getOrderPage(para).then((res) => {
                    this.total = res.data.totalNum;
                    this.orders = res.data.record;
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            getDetail() {
                getOrderDetailPage(this.detailFilters).then((res) => {
                    this.detailTotal = res.data.totalNum;
                    this.orderDetails = res.data.record;
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    customerCode: '',
                    name: '',
                    remark: '',
                    detailList: [],
                };
            },
            //显示新增界面
            handleEdit: function (index, row) {
                let para = {code: row.code};
                getOrderDetail(para).then((res) => {
                    this.$refs['editForm'].resetFields();
                    this.editFormVisible = true;
                    this.editForm.code = res.data.code;
                    this.editForm.name = res.data.name;
                    this.editForm.detailList = [];
                    res.data.detailList.forEach(item => {
                        this.editForm.detailList.push({
                            goodsCode: item.goodsCode,
                            goodsName: item.goodsName,
                            price: item.price,
                            buyNum: item.num,
                        })
                    });
                }).finally(() => {
                    this.editLoading = false;
                });

                this.editFormVisible = true;
                this.addForm = {
                    customerCode: '',
                    name: '',
                    remark: '',
                    detailList: [],
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            addOrder(para).then((res) => {
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getOrder();
                            }).finally(() => {
                                this.addLoading = false;
                            });
                        });
                    }
                });
            },
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            updateOrder(para).then((res) => {
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getOrder();
                            }).finally(() => {
                                this.editLoading = false;
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            formatOrderStatus(row, column) {
                return enumsUtil.formatOrderStatus(row.status);
            },
            formatGoodsBrand(row, column) {
                return "(" + row.brandId + ")" + row.brandName;
            },
            formatGoodsModel(row, column) {
                return "(" + row.modelId + ")" + row.modelName;
            },
            formatCustomer(row, column) {
                return "(" + row.customerCode + ")" + row.customerName;
            },
            dialogVisibleShow(imgPath) {
                this.dialogImgVisible = true;
                this.showImgList = imgPath.split(",");
            },
            rowClick(row, event, column) {

                this.expandOrder = row;
                Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if (this.entexpands.indexOf(row.id) < 0) {
                    this.entexpands = [];
                    this.entexpands.push(row.id);
                    this.detailFilters.orderCode = row.code;
                    this.getDetail();
                } else {
                    this.entexpands.remove(row.id);
                }

            },
            handleDetail(index, row) {
                // this.$router.push({ path: '/order/detail/' + row.code,  });
                const {href} = this.$router.resolve({
                    path: '/order/detail/' + row.code
                })
                window.open(href, '_blank');
            },

            handleUpdateStatus(index, row) {
                let para = {code: row.code};
                if (row.status == 1) {
                    confirmOrderStatus(para).then((res) => {
                        row.status = 2;
                        this.$set(this.orders, index, row);
                    });
                }
                if (row.status == 2) {
                    distributionOrderStatus(para).then((res) => {
                        row.status = 3;
                        this.$set(this.orders, index, row);
                    });
                }
                if (row.status == 3) {
                    deliveryOrderStatus(para).then((res) => {
                        row.status = 4;
                        this.$set(this.orders, index, row);
                    });
                }
                if (row.status == 4) {
                    receiptOrderStatus(para).then((res) => {
                        row.status = 5;
                        this.$set(this.orders, index, row);
                    });
                }
                if (row.status == 5) {
                    successOrderStatus(para).then((res) => {
                        row.status = 10;
                        this.$set(this.orders, index, row);
                    });
                }
            },


            goodsSelsChange: function (sels) {
                this.goodsSels = sels;
            },
            handleGoodsCurrentChange(val) {
                this.goodsPage = val;
                this.getGoods();
            },
            getGoods() {
                let para = Object.assign({}, this.goodsFilters);
                para.pageNo = this.goodsPage;
                this.goodsListLoading = true;
                getGoodsPage(para).then((res) => {
                    this.goodsTotal = res.data.totalNum;
                    this.goodsList = res.data.record;
                }).finally(() => {
                    this.goodsListLoading = false;
                });
            },
            handleAddGoodsToOrder(index, row, rows) {
                debugger;
                if (rows.find((item) => {
                    return item.goodsCode === row.code
                }) == undefined) {
                    rows.push({
                        goodsCode: row.code,
                        goodsName: row.name,
                        code: row.code,
                        name: row.name,
                        price: row.salePrice,
                        buyNum: 1
                    });
                }

            },
            removeOrderDetail(index, rows) {
                rows.splice(index, 1);
            },

            customerSelectSearch(query) {
                if (query !== '') {
                    this.customerSelectLoading = true;
                    let para = {
                        pageNo: 1,
                        pageSize: 50,
                        name: query
                    };
                    getCustomerPage(para).then((res) => {
                        this.customerSelectList = res.data.record;
                        this.customerSelectLoading = false;
                    });
                } else {
                    this.customerSelectList = [];
                }
            },
            getCustomerSelect: function (code) {
                this.addForm.customerCode = code;
            },
        },
        mounted() {
            this.getOrder();
        }
    }

</script>

<style scoped>

</style>