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
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
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
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="200" sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" width="300" sortable>
			</el-table-column>
			<el-table-column label="操作" width="100" fixed="right">
				<template scope="scope" slot-scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="addForm.phone" auto-complete="off"></el-input>
                </el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.address"></el-input>
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
	import { getUserPage, removeUser, addUser } from '../../api/api';

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
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
                    password: '',
                    phone: '',
                    email: '',
                    address: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					pageNo: this.page,
					name: this.filters.name,
                    phone: this.filters.phone,
                    email: this.filters.email,
				};
				this.listLoading = true;
                getUserPage(para).then((res) => {
					this.total = res.data.totalNum;
					this.users = res.data.record;
				}).finally(() => {
                    this.listLoading = false;
                });
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: [row.id] };
					removeUser(para).then((res) => {
						this.listLoading = false;

						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    name: '',
                    password: '',
                    phone: '',
                    email: '',
                    address: ''
                };
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addUser(para).then((res) => {
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
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
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
					removeUser(para).then((res) => {
						this.listLoading = false;
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
