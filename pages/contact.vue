<script setup lang="ts">
import {Label} from 'radix-vue'

definePageMeta({
  title: 'Contact Moonwitch'
})

const { t } = useI18n()
const mail = useMail()
const turnstile = ref()

const sending = ref(false)
const from = ref<string>()
const name = ref<string>()
const subject = ref<string>()
const text = ref<string>()
const mailMessage = computed(() => {
  return `From: ${from.value}\n\nName: ${name.value} \n\nSubject: ${subject.value} \n\nMessage: \n\n${text.value}`
})

const token = ref()
const errorMsg = ref<string>('')
const successMsg = ref<string>('')
const sendMail = async () => {
  const response: any = await $fetch('/_turnstile/validate', {
    method: 'POST',
    body: {
      token: token.value,
    },
  })

  if (response.success) {
    if (from.value && subject.value && text.value) {
      try {
        sending.value = true
        await mail.send({
          from: 'client',
          subject: 'Inquiry',
          text: mailMessage.value,
        });
        errorMsg.value = ''
        successMsg.value = t('contact.success');
      } catch (error) {
        console.error('Error sending email:', error);
        errorMsg.value = t('contact.error')
      } finally {
        sending.value = false
        turnstile.value.reset()
      }
    } else {
      errorMsg.value = t('contact.missingFields')
    }
  } else {
    errorMsg.value = t('contact.invalidToken')
  }
};
</script>

<template>
  <div class="contact-container">
    <ClientOnly>
      <h1>{{ $t('contact.title') }}</h1>
      <div class="info">
        <p>{{ $t('contact.info') }}</p>
        <p>{{ $t('contact.greet') }}</p>
      </div>
      <form @submit.prevent="">
        <div class="group">
          <div class="input">
            <Label for="name" class="label">{{ $t('contact.name') }}</Label>
            <input type="text" id="name" v-model="name" required aria-required="true"/>
          </div>
          <div class="input">
            <Label for="email" class="label">{{ $t('contact.email') }}</Label>
            <input type="email" id="email" v-model="from" required aria-required="true"/>
          </div>
        </div>
        <div class="input">
          <Label for="subject" class="label">{{ $t('contact.subject') }}</Label>
          <input type="text" id="subject" v-model="subject" required aria-required="true"/>
        </div>
        <div class="input">
          <Label for="message" class="label">{{ $t('contact.message') }}</Label>
          <textarea id="message" v-model="text" rows="6" required aria-required="true"></textarea>
        </div>
        <div class="warning-container">
          <p class="warning" v-if="!name || !subject || !from || !text">{{ $t('contact.missingFields') }}</p>
          <p class="warning"> {{ errorMsg }}</p>
          <p class="success"> {{ successMsg }}</p>
        </div>
        <button
            class="submit-button"
            @click="sendMail"
            :disabled="!name || !subject || !from || !text || !token"
        >
          <span class="loader" v-if="sending">
            <ParticleLoader />
          </span>
          <span v-else>{{ $t('contact.send') }}</span>
        </button>
      </form>

      <div class="privacy-info">
        <p>{{ $t('contact.privacy') }}</p>
      </div>

      <NuxtTurnstile ref="turnstile" v-model="token" :options="{ action: 'vue' }"/>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.contact-container {
  text-align: center;
  padding: 1rem;

  .info {
    border: 1px solid $alt;
    border-radius: $radius;
    padding: .5rem 1rem;
    margin-bottom: 4rem;
    margin-top: 2rem;

    @media (min-width: 1024px) {
      margin-right: 25rem;
      margin-left: 25rem;
    }

    p:first-child {
      margin-bottom: 1rem;
    }
  }

  .group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    @media (min-width: 1024px) {
      flex-direction: row;
      gap: 3rem;
      margin: 1rem 0;
    }
  }

  .input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: .75rem;

    .label {
      text-align: end;
      margin-bottom: .25rem;
    }

    input, textarea {
      width: 15rem;
      border-radius: $radius;
      border: none;
      padding: .5rem;
      background: $secondary;
    }

    @media (min-width: 1024px) {
      textarea {
        width: 34rem;
      }
    }
  }

  button {
    border: none;
    border-radius: $radius;
    padding: .5rem 1rem;
    margin-top: 2rem;
    font-size: $font-size;
    background: $alt;
    color: $primary;
    cursor: pointer;

    &:disabled {
      background: grey;
    }

    &:hover {
      background: $active;
    }
  }

  .warning-container {
    height: 2rem;

    .warning {
      color: red;
    }

    .success {
      color: green;
    }
  }

  .submit-button {
    margin-bottom: 2rem;
    min-width: 3.5rem;
    min-height: 3.5rem;
    position: relative;

    .loader {
      position: absolute;
      top: 50%;
      left: 49%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  .privacy-info {
    margin: 1rem 0;
    font-size: .8rem;
  }
}
</style>