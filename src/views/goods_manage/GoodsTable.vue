<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.code" placeholder="商品编码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.brandName" placeholder="品牌名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.modelName" placeholder="型号名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.status" placeholder="商品状态"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getGoods">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="goodsList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
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
            <el-table-column prop="mainImg" label="主图" width="120" sortable>
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogVisibleShow(scope.row.mainImg)">点击打开查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="otherImg" label="其他图" width="180" sortable>
                <template slot-scope="scope">
                    <el-button type="text" @click="dialogVisibleShow(scope.row.otherImg)">点击打开查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120" :formatter="formatGoodsStatus">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="220" sortable>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template scope="scope" slot-scope="scope">
                    <el-button type="danger" v-show="scope.row.status == 2" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">上架
                    </el-button>
                    <el-button type="danger" v-show="scope.row.status == 1" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row)">下架
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog
                title="商品图片"
                :visible.sync="dialogImgVisible">
            <img :src="img" v-for="img in showImgList" style="width: 100%;height: auto">
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="型号">
                    <el-select filterable remote placeholder="请输入型号"
                               v-model="modelSelectOne"
                               :remote-method="modelSelectSearch" :loading="modelSelectLoading"
                               @change="getModelSelect">
                        <el-option style="height:50px;" v-for="item in modelSelectList"
                                   v-bind:key="addForm.modelId"
                                   :key="item.id" :label="item.brandName + ':' + item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类" prop="categoryId">
                    <treeselect v-model="addForm.categoryId"
                                placeholder="请选择分类"
                                :select="selectCategory"
                                :clearable="true"
                                :searchable="true"
                                :multiple="false"
                                :options="categoryList" />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品主图" prop="mainImg">
                    <el-upload class="upload-model-main-img"
                               action="/api/admin/upload/img"
                               ::on-preview="handleMainImgPreview"
                               :on-remove="handleMainImgRemove"
                               :on-success="handleMainImgSuccess"
                               :on-exceed="handleImgExceed"
                               :file-list="mainSelectImgList"
                               :limit="1"
                               list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="其他图片" prop="otherImg">
                    <el-upload class="upload-model-other-img"
                               action="/api/admin/upload/img"
                               ::on-preview="handleOtherImgPreview"
                               :on-remove="handleOtherImgRemove"
                               :on-success="handleOtherImgSuccess"
                               :file-list="otherSelectImgList"
                               list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="详情描述" prop="descInfo">
                    <el-input type="textarea" autosize v-model="addForm.descInfo"></el-input>
                </el-form-item>
                <el-form-item label="成品价格" prop="costPrice">
                    <el-input-number v-model="addForm.costPrice"
                                     :precision="2"
                                     :step="0.1"
                                     :min="0"
                                     :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="售价" prop="salePrice">
                    <el-input-number v-model="addForm.salePrice"
                                     :precision="2"
                                     :step="0.1"
                                     :min="0"
                                     :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="权重" prop="priority">
                    <el-input-number v-model="addForm.priority" :step="1" :max="100" :min="0"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {addGoods, getGoodsPage, getModelPage, getCategory,
        onSaleGoods, offSaleGoods} from '../../api/api';
    import enumsUtil from "../../common/js/enumsUtil";
    import categorySelectEval from "./categorySelectEval";

    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
        components: { Treeselect },
        data() {
            return {
                filters: {
                    code: '',
                    name: '',
                    brandName: '',
                    modelName: '',
                    status: '',
                },
                goodsList: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入商品名', trigger: 'blur'}
                    ],
                    descInfo: [
                        {required: true, message: '请输入商品描述', trigger: 'blur'}
                    ],
                },
                //新增界面数据
                addForm: {
                    categoryId: 0,
                    costPrice: 0,
                    descInfo: '',
                    mainImg: '',
                    modelId: 0,
                    name: '',
                    otherImg: '',
                    priority: 0,
                    salePrice: 0
                },
                showImgList: [],
                dialogImgVisible: false,
                mainImgList: [],
                otherImgList: [],
                mainSelectImgList: [],
                otherSelectImgList: [],
                modelSelectList: [],
                modelSelectLoading: false,
                modelSelectOne: '',

                categoryList: [],

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getBrands();
            },
            formatGoodsStatus(row, column) {
                return enumsUtil.formatterGoodsStatus(row.status);
            },
            formatGoodsBrand(row, column) {
                return "(" + row.brandId + ")" + row.brandName;
            },
            formatGoodsModel(row, column) {
                return "(" + row.modelId + ")" + row.modelName;
            },
            //获取用户列表
            getGoods() {
                let para = Object.assign({}, this.filters);
                para.pageNo = this.page;
                this.listLoading = true;
                getGoodsPage(para).then((res) => {
                    this.total = res.data.totalNum;
                    this.goodsList = res.data.record;
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            getCategory() {
                getCategory().then((res) => {
                    let categorySelectList = categorySelectEval(res.data, null, 0);
                    this.categoryList = categorySelectList;
                });
            },
            //显示新增界面
            handleAdd: function () {
                this.getCategory();
                this.addFormVisible = true;
                this.mainImgList = [];
                this.otherImgList = [];
                this.addForm = {
                    categoryId: 0,
                    costPrice: 0,
                    descInfo: '',
                    mainImg: '',
                    modelId: 0,
                    name: '',
                    otherImg: '',
                    priority: 0,
                    salePrice: 0
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            if (this.mainImgList.length > 0) {
                                para.mainImg = this.mainImgList[0].uri;
                            }
                            if (this.otherImgList.length > 0) {
                                para.otherImg = this.otherImgList.map(function (o) {
                                    return o.uri;
                                }).join(",");
                            }
                            addGoods(para).then(() => {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getGoods();
                            }).finally(() => {
                                this.addLoading = false;
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            dialogVisibleShow(imgPath) {
                this.dialogImgVisible = true;
                this.showImgList = imgPath.split(",");
            },
            modelSelectSearch(query) {
                if (query !== '') {
                    this.modelSelectLoading = true;
                    let para = {
                        pageNo: 1,
                        pageSize: 50,
                        name: query
                    };
                    getModelPage(para).then((res) => {
                        this.modelSelectList = res.data.record;
                    }).finally(() => {
                        this.modelSelectLoading = false;
                    });
                } else {
                    this.modelSelectList = [];
                }
            },
            getModelSelect: function (selId) {
                this.addForm.modelId = selId;
            },
            handleMainImgSuccess(response, file, fileList) {
                this.mainImgList.push(response.data);
            },
            handleOtherImgSuccess(response, file, fileList) {
                this.otherImgList.push(response.data);
            },
            handleMainImgRemove(file, fileList) {
                const index = this.mainImgList.findIndex((v) => {
                    return v.uri == file.uri
                });
                this.mainImgList.splice(index, 1);
            },
            handleMainImgPreview(file) {
                console.log(file);
            },
            handleOtherImgRemove(file, fileList) {
                const index = this.otherImgList.findIndex((v) => {
                    return v.uri == file.uri
                });
                this.otherImgList.splice(index, 1);
            },
            handleOtherImgPreview(file) {
                console.log(file);
            },
            handleImgExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            selectCategory(node, instanceId) {
                console.log(node);
                this.addForm.categoryId.id;
            },
            handleUpdateStatus(index, row) {
                let para = {code: row.code};
                if (row.status == 1) {
                    offSaleGoods(para).then((res) => {
                        row.status = 2;
                        this.$set(this.orders, index, row);
                    });
                }
                if (row.status == 2) {
                    onSaleGoods(para).then((res) => {
                        row.status = 1;
                        this.$set(this.orders, index, row);
                    });
                }
            },
        },
        mounted() {
            this.getGoods();
        }
    }

</script>

<style scoped>

</style>
