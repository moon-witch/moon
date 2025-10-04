<script setup lang="ts">
const burgerState: any = inject('burger')

const showContent = ref(false)
const show = computed(() => {
      if (burgerState.menuOpen.value) {
        setTimeout(() => {
          showContent.value = true
        }, 150)
      } else {
        showContent.value = false
      }
      return burgerState.menuOpen.value
    }
)

const closeMenu = () => {
  burgerState.closeMenu()
}

const horizontalLength = computed(() => {
  if (burgerState.menuOpen.value) {
    return '-60px'
  } else {
    return '0'
  }
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="show" class="menu-container extended-border-button">
      <ul class="nav-list">
        <li class="link-buttons">
          <!-- <BlogButton @click="closeMenu"/> !-->
        </li>
        <li v-if="showContent" class="languages">
          <LangSwitcher/>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.menu-container {
  background: $secondary;
  font-size: 1rem;

  .nav-list {
    height: 80%;
    width: 72%;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    z-index: 21;

    .link-buttons {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
  }
}

.extended-border-button {
  position: relative;
  display: inline-block;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.extended-border-button::before,
.extended-border-button::after {
  content: '';
  position: absolute;
  border: 1px solid hsla(0, 100%, 94%, 0.4);
}

.extended-border-button::before {
  top: 0;
  left: v-bind(horizontalLength);
  right: v-bind(horizontalLength);
  bottom: 0;
  border-right: transparent;
  border-left: transparent;
}

.extended-border-button::after {
  top: -60px;
  left: 0;
  right: 0;
  bottom: -60px;
  border-top: transparent;
  border-bottom: transparent;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>