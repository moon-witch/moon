<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const path = ref(route.fullPath.split('/'))
const blogButtonText = computed(() => {
  return t('base.blogCTA', 'Check out my blog')
});

watch(() => route.fullPath, () => {
  path.value = route.fullPath.split('/')
})
</script>

<template>
  <div>
    <ClientOnly>
      <TransitionGroup
          name="fade"
          tag="div"
          appear
      >
        <LocLink
            v-if="route.fullPath.includes('blog') && path[path.length - 1] != 'blog'"
            to="/blog"
            class="back-button"
        >
          Back
        </LocLink>
        <LocLink
            v-else-if="!route.fullPath.includes('blog')"
            to="/blog"
            class="blog-button extended-border-button link"
        >
          {{ blogButtonText }}
          <span class="arrow">→</span>
        </LocLink>
      </TransitionGroup>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.back-button {
  color: $alt;

  &:hover {
    color: $active;
  }

  @media (max-width: 1023px) {
    display: none;
  }
}

.blog-button {
  background: transparent;
  position: relative;

  .link {
    color: $secondary;
    text-decoration: none;

    @media (max-width: 1023px) {
      color: $primary;
    }
  }

  &:hover {
    cursor: pointer;

    .arrow {
      right: 0%;
    }

    .link {
      color: $alt;
    }
  }

  .arrow {
    font-size: 1.7rem;
    position: absolute;
    top: 50%;
    right: 2%;
    transform: translateY(-50%);
    transition: right .1s ease;
  }
}

.extended-border-button {
  position: relative;
  display: inline-block;
  padding: .5rem 2rem .5rem .7rem;
  border: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
}

.extended-border-button::before,
.extended-border-button::after {
  content: '';
  position: absolute;
  border: 1px solid hsla(36, 49%, 90%, 0.4);

  @media (max-width: 1023px) {
    border: 1px solid hsla(24, 6%, 33%, 0.4);
  }
}

.extended-border-button::before {
  top: 0;
  left: -25px;
  right: -25px;
  bottom: 0;
  border-right: transparent;
  border-left: transparent;
}

.extended-border-button::after {
  top: -10px;
  left: -15px;
  right: -15px;
  bottom: -10px;
  border-top: transparent;
  border-bottom: transparent;
}

.fade-enter-active {
  transition: opacity 0.5s
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>