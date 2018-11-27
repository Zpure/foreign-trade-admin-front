<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.brandId" placeholder="品牌ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.brandName" placeholder="品牌名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="型号名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getModels">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="modelList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="brandName" label="品牌名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="name" label="型号名称" width="120" sortable>
            </el-table-column>
            <el-table-column prop="alias" label="型号别名" width="180" sortable>
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
            <el-table-column prop="createTime" label="创建时间" width="220" sortable>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template scope="scope" slot-scope="scope">
                    <el-button type="danger" size="small" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="模型图片"
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
                <el-form-item label="品牌">
                    <el-select filterable remote placeholder="请输入品牌"
                               v-model="brandSelectOne"
                               :remote-method="brandSelectSearch" :loading="brandSelectLoading"
                               @change="getBrandSelect">
                        <el-option style="height:50px;" v-for="item in brandSelectList"
                                   v-bind:key="addForm.brandId"
                                   value="item.name"
                                   :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="型号名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="型号别名" prop="alias">
                    <el-input v-model="addForm.alias" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="型号主图" prop="mainImg">
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="编码" prop="id">
                    <el-input v-model="editForm.id" auto-complete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="alias">
                    <el-input v-model="editForm.alias" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="型号主图" prop="mainImg">
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="updateSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {addModel, getBrandPage, getModelPage, updateModel} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    brandId: '',
                    brandName: '',
                    name: ''
                },
                mainImgList: [],
                otherImgList: [],
                mainSelectImgList: [],
                otherSelectImgList: [],
                brandSelectList: [],
                brandSelectOne: '',
                modelList: [],
                total: 0,
                page: 1,
                listLoading: false,
                brandSelectLoading: false,
                sels: [],//列表选中列

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    brandId: [
                        {required: true, message: '请选择品牌', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入模块名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    brandId: '',
                    name: '',
                    alias: '',
                    mainImg: '',
                    otherImg: ''
                },

                editFormVisible: false,//新增界面是否显示
                editLoading: false,
                editFormRules: {
                    alias: [
                        {required: true, email: '请输入别名', trigger: 'blur'},
                    ],
                },
                //新增界面数据
                editForm: {
                    id: '',
                    alias: '',
                    mainImg: '',
                    otherImg: '',
                },

                showImgList: [],
                dialogImgVisible: false,

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getBrands();
            },
            //获取用户列表
            getModels() {
                let para = {
                    pageNo: this.page,
                    brandId: this.filters.brandId,
                    brandName: this.filters.brandName,
                    name: this.filters.name
                };
                this.listLoading = true;
                getModelPage(para).then((res) => {
                    this.total = res.data.totalNum;
                    this.modelList = res.data.record;
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    brandId: '',
                    name: '',
                    alias: '',
                    mainImg: '',
                    otherImg: ''
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
                            addModel(para).then((res) => {
                                this.addLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getModels();
                            }).finally(() => {
                                this.addLoading = false;
                            });
                        });
                    }
                });
            },
            handleUpdate(index, row) {
                this.editFormVisible = true;
                this.editForm = row;
                if (row.mainImg.length > 0) {
                    this.mainImgList.push({
                        uri: row.mainImg,
                        url: row.mainImg,
                        id: row.mainImg.substring(row.mainImg.lastIndexOf("/") + 1, row.mainImg.length),
                        name: row.mainImg.substring(row.mainImg.lastIndexOf("/") + 1, row.mainImg.length),
                    })
                    this.mainSelectImgList = this.mainImgList;
                }
                if (row.otherImg.length > 0) {
                    row.otherImg.split(",").forEach((item) => {
                        this.otherImgList.push({
                            uri: item,
                            url: item,
                            id: item.substring(item.lastIndexOf("/") + 1, item.length),
                            name: item.substring(item.lastIndexOf("/") + 1, item.length),
                        })
                    });
                    this.otherSelectImgList = this.otherImgList;

                }


            },
            //编辑
            updateSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            if (this.mainImgList.length > 0) {
                                para.mainImg = this.mainImgList[0].uri;
                            }
                            if (this.otherImgList.length > 0) {
                                para.otherImg = this.otherImgList.map(function (o) {
                                    return o.uri;
                                }).join(",");
                            }
                            updateModel(para).then((res) => {
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getModels();
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
            brandSelectSearch(query) {
                if (query !== '') {
                    this.brandSelectLoading = true;
                    let para = {
                        pageNo: 1,
                        pageSize: 50,
                        name: query
                    };
                    getBrandPage(para).then((res) => {
                        this.brandSelectList = res.data.record;
                        this.brandSelectLoading = false;
                    });
                } else {
                    this.brandSelectList = [];
                }
            },
            getBrandSelect: function (selBrandId) {
                this.addForm.brandId = selBrandId;
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
            dialogVisibleShow(imgPath) {
                this.dialogImgVisible = true;
                this.showImgList = imgPath.split(",");
            }
        },
        mounted() {
            this.getModels();
        }
    }

</script>

<style scoped>

</style>