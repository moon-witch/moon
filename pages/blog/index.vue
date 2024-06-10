<script setup lang="ts">
import {onMounted} from "vue";
import {useBlog} from "~/composables/useBlog";
import { formatDate } from "~/helpers/formatters";
import type { Post } from '~/types/post.type'
import { getImageUrl } from "~/helpers/imageurl";

const blogState = useBlog()
const runtime = useRuntimeConfig()

const selectedCategory = ref("")
const searchTerm = ref("");

const posts = computed(() => {
  return blogState.blogPosts.value as Post[]
})

const filteredPosts = computed(() => {
  if (!posts.value) return []
  return posts.value.filter(post => {
    const matchCategory = selectedCategory.value ? post.category === selectedCategory.value : true;
    const matchTitle = post.translations[0].title.toLowerCase().includes(searchTerm.value.toLowerCase());
    return matchCategory && matchTitle;
  });
});

const categories = computed(() => {
  if (!posts.value) return []
  const uniqueCategories = new Set(posts.value.map(post => post.category));
  return Array.from(uniqueCategories);
});

const beforeEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.opacity = '0';
  htmlEl.style.transform = 'translateY(-20px)';
};

const enter = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
  const delay = Array.from(htmlEl.parentNode!.children).indexOf(htmlEl) * 100;
  setTimeout(() => {
    htmlEl.style.transition = 'opacity 0.5s, transform 0.5s';
    htmlEl.style.opacity = '1';
    htmlEl.style.transform = 'translateY(0)';
    done();
  }, delay);
};

const leave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;
    htmlEl.style.transition = 'opacity 0.5s, transform 0.5s';
    htmlEl.style.opacity = '0';
    htmlEl.style.transform = 'translateY(-20px)';
    done();
};

const afterLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.opacity = '';
  htmlEl.style.transform = '';
  htmlEl.style.transition = '';
};

onMounted(() => {
  blogState.getPosts('en')
})
</script>

<template>
  <div class="bloglist">
    <ClientOnly>
      <div class="tools">
        <input type="text" v-model="searchTerm" placeholder="Search" class="searchbar"/>
        <CategoryFilter :categories="categories" v-model="selectedCategory" class="filter"/>
      </div>

      <TransitionGroup
          name="stagger"
          tag="ul"
          class="menu-options"
          role="menu"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
          @after-leave="afterLeave"
          appear
      >
        <li v-for="post in filteredPosts" :key="post.id">
          <div class="title">{{ post.translations[0].title }}</div>
          <div class="date">Published: {{ formatDate(post.date_created) }}</div>
          <div v-if="formatDate(post.date_created) != formatDate(post.date_updated) && formatDate(post.date_updated) != '01.01.1970'" class="date">Last updated: {{ formatDate(post.date_updated) }}</div>
          <img
              :src="getImageUrl(runtime, post.image)"
              alt="Header image for the blog post"
              class="post-photo"
          />
          <div class="description">{{ post.translations[0].description }}</div>
          <div class="category">{{ post.category }}</div>
          <LocLink :to="`/blog/${post.id}/${post.translations[0].slug}`" class="link">Keep reading <span class="arrow">→</span></LocLink>
        </li>
      </TransitionGroup>
      <div v-if="filteredPosts.length == 0" class="nothing">No blog posts found.</div>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.bloglist {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  position: relative;

  .nothing {
    align-self: center;
    font-size: 1.5rem;
  }

  .tools {
    margin-top: .5rem;
    display: flex;
    justify-content: space-between;
    width: 85dvw;
    padding: 0 1rem;

    @media (min-width: 1024px) {
      margin-top: 2rem;
      justify-content: end;
    }

    .searchbar {
      border: none;
      border-radius: $radius;
      padding: .4rem;
      background: $secondary;

      @media (min-width: 1024px) {
        margin-right: 3rem;
      }
    }

    .filter {
      margin-right: 1.5rem;
    }
  }


  ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    padding: 1rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    li {
      border: 1px solid $alt;
      border-radius: $radius;
      padding: 1rem;
      position: relative;
      transition: box-shadow .2s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &:hover {
        box-shadow: 0 0 2px 1px $secondary;
      }

      .title {
        font-weight: 600;
        font-size: 1.25rem;
        letter-spacing: .125rem;
        color: $alt;
        text-align: center;
        margin-top: 2rem;
      }

      .date {
        font-size: 0.8rem;
        text-align: center;
      }

      .post-photo {
        width: 12rem;
        margin: 1rem;
        border-radius: $radius;
        box-shadow: 0 0 3px 1px $secondary;
      }

      .description {
        margin: .5rem .5rem 2rem .5rem;
        text-align: center;
      }

      .category {
        border: 1px solid $secondary;
        border-radius: $radius;
        width: fit-content;
        font-size: 1rem;
        padding: .25rem .5rem;
        position: absolute;
        top: -1rem;
        left: 50%;
        transform: translateX(-50%);
        background: $primary;
        box-shadow:  0 0 2px 1px $secondary;
        color: $alt;
      }

      .link {
        color: $secondary;
        position: absolute;
        right: 1.5rem;
        bottom: .5rem;
        transition: color .2s ease-in-out;

        &:hover {
          color: $alt;
        }

        .arrow {
          position: absolute;
          top: .05rem;
          right: -1rem;
        }
      }
    }
  }
}

.stagger-enter-active {
  transition: opacity 0.5s, transform 0.5s;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
</style>