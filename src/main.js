import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/mulanbay.scss' // mulanbay css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { parseTime, resetForm, addDateRange, selectDictLabel, download,
handleTree,commonStatusOptions,booleanOptions,formatMoneyWithSymbal,isObjectEmpty,loadingOptions} from "@/utils/mulanbay";
import { getYearDateRange,getMonthDateRange,datePickerOptions,getFormatDate} from "@/utils/datetime";
import Pagination from "@/components/Pagination";
import {getEnumTree,getDictItemTree} from "@/api/common";

// 全局方法挂载
Vue.prototype.getEnumTree = getEnumTree
Vue.prototype.getDictItemTree = getDictItemTree
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.formatMoneyWithSymbal = formatMoneyWithSymbal
Vue.prototype.commonStatusOptions = commonStatusOptions
Vue.prototype.booleanOptions = booleanOptions
Vue.prototype.loadingOptions = loadingOptions
Vue.prototype.datePickerOptions = datePickerOptions
Vue.prototype.isObjectEmpty = isObjectEmpty
Vue.prototype.getYearDateRange = getYearDateRange
Vue.prototype.getMonthDateRange = getMonthDateRange
Vue.prototype.getFormatDate = getFormatDate

//当前登陆模式
//Vue.prototype.familyMode = store.state.user.familyMode;

//获取用户名称
Vue.prototype.familyUserName = function (userId) {
  let familyUserList = store.state.user.familyUserList;
  if(familyUserList==null||familyUserList.length==0){
    return null;
  }else{
    for(let i=0;i<familyUserList.length;i++){
      let fu = familyUserList[i];
      if(fu.id==userId){
        return fu.text;
      }
    }
    return null;
  }
}

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

/**
 * 弹出提示
 * @param {Object} title
 * @param {Object} msg
 */
Vue.prototype.msgAlert = function (title,msg) {
  this.$alert(msg, title, {
    confirmButtonText: '确定',
    //支持html，比如换行符之类
    dangerouslyUseHTMLString:true,
    callback: action => {
      //回调
    }
  });
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
