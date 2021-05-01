<template>
  <div class="app-container">
    <div class="block">
      <div align="right">
        <span class="link-type" @click="handleDispatch"><i class="el-icon-more" />更多</span>
      </div>
      <el-carousel v-loading="loading" height="245px">
        <el-carousel-item v-for="item in notifyData" :key="item.id">
          <div class="el-table el-table--enable-row-hover el-table--medium" align="center">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell" align="center">字段</div></th>
                  <th class="is-leaf"><div class="cell" align="center">数值</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="cell" align="center">名称</div></td>
                  <td><div class="cell" align="center">{{ item.title }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell" align="center">字段1</div></td>
                  <td>
                    <div class="cell" align="center">
                      {{ item.content }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell" align="center">字段2</div></td>
                  <td><div class="cell" align="center">{{ item.content }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell" align="center">字段3</div></td>
                  <td><div class="cell" align="center">{{ item.content }}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>

export default {
  name: "CarouselStat",
  data() {
    return {
      loading:false,
      notifyData:[]
    };
  },
  created() {
    this.getStatList();
  },
  methods: {
    //跳转
    handleDispatch(){
      //路由定向
      this.$router.push({name:'UserNotify',query: {}})
    },
    getStatList(){
      this.notifyData = new Array();
      this.notifyData.push({id:1,title:'标题',content:'内容'})
      this.loading=false;
    }
  }
};
</script>
