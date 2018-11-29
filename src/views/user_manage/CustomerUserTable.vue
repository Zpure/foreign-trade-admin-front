<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
                <el-form-item>
                    <el-input v-model="filters.phone" placeholder="手机号"></el-input>
                </el-form-item>
				<el-form-item>
					<el-input v-model="filters.email" placeholder="邮箱"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCustomers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
            <el-table-column prop="code" label="编码" width="120" sortable>
            </el-table-column>
			<el-table-column prop="name" label="姓名" width="100" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="120" sortable>
            </el-table-column>
            <el-table-column prop="country" label="国家" width="120" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" width="100" sortable>
			</el-table-column>
            <el-table-column prop="company" label="公司" width="100" sortable>
            </el-table-column>
            <el-table-column prop="website" label="官网" width="100" sortable>
                <template slot-scope="scope">
                    <a :href="scope.row.website"
                       target="_blank"
                       class="buttonText">{{scope.row.website}}</a>
                </template>
            </el-table-column>
			<el-table-column label="操作" width="100" fixed="right">
				<template scope="scope" slot-scope="scope">
					<el-button type="danger" size="small" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="编码" prop="code">
                    <el-input v-model="addForm.code" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="国家" prop="country">
                    <el-input v-model="addForm.country" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司" prop="company">
                    <el-input v-model="addForm.company" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="官网" prop="website">
                    <el-input v-model="addForm.website" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.address"></el-input>
				</el-form-item>
                <el-form-item label="权重">
                    <el-input-number v-model="addForm.priority" :step="1" :max="100" :min="0"></el-input-number>
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
                <el-form-item label="编码" prop="code">
                    <el-input v-model="editForm.code" auto-complete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="国家" prop="country">
                    <el-input v-model="editForm.country" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司" prop="company">
                    <el-input v-model="editForm.company" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="官网" prop="website">
                    <el-input v-model="editForm.website" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.address"></el-input>
                </el-form-item>
                <el-form-item label="权重">
                    <el-input-number v-model="editForm.priority" :step="1" :max="100" :min="0"></el-input-number>
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
	import { getCustomerPage, updateCustomer, addCustomer } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
					phone: '',
                    ids: [],
                    levels: [],
                    email: '',
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    code: [
                        { required: true, code: '请输入编码', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, name: '请输入姓名', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, email: '请输入邮箱', trigger: 'blur' },
                    ],
                    priority: [
                        { required: true, priority: '请输入优先级', trigger: 'blur' }
                    ],
				},
				//新增界面数据
				addForm: {
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


                editFormVisible: false,//新增界面是否显示
                editLoading: false,
                editFormRules: {
                    code: [
                        { required: true, code: '请输入编码', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, email: '请输入邮箱', trigger: 'blur' },
                    ],
                    priority: [
                        { required: true, priority: '请输入优先级', trigger: 'blur' }
                    ],
                },
                //新增界面数据
                editForm: {
                    code: '',
                    phone: '',
                    email: '',
                    company: '',
                    country: '',
                    address: '',
                    website: '',
                    priority: 0,
                }

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getCustomers();
			},
			//获取用户列表
			getCustomers() {
				let para = {
                    pageNo: this.page,
					name: this.filters.name,
                    phone: this.filters.phone,
                    email: this.filters.email,
				};
				this.listLoading = true;
                getCustomerPage(para).then((res) => {
					this.total = res.data.totalNum;
					this.users = res.data.record;
				}).finally(() => {
                    this.listLoading = false;
                });
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    code: '',
                    name: '',
                    phone: '',
                    email: '',
                    company: '',
                    country: '',
                    address: '',
                    website: '',
                    priority: 0,
                };
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addCustomer(para).then((res) => {
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getCustomers();
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

            },
            //编辑
            updateSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            updateCustomer(para).then((res) => {
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getCustomers();
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
		},
		mounted() {
			this.getCustomers();
		}
	}

</script>

<style scoped>

</style>
