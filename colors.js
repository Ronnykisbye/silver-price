// =========================================================
// AFSNIT 01 – FARVER & TEMA (kun tema her)
// =========================================================

export const THEMES = {
  dark: {
    '--bg': '#050611',
    '--fg': '#EAF0FF',
    '--panel': 'rgba(10,12,26,.76)',
    '--stroke': 'rgba(120,140,190,.20)',

    '--accent-1': '#00F0FF',
    '--accent-2': '#7A5CFF',

    '--btn-bg': 'rgba(16,20,40,.62)',
    '--btn-fg': '#EAF0FF',

    '--logo-bg': 'rgba(0,240,255,.12)',
    '--logo-fg': '#EAF0FF',

    '--link': '#7FEFFF'
  },

  light: {
    '--bg': '#F6F8FF',
    '--fg': '#0B1022',
    '--panel': 'rgba(255,255,255,.84)',
    '--stroke': 'rgba(30,50,90,.16)',

    '--accent-1': '#00C7D4',
    '--accent-2': '#6B4CFF',

    '--btn-bg': 'rgba(255,255,255,.90)',
    '--btn-fg': '#0B1022',

    '--logo-bg': 'rgba(0,199,212,.12)',
    '--logo-fg': '#0B1022',

    '--link': '#0B61FF'
  }
};

// =========================================================
// AFSNIT 02 – TEMA STORAGE
// =========================================================
const KEY = 'silver_theme_v1';

export function getStoredTheme(){
  const v = localStorage.getItem(KEY);
  return (v === 'light' || v === 'dark') ? v : 'dark';
}

export function storeTheme(theme){
  localStorage.setItem(KEY, theme);
}

// =========================================================
// AFSNIT 03 – APPLY THEME
// =========================================================
export function applyTheme(theme){
  const t = THEMES[theme] || THEMES.dark;
  for (const [k, v] of Object.entries(t)) {
    document.documentElement.style.setProperty(k, v);
  }
  document.documentElement.dataset.theme = theme;
}
