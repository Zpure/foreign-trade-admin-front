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
					<el-button type="primary" v-on:click="getSupplier">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="suppliers"
                  highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange"
                  @row-click="rowClick"
                  :expand-row-keys="entexpands"
                  style="width: 100%;">
			<el-table-column type="expand">

				<template slot-scope="props">
                    <!--工具条-->
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
                            <el-form-item>
                                <el-button type="primary" @click="handleDetailAdd">新增</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
					<el-table :data="supplierDetails" highlight-current-row>
						<el-table-column type="index" width="60">
						</el-table-column>
						<el-table-column prop="goodsCode" label="商品编码" width="120" sortable>
						</el-table-column>
						<el-table-column prop="goodsName" label="商品名称" width="120" sortable>
						</el-table-column>
						<el-table-column prop="categoryLinkName" label="全分类名称" width="200" sortable>
						</el-table-column>
						<el-table-column prop="brandName" label="商品品牌" width="120" :formatter="formatGoodsBrand">
						</el-table-column>
						<el-table-column prop="modelName" label="商品型号" width="120" :formatter="formatGoodsModel">
						</el-table-column>
						<el-table-column prop="mainImg" label="商品主图" width="120" sortable>
							<template slot-scope="scope">
								<el-button type="text" @click="dialogVisibleShow(scope.row.mainImg)">点击打开查看</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="otherImg" label="商品其他图" width="180" sortable>
							<template slot-scope="scope">
								<el-button type="text" @click="dialogVisibleShow(scope.row.otherImg)">点击打开查看</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="商品状态" width="120" :formatter="formatSupplierGoodsStatus">
						</el-table-column>
                        <el-table-column label="操作" width="100">
                            <template scope="scope" >
                                <el-button type="danger" v-show="scope.row.status == 1" size="small"
                                           @click="handleUpdateGoodsStatus(scope.$index, scope.row, supplierDetails)">停产
                                </el-button>
                                <el-button type="danger" v-show="scope.row.status == 2" size="small"
                                           @click="handleUpdateGoodsStatus(scope.$index, scope.row, supplierDetails)">开产
                                </el-button>
                            </template>
                        </el-table-column>
					</el-table>
                    <!--工具条-->
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="prev, pager, next" @current-change="handleDetailCurrentChange" :page-size="20" :total="detailTotal" style="float:right;">
                        </el-pagination>
                    </el-col>
				</template>
			</el-table-column>
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
			<el-table-column label="操作" width="100">
				<template scope="scope" >
                    <el-button type="danger" v-show="scope.row.status == 1" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row, suppliers)">停产
                    </el-button>
                    <el-button type="danger" v-show="scope.row.status == 2" size="small"
                               @click="handleUpdateStatus(scope.$index, scope.row, suppliers)">开产
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

        <!--新增供货商品界面-->
        <el-dialog title="新增供货商品" v-model="addDetailFormVisible" :close-on-click-modal="false">
            <el-tag v-model="addDetailForm.supplierCode">{{addDetailForm.supplierCode}}</el-tag>
            <el-tag v-model="addDetailForm.supplierName">{{addDetailForm.supplierName}}</el-tag>
            <el-input-number v-model="supplierGoodsPrice"
                             :precision="2"
                             :step="0.1"
                             :min="0"
                             :max="10000"></el-input-number>

            <el-table :data="addDetailForm.detailList">
                <el-table-column prop="goodsCode" label="商品编码" width="180">
                </el-table-column>
                <el-table-column prop="name" label="商品名称" width="180">
                </el-table-column>
                <el-table-column prop="price" label="供货价" width="80">
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template scope="scope" slot-scope="scope">
                        <el-button type="danger" size="small" @click="removeSupplierDetail(scope.$index, addDetailForm.detailList)">移除</el-button>
                        <el-button type="danger" size="small" @click="changeSupplierDetailPrice(scope.$index, scope.row)">改价</el-button>
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
            <el-table :data="goodsList" highlight-current-row v-loading="goodsListLoading" @selection-change="goodsSelsChange"
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
                <el-table-column label="操作" width="100" fixed="right">
                    <template scope="scope" slot-scope="scope">
                        <el-button type="danger" size="small" @click="handleAddGoodsToSupplier(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleGoodsCurrentChange" :page-size="20"
                               :total="goodsTotal" style="float:right;">
                </el-pagination>
            </el-col>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addDetailFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addDetailSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
	</section>
</template>

<script>
	import { getSupplierPage, getSupplierDetail, startSupplier, stopSupplier,
        addSupplier, getSupplierDetailPage, startSupplierGoods, stopSupplierGoods,
        addSupplierGoods, getGoodsPage} from '../../api/api';
    import enumsUtil from "../../common/js/enumsUtil";

	export default {
		data() {
			return {
				filters: {
					name: '',
					phone: '',
                    email: '',
				},
                detailFilters: {
				    supplierCode: '',
                    goodsCode: '',
                    goodsName: '',
                    brandName: '',
                    modelName: '',
                    categoryName: '',
                    status: null,
                },
                expandSupplier: {
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
				suppliers: [],
                supplierDetails: [],
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

                addDetailFormVisible: false,//新增界面是否显示
                addDetailLoading: false,
                addDetailFormRules: {
                    supplierCode: [
                        { required: true, supplierCode: '请输入编码', trigger: 'blur' },
                    ],
                },
                //新增界面数据
                addDetailForm: {
                    supplierCode: '',
                    supplierName: '',
                    detailList: [],
                },
                supplierGoodsPrice: 0,

                showImgList: [],
                dialogImgVisible: false,


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
			handleCurrentChange(val) {
				this.page = val;
				this.getSupplier();
			},
            handleDetailCurrentChange(val) {
                this.detailPage = val;
                this.getDetail();
            },
			//获取用户列表
			getSupplier() {
				let para = {
                    pageNo: this.page,
					name: this.filters.name,
                    phone: this.filters.phone,
                    email: this.filters.email,
				};
				this.listLoading = true;
                getSupplierPage(para).then((res) => {
					this.total = res.data.totalNum;
					this.suppliers = res.data.record;
				}).finally(() => {
                    this.listLoading = false;
                });
			},
            getDetail() {
			    if(this.detailFilters.status == '') {
                    this.detailFilters.status = null;
                }
                getSupplierDetailPage(this.detailFilters).then((res) => {
                    this.detailTotal = res.data.totalNum;
                    this.supplierDetails = res.data.record;
                }).finally(() => {
                    this.listLoading = false;
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
							addSupplier(para).then((res) => {
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getSupplier();
							}).finally(() => {
                                this.addLoading = false;
                            });
						});
					}
				});
			},
            //显示新增界面
            handleDetailAdd: function () {
                this.addDetailFormVisible = true;
                this.addDetailForm.supplierCode = this.expandSupplier.code;
                this.addDetailForm.supplierName = this.expandSupplier.name;
            },
            //新增
            addDetailSubmit: function () {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addDetailLoading = true;
                    let para = Object.assign({}, this.addDetailForm);
                    addSupplierGoods(para).then((res) => {
                        this.addDetailForm.detailList = [];
                        this.addDetailFormVisible = false;
                        this.getDetail();
                    }).finally(() => {
                        this.addDetailLoading = false;
                    });
                });
            },
			selsChange: function (sels) {
				this.sels = sels;
			},
            formatSupplierGoodsStatus(row, column) {
                return enumsUtil.formatSupplierGoodsStatus(row.status);
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

			    this.expandSupplier = row;
                Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if (this.entexpands.indexOf(row.id) < 0) {
                    this.entexpands= [];
                    this.entexpands.push(row.id);
                    this.detailFilters.supplierCode = row.code;
                    this.getDetail();
                } else {
                    this.entexpands.remove(row.id);
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
            handleAddGoodsToSupplier(index, row) {
			    if(this.addDetailForm.detailList.find((item) => {
                    return item.goodsCode === row.code
                }) == undefined) {
			        let detail = row;
                    detail.goodsCode = row.code;
                    detail.price = row.salePrice;
                    this.addDetailForm.detailList.push(detail);
                }

            },
            handleUpdateStatus(index, row, rows) {
                let para = {code: row.code};
                if (row.status == 1) {
                    stopSupplier(para).then((res) => {
                        row.status = 2;
                        this.$set(rows, index, row);
                    });
                }

                if (row.status == 2) {
                    startSupplier(para).then((res) => {
                        row.status = 1;
                        this.$set(rows, index, row);
                    });
                }
            },
            handleUpdateGoodsStatus(index, row, rows) {
                let para = {id: row.id};
                if (row.status == 1) {
                    stopSupplierGoods(para).then((res) => {
                        row.status = 2;
                        this.$set(rows, index, row);
                    });
                }

                if (row.status == 2) {
                    startSupplierGoods(para).then((res) => {
                        row.status = 1;
                        this.$set(rows, index, row);
                    });
                }
            },
            removeSupplierDetail(index, rows) {
                rows.splice(index, 1);
            },
            changeSupplierDetailPrice(index, row) {
                row.price = this.supplierGoodsPrice
                this.$set(this.addDetailForm.detailList, index, row);
            }
		},
		mounted() {
			this.getSupplier();
		}
	}

</script>

<style scoped>

</style>
