<script setup lang="ts">
</script>

<template>
  <div class="logo">
    <LocLink to="/" class="link">
      <h1>moonwitch</h1>
      <h3>Joshua Langenbach</h3>
      <h2>Software Developer</h2>
    </LocLink>
  </div>
</template>

<style scoped lang="scss">
.logo {
  z-index: 10;
}

.link {
  color: $secondary;
  font-family: 'Cinzel', serif;
  -webkit-tap-highlight-color: transparent;

  h1 {
    font-size: 30px;
    margin: 0 0 5px 20px;
    padding: 0;

    @media (min-width: 1024px) {
      font-size: 40px;
    }
  }

  h2 {
    font-size: 17px;
    margin: 0 0 0 20px;
    padding: 0;

    @media (min-width: 1024px) {
      font-size: 25px;
    }
  }

  h3 {
    font-size: 15px;
    margin: 0 0 0 20px;
    padding: 0;

    @media (min-width: 1024px) {
      font-size: 20px;
    }
  }

  &:hover {
    filter: invert(50%);
  }

  .moonwitch {
    width: 15rem;
  }
}
</style>