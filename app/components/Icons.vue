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
    type: "DevOps"
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
    image: 'icons/tools/aws.svg',
    alt: "Icon that represents Amazon Web Services",
    invert: false,
    type: "DevOps"
  },
  {
    link: 'https://kit.svelte.dev/',
    title: 'SvelteKit',
    image: 'icons/tools/svelte.svg',
    alt: "Icon that represents the SvelteKit framework",
    invert: false,
    type: "Frontend"
  },
  {
    link: 'https://nodejs.org/',
    title: 'Node.js',
    image: 'icons/tools/nodejs.svg',
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
    type: "DevOps"
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
  },
  {
    link: 'https://openai.com',
    title: 'OpenAI',
    image: 'icons/tools/openai.png',
    alt: "Icon that represents the OpenAI LLM provider",
    invert: true,
    type: "AI"
  },
  {
    link: 'https://www.anthropic.com',
    title: 'Anthropic',
    image: 'icons/tools/anthropic.png',
    alt: "Icon that represents the Anthropic LLM provider",
    invert: false,
    type: "AI"
  },
  {
    link: 'https://aws.amazon.com/bedrock/',
    title: 'AWS Bedrock',
    image: 'icons/tools/bedrock.png',
    alt: "Icon that represents the AWS Bedrock LLM Agent provider",
    invert: false,
    type: "AI"
  },
  {
    link: 'https://www.hetzner.com',
    title: 'Hetzner',
    image: 'icons/tools/hetzner.jpeg',
    alt: "Icon that represents the Hetzner VPS provider",
    invert: false,
    type: "DevOps"
  },
]

const {t} = useI18n()

const frontendText = computed(() => t('icons.frontend', "Frontend"))
const backendText = computed(() => t('icons.backend', "Backend"))
const devOpsText = computed(() => t('icons.devops', "DevOps"))
const aiText = computed(() => t('icons.ai', "AI"))
const languagesText = computed(() => t('icons.languages', "Languages"))
</script>

<template>
  <div class="icons desktop">
    <section>
      <h4>{{ languagesText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Language'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ frontendText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Frontend'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ backendText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Backend'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ devOpsText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'DevOps'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ aiText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'AI'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
  </div>
  <div class="icons mobile">
    <section>
      <h4>{{ frontendText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Frontend'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ backendText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Backend'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ devOpsText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'DevOps'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ languagesText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'Language'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
    <section>
      <h4>{{ aiText }}</h4>
      <a v-for="(icon, index) in icons" :key="index" :href="icon.link" target="_blank" tabindex="0" :title="icon.title">
        <img v-if="icon.type === 'AI'" :src="icon.image" :alt="icon.alt" :class="{ 'invert':  icon.invert }"/>
      </a>
    </section>
  </div>
</template>

<style scoped lang="scss">
.icons {

  @media (min-width: 700px) {
    &.mobile {
      display: none;
    }
  }

  @media (max-width: 700px) {
    &.desktop {
      display: none
    }
  }

  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;

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
      height: 48px;
      margin: .5rem;

      @media (min-width: 1024px) {
        margin: .3rem .75rem;
      }

      &.invert {
        filter: invert(0.8);
      }
    }
  }
}
</style>