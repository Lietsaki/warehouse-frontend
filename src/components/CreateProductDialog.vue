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
    <q-card class="create-product">
      <!-- Card header. It contains the title and close button -->
      <q-card-section class="q-pa-none q-mb-sm">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title
            >{{ $t('create') }} {{ $tc('product', 1) }}</q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>

      <q-form class="create-product__form" @submit="insertProduct()">
        <q-card-section class="q-pa-sm">
          <q-input
            :label="$t('name')"
            filled
            class="q-mb-md"
            v-model="product_body.name"
            :rules="[(val) => !!val || $t('name') + ' ' + $t('required')]"
          />

          <div class="article-picker">
            <div class="article-picker__title text-subtitle1 text-dark">
              {{ $t('add_articles_to_product') }}
            </div>
            <q-spinner-bars
              v-if="loading_articles"
              class="q-my-lg"
              color="grey-7"
              size="60px"
            />
            <div v-else class="article-picker__list scrollify">
              <div
                class="article-item"
                v-for="article of articles"
                :key="article.id"
              >
                <div class="article-item__name">
                  {{ article.name }}
                </div>

                <div class="article-item__stock flex items-center">
                  {{ $t('stock') }}: {{ article.stock }}

                  <q-input
                    dense
                    borderless
                    class="q-ml-lg"
                    :label="$t('required_amount')"
                    type="number"
                    v-model.number="article.required_amount"
                  />
                </div>

                <div class="article-item__actions">
                  <q-checkbox v-model="article.selected" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="">
          <div class="q-mb-sm">{{ $t('upload_from_file') }}</div>

          <q-file
            :label="$t('select_or_drop_file')"
            accept="application/JSON"
            outlined
            @update:model-value="(new_val) => uploadProductFile(new_val)"
            v-model="products_file"
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
            :loading="insertingProduct"
            :disable="insertingProduct"
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
import {
  catchRequest,
  postRequest,
  getAll,
  insertManyRequest
} from 'src/api/API'
import { ArticleToSelect, Product } from 'src/types/AppTypes'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'CreateProductDialog',
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
    const product_schema: Product = {
      name: '',
      contain_articles: []
    }
    const product_body = ref(product_schema)
    const insertingProduct = ref(false)
    const loading_articles = ref(false)
    const articles = ref([])
    const products_file = ref(null)

    const loadArticles = async () => {
      loading_articles.value = true
      const res = await catchRequest(getAll, { entity: 'article' })
      articles.value = res.data.results.map((article: ArticleToSelect) => {
        article.selected = false
        article.required_amount = 0
        return article
      })
      loading_articles.value = false
    }

    const resetDialog = async () => {
      product_body.value = { ...product_schema }
      products_file.value = null
      await loadArticles()
    }

    const getSelectedArticles = () => {
      const selected_articles: ArticleToSelect[] = articles.value.filter(
        (article: ArticleToSelect) =>
          article.selected && article.required_amount
      )

      if (!selected_articles.length) {
        $q.notify({
          message: t('product_must_have_articles'),
          color: 'negative'
        })
      }

      return selected_articles
    }

    const insertProduct = async () => {
      const selected_articles = getSelectedArticles()
      if (!selected_articles.length) return

      product_body.value.contain_articles = selected_articles.map(
        (article: ArticleToSelect) => {
          return { amount_of: article.required_amount!, art_id: article._id }
        }
      )

      insertingProduct.value = true

      const success = await catchRequest(postRequest, {
        entity: 'product',
        body: product_body.value
      })

      if (success) {
        $q.notify({
          message: t('success_create', { item: 'product' }),
          color: 'positive'
        })

        emit('success')
      }

      insertingProduct.value = false
    }

    const uploadProductFile = (received_file: File) => {
      const reader = new FileReader()

      reader.onload = async (event) => {
        insertingProduct.value = true
        const file_data = event.target!.result as string
        const parsed_data = JSON.parse(file_data)

        if (!parsed_data.products) {
          insertingProduct.value = false
          products_file.value = null
          return $q.notify({
            message: t('missing_property_in_file', { prop: 'products' }),
            color: 'negative'
          })
        }

        const success = await catchRequest(insertManyRequest, {
          entity: 'product',
          items: parsed_data.products
        })

        if (success) {
          $q.notify({
            message: t('file_upload_success', { items: 'products' }),
            color: 'positive'
          })

          emit('success')
        } else {
          products_file.value = null
        }

        insertingProduct.value = false
      }

      reader.readAsText(received_file)
    }

    return {
      is_open,
      product_body,
      loading_articles,
      insertProduct,
      insertingProduct,
      resetDialog,
      articles,
      products_file,
      uploadProductFile
    }
  }
})
</script>

<style lang="scss">
.create-product {
  @media (min-width: $breakpoint-xs-max) {
    width: 700px;
    max-width: 700px !important;
  }

  &__form {
    width: 90%;
    margin: 0 auto;
  }

  .article-picker {
    &__list {
      margin-top: 5px;
      background-color: $grey-3;
      height: 250px;
      border-radius: 10px;

      .article-item {
        border-radius: 50px;
        background-color: $grey-2;
        display: grid;
        grid-template-columns: 1fr 40% auto;
        align-items: center;
        padding: 18px 0 18px 20px;
        margin: 25px;
        box-shadow: 2px 3px 7px $subtle-shadow;

        &__name {
          padding: 8px 16px;
        }

        &__stock {
          label {
            width: 100px;
          }
        }

        &__actions {
          padding-right: 10px;
        }
      }
    }
  }

  @media (max-width: $breakpoint-xs-max) {
    .article-picker {
      &__list {
        height: 35vh;

        .article-item {
          border-radius: 8px;
          padding: 20px 5px 20px 6px;
          grid-template-columns: 1fr 50% auto;
          margin: 15px;
          font-size: 12px;

          &__name {
            padding: 8px 0px 8px 6px;
          }

          &__stock {
            label {
              width: 70px;
            }
          }

          &__actions {
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>
