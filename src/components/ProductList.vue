<template>
  <div class="product-list">
    <div class="product-list__title">
      <h5 class="q-my-none q-ml-md text-dark">{{ $tc('product', 2) }}</h5>
      <div>
        <q-btn
          v-if="user"
          @click="create_product_dialog.is_open = true"
          icon="add"
          push
          round
          class="q-mr-md"
        />
        <q-btn
          push
          round
          icon="fa fa-rotate"
          v-if="fetched_list"
          @click="fetchProducts()"
        />
      </div>
    </div>

    <div class="product-list__list q-mt-md scrollify">
      <div class="product-list__list--message" v-if="fetching_list">
        <q-spinner-bars color="grey-7" size="60px" />
      </div>

      <div class="product-list__list--message" v-else-if="!fetched_list">
        <q-btn
          @click="fetchProducts()"
          :label="$t('fetch_items', { items: 'products' })"
          push
          rounded
          size="lg"
        />
      </div>

      <div
        class="product-list__list--message"
        v-else-if="fetched_list && !products.length"
      >
        {{ $t('no_items', { items: 'products' }) }}
      </div>

      <div v-else class="product-list__list--items">
        <div
          v-for="product of products"
          :key="product._id"
          class="product-item"
        >
          <div class="product-item__name">
            {{ product.name }}
          </div>

          <div class="product-item__actions" v-if="user">
            <q-btn
              dense
              :label="$t('delete.title')"
              padding="0 10px"
              push
              color="negative"
              class="q-mr-sm"
              @click="deleteProduct(product._id)"
            />
            <q-btn
              dense
              color="accent"
              text-color="dark"
              :label="$t('sell')"
              padding="0 10px"
              push
              @click="performProductSale(product._id)"
            />
          </div>

          <div class="product-item__articles">
            <q-expansion-item
              dense
              header-class="expansion-item"
              :label="
                $t('articles_required') + ': ' + product.contain_articles.length
              "
            >
              <div
                v-for="(required_article, i) of product.contain_articles"
                :key="required_article.art_id ? required_article.art_id._id : i"
                class="articles-detail-container"
              >
                <div class="articles-detail" v-if="required_article.art_id">
                  <div class="articles-detail__name">
                    {{ required_article.art_id.name }}
                  </div>
                  <div class="articles-detail__amount">
                    {{ $t('required_amount') }}:
                    {{ required_article.art_id.stock }}
                  </div>
                  <div class="articles-detail__stock">
                    {{ $t('stock') }}:
                    {{ required_article.amount_of }}
                  </div>
                </div>

                <div v-else class="articles-detail">
                  {{ $t('deleted_article') }}
                </div>
              </div>
            </q-expansion-item>
          </div>
        </div>
      </div>
    </div>

    <CreateProductDialog
      :is_dialog_open="create_product_dialog.is_open"
      @close-dialog="create_product_dialog.is_open = false"
      @success="handleProductInsert()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getAll, deleteOne, sellProduct, catchRequest } from 'src/api/API'
import CreateProductDialog from 'src/components/CreateProductDialog.vue'
import { user } from 'src/api/store'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'ProductList',
  props: {},
  components: { CreateProductDialog },
  setup() {
    const $q = useQuasar()
    const fetching_list = ref(false)
    const fetched_list = ref(false)
    const products = ref([])
    const create_product_dialog = ref({ is_open: false })

    const fetchProducts = async () => {
      fetching_list.value = true
      const res = await catchRequest(getAll, {
        entity: 'product',
        populate: 'contain_articles.art_id'
      })
      products.value = res.data.results
      fetching_list.value = false
      fetched_list.value = true
    }

    const deleteProduct = async (product_id: string) => {
      const success = await catchRequest(deleteOne, {
        entity: 'product',
        _id: product_id
      })

      if (success) {
        $q.notify({
          message: t('delete.success', { item: 'product' }),
          color: 'positive'
        })

        await fetchProducts()
      }
    }

    const performProductSale = async (product_id: string) => {
      const success = await catchRequest(sellProduct, product_id)
      if (success) {
        $q.notify({
          message: t('success_sold'),
          color: 'positive'
        })
        await fetchProducts()
      }
    }

    const handleProductInsert = async () => {
      await fetchProducts()
      create_product_dialog.value.is_open = false
    }

    return {
      products,
      fetched_list,
      fetching_list,
      fetchProducts,
      user,
      deleteProduct,
      performProductSale,
      create_product_dialog,
      handleProductInsert
    }
  }
})
</script>

<style lang="scss">
.product-list {
  & > div {
    border-radius: 50px;
    background-color: $grey-3;
    padding: 10px;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__list {
    height: 80vh;
    color: #333;

    &--message {
      color: $grey-7;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.product-item {
  border-radius: 50px;
  background-color: $grey-4;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  grid-template-rows: 15px 1fr;
  align-items: center;
  padding: 18px 0 18px 20px;
  margin: 25px;
  box-shadow: 2px 3px 7px $subtle-shadow;

  &__name {
    grid-column: 1 / 3;
    padding: 8px 16px;
  }

  &__articles {
    grid-column: 1 / -1;
    padding-right: 30px;
    margin-top: 20px;

    .expansion-item {
      border-radius: 30px;
      margin-bottom: 10px;
    }

    .articles-detail-container {
      margin-top: 15px;

      &:first-child {
        margin-top: 0px;
      }

      .articles-detail {
        border-radius: 30px;
        background-color: $grey-2;
        display: grid;
        grid-template-columns: 40% 30% 30%;
        padding: 5px 10px 5px 20px;
        box-shadow: 2px 3px 7px $subtle-shadow;

        &__amount,
        &__stock {
          border-left: 2px solid $grey-5;
          padding-left: 8px;
        }
      }
    }
  }

  &__actions {
    display: flex;
  }
}
</style>
