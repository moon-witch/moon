<script setup lang="ts">
const icons = [
  {
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    title: 'HTML',
    image: 'icons/tools/html.png',
    alt: "Icon that represents HTML5",
    invert: false
  },
  {
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    title: 'CSS',
    image: 'icons/tools/css.png',
    alt: "Icon that represents CSS",
    invert: false
  },
  {
    link: 'https://sass-lang.com',
    title: 'Sass',
    image: 'icons/tools/sass.png',
    alt: "Icon that represents Sass, the CSS preprocessor",
    invert: false
  },
  {
    link: "https://developer.mozilla.org/en-US/docs/Web/javascript",
    title: 'JavaScript',
    image: "/icons/tools/js.png",
    alt: "Icon that represents the JavaScript programming language.",
    invert: false
  },
  {
   link: "https://www.typescriptlang.org",
    title: 'TypeScript',
    image: "/icons/tools/ts.png",
    alt: "Icon that represents the TypeScript programming language.",
    invert: false
  },
  {
    link: "https://vuejs.org",
    title: 'VueJs',
    image: "/icons/tools/vue.png",
    alt: "Icon that represents the Vue JavaScript framework.",
    invert: false
  },
  {
    link: "https://nuxt.com",
    title: 'Nuxt',
    image: "/icons/tools/nuxt.png" ,
    alt: "Icon that represents the Nuxt JavaScript framework.",
    invert: false
  },
  {
    link: "https://expressjs.com",
    title: 'ExpressJs',
    image: "/icons/tools/express.png",
    alt: "Icon that represents the Express JavaScript framework.",
    invert: true
  },
  {
    link: "https://www.postgresql.org",
    title: 'PostgreSQL',
    image: "/icons/tools/postgres.png",
    alt: "Icon that represents the PostgreSQL relational database.",
    invert: true
  },
  {
    link: 'https://www.docker.com',
    title: 'Docker',
    image: 'icons/tools/docker.png',
    alt: "Icon that represents Docker, the containerization tool",
    invert: false
  },
  {
    link: 'https://redis.io',
    title: 'Redis',
    image: 'icons/tools/redis.png',
    alt: "Icon that represents Redis, the in-memory cache",
    invert: false
  }
]
</script>

<template>
  <div class="icons">
    <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
      <img :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
    </a>
  </div>
</template>

<style scoped lang="scss">
.icons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  img {
    width: 48px;
    margin: .3rem;

    @media (min-width: 1024px) {
      margin: .5rem .75rem;
    }

    &.invert {
      filter: invert(0.8);
    }
  }
}
</style>