<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <div id="footer">
    <div class="links">
      <div class="container">
        <NuxtLink to="/en/legal/imprint" class="legal-link third" tabindex="0">{{ $t("footer.imprint") }}</NuxtLink>
        <a
            class="link-logo"
            href="https://github.com/moon-witch"
            target="_blank"
            rel="noopener"
            tabindex="0"
        >
          <img id="github" src="/icons/github-mark-white.png" alt="github" />
        </a>
        <div class="legal-name third">moonwitch © 2023-{{ currentYear }}</div>
        <a
            class="link-logo"
            href="https://de.linkedin.com/in/joshua-langenbach-873a19252/en"
            target="_blank"
            rel="noopener"
            tabindex="0"
        >
          <img id="linkedin" src="/icons/In-White-26.png" alt="linkedin" />
        </a>
        <NuxtLink to="/en/legal/disclaimer" class="legal-link third" tabindex="0">{{ $t("footer.disclaimer") }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#footer {
  color: $secondary;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  width: 100vw;
  margin-top: 3rem;
  padding-bottom: .5rem;
  font-size: .7rem;

  @media (min-width: 740px) {
    font-size: $font-size;
  }

  .legal-link {
    margin: 0 1rem;
    color: $secondary;
    text-decoration: none;

    @media (min-width: 710px) {
      margin: 0 4rem;
    }

    &:hover {
      cursor: pointer;
    }

    &:visited {
      color: $secondary;
    }
  }

  .links {
    display: flex;
    justify-content: center;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .5rem;

  @media (min-width: 740px) {
    padding: 0 2rem 0 2rem;
    gap: 2rem;
  }

  .legal-name {
    width: fit-content;
    white-space: nowrap;
  }
}

#github {
  width: 1.5rem;
  filter: brightness(0) saturate(100%) invert(48%) sepia(0%) saturate(8%) hue-rotate(152deg) brightness(98%) contrast(81%);
}

#linkedin {
  width: 1.5rem;
  filter: brightness(0) saturate(100%) invert(48%) sepia(0%) saturate(8%) hue-rotate(152deg) brightness(98%) contrast(81%);
}

.link-text {
  display: none;

  @media (min-width: 740px) {
    display: block;
  }
}

.link-logo {
  :hover {
    filter: invert(76%) sepia(6%) saturate(2569%) hue-rotate(319deg) brightness(101%) contrast(101%) !important;
  }
}
</style>
