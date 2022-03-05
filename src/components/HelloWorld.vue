<script  setup lang="ts" >
import { ref, watch } from 'vue';
import { useLocale } from '../composables';
import { LocalesData } from '../constants';
const { currentLocale, t, defineLocale } = useLocale();
defineProps<{ msg: string }>();

const count = ref(0);
const darkMode = ref(false);
const { isDarkTheme, setTheme } = useTheme();
/* const updateLanguage = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  try {
    locale.value = target.value;
  } catch (error) {
    console.error(error);
  }
}; */
/* console.log(88, currentLocale, t, defineLocale);
watch(darkMode, () => document.documentElement.setAttribute("theme", darkMode ? "dark" : 'light') ) */
</script>

<template>
  <h1>{{ msg }}</h1>

  click<input
    type="checkbox"
    class="theme-switch"
    :value="isDarkTheme"
    @change="$event => setTheme($event.target.checked)"
  />
  <button type="button" @click="count++">count is: {{ count }}</button>
  <button :key="`${locale}`" v-for="locale in LocalesData" @click="defineLocale(locale.value)">{{ locale.caption }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <p>{{ t('dark') }}</p>
  <p>{{ currentLocale }}</p>
</template>

<style lang="scss" scoped>
h1 {
  font-family: $font-title;
}
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

/* input.theme-switch {
  display: none;
} */

input.theme-switch + label {
  cursor: pointer;
}

input.theme-switch:not(:checked) + label:hover {
  cursor: pointer;
}

input.theme-switch + label:active,
input.theme-switch:checked + label {
  cursor: pointer;
}
</style>
