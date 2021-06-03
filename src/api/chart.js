import {axios} from '@/utils/request'

const api = {
  chartPre: '/api/chart'
}

/**
 * 搜索公司名或人名得到与其有关的公司,及各个公司中的最大股东，返回知识图谱的数据
 * @param searchName 搜索的公司名或人名
 * @returns {*} 返回下级控股公司，以及各个公司的最大股东
 * [
 {group: 'nodes', data: {'id': 'n1', 'name': '李俊杰 ',}, classes: 'classes-A', position: {x: 200, y: 50}},
 {group: 'edges', data: {id: 'e1', name: '是', source: '李俊杰', target: '野猪'},classes:'relationB'},
 ]
 TODO:classes根据后端命名来
 */

export function findRelatedCompaniesAPI(searchName) {
  console.log("findRelatedCompaniesAPI:searchName----"+searchName)
  return axios({
    url: `${api.chartPre}/findRelatedCompanies/${searchName}`,
    method: 'GET',
  })
}

/**
 * 向上查询该公司是否有上级公司控制，查询找到最终控股人/公司
 * @param searchName
 * @returns {*} 返回有最终控股人的知识图谱，
 * [
 {group: 'nodes', data: {'id': 'n1', 'name': '李俊杰 ',}, classes: 'classes-A', position: {x: 200, y: 50}},
 {group: 'edges', data: {id: 'e1', name: '是', source: '李俊杰', target: '野猪'},classes:'relationB'},
 ]
 * TODO:最终返回多少数据还要讨论一下
 */
export function findUpCompaniesAPI(searchName) {
  console.log("findUpCompaniesAPI:searchName----"+searchName)
  return axios({
    url: `${api.chartPre}/findUpCompanies/${searchName}`,
    method: 'GET',
  })
}


/**
 * 查询公司风险，返回包括风险的知识图谱数据
 * @param companyName 公司名称
 * @returns {*} 返回计算风险涉及到的公司，以及。。。
 * [
 {group: 'nodes', data: {'id': 'n1', 'name': '李俊杰 ',}, classes: 'classes-A', position: {x: 200, y: 50}},
 {group: 'edges', data: {id: 'e1', name: '是', source: '李俊杰', target: '野猪'},classes:'relationB'},
 ]
 */
export function findRiskChartAPI(companyName) {
  console.log("findRiskChartAPI:companyName----"+companyName)
  return axios({
    url: `${api.chartPre}/findRiskChart/${companyName}`,
    method: 'GET',
  })
}

/**
 * 查询公司的详细信息
 * @param companyName 公司名称
 * @returns {*} 返回介绍，共有多少员工，风险计算的具体公式，有多少家子公司等等
 * {id:'',name:'',introduction:'',......,}
 */
export function findDetailAPI(companyName) {
  console.log("findDetailAPI:companyName----"+companyName)
  return axios({
    url: `${api.chartPre}/findDetail/${companyName}`,
    method: 'GET',
  })
}

/**
 * 搜索模糊查询,根据传输的词返回包括该词的所有公司列表
 * @param keyWord 用户输入的词
 * @returns
 * [{id: "",name: "",},
    {id: "",name: "",},]
 */
export function getNameListAPI(keyWord) {
  console.log("getNameListAPI:keyWord----"+keyWord)
  return axios({
    url: `${api.chartPre}/getNameList/${keyWord}`,
    method: 'GET',
  })
}

