const THEME_STORAGE_KEY = 'theme';
const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

export function onThemeToggle(themeSwitcher) {
  const { isLightTheme, isDarkTheme } = getBoolean();

  if (isLightTheme) {
    localStorage.setItem(THEME_STORAGE_KEY, Theme.DARK);
  }

  if (isDarkTheme) {
    localStorage.setItem(THEME_STORAGE_KEY, Theme.LIGHT);
  }

  renderTheme();
}

export function renderTheme() {
  const { isLightTheme, isDarkTheme } = getBoolean();

  if (isDarkTheme) {
    document
      .querySelector('.theme-switch__toggle')
      .setAttribute('checked', true);
    changeBodyClass(Theme.DARK, Theme.LIGHT);
  }

  if (isLightTheme) {
    changeBodyClass(Theme.LIGHT, Theme.DARK);
  }
}

function changeBodyClass(add, remove) {
  document.body.classList.add(add);
  document.body.classList.remove(remove);
}

function getBoolean() {
  const storageTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const isLightTheme = storageTheme === Theme.LIGHT || !storageTheme;
  const isDarkTheme = storageTheme === Theme.DARK;
  return { isLightTheme, isDarkTheme };
}
