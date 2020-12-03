import request from '../request'
// 券码列表
export const qHistoryList = params => {
  return request('/gateway/merchant/clerk/getVoucherCodeList', 'post', params)
}
// 收款列表
export const pageForPayment = params => {
  return request('/gateway/merchant/payment/pageForPayment', 'post', params)
}
// 券码数量列表
export const queryVoucherCount = params => {
  return request('/gateway/merchant/clerk/queryVoucherCount', 'get', params)
}