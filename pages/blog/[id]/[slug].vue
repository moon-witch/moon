<script setup lang="ts">
import DOMPurify from "dompurify";
import {useBlog} from "~/composables/useBlog";
import { type Post } from "~/types/post.type";
import {formatDate} from "~/helpers/formatters";
import { getImageUrl } from "~/helpers/imageurl";

const blogState = useBlog()
const route = useRoute()
const runtime = useRuntimeConfig()

const post = ref()
const content = ref()
const getPost = async (id: string) => {
    const unsanitizedPost: Post | null = await blogState.getSinglePost(id, 'en')

    if (unsanitizedPost) {
      content.value = DOMPurify.sanitize(unsanitizedPost.translations[0].content)
      post.value = unsanitizedPost
    }
}

onMounted(() => {
  getPost(route.params.id[0])
})
</script>

<template>
  <div>
    <div v-if="content && post" class="post-container">
      <div class="post-title">{{ post.translations[0].title }}</div>
      <div class="post-date">Published: {{ formatDate(post.date_created) }}</div>
      <div v-if="formatDate(post.date_created) != formatDate(post.date_updated) && formatDate(post.date_updated) != '01.01.1970'" class="post-date">Last updated: {{ formatDate(post.date_updated) }}</div>
      <img
          :src="getImageUrl(runtime, post.image)"
          alt="Header image for the blog post"
          class="post-view-photo"
      />
      <div v-html="content" class="post-content"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 1024px) {
    padding: 0 20rem;
  }

  .post-title {
    font-weight: 600;
    font-size: 1.8rem;
    margin: 2rem 0;
  }

  .post-view-photo {
    margin: 3rem 0;
    width: 18rem;
    border-radius: $radius;
    border: 1px solid $secondary;
    box-shadow: 0 0 3px 1px $secondary;

    @media (min-width: 1024px) {
      width: 22rem;
    }
  }

  .post-content {
    text-align: center;
  }
}
</style>