import request from '../request'
// 核对券码
export const checkVoucherCode = params => {
  return request('/gateway/merchant/clerk/checkVoucherCode', 'get', params)
}
// 商户信息
export const getStoreIndexDetail = params => {
  return request('/gateway/merchant/clerk/getStoreIndexDetail', 'post', params)
}
// 商户信息
export const getVoucherName = params => {
  return request('/gateway/merchant/clerk/getVoucherName', 'get', params)
}