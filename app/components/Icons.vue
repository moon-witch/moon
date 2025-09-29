<script setup lang="ts">
const icons = [
  {
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    title: 'HTML',
    image: 'icons/tools/html.png',
    alt: "Icon that represents HTML5",
    invert: false,
    type: "Frontend"
  },
  {
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    title: 'CSS',
    image: 'icons/tools/css.png',
    alt: "Icon that represents CSS",
    invert: false,
    type: "Frontend"
  },
  {
    link: 'https://sass-lang.com',
    title: 'Sass',
    image: 'icons/tools/sass.png',
    alt: "Icon that represents Sass, the CSS preprocessor",
    invert: false,
    type: "Frontend"
  },
  {
    link: "https://developer.mozilla.org/en-US/docs/Web/javascript",
    title: 'JavaScript',
    image: "/icons/tools/js.png",
    alt: "Icon that represents the JavaScript programming language.",
    invert: false,
    type: "Language"
  },
  {
    link: "https://www.typescriptlang.org",
    title: 'TypeScript',
    image: "/icons/tools/ts.png",
    alt: "Icon that represents the TypeScript programming language.",
    invert: false,
    type: "Language"
  },
  {
    link: "https://vuejs.org",
    title: 'VueJs',
    image: "/icons/tools/vue.png",
    alt: "Icon that represents the Vue JavaScript framework.",
    invert: false,
    type: "Frontend"
  },
  {
    link: "https://nuxt.com",
    title: 'Nuxt',
    image: "/icons/tools/nuxt.png" ,
    alt: "Icon that represents the Nuxt JavaScript framework.",
    invert: false,
    type: "Frontend"
  },
  {
    link: "https://expressjs.com",
    title: 'ExpressJs',
    image: "/icons/tools/express.png",
    alt: "Icon that represents the Express JavaScript framework.",
    invert: true,
    type: "Backend"
  },
  {
    link: "https://www.postgresql.org",
    title: 'PostgreSQL',
    image: "/icons/tools/postgres.png",
    alt: "Icon that represents the PostgreSQL relational database.",
    invert: true,
    type: "Backend"
  },
  {
    link: 'https://www.docker.com',
    title: 'Docker',
    image: 'icons/tools/docker.png',
    alt: "Icon that represents Docker, the containerization tool",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://redis.io',
    title: 'Redis',
    image: 'icons/tools/redis.png',
    alt: "Icon that represents Redis, the in-memory cache",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://aws.amazon.com/',
    title: 'AWS',
    image: 'icons/tools/aws.png',
    alt: "Icon that represents Amazon Web Services",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://svelte.dev/',
    title: 'Svelte',
    image: 'icons/tools/svelte.png',
    alt: "Icon that represents the Svelte frontend framework",
    invert: false,
    type: "Frontend"
  },
  {
    link: 'https://kit.svelte.dev/',
    title: 'SvelteKit',
    image: 'icons/tools/sveltekit.png',
    alt: "Icon that represents the SvelteKit framework",
    invert: false,
    type: "Frontend"
  },
  {
    link: 'https://nodejs.org/',
    title: 'Node.js',
    image: 'icons/tools/nodejs.png',
    alt: "Icon that represents Node.js runtime",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://www.mongodb.com/',
    title: 'MongoDB',
    image: 'icons/tools/mongodb.png',
    alt: "Icon that represents MongoDB NoSQL database",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://www.nginx.com/',
    title: 'Nginx',
    image: 'icons/tools/nginx.png',
    alt: "Icon that represents the Nginx web server",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://www.jenkins.io/',
    title: 'Jenkins',
    image: 'icons/tools/jenkins.png',
    alt: "Icon that represents Jenkins CI/CD tool",
    invert: false,
    type: "Backend"
  },
  {
    link: 'https://git-scm.com/',
    title: 'Git',
    image: 'icons/tools/git.png',
    alt: "Icon that represents Git version control system",
    invert: false,
    type: "DevOps"
  },
  {
    link: 'https://www.terraform.io/',
    title: 'Terraform',
    image: 'icons/tools/terraform.png',
    alt: "Icon that represents Terraform infrastructure as code tool",
    invert: false,
    type: "DevOps"
  },
  {
    link: 'https://www.python.org/',
    title: 'Python',
    image: 'icons/tools/python.png',
    alt: "Icon that represents the Python programming language",
    invert: false,
    type: "Language"
  }
]
</script>

<template>
  <div class="icons">
    <section>
      <h4>Languages</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Language'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>Frontend</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Frontend'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>Backend</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Backend'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>DevOps</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'DevOps'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
  </div>
</template>

<style scoped lang="scss">
.icons {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;

  section {
    h4 {
      margin: 8px;
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    img {
      width: 48px;
      margin: .3rem;

      @media (min-width: 1024px) {
        margin: 0 .75rem;
      }

      &.invert {
        filter: invert(0.8);
      }
    }
  }
}
</style>