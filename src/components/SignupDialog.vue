<template>
  <q-dialog
    persistent
    :model-value="is_open"
    @hide="$emit('close-dialog')"
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

      <q-form class="form-dialog__form">
        <q-card-section class="">
          <q-input
            v-model="account.name"
            :label="$t('name')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="account.surname"
            :label="$t('surname')"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="account.email"
            :label="$t('email')"
            filled
            class="q-mb-md"
            type="email"
          />
          <q-input
            v-model="account.password"
            :label="$t('password')"
            filled
            class="q-mb-md"
            type="password"
          />
          <q-select
            :options="role_options"
            v-model="account.role"
            :label="$t('role')"
            filled
            emit-value
            map-options
          />
        </q-card-section>

        <q-item class="q-mb-sm" v-if="validation_error">
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
            <q-item-label caption>{{ validation_error }}</q-item-label>
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
            {{ $t('signup.title') }}
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'SignupDialog',
  props: {
    is_dialog_open: {
      type: Boolean,
      required: true
    }
  },
  components: {},
  setup(props) {
    const is_open = computed(() => props.is_dialog_open)

    const account = ref({
      name: '',
      surname: '',
      email: '',
      password: '',
      role: ''
    })

    const role_options = [
      { value: 'operator', label: 'Operator' },
      { value: 'manager', label: 'Manager' }
    ]

    const validation_error = ref('')

    return { is_open, account, validation_error, role_options }
  }
})
</script>

<style lang="scss"></style>
