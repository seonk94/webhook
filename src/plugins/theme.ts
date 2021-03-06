import { App, inject, reactive, watch } from 'vue';

const ThemeSymbol = Symbol();
type ThemeType = 'light' | 'dark';
export const createTheme = () => {
  const state = reactive({
    theme: 'light' as ThemeType,
  });

  (function checkLocalStorage() {
    const storageTheme = localStorage.getItem('theme');
    if (storageTheme && (storageTheme === 'dark' || storageTheme === 'light')) {
      state.theme = storageTheme;
    }
  })();

  const action = {
    toggleTheme: () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
  };

  watch(
    () => state.theme,
    () => {
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    {
      immediate: true,
    }
  );
  return {
    themeState: state,
    themeAction: action,
  };
};

export function injectTheme() {
  const theme = inject(ThemeSymbol) as ReturnType<typeof createTheme>;

  if (!theme) throw new Error('Use Theme Error');

  return theme;
}

export default {
  install: (app: App) => {
    const theme = createTheme();
    app.provide(ThemeSymbol, theme);
    app.config.globalProperties.$theme = theme;
  },
};
