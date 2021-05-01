<template>
  <el-form ref="fastMenuForm" :model="fastMenuForm" label-width="80px">
    <el-form-item label="菜单列表">
      <el-tree
        :data="fastMenuOptions"
        show-checkbox
        ref="fastMenuTree"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        empty-text="加载中，请稍后"
        :props="defaultProps"
      ></el-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {getMenuTree,saveFastMenu} from "@/api/auth/fastMenu";

export default {
  data() {
    return {
      fastMenuForm:{},
      fastMenuOptions:[],
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultExpandedKeys:[0]
    };
  },
  created() {
    this.loadMenuTree();
  },
  methods: {
    loadMenuTree(){
      getMenuTree().then(
        response => {
          this.fastMenuOptions = response.treeData;
          //设置已经勾选
          //默认选中的树的数据
          let that = this;
          setTimeout(function() {
            response.checkedKeys.forEach(value => {
              that.$refs.fastMenuTree.setChecked(value, true, false);
            });
          }, 500);
        }
      );
    },
    submitForm() {
      let checkedKeys = this.$refs.fastMenuTree.getCheckedKeys();
      this.fastMenuForm.functionIds = checkedKeys.join(',');
      saveFastMenu(this.fastMenuForm).then(
        response => {
          this.msgSuccess("修改成功");
        }
      );
    }
  }
};
</script>
