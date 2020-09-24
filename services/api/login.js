import request from '../request'
// 微信登录
export const wxlogin = params => {
  return request('/gateway/merchant/applets/appletLogin', 'get', params)
}
//微信登录首次获取二维码
export const firstLoginCode = params => {
  return request('/gateway/merchant/applets/appletSendSms', 'get', params)
}
// 首次微信登录再登录
export const firstLogin = params => {
  return request('/gateway/merchant/applets/checkAppletSms', 'get', params)
}
// 获取手机号验证码
export const getPhoneCode = params => {
  return request('/gateway/merchant/clerk/getVerifyCode', 'post', params,'application/x-www-form-urlencoded',)
}
// 手机号密码登录
export const phoneLogin = params => {
  return request('/gateway/merchant/clerk/getClerkByMobileAndPassword', 'post', params)
}
//退出登录
export const loginOut = params => {
  return request('/gateway/merchant/clerk/loginOut', 'get', params)
}
//获取银行列表
export const getAllSupportBank = params => {
  return request('/gateway/merchant/clerk/getAllSupportBank', 'get', params)
}