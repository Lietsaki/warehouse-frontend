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
          <q-toolbar-title>{{ $t('signup.extended_title') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>

      <q-form class="form-dialog__form" @submit="performSignup()">
        <q-card-section class="">
          <q-input
            v-model="account.name"
            :label="$t('name')"
            filled
            class="q-mb-md"
            :rules="[(val) => !!val || $t('name') + ' ' + $t('required')]"
          />
          <q-input
            v-model="account.surname"
            :label="$t('surname')"
            filled
            class="q-mb-md"
            :rules="[(val) => !!val || $t('surname') + ' ' + $t('required')]"
          />
          <q-input
            v-model="account.email"
            :label="$t('email')"
            filled
            class="q-mb-md"
            type="email"
            :rules="[(val) => !!val || $t('email') + ' ' + $t('required')]"
          />
          <q-input
            v-model="account.password"
            :label="$t('password')"
            filled
            class="q-mb-md"
            type="password"
            :rules="[(val) => !!val || $t('password') + ' ' + $t('required')]"
          />
          <q-select
            :options="role_options"
            v-model="account.role"
            :label="$t('role')"
            filled
            emit-value
            map-options
            :rules="[(val) => !!val || $t('role') + ' ' + $t('required')]"
          />
        </q-card-section>

        <q-item class="q-mb-sm q-pt-none" v-if="signup_error">
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
            <q-item-label caption>{{ signup_error }}</q-item-label>
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
            :disable="loading"
            :loading="loading"
          >
            {{ $t('signup.title') }}
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { signup } from 'src/api/API'
import { AxiosError } from 'axios'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'SignupDialog',
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
    const account_schema = {
      name: '',
      surname: '',
      email: '',
      password: '',
      role: ''
    }
    const account = ref(account_schema)
    const role_options = [
      { value: 'operator', label: 'Operator' },
      { value: 'manager', label: 'Manager' }
    ]
    const signup_error = ref('')
    const loading = ref(false)

    const performSignup = async () => {
      loading.value = true

      try {
        await signup(account.value)
        signup_error.value = ''
        $q.notify({
          message: t('signup.success'),
          color: 'positive'
        })
        emit('close-dialog')
      } catch (error) {
        const err = error as AxiosError
        const message_from_api = err.response?.data?.message
        signup_error.value = message_from_api || t('unknown_error')
      }

      loading.value = false
    }

    const resetDialog = () => (account.value = { ...account_schema })

    return {
      is_open,
      account,
      signup_error,
      role_options,
      performSignup,
      loading,
      resetDialog
    }
  }
})
</script>

<style lang="scss"></style>
