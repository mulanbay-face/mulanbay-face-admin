/** 动态表单生成插件form-create的通用封装方法*/
/**
 * 根据后台数据生成规则
 * @param {Object} dataRules
 */
export function generateFcRules(dataRules){
  let selectOptions = new Array();
  if(dataRules==null||dataRules.length==0){
    return selectOptions;
  }
  //组装数据
  const n = dataRules.length;
  for(let i =0;i<n;i++){
    let r = dataRules[i];
    if(r.list==null||r.list.length==0){
      this.msgError(r.promptMsg);
      return new Array();
    }
    //field插件需要唯一
    let selectData = {
      type: "select",
      field: "bindValue"+i,
      title: r.name,
      value: [],
      options: [],
      props: {
        multiple: false
      }
    };
    const ll = r.list.length;
    let os = new Array();
    for(let j=0;j<ll;j++){
      let opData = r.list[j];
      let o = {"value": opData.id, "label": opData.text, "disabled": false};
      os.push(o);
    }
    selectData.options = os;
    selectOptions.push(selectData);
  }
  return selectOptions;
}

/**
 * 获取绑定值:fcObject为表单对象
 * @param {Object} fcObject
 */
export function getBindValues(fcObject){
  let formData = fcObject.formData();
  let values = new Array();
  for(let key in formData){
    if(formData[key]!=null){
      values.push(formData[key]);
    }
  }
  if(values.length>0){
    return values.join(',');
  }else{
    return undefined;
  }
}

/**
 * 设置绑定值
 * @param {Object} bindValues
 * @param {Object} fcObject
 */
export function setBindValues(bindValues,fcObject){
  if(bindValues==undefined||bindValues==null){
    return;
  }
  let ss = bindValues.split(',');
  for(let i=0;i<ss.length;i++){
    fcObject.setValue("bindValue"+i,ss[i]);
  }
}

/**
 * 产生规则
 * @param {Object} dataRules
 */
export function generateTriggerParasRules(dataRules){
  let options = new Array();
  const n = dataRules.length;
  for(let i=0;i<n;i++){
    let dr = dataRules[i];
    let title =dr.name;
    if(dr.desc!=null&&dr.desc!=''){
      title+='('+dr.desc+')';
    }
    let op={};
    if(dr.editType=='BOOLEAN'||dr.dataType=='java.lang.Boolean'){
      op = {
        type:"switch",
        title:title,
        field:dr.field,
        value:"true",
        props: {
            activeValue:"true",
            inactiveValue:"false",
        }
      };
    }else if(dr.editType=='COMBOBOX'){
      //field插件需要唯一
      op = {
        type: "select",
        title:title,
        field:dr.field,
        value: [],
        options: [],
        props: {
          size:'small',
          multiple: false
        }
      };
      const ed = eval('(' + dr.editData + ')');
      const ll = ed.length;
      let os = new Array();
      for(let j=0;j<ll;j++){
        let opData = ed[j];
        let o = {"value": opData.id, "label": opData.text, "disabled": false};
        os.push(o);
      }
      op.options = os;
    }else if(dr.editType=='NUMBER'){
      op = {
        type: "InputNumber",
        title:title,
        field:dr.field,
        value: 1,
        props: {
            precision:dr.scale
        }
      };
    }else if(dr.editType=='TIME'){
      op = {
        type: "TimePicker",
        title:title,
        field:dr.field,
        value: [],
        props: {
            isRange:false,
            format:"HH:mm",
            valueFormat:"HH:mm"
          }
        };
    }else{
      op ={
        type:"input",
        title:title,
        field:dr.field,
        value:"",
        props: {
            "type": "text",
        }
      }
    }
    options.push(op);
  }
  return options;
}

/**
 * 设置绑定值
 * @param {Object} bindValues
 * @param {Object} fcObject
 */
export function setTriggerParasBindValues(paras,fcObject){
  if(paras==undefined||paras==null){
    return;
  }
  const pp = eval('(' + paras + ')');
  for(let key in pp){
    fcObject.setValue(key,pp[key]);
  }
}
