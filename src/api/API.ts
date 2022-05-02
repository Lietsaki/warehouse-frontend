/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'src/boot/axios'
import { AxiosError } from 'axios'
import { Notify, LocalStorage } from 'quasar'
import { LoginCredentials, SignupBody } from 'src/types/AppTypes'
import t from './i18n'

const getAuthHeaders = () => {
  return {
    Authorization: LocalStorage.getItem('token')
  }
}

const catchRequest = async (fn: (arg0: any) => any, request_data: any) => {
  try {
    return await fn(request_data)
  } catch (error) {
    const err = error as AxiosError
    const message_from_api = err.response?.data?.message

    Notify.create({
      message: message_from_api || t('unknown_error'),
      color: 'negative'
    })
  }
}

const getAll = async (request_data: any) => {
  const { entity, populate } = request_data
  const res = await api.get(`/${entity}`, { params: { populate } })
  return res
}

const postRequest = async (request_data: any) => {
  const { entity, body } = request_data
  return await api.post(`/${entity}`, body, { headers: getAuthHeaders() })
}

const insertManyRequest = async (request_data: any) => {
  const { entity, items } = request_data
  return await api.post(
    `/${entity}/insertMany`,
    { items },
    { headers: getAuthHeaders() }
  )
}

const deleteOne = async (request_data: any) => {
  const { entity, _id } = request_data
  return await api.delete(`/${entity}/${_id}`, { headers: getAuthHeaders() })
}

const sellProduct = async (_id: string) => {
  return await api.delete(`/product/sell/${_id}`, { headers: getAuthHeaders() })
}

const login = async (body: LoginCredentials) => {
  return await api.post('/login', body)
}

const signup = async (body: SignupBody) => {
  return await api.post('/register', body)
}

export {
  catchRequest,
  getAll,
  postRequest,
  deleteOne,
  login,
  signup,
  sellProduct,
  insertManyRequest
}
