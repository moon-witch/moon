<script setup lang="ts">
import {useBurger} from "~/composables/useBurger";
import LangSwitcher from "~/components/buttons/LangSwitcher.vue";
import GeometryAnimation from "~/components/animations/GeometryAnimation.vue";

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
    return '30dvh'
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
      <div clasS="visuals">
        <Logo class="moonwitch-logo" @click="closeMenu"/>
        <MobileNav class="burger"/>
      </div>
      <MobileMenu class="burger-menu"/>
      <div v-if="open" @click="closeMenu" class="overlay"></div>
    </nav>
    <nav class="top-line-desktop">
      <Logo class="moonwitch-logo" />
      <LangSwitcher class="lang-switcher"/>
      <Transition name="fade" appear>
        <div class="geo-bg">
          <GeometryAnimation :speed="0.1"/>
        </div>
      </Transition>
    </nav>
    <div class="content">
      <slot />
      <Footer />
    </div>
  </main>
</template>

<style scoped lang="scss">
.geo-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvw;
  z-index: 1;
  overflow: hidden;
  filter: blur(10px);
  opacity: 0.2;
}

.top-line-mobile {
  height: 100px;
  width: 100dvw;

  @media (min-width: 1024px) {
    height: 170px;
  }

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
    margin-top: .5rem;
  }

  .burger {
    position: absolute;
    right: .5rem;
    top: -3px;
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
  display: flex;
  justify-content: space-between;
  width: 100dvw;
  height: 8.5rem;

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
    padding: 1rem;
  }

  .lang-switcher {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}

.content {
  height: calc(100dvh - 8.5rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  position: relative;

  @media (max-width: 1023px) {
    height: calc(100dvh - 170px);
  }
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

.fade-enter-active,
.fade-appear-active {
  transition: opacity 3s ease;
}

.fade-enter-from,
.fade-appear-from {
  opacity: 0;
}

.fade-enter-to,
.fade-appear-to {
  opacity: 0.2;
}
</style>