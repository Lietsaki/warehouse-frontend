/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from 'src/boot/axios'
import { Notify } from 'quasar'
import t from './i18n'

const catchRequest = async (fn: (arg0: any) => any, request_data: any) => {
  try {
    return await fn(request_data)
  } catch (error) {
    Notify.create({
      message: t('fetch_error'),
      color: 'negative'
    })
  }
}

const getAll = async (request_data: any) => {
  const { entity, populate } = request_data

  const results = await api.get(`/${entity}`, {
    params: {
      populate
    }
  })

  return results
}

export { getAll, catchRequest }
