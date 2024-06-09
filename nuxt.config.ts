// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    app: {
        pageTransition: { name: 'page', mode: 'out-in' }
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
    }], "@nuxtjs/turnstile"],
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