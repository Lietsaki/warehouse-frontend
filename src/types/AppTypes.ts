type SimpleDialog = { is_open: boolean }
type LoginCredentials = { email: string; password: string }
type SignupBody = {
  name: string
  surname: string
  email: string
  password: string
  role: string
}
type User = {
  _id: string
  name: string
  surname: string
  email: string
  role: string
  last_updated: number
}

export { SimpleDialog, LoginCredentials, SignupBody, User }
