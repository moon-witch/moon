<script setup lang="ts">
definePageMeta({
  title: 'Imprint'
})
</script>

<template>
  <div class="imprint-container">
    <h1 class="header">imprint</h1>
    <div class="legal">
      <p>This website is owned by</p>
      <p>Joshua Langenbach</p>
      <p class="inquiry">For any inquiries about the content of the website, please contact me directly through my
        <LocLink to="/contact" class="link">contact form</LocLink>.
      </p>
    </div>
    <div class="inspiration">
      <h2>Credits</h2>
      <p>Geometry background animation inspired by <a href="https://codepen.io/atzedent/pen/GRwVpKz" target="_blank">Matthias Hurrle</a></p>
      <p>Circle button animations inspired by <a href="https://codepen.io/filipz" target="_blank">Filip Zrnzevic</a></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.imprint-container {
  height: calc(100dvh - 14.5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  color: $secondary;
  flex-direction: column;
  gap: 6rem;

  .header {
    font-size: 30px;
    font-weight: bold;

    @media (min-width: 1024px) {
      font-size: 35px;
    }
  }

  .legal {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;

    > p:nth-of-type(2){
      font-weight: 600;
    }

    @media (min-width: 1024px) {
      font-size: 20px;
    }

    .inquiry {
      text-align: center;
      margin-top: 2rem;
      padding: 1rem;

      .link {
        color: $alt;

        &:hover {
          color: $active;
        }
      }
    }
  }
}

.inspiration {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  a {
    color: $alt;
  }
}
</style>