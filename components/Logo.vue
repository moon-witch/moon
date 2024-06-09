<script setup lang="ts">
</script>

<template>
  <div class="logo">
    <LocLink to="/" class="link">
      <img src="/logos/sol.svg" alt="Logo of a sun, drawn with wavy lines." class="sol"/>
      <img src="/logos/moonwitch.svg" alt="Written name of the company, moonwitch, using soft curvy lines." class="moonwitch"/>
    </LocLink>
  </div>
</template>

<style scoped lang="scss">
.logo {
  z-index: 10;
}

.link {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s ease-in-out;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    filter: invert(50%);

    .sol {
      transform: rotate(3deg);
    }
  }

  .sol {
    width: 5rem;
    filter: invert(80%);
    transition: all .1s ease-in-out;
  }

  .moonwitch {
    width: 15rem;
  }
}
</style>