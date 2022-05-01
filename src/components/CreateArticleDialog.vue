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
            >{{ $t('create') }} {{ $tc('article', 1) }}</q-toolbar-title
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

        <q-card-section class="">
          <div class="q-mb-sm">{{ $t('upload_from_file') }}</div>

          <q-file
            :label="$t('select_or_drop_file')"
            accept="application/JSON"
            outlined
            @update:model-value="(new_val) => uploadProductFile(new_val)"
            v-model="articles_file"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
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
import { catchRequest, postRequest, insertManyRequest } from 'src/api/API'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'CreateArticleDialog',
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
    const articles_file = ref(null)

    const insertArticle = async () => {
      loading.value = true

      const success = await catchRequest(postRequest, {
        entity: 'article',
        body: article_body.value
      })

      if (success) {
        $q.notify({
          message: t('success_create', { item: 'article' }),
          color: 'positive'
        })
        emit('success')
      }

      loading.value = false
    }

    const resetDialog = () => {
      article_body.value = { ...article_schema }
      articles_file.value = null
    }

    const uploadProductFile = (received_file: File) => {
      const reader = new FileReader()

      reader.onload = async (event) => {
        loading.value = true
        const file_data = event.target!.result as string
        const parsed_data = JSON.parse(file_data)

        if (!parsed_data.inventory) {
          loading.value = false
          articles_file.value = null
          return $q.notify({
            message: t('missing_property_in_file', { prop: 'inventory' }),
            color: 'negative'
          })
        }

        const success = await catchRequest(insertManyRequest, {
          entity: 'article',
          items: parsed_data.inventory
        })

        if (success) {
          $q.notify({
            message: t('file_upload_success', { items: 'articles' }),
            color: 'positive'
          })

          emit('success')
        } else {
          articles_file.value = null
        }

        loading.value = false
      }

      reader.readAsText(received_file)
    }

    return {
      is_open,
      article_body,
      insertArticle,
      loading,
      resetDialog,
      articles_file,
      uploadProductFile
    }
  }
})
</script>

<style lang="scss"></style>
