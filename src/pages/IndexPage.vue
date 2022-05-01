<template>
  <q-page class="home">
    <ProductList />
    <ArticleList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProductList from 'src/components/ProductList.vue'
import ArticleList from 'src/components/ArticleList.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { ProductList, ArticleList },
  setup() {
    return {}
  }
})
</script>

<style lang="scss">
.home {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;

  @media (max-width: $breakpoint-xs-max) {
    grid-template-columns: 1fr;
  }
}
</style>
