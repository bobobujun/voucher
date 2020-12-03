export const getEnv = () => {
  // console.log(__wxConfig)
   //develop:开发版  trial:体验版  release:正式版
  if (__wxConfig) {
    return __wxConfig.envVersion
  } else {
    return 'release'
  }
}