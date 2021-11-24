/**
 * 用户的行为——>dispatch一个action——>commit mutation ——>保存state
 */

import storage from '../utils/storage'

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  },
}
