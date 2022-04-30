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
type ArticleToSelect = {
  _id: string
  name: string
  stock: number
  selected?: boolean
  required_amount?: number
}
type ContainedArticlesUnpopulated = {
  amount_of: number
  art_id: string
}
type Product = {
  name: string
  contain_articles: ContainedArticlesUnpopulated[]
}

export {
  SimpleDialog,
  LoginCredentials,
  SignupBody,
  User,
  ArticleToSelect,
  Product
}
