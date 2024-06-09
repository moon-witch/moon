<script setup lang="ts">
import {useBurger} from "~/composables/useBurger";

const route = useRoute()

const burgerState = useBurger()
provide('burger', burgerState)

const closeMenu = () => {
  burgerState.closeMenu()
}

const menuOpenWidth = computed(() => {
  if (burgerState.menuOpen.value) {
    return '60dvw'
  } else {
    closeMenu()
    return '0'
  }
})

const menuOpenHeight = computed(() => {
  if (burgerState.menuOpen.value) {
    return '60dvh'
  } else {
    closeMenu()
    return '0'
  }
})

const menuHorizontalPos = computed(() => {
  if (burgerState.menuOpen.value) {
    return '20%'
  } else {
    closeMenu()
    return '0'
  }
})

const open = computed(() => {
  return burgerState.menuOpen.value
})
</script>

<template>
  <main class="container">
    <nav class="top-line-mobile">
      <Logo class="moonwitch-logo" @click="closeMenu"/>
      <MobileNav class="burger"/>
      <MobileMenu class="burger-menu"/>
      <div v-if="open" @click="closeMenu" class="overlay"></div>
    </nav>
    <nav class="top-line-desktop">
      <ArtButton v-if="!route.fullPath.split('/').includes('art')" class="art-button"/>
      <BlogButton class="blog-button" />
      <Logo class="moonwitch-logo" />
      <LangSwitcher class="lang-switcher"/>
    </nav>
    <div class="content">
      <slot />
      <Footer />
    </div>
    <Sol />
  </main>
</template>

<style scoped lang="scss">
.top-line-mobile {
  height: 6.5rem;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 19;
  }

  .moonwitch-logo {
    position: absolute;
    left: 44%;
    transform: translateX(-50%);
  }

  .burger {
    position: absolute;
    right: .5rem;
    top: 1.5rem;
    z-index: 20;
  }

  .burger-menu {
    height: v-bind(menuOpenHeight);
    width: v-bind(menuOpenWidth);
    position: absolute;
    top: 50%;
    right: v-bind(menuHorizontalPos);
    transform: translateY(-50%);
    z-index: 20;
    transition: all .2s ease-in-out;
  }

  @media (min-width: 1024px) {
    display: none;
  }
}

.top-line-desktop {
  width: 100dvw;
  height: 6.5rem;

  @media (max-width: 1023px) {
    display: none;
  }

  .art-button {
    position: absolute;
    top: 1rem;
    left: 3.5rem;
  }

  .blog-button {
    position: absolute;
    top: 3.25rem;
    left: 2rem;
  }

  ::v-deep(.art-button) {
    color: $secondary;

    &:hover {
      color: $alt;
    }
  }

  .moonwitch-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .lang-switcher {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}

.content {
  height: calc(100dvh - 6.5rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  position: relative;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
  border-radius: $radius;

  @media (max-width: 1023px) {
    width: 1px;
  }
}

/* Track */
::-webkit-scrollbar-track {
  background: $primary;
  border-radius: $radius;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: $alt;
  border-radius: $radius;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $active;
}
</style>