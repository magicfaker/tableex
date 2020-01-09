import { get,post } from './http'

export const getList = p => post('purchaseBaseMessage/getExcelValue', p);
// 获取excel名称
export const getExcelName = p => post('excel/saveExcel', p);
//下载excel
export const downLoad = () => post('excel/downloadByFileName');
//菜单
export const selcetValue = () => get('purchaseBaseMessage/getSelcetValue');