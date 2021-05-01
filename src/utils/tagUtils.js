/** 标签的通用方法*/
import {Message} from 'element-ui'

/**
 * 添加标签
 * @param {Object} tag
 * @param {Object} tagOptions
 */
export function appendTagToOptions(tag,tagOptions){
  const a = tagOptions.indexOf(tag);
  if(a>=0){
    Message({
      message: '该标签已经存在',
      type: 'error',
      duration: 5 * 1000
    });
  }else{
    tagOptions.push(tag);
  }
}
