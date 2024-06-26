<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue'
import type {LocaleObject} from "@nuxtjs/i18n";

const {locales, t} = useI18n();
const supportedLocales = locales.value as Array<LocaleObject>;

const router = useRouter();
const switchLocalePath = useSwitchLocalePath();

const menuOpen = ref(false);

const closeMenu = () => {
  menuOpen.value = false
}

function onLocaleChanged(code: string) {
  closeMenu()
  router.push({path: switchLocalePath(code)});
}

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
  const delay = Array.from(htmlEl.parentNode!.children).indexOf(htmlEl) * 100;
  setTimeout(() => {
    htmlEl.style.transition = 'opacity 0.5s, transform 0.5s';
    htmlEl.style.opacity = '0';
    htmlEl.style.transform = 'translateY(-20px)';
    done();
  }, delay);
};

const afterLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.opacity = '';
  htmlEl.style.transform = '';
  htmlEl.style.transition = '';
};

const langSwitchText = computed(() => t('base.langSwitch', 'Change Language'));
</script>

<template>
  <div class="menu-container">
    <ClientOnly>
      <DropdownMenuRoot v-model:open="menuOpen">
        <DropdownMenuTrigger
            class="menu-button"
            aria-label="Customise options"
        >
          {{ langSwitchText }}
        </DropdownMenuTrigger>

        <DropdownMenuPortal disabled>
          <DropdownMenuContent
              class="menu-options"
              :side-offset="5"
              style="z-index: 11"
          >
            <TransitionGroup
                name="stagger"
                tag="div"
                v-if="menuOpen"
                class="menu-options"
                role="menu"
                @before-enter="beforeEnter"
                @enter="enter"
                @leave="leave"
                @after-leave="afterLeave"
                appear
            >
              <DropdownMenuItem
                  v-for="(option, index) in supportedLocales"
                  :key="index"
                  :value="option.name"
                  class="menu-option"
                  @click="onLocaleChanged(option.code)"
              >
                <span>
                  <span v-if="option.code === 'en'">🇬🇧</span>
                  <span v-if="option.code === 'de'">🇩🇪</span>
                  <span v-if="option.code === 'el'">🇬🇷</span>
                  <span v-if="option.code === 'es'">🇪🇸</span>
                </span>
                <span class="desktop-text">{{ option.name }}</span>
              </DropdownMenuItem>
            </TransitionGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  position: relative;
  width: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.1s ease;
  color: $secondary;
  border: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-family: 'Uni Neue', sans-serif;
  font-size: $font-size;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 1023px) {
    color: $primary;
    margin-bottom: 1rem;
    font-size: .9rem;

    &:hover {
      color: $primary;
    }
  }

  @media (min-width: 1024px) {
    &.open {
      color: $active;
    }

    &:hover {
      color: $active;
    }

    &:active {
      width: 9.9rem;
      height: 1.9rem;
      font-size: $font-size;
    }
  }

  .toggle {
    display: block;
  }
}

.menu-options {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: $primary;
  border-radius: $radius;
  box-shadow: 0 0 2px 1px $active;

  @media (max-width: 1023px) {
    flex-direction: row;
    background: $secondary;
    box-shadow: none;
  }

  .menu-option {
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(-20px);
    text-align: center;
    color: $secondary;
    font-family: 'Uni Neue', sans-serif;
    font-size: 18px;
    display: flex;
    gap: .25rem;

    .desktop-text {
      @media (max-width: 1023px) {
        display: none;
      }
    }

    &:hover {
      color: $active;
    }
  }
}

.stagger-enter-active,
.stagger-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.stagger-enter-from,
.stagger-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>