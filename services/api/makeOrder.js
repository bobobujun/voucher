import request from '../request'
// 核销确认的券码列表
export const queryAllVoucher = params => {
  return request('/gateway/merchant/payment/queryAllVoucher', 'get', params)
}
// 确认的券码核销
export const checkAllVoucherCode = params => {
  return request('/gateway/merchant/payment/checkAllVoucherCode', 'post', params,'application/x-www-form-urlencoded')
}
// 创建买单订单
export const createPaymentOrder = params => {
  return request('/gateway/merchant/payment/createPaymentOrder', 'post', params)
}
// 提供二维码
export const getQRcodeForUser = params => {
  return request('/gateway/merchant/payment/getQRcodeForUser', 'get', params)
}
// 支付订单详情
export const paymentDetailResult = params => {
  return request('/gateway/merchant/payment/paymentDetailResult', 'get', params)
}
// 取消收款
export const cancelOrder = params => {
  return request('/gateway/merchant/payment/cancelOrder', 'get', params)
}