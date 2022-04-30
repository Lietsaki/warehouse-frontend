<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="flex items-center">
          <q-icon name="fa fa-warehouse" size="xs" class="q-mx-md" />
          {{ $t('app_title') }}
        </q-toolbar-title>

        <div v-if="!user">
          <q-btn
            color="accent"
            :label="$t('login.title')"
            no-caps
            text-color="dark"
            push
            @click="manageDialog(login_dialog, true)"
          />
          <q-btn
            color="accent"
            :label="$t('signup.title')"
            class="q-ml-md"
            no-caps
            text-color="dark"
            push
            @click="manageDialog(signup_dialog, true)"
          />
        </div>
        <div v-else class="ellipsis">
          {{ user.name }}
          <q-btn
            color="accent"
            :label="$t('logout.title')"
            class="q-ml-md"
            no-caps
            text-color="dark"
            push
            @click="performLogout()"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <LoginDialog
      :is_dialog_open="login_dialog.is_open"
      @close-dialog="manageDialog(login_dialog, false)"
    />
    <SignupDialog
      :is_dialog_open="signup_dialog.is_open"
      @close-dialog="manageDialog(signup_dialog, false)"
    />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LoginDialog from 'src/components/LoginDialog.vue'
import SignupDialog from 'src/components/SignupDialog.vue'
import { SimpleDialog } from 'src/types/AppTypes'
import { user, logOut } from 'src/api/store'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'MainLayout',
  components: { LoginDialog, SignupDialog },
  setup() {
    const $q = useQuasar()
    const login_dialog = ref({ is_open: false })
    const signup_dialog = ref({ is_open: false })

    const manageDialog = (dialog: SimpleDialog, state: boolean) => {
      dialog.is_open = state
    }

    const performLogout = () => {
      logOut()
      $q.notify({
        message: t('logout.success'),
        color: 'positive'
      })
    }

    return {
      login_dialog,
      signup_dialog,
      manageDialog,
      user,
      performLogout
    }
  }
})
</script>
