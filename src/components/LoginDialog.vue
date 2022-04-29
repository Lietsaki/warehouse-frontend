<template>
  <q-dialog
    persistent
    :model-value="is_open"
    @hide="$emit('close-dialog')"
    :maximized="$q.screen.lt.sm"
    transition-show="jump-right"
    transition-hide="jump-left"
  >
    <q-card class="login-dialog">
      <!-- Card header. It contains the title and close button -->
      <q-card-section class="q-pa-none q-mb-sm">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ $t('login.extended_title') }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>

      <q-form class="login-form">
        <q-card-section class="">
          <q-input
            :label="$t('email')"
            filled
            class="q-mb-md"
            type="email"
            v-model="credentials.email"
          />
          <q-input
            :label="$t('password')"
            filled
            v-model="credentials.password"
            type="password"
          />
        </q-card-section>

        <q-item class="q-mb-sm" v-if="login_error">
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

export default defineComponent({
  name: 'LoginDialog',
  props: {
    is_dialog_open: {
      type: Boolean,
      required: true
    }
  },
  components: {},
  setup(props) {
    const is_open = computed(() => {
      return props.is_dialog_open
    })

    const credentials = ref({
      email: '',
      password: ''
    })

    const login_error = ref('')

    return { is_open, credentials, login_error }
  }
})
</script>

<style lang="scss">
.login-dialog {
  @media (min-width: $breakpoint-xs-max) {
    width: 600px;

    .login-form {
      width: 70%;
      margin: 0 auto;
    }
  }

  .login-error {
    display: flex;
    justify-content: center;
  }
}
</style>
