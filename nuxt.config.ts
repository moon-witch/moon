// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    site: {
        url: "https://www.moonwitch.art",
        name: "Moonwitch Web Development",
        description: "I am Joshua, your personal web developer. I create your customized website, designs and logos.",
    },
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            script: [
                {
                    src: "https://plausible.io/js/script.js",
                    defer: true,
                    "data-domain": "moonwitch.art",
                },
            ],
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            title: "moonwitch",
            link: [
                { rel: "icon", type: "image/png", href: "/logos/moon.png" }
            ],
            meta: [
                {
                    name: 'google-site-verification',
                    content: 'w2oCmZUgAphMSbJo_A4zg9uHY8KLE-yUNG8VNIxRq_M'
                },
            ],
        },
    },
    modules: ["@nuxt/eslint", '@vueuse/nuxt', [
        '@nuxtjs/i18n',
        {
            locales: [
                {
                    code: 'en',
                    name: "English",
                    file: 'en.json'
                },
                {
                    code: 'el',
                    name: 'Ελληνικά',
                    file: 'el.json'
                },
                {
                    code: 'es',
                    name: "Español",
                    file: 'es.json'
                },
                {
                    code: 'de',
                    name: "Deutsch",
                    file: 'de.json'
                }
            ],
            lazy: false,
            langDir: 'lang',
            defaultLocale: 'en',
            strategy: 'prefix',
            detectBrowserLanguage: false,
            vueI18n: "./i18n.config.ts",
        }
    ], ["nuxt-mail", {
        message: {
            to: process.env.MAIL
        },
        smtp: {
            host: 'smtp.strato.de',
            port: 465,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        }
    }], "@nuxtjs/turnstile", "@nuxtjs/seo"],
    turnstile: {
        siteKey: '0x4AAAAAAAbgZ0R7KdrBQE4C',
        addValidateEndpoint: true
    },
    routeRules: {
        "/": {redirect: "/en"},
    },
    runtimeConfig: {
        public: {
            directusUrl: process.env.DIRECTUS_URL,
        },
        turnstile: {
            secretKey: process.env.TURNSTILE_KEY
        }
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "~/assets/main.scss";'
                }
            }
        }
    }
})