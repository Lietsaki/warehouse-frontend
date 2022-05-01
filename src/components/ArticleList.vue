<template>
  <div class="article-list">
    <div class="article-list__title">
      <h5 class="q-my-none q-ml-md text-dark">{{ $tc('article', 2) }}</h5>
      <div>
        <q-btn
          v-if="user"
          @click="create_article_dialog.is_open = true"
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
          @click="fetchArticles()"
        />
      </div>
    </div>

    <div class="article-list__list q-mt-md scrollify">
      <div class="article-list__list--message" v-if="fetching_list">
        <q-spinner-bars color="grey-7" size="60px" />
      </div>

      <div class="article-list__list--message" v-else-if="!fetched_list">
        <q-btn
          @click="fetchArticles()"
          :label="$t('fetch_items', { items: 'articles' })"
          push
          rounded
          size="lg"
        />
      </div>

      <div
        class="article-list__list--message"
        v-else-if="fetched_list && !articles.length"
      >
        {{ $t('no_items', { items: 'articles' }) }}
      </div>

      <div v-else class="article-list__list--items">
        <div
          v-for="article of articles"
          :key="article._id"
          class="article-item"
        >
          <div class="article-item__name">
            {{ article.name }}
          </div>

          <div class="article-item__stock">
            {{ $t('stock') }}: {{ article.stock }}
          </div>

          <div v-if="user" class="article-item__actions">
            <q-btn
              dense
              :label="$t('delete.title')"
              padding="0 10px"
              push
              color="negative"
              class="q-mr-sm"
              @click="deleteArticle(article._id)"
            />
          </div>
        </div>
      </div>
    </div>

    <CreateArticleDialog
      :is_dialog_open="create_article_dialog.is_open"
      @close-dialog="create_article_dialog.is_open = false"
      @success="handleArticleInsert()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getAll, deleteOne, catchRequest } from 'src/api/API'
import { user } from 'src/api/store'
import CreateArticleDialog from 'src/components/CreateArticleDialog.vue'
import { useQuasar } from 'quasar'
import t from 'src/api/i18n'

export default defineComponent({
  name: 'ArticleList',
  props: {},
  components: { CreateArticleDialog },
  setup() {
    const $q = useQuasar()
    const fetching_list = ref(false)
    const fetched_list = ref(false)
    const articles = ref([])
    const create_article_dialog = ref({ is_open: false })

    const fetchArticles = async () => {
      fetching_list.value = true
      const res = await catchRequest(getAll, { entity: 'article' })
      articles.value = res.data.results
      fetching_list.value = false
      fetched_list.value = true
    }

    const deleteArticle = async (art_id: string) => {
      const success = await catchRequest(deleteOne, {
        entity: 'article',
        _id: art_id
      })

      if (success) {
        $q.notify({
          message: t('delete.success', { item: 'article' }),
          color: 'positive'
        })

        await fetchArticles()
      }
    }

    const handleArticleInsert = async () => {
      await fetchArticles()
      create_article_dialog.value.is_open = false
    }

    return {
      articles,
      fetched_list,
      fetching_list,
      fetchArticles,
      deleteArticle,
      user,
      create_article_dialog,
      handleArticleInsert
    }
  }
})
</script>

<style lang="scss">
.article-list {
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

  @media (max-width: $breakpoint-xs-max) {
    &__list {
      height: 36vh;
    }
  }
}

.article-item {
  border-radius: 50px;
  background-color: $grey-4;
  display: grid;
  grid-template-columns: 1fr 20% auto;
  grid-template-rows: 15px 1fr;
  align-items: center;
  padding: 18px 0 18px 20px;
  margin: 25px;
  box-shadow: 2px 3px 7px $subtle-shadow;

  &__name {
    padding: 8px 16px;
  }

  &__actions {
    padding-right: 10px;
  }

  @media (max-width: $breakpoint-xs-max) {
    padding: 20px 20px 20px 0px;
    border-radius: 10px;
    margin: 20px;
    grid-template-columns: 1fr auto auto;
    column-gap: 15px;

    button span {
      font-size: 10px;
    }
  }
}
</style>
