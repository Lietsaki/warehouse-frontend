<template>
  <div class="product-list">
    <div class="product-list__title">
      <h5 class="q-my-none q-ml-md">{{ $t('products') }}</h5>
      <q-btn
        push
        round
        icon="fa fa-rotate"
        v-if="fetched_list"
        @click="fetchProducts()"
      ></q-btn>
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

          <div class="product-item__articles">
            <q-expansion-item
              :label="
                $t('articles_required') + ': ' + product.contain_articles.length
              "
            >
              <q-card>
                <q-card-section>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Quidem, eius reprehenderit eos corrupti commodi magni quaerat
                  ex numquam, dolorum officiis modi facere maiores architecto
                  suscipit iste eveniet doloribus ullam aliquid.
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>

          <div class="product-item__actions">
            <q-btn
              dense
              :label="$t('sell')"
              padding="0 10px"
              push
              class="q-mr-sm"
            />
            <q-btn dense :label="$t('delete.title')" padding="0 10px" push />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getAll, catchRequest } from 'src/api/API'

export default defineComponent({
  name: 'ProductList',
  props: {},
  components: {},
  setup() {
    const fetching_list = ref(false)
    const fetched_list = ref(false)
    const products = ref([])

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

    return { products, fetched_list, fetching_list, fetchProducts }
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
  align-items: center;
  padding: 18px 0 18px 20px;
  margin: 25px;

  &__actions {
    display: flex;
  }
}
</style>
