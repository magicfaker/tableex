<template>
  <div class="table">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="品牌">
        <el-select v-model="formInline.brandName" placeholder="品牌选择" style="width:140px" clearable>
          <el-option :label="item" v-for="(item,index) in optionName" :key="index" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="季节">
        <el-select v-model="formInline.season" placeholder="季节选择" style="width:140px">
          <el-option :label="item" v-for="(item,index) in seasonName" :key="index" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="合同号">
        <el-input v-model="formInline.htNumber" placeholder="请输入合同号">></el-input>
      </el-form-item>

      <el-form-item label="款号">
        <el-input v-model="formInline.productCode"></el-input>
      </el-form-item>

      <el-form-item label="订货年份">
        <el-select v-model="formInline.year" placeholder="年份选择" style="width:140px">
          <el-option
            :label="item1"
            v-for="(item1,index1) in yearListname"
            :key="index1"
            :value="item1"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="请购类型">
        <el-select v-model="formInline.purchaseType" placeholder="类型选择" style="width:140px">
          <el-option
            :label="item2"
            v-for="(item2,index2) in sourceTypeName"
            :key="index2"
            :value="item2"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
        <el-button type="primary" @click="over()">重置筛选条件</el-button>
      </el-form-item>
      <el-button type="primary" @click="down()">下载excel</el-button>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData.slice((currentPage-1)*formInline.pageSize,currentPage*formInline.pageSize)"
      max-height="780"
      style="width: 100%"
      :header-cell-style="{background:'#7799bc',color:'#fff'}"
    >
      <el-table-column label="基础数据" style="background:red">
        <el-table-column
          v-for="item of baseInfo"
          :key="item.key"
          :prop="item.key"
          :label="item.title"
          :min-width="item.width"
        ></el-table-column>
      </el-table-column>

      <el-table-column
        v-for="(item, idx) of materiaList"
        :key="`materia-${idx}`"
        :label="`面料${idx+1}`"
      >
        <el-table-column v-for="(items, i) of ml" :label="items.title" :key="i">
          <template
            v-slot:default="{ row }"
          >{{ row.materiaMap[idx] ? row.materiaMap[idx][items.key] : '' }}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        v-for="(item, idx) of subsidiaryList"
        :key="`subsidiary-${idx}`"
        :label="`辅料${idx+1}`"
      >
        <el-table-column :label="item.subsidiaryName" height="10px" min-width="300px">
          <template v-slot:default="{ row }">{{ row.subsidiaryMap[idx].subsidiaryMoney }}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column v-for="(item, idx) of costList" :label="`费用${idx+1}`" :key="`cost-${idx}`">
        <el-table-column :label="item.itemName">
          <template v-slot:default="{ row }">{{ row.itemsMap[idx].itemMoney }}</template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="current_change"
        :page-size="formInline.pageSize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getList, getExcelName, selcetValue } from "./../http/api"; // 导入我们的api接口
export default {
  data() {
    return {
      // 基础数据表头
      baseInfo: [
        {
          title: "面料类型",
          key: "mlType"
        },
        {
          title: "订货年份",
          width: "100px",
          key: "year"
        },
        {
          title: "季节",
          key: "season"
        },
        {
          title: "品牌",
          width: "110px",
          key: "brandName"
        },
        {
          title: "合同号",
          width: "160px",
          key: "htNumber"
        },
        {
          title: "合同签订工厂",
          width: "200px",
          key: "supplierName"
        },
        {
          title: "款号",
          width: "130px",
          key: "productCode"
        },
        {
          title: "款名",
          width: "200px",
          key: "productName"
        },
        {
          title: "请购类型",
          key: "sourceTypeName"
        },
        {
          title: "成衣合同价",
          key: "price"
        },
        {
          title: "数量",
          key: "htNum"
        },
        {
          title: "合同金额",
          key: "money"
        },
        {
          title: "合同发布时间",
          width: "180px",
          key: "addTime"
        },
        {
          title: "分批交货时间",
          width: "180px",
          key: "dtime"
        },
        {
          title: "税率",
          key: "taxRate"
        },
        {
          title: "业务员",
          key: "cgManName"
        },
        {
          title: "发布人",
          key: "addUserName"
        }
      ],
      // 面料表头
      ml: [
        {
          title: "是否制定",
          key: "materialIspoint"
        },
        {
          title: "面料编号",
          key: "mnumber"
        },
        {
          title: "面料名称",
          key: "mname"
        },

        {
          title: "面料价格",
          key: "mprice"
        },
        {
          title: "面料成份",
          key: "mingredients"
        },
        {
          title: "纱织规格",
          key: "msaori"
        },
        {
          title: "面料克重",
          key: "mweight"
        },
        {
          title: "用量",
          key: "mdosage"
        }
      ],
      // 搜索条件
      formInline: {
        brandName: "",
        htNumber: "",
        productCode: "",
        season: "",
        purchaseType: "",
        year: "",
        nowPage: 1,
        pageSize: 20
      },
      idx: "",
      // idx_f: '',
      // idx_m: '',
      // idx3: "",
      costList: [],
      materiaList: [],
      subsidiaryList: [],
      //费用
      cost: [],
      //辅料
      accessories: [],
      //面料
      fabric: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      excelName: "",
      optionName: [],
      seasonName: ["全部", "春", "夏", "秋", "冬", "四季", "暂无季节"],
      sourceTypeName: [],
      yearListname: [] || "",
      loading: false
    };
  },
  created() {
    // this.init();
    this.getSelcetValue();
  },
  methods: {
    over() {
      location.reload();
    },
    getSelcetValue() {
      selcetValue().then(res => {
        (this.optionName = res.data.data.data.brandNameList),
          (this.sourceTypeName = res.data.data.data.sourceTypeName),
          (this.yearListname = res.data.data.data.yearList);
      });
    },
    onSubmit() {
      this.loading = true;
      getList({
        brandName: this.formInline.brandName,
        season: this.formInline.season,
        htNumber: this.formInline.htNumber,
        productCode: this.formInline.productCode,
        purchaseType: this.formInline.purchaseType,
        year: this.formInline.year,
        nowPage: this.formInline.nowPage,
        pageSize: this.formInline.pageSize
      })
        .then(res => {
          if (res.data == null) {
            this.loading = false;
            this.$message.error("无匹配信息，请重新选择搜索条件");
            console.log(res.data);
          } else {
            this.loading = false;
            this.tableData = res.data.data;
            console.log(res.data.data, "~~~");
            if (this.tableData.length) {
              this.costList = this.tableData[0].itemsMap;
              this.subsidiaryList = this.tableData[0].subsidiaryMap;
              this.materiaList = this.tableData[0].materiaMap;
            }
            this.total = res.data.totalCount;
            this.formInline.pageSize = res.data.pageSize;
          }
        })
        .catch(arr => {
          console.log(arr);
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClick(row) {
      console.log(row);
    },
    down() {
      //获取excel文件名
      this.loading = true;
      getExcelName({
        brandName: this.formInline.brandName,
        season: this.formInline.season,
        htNumber: this.formInline.htNumber,
        productCode: this.formInline.productCode,
        purchaseType: this.formInline.purchaseType,
        year: this.formInline.year,
        nowPage: this.formInline.nowPage,
        pageSize: this.formInline.pageSize
      }).then(res => {
        axios({
          method: "post",
          url: "http://115.238.142.66:8882/purchase/excel/downloadByFileName", // 请求地址
          params: {
            fileName: res.data
          },
          responseType: "blob"
        }).then(res => {
          this.loading = false;
          const content = res.data;
          const blob = new Blob([content]);
          const fileName = "table.xlsx";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        });
      });
    },
    // init() {
    //   getList({
    //     nowPage: this.formInline.nowPage,
    //     pageSize: 20
    //   }).then(res => {
    //     this.tableData = res.data.data || [];
    //     this.loading = false;
    //     if (this.tableData.length) {
    //       this.costList = this.tableData[0].itemsMap;
    //       this.subsidiaryList = this.tableData[0].subsidiaryMap;
    //       this.materiaList = this.tableData[0].materiaMap;
    //     }
    //     this.total = res.data.totalCount;
    //     this.formInline.pageSize = res.data.pageSize;
    //   });
    // },
    current_change: function(currentPage) {
      this.formInline.nowPage = currentPage;
      console.log(currentPage);
      this.loading = true;
      getList({
        nowPage: this.formInline.nowPage,
        season: this.formInline.season,
        brandName: this.formInline.brandName,
        htNumber: this.formInline.htNumber,
        productCode: this.formInline.productCode,
        purchaseType: this.formInline.purchaseType,
        year: this.formInline.year,
        pageSize: this.formInline.pageSize
      }).then(res => {
        this.loading = false;
        this.tableData = res.data.data || [];
        if (this.tableData.length) {
          this.costList = this.tableData[0].itemsMap;
          this.subsidiaryList = this.tableData[0].subsidiaryMap;
          this.materiaList = this.tableData[0].materiaMap;
        }
        this.total = res.data.totalCount;
        this.formInline.pageSize = res.data.pageSize;
      });
    }
  }
};
</script>

<style lang="less" scope>
.table {
  .block {
    margin-top: 10px;
  }
  .demo-form-inline {
    min-width: 1700px;
  }
}
</style>