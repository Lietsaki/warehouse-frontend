<template>
  <q-dialog
    persistent
    :model-value="is_open"
    @hide="$emit('close-dialog')"
    @before-show="resetDialog()"
    :maximized="$q.screen.lt.sm"
    transition-show="jump-right"
    transition-hide="jump-left"
  >
    <q-card class="form-dialog">
      <!-- Card header. It contains the title and close button -->
      <q-card-section class="q-pa-none q-mb-sm">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ $t('login.title') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>

      <q-form class="form-dialog__form" @submit="performLogin()">
        <q-card-section class="">
          <q-input
            :label="$t('email')"
            filled
            class="q-mb-md"
            type="email"
            v-model="credentials.email"
            :rules="[(val) => !!val || $t('email') + ' ' + $t('required')]"
          />
          <q-input
            :label="$t('password')"
            filled
            v-model="credentials.password"
            type="password"
            :rules="[(val) => !!val || $t('password') + ' ' + $t('required')]"
          />
        </q-card-section>

        <q-item class="q-mb-sm q-pt-none" v-if="login_error">
          <q-item-section top avatar>
            <q-avatar
              color="negative"
              text-color="white"
              square
              icon="fa fa-face-dizzy"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ $t('error') }}</q-item-label>
            <q-item-label caption>{{ login_error }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-card-actions class="flex justify-center">
          <q-btn
            class="q-mb-sm"
            color="positive"
            size="lg"
            padding="3px 20px"
            push
            type="submit"
            :loading="loading"
            :disable="loading"
          >
            {{ $t('login.title') }}
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { login } from 'src/api/API'
import { setCurrentUser } from 'src/api/store'
import { AxiosError } from 'axios'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'LoginDialog',
  props: {
    is_dialog_open: {
      type: Boolean,
      required: true
    }
  },
  components: {},
  setup(props, { emit }) {
    const $q = useQuasar()
    const is_open = computed(() => props.is_dialog_open)
    const initial_credentials = {
      email: '',
      password: ''
    }
    const credentials = ref(initial_credentials)
    const login_error = ref('')
    const loading = ref(false)

    const performLogin = async () => {
      loading.value = true

      try {
        const res = await login(credentials.value)
        setCurrentUser(res.data.user, res.data.token)
        login_error.value = ''

        $q.notify({
          message: t('login.success', { name: res.data.user.name }),
          color: 'positive'
        })
        emit('close-dialog')
      } catch (error) {
        const err = error as AxiosError
        const message_from_api = err.response?.data?.message
        login_error.value = message_from_api || t('unknown_error')
      }

      loading.value = false
    }

    const resetDialog = () => {
      credentials.value = { ...initial_credentials }
      login_error.value = ''
    }

    return {
      is_open,
      credentials,
      login_error,
      performLogin,
      loading,
      resetDialog
    }
  }
})
</script>

<style lang="scss"></style>
