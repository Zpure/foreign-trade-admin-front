<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="handleAddRoot">新增一级分类</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
            <el-table-column label="分类名">
                <template slot-scope="scope">
                    <el-tag>{{ scope.row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" v-show="scope.row.isDir === 1" @click="handleAdd(scope.row)">新增子分类</el-button>
                </template>
            </el-table-column>
        </tree-table>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="父分类ID" prop="parentId">
                    <el-input v-model="addForm.parentId" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="父分类" prop="parentName">
                    <el-input v-model="addForm.parentName" auto-complete="off" readonly=""></el-input>
                </el-form-item>
                <el-form-item label="分类名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否目录" prop="isDir">
                    <el-switch
                            v-model="addForm.isDir"
                            active-color="#13ce66"
                            inactive-color="#ff4900"
                            active-text="是"
                            inactive-text="非"
                            active-value="1"
                            inactive-value="0">
                    </el-switch>
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
    import {addCategory, getCategory} from '../../api/api';
    import treeTable from '../../components/treeTable'
    import treeToArray from './categoryEval'

    export default {
        components: {treeTable},
        data() {
            return {
                func: treeToArray,
                args: [null, null, null],
                data: [],
                expandAll: false,

                listLoading: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入分类名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    parentName: '',
                    parentId: '',
                    name: '',
                    isDir: 0,
                }

            }
        },
        methods: {
            //获取用户列表
            getCategory() {
                let para = {};
                this.listLoading = true;
                getCategory(para).then((res) => {
                    this.data = res.data;
                }).finally(() => {
                    this.listLoading = false;
                });
            },
            //显示新增界面
            handleAddRoot: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    parentId: 0,
                    parentName: 'root',
                    isDir: 1,
                };
            },
            handleAdd: function (parent) {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    parentId: parent.id,
                    parentName: parent.name,
                    isDir: 1,
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            para.isDir = para.isDir ? 1 : 0;
                            addCategory(para).then((res) => {
                                this.addLoading = false;
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getCategory();
                            }).finally(() => {
                                this.addLoading = false;
                            });
                        });
                    }
                });
            },
            iconShow(index, record) {
                return (index === 0 && record.childList && record.childList.length > 0)
            }
        },
        mounted() {
            this.getCategory();
        }
    }

</script>

<style scoped>

</style>