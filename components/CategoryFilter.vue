<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue'
import type {ModelRef} from "vue";

defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const category: ModelRef<string | undefined> = defineModel()

const dropdownOpen = ref(false)

const setFilter = (selection: string) => {
  category.value = selection
}

const clearFilter = () => {
  category.value = ''
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
</script>

<template>
  <div>
    <ClientOnly>
      <div class="filters">
        <div class="clear-button" @click="clearFilter">{{ category != '' ? 'x' : '' }}</div>
        <DropdownMenuRoot v-model:open="dropdownOpen">
          <DropdownMenuTrigger class="filter-button" aria-label="Filter blog posts by category">
            {{ category != '' ? category : 'Filter' }}
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent class="content" style="z-index: 11">
              <TransitionGroup
                  name="stagger"
                  tag="div"
                  v-if="dropdownOpen"
                  class="filter-options"
                  role="menu"
                  @before-enter="beforeEnter"
                  @enter="enter"
                  @leave="leave"
                  @after-leave="afterLeave"
                  appear
              >
              <DropdownMenuItem @click="setFilter(category as string)" v-for="(category, index) in categories" :key="index" class="filter-option">
                {{ category }}
              </DropdownMenuItem>
              </TransitionGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.filters {
  display: flex;
  gap: .5rem;
  justify-content: start;

  @media (min-width: 1024px) {
    width: 7rem;
  }
}

.filter-button {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.1s ease;
  color: $secondary;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-family: 'Uni Neue', sans-serif;
  font-size: $font-size;
  -webkit-tap-highlight-color: transparent;
  border-radius: $radius;
  border: 1px solid $secondary;

  @media (min-width: 1024px) {
    &.open {
      color: $active;
    }

    &:hover {
      color: $active;
    }
  }

  .toggle {
    display: block;
  }
}

.clear-button {
  border: none;
  cursor: pointer;

  &:hover {
    color: $active;
  }
}

.content {
  background: $primary;
}

.filter-options {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: $primary;
  box-shadow: 0 0 2px 1px $active;
  border-radius: $radius;
  margin-top: .5rem;

  .filter-option {
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
    justify-content: center;
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