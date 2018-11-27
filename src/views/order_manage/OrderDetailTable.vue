<template>
    <section>
        <el-card class="box-card" v-model="orderDetail">
            <div class="text item">
                订单编码: {{orderDetail.code}}
            </div>
            <div class="text item">
                订单名称: {{orderDetail.name}}
            </div>
            <div class="text item">
                客户编码: {{orderDetail.customerCode}}
            </div>
            <div class="text item">
                客户名称: {{orderDetail.customerName}}
            </div>
            <div class="text item">
                订单状态: {{formatOrderStatus(orderDetail.status)}}
            </div>
            <div class="text item">
                订单备注: {{orderDetail.remark}}
            </div>
        </el-card>

        <el-card class="box-card" v-model="orderDetail">
            <div class="text item">
                下单数量: {{orderDetail.totalNum}}
            </div>
            <div class="text item">
                下单金额: {{orderDetail.totalAmount}}
            </div>
            <div class="text item">
                已分配数: {{orderDetail.totalInitDisNum}}
            </div>
            <div class="text item">
                已备货数: {{orderDetail.totalDisNum}}
            </div>
        </el-card>

        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="orderDetailFilters" ref="orderDetailFilters">
                <el-form-item prop="goodsCode">
                    <el-input v-model="orderDetailFilters.goodsCode" placeholder="商品编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderDetailFilters.goodsName" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderDetailFilters.brandName" placeholder="品牌名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="orderDetailFilters.modelName" placeholder="型号名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetForm('orderDetailFilters')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="orderDetail.detailList
        .filter(data => (!orderDetailFilters.goodsCode ||
        data.goodsCode.toLowerCase().includes(orderDetailFilters.goodsCode.toLowerCase())) &&
        (!orderDetailFilters.goodsName ||
        data.goodsName.toLowerCase().includes(orderDetailFilters.goodsName.toLowerCase())) &&
        (!orderDetailFilters.brandName ||
        data.brandName.toLowerCase().includes(orderDetailFilters.brandName.toLowerCase())) &&
        (!orderDetailFilters.modelName ||
        data.modelName.toLowerCase().includes(orderDetailFilters.modelName.toLowerCase()))

        )"
                  height="450"
                  highlight-current-row
                  v-loading="listLoading"
                  @row-click="rowClick"
                  :expand-row-keys="entexpands"
                  :row-class-name="orderDetailRowClassName"
                  style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table :data="orderDisDetails" highlight-current-row>
                        <el-table-column prop="supplierCode" label="供应商编码" width="180">
                        </el-table-column>
                        <el-table-column prop="supplierName" label="供应商名称" width="180">
                        </el-table-column>
                        <el-table-column prop="initDisNum" label="已分配数量" width="180">
                        </el-table-column>
                        <el-table-column label="已拿货数量" width="200">
                            <template scope="scope">
                                <span v-if="true" class="cell-edit-input">
                                    <el-input-number v-model="scope.row.disNum"
                                                     precision="0"
                                                     :step="1"
                                                     :min="1"
                                                     :max="10000"></el-input-number>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" fixed="left">
                            <template scope="scope" slot-scope="scope">
                                <el-button type="danger" size="small" @click="handleDistributionUpdate(scope.$index, scope.row)">保存
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>

            <el-table-column prop="goodsCode" label="商品编码" width="120">
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" width="120">
            </el-table-column>
            <el-table-column prop="categoryLinkName" label="全分类名称" width="200">
            </el-table-column>
            <el-table-column prop="brandName" label="商品品牌" width="120" :formatter="formatGoodsBrand">
            </el-table-column>
            <el-table-column prop="modelName" label="商品型号" width="120" :formatter="formatGoodsModel">
            </el-table-column>
            <el-table-column prop="mainImg" label="商品主图" width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogVisibleShow(scope.row.mainImg)">点击打开查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="otherImg" label="商品其他图" width="180">
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogVisibleShow(scope.row.otherImg)">点击打开查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="num" label="下单数" width="120">
            </el-table-column>
            <el-table-column prop="initDisNum" label="已分配数量" width="120">
            </el-table-column>
            <el-table-column prop="disNum" label="已拿货数量" width="120">
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template scope="scope" slot-scope="scope">
                    <el-button type="danger" size="small" @click="handleDistribution(scope.$index, scope.row)">分配
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="商品图片"
                :visible.sync="dialogImgVisible">
            <img :src="img" v-for="img in showImgList" style="width: 100%;height: auto">
        </el-dialog>

        <!--配单界面-->
        <el-dialog title="配单" :visible.sync="distributionFormVisible" :close-on-click-modal="false">
            <el-form :model="distributionForm" label-width="80px" :rules="distributionFormRules" ref="addForm">
                <el-form-item label="订单编码" prop="code">
                    <el-input v-model="distributionForm.code" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="商品编码" prop="goodsCode">
                    <el-input v-model="distributionGoods.goodsCode" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input v-model="distributionGoods.goodsName" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="下单总数" prop="num">
                    <el-input v-model="distributionGoods.num" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-select filterable remote placeholder="请输入供应商名"
                               v-model="supplierSelectOne"
                               :remote-method="supplierSelectSearch" :loading="supplierSelectLoading"
                               @change="getSupplierSelect">
                        <el-option style="height:50px;" v-for="item in supplierSelectList"
                                   v-bind:key="supplierSelectCode"
                                   value="item.name"
                                   :key="item.code" :label="item.name"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-input-number v-model="orderDistributionNum"
                                 :precision="0"
                                 :step="1"
                                 :min="1"
                                 :max="10000"></el-input-number>
                <el-table :data="distributionForm.detailList">
                    <el-table-column prop="supplierCode" label="供应商编码" width="120">
                    </el-table-column>
                    <el-table-column prop="supplierName" label="供应商名称" width="120">
                    </el-table-column>
                    <el-table-column prop="num" label="供货数量" width="100">
                    </el-table-column>
                    <el-table-column label="操作" width="200" fixed="right">
                        <template scope="scope" slot-scope="scope">
                            <el-button type="danger" size="small"
                                       @click="removeDistributionDetail(scope.$index, distributionForm.detailList)">移除
                            </el-button>
                            <el-button type="danger" size="small"
                                       @click="changeDistributionDetailNum(scope.$index, scope.row)">改量
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="distributionFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="distributionSubmit" :loading="distributionLoading">提交
                </el-button>
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
        background: #f0f9eb;
    }
</style>

<script>
    import {distributionOrder, getDistributionDetail, getOrderDetail, getSupplierPage, updateDistributionOrder} from '../../api/api';
    import enumsUtil from "../../common/js/enumsUtil";

    export default {
        data() {
            return {
                orderCode: '',
                orderDetail: {
                    code: '',
                    customerCode: '',
                    customerName: '',
                    detailList: [],
                    name: '',
                    remark: '',
                    status: 0,
                    totalAmount: 0,
                    totalDisNum: 0,
                    totalInitDisNum: 0,
                    totalNum: 0
                },

                orderDetailFilters: {
                    goodsCode: '',
                    goodsName: '',
                    brandName: '',
                    modelName: '',
                },
                detailFilters: {
                    orderCode: '',
                    goodsCode: '',
                },
                expandRow: {
                    orderCode: '',
                    goodsCode: '',
                    goodsName: '',
                },
                entexpands: [0],
                orderDisDetails: [],
                total: 0,
                page: 1,
                detailTotal: 0,
                detailPage: 1,
                listLoading: false,
                sels: [],//列表选中列

                distributionFormVisible: false,//新增界面是否显示
                distributionLoading: false,
                distributionFormRules: {
                    code: [
                        {required: true, code: '请输入编码', trigger: 'blur'},
                    ],
                },
                distributionForm: {
                    code: '',
                    detailList: []
                },
                distributionGoods: {
                    code: '',
                    name: '',
                },


                orderDistributionNum: 0,

                showImgList: [],
                dialogImgVisible: false,

                supplierSelectList: [],
                supplierSelectOne: '',
                supplierSelectCode: '',
                supplierSelectLoading: false,
            }
        },
        methods: {
            orderDetailRowClassName(row, rowIndex) {
                if (this.orderDetail.status == 2) {
                    if (row.initDisNum < row.totalNum) {
                        return 'warning-row';
                    } else {
                        if (row.disNum < row.initDisNum) {
                            return 'error-row';
                        } else {
                            return 'success-row';
                        }
                    }

                }
                return '';
            },
            getOrderDetail() {
                let para = {code: this.orderCode};
                this.listLoading = true;
                getOrderDetail(para).then((res) => {
                    this.orderDetail = res.data;
                    this.orderDetail.detailList = res.data.detailList;
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            getDisDetail() {
                getDistributionDetail(this.detailFilters).then((res) => {
                    this.orderDisDetails = res.data;

                    this.orderDisDetails.forEach((item) => {
                        this.distributionForm.detailList = [];
                        this.distributionForm.detailList.push({
                            goodsCode: item.goodsCode,
                            goodsName: item.goodsName,
                            supplierCode: item.supplierCode,
                            supplierName: item.supplierName,
                            num: item.initDisNum,
                        });
                    })
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            //配单
            distributionSubmit: function () {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.distributionLoading = true;
                    let para = Object.assign({}, this.distributionForm);
                    distributionOrder(para).then((res) => {
                        this.distributionLoading = false;
                        this.distributionFormVisible = false;
                        this.getOrderDetail();
                        this.getDisDetail();
                    }).finally(() => {
                        this.distributionLoading = false;
                    });
                });
            },
            formatOrderStatus(status) {
                return enumsUtil.formatOrderStatus(status);
            },
            formatGoodsBrand(row, column) {
                return "(" + row.brandId + ")" + row.brandName;
            },
            formatGoodsModel(row, column) {
                return "(" + row.modelId + ")" + row.modelName;
            },
            dialogVisibleShow(imgPath) {
                this.dialogImgVisible = true;
                this.showImgList = imgPath.split(",");
            },
            rowClick(row, event, column) {

                this.expandRow = row;
                Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if (this.entexpands.indexOf(row.id) < 0) {
                    this.entexpands = [];
                    this.entexpands.push(row.id);
                    this.detailFilters.orderCode = row.orderCode;
                    this.detailFilters.goodsCode = row.goodsCode;
                    this.getDisDetail();
                } else {
                    this.entexpands.remove(row.id);
                }

            },
            handleDistribution(index, row) {
                this.distributionForm.code = this.orderCode;
                this.distributionFormVisible = true;
                this.distributionGoods = row;

                this.detailFilters.orderCode = row.orderCode;
                this.detailFilters.goodsCode = row.goodsCode;

                this.orderDistributionNum = this.distributionGoods.num;

                this.getDisDetail();
            },
            removeDistributionDetail(index, rows) {
                rows.splice(index, 1);
            },
            changeDistributionDetailNum(index, row) {
                row.num = this.orderDistributionNum;
                this.$set(this.distributionForm.detailList, index, row);
            },

            supplierSelectSearch(query) {
                if (query !== '') {
                    this.supplierSelectLoading = true;
                    let para = {
                        pageNo: 1,
                        pageSize: 50,
                        name: query
                    };
                    getSupplierPage(para).then((res) => {
                        this.supplierSelectList = res.data.record;
                        this.supplierSelectLoading = false;
                    });
                } else {
                    this.supplierSelectList = [];
                }
            },
            getSupplierSelect: function (code) {
                if (this.distributionForm.detailList.find((item) => {
                    return item.supplierCode === code
                }) != undefined) {
                    return;
                }
                let one = this.supplierSelectList.find((item) => {
                    return item.code === code
                });
                if (one != undefined) {
                    this.distributionForm.detailList.push({
                        goodsCode: this.distributionGoods.goodsCode,
                        goodsName: this.distributionGoods.goodsName,
                        supplierCode: one.code,
                        supplierName: one.name,
                        num: this.distributionGoods.num,
                    });
                }

            },
            handleDistributionUpdate(index, row) {
                let para = {
                    orderCode: row.orderCode,
                    goodsCode: row.goodsCode,
                    supplierCode: row.supplierCode,
                    num: row.disNum,
                }
                updateDistributionOrder(para).then((res) => {
                    // this.getOrderDetail();
                    this.getDisDetail();
                    this.$message('保存成功');
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        mounted() {
            this.orderCode = this.$route.params.code;
            this.getOrderDetail();
        }
    }

</script>

<style scoped>

</style>