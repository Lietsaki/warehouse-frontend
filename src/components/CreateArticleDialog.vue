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
          <q-toolbar-title
            >{{ $t('create') }} {{ $tc('product', 1) }}</q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>

      <q-form class="form-dialog__form" @submit="insertArticle()">
        <q-card-section class="">
          <q-input
            :label="$t('name')"
            filled
            class="q-mb-md"
            v-model="article_body.name"
            :rules="[(val) => !!val || $t('name') + ' ' + $t('required')]"
          />
          <q-input
            :label="$t('stock')"
            filled
            type="number"
            v-model.number="article_body.stock"
            :rules="[(val) => !!val || $t('stock') + ' ' + $t('required')]"
          />
        </q-card-section>

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
            {{ $t('create') }}
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { catchRequest, postRequest } from 'src/api/API'
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
    const article_schema = {
      name: '',
      stock: ''
    }
    const article_body = ref(article_schema)
    const loading = ref(false)

    const insertArticle = async () => {
      loading.value = true

      try {
        await catchRequest(postRequest, {
          entity: 'article',
          body: article_body.value
        })
        $q.notify({
          message: t('success_create', { item: 'article' }),
          color: 'positive'
        })
        emit('close-dialog')
      } catch (error) {
        console.log(error)
      }

      loading.value = false
    }

    const resetDialog = () => (article_body.value = { ...article_schema })

    return {
      is_open,
      article_body,
      insertArticle,
      loading,
      resetDialog
    }
  }
})
</script>

<style lang="scss"></style>
