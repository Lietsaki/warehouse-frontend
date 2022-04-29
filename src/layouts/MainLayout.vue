<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="flex items-center">
          <q-icon name="fa fa-warehouse" size="xs" class="q-mx-md" />
          {{ $t('app_title') }}
        </q-toolbar-title>

        <div>
          <q-btn
            color="accent"
            :label="$t('login.title')"
            no-caps
            text-color="dark"
            push
            @click="manageLoginDialog(true)"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <LoginDialog
      :is_dialog_open="login_dialog.is_open"
      @close-dialog="manageLoginDialog(false)"
    />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LoginDialog from 'src/components/LoginDialog.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { LoginDialog },
  setup() {
    const login_dialog = ref({ is_open: false })
    const manageLoginDialog = (state: boolean) => {
      login_dialog.value.is_open = state
    }

    return { login_dialog, manageLoginDialog }
  }
})
</script>
