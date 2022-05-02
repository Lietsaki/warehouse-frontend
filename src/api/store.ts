import { LocalStorage } from 'quasar'
import { User } from 'src/types/AppTypes'
import { setAuthorizationHeaders } from './API'
import { ref } from 'vue'

// STATE
const user = ref(LocalStorage.getItem('current_user'))

// SETTERS
const logOut = () => {
  LocalStorage.remove('current_user')
  LocalStorage.remove('token')
  user.value = null
  setAuthorizationHeaders('')
}

const setCurrentUser = (user_data: User, token: string) => {
  LocalStorage.set('current_user', { ...user_data })
  LocalStorage.set('token', `Bearer ${token}`)
  setAuthorizationHeaders(token)
  user.value = user_data
}

export { setCurrentUser, logOut, user }
