<template>
  <q-page class="home">
    <ProductList />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProductList from 'src/components/ProductList.vue'

export default defineComponent({
  name: 'IndexPage',
  components: { ProductList },
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
}
</style>
