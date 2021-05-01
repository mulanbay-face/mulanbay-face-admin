/**
 * 通用js方法封装处理
 * Copyright (c) 2020 mulanbay
 */

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
  this.$forceUpdate();
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.startDate = "";
  search.endDate = "";
  if (null != dateRange && '' != dateRange) {
    search.startDate = this.dateRange[0];
    search.endDate = this.dateRange[1];
  }
  return search;
}


// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == ('' + value)) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  })
  return actions.join('');
}

// 通用下载方法
export function download(fileName) {
  window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function() {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}

// 字符加上金钱前缀
export function formatMoneyWithSymbal(pp) {
  if (pp == null) {
    return '';
  }
  return '￥' + pp.toFixed(2);
}

// 判断是否为空
export function isObjectEmpty(o) {
  if (o === undefined || o === null || o === '') {
    return true;
  }
  return false;
}

//计算百分比
export function getPercent(num1,num2) {
	if(num2==0){
		return 'n/a';
	}
    return (Math.round(num1 / num2 * 10000) / 100.00);
}

export function encodeJsonString(ss) {
  if(ss==undefined||ss==null||ss==''){
    return null;
  }
	if(ss.indexOf('{')==0){
		return  encodeURIComponent(ss);
	}else{
		return ss;
	}
}

/**
 * 字符串转换为json数据
 * @param {Object} ss
 */
export function string2Json(ss) {
  return eval('(' + ss + ')');
}

// 遍历解析Json
export function parseJsonToTree(jsonObj,prefix) {
  //不加前缀导致整个tree的id不唯一
  const pp = (prefix==undefined||prefix==null ? '':prefix+'_');
  let datas = new Array();
  // 循环所有键
  for(let key in jsonObj) {
    //如果对象类型为object类型且数组长度大于0 或者 是对象 ，继续递归解析
    let element = jsonObj[key];
    if(element==null||element==''){
      datas.push({id:pp+key,text:'--',label:'--',hasChildren:false})
    }else if(element.length > 0 && typeof(element) == "object" || typeof(element) == "object") {
        let eo = {id:pp+key,text:'详情',label:'详情',hasChildren:true};
        let children = parseJsonToTree(element,key);
        eo.children = children;
        datas.push(eo);
    } else {
      datas.push({id:pp+key,text:element,label:element,hasChildren:false})
    }
  }
  //冒泡排序
  for(let j=0;j<datas.length-1;j++){
  //两两比较，如果前一个比后一个大，则交换位置。
   for(let i=0;i<datas.length-1-j;i++){
        if(datas[i].id>datas[i+1].id){
            let temp = datas[i];
            datas[i] = datas[i+1];
            datas[i+1] = temp;
        }
    }
  }
  return datas;
}

/**
 * 加载层
 */
export const loadingOptions = {
    lock: true,
    text: "拼命读取中",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
}

/**
 * 通用状态
 */
export const commonStatusOptions = [{
    id: 'ENABLE',
    text: '有效'
  },
  {
    id: 'DISABLE',
    text: '无效'
  }
]

export const booleanOptions = [{
    id: 'true',
    text: '是'
  },
  {
    id: 'false',
    text: '否'
  }
]
