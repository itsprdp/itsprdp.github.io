/*!
 * Adapted from Bootstrap's color mode toggler
 * https://getbootstrap.com/docs/5.3/customize/color-modes/
 */
(() => {
  'use strict'

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const stored = getStoredTheme()
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    const resolved = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    document.documentElement.setAttribute('data-bs-theme', resolved)
  }

  const ICONS = { light: '#sun-fill', dark: '#moon-stars-fill', auto: '#circle-half' }

  const showActiveTheme = (theme, focus = false) => {
    const switcher = document.querySelector('#bd-theme')
    if (!switcher) return

    const activeIcon = switcher.querySelector('.theme-icon-active use')
    if (activeIcon) activeIcon.setAttribute('href', ICONS[theme] || ICONS.auto)

    document.querySelectorAll('[data-bs-theme-value]').forEach(el => {
      const active = el.dataset.bsThemeValue === theme
      el.classList.toggle('active', active)
      el.setAttribute('aria-pressed', active)
      el.querySelector('.bi.ms-auto').classList.toggle('d-none', !active)
    })

    if (focus) switcher.focus()
  }

  setTheme(getPreferredTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const stored = getStoredTheme()
    if (stored !== 'light' && stored !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getStoredTheme() || 'auto')

    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const theme = toggle.dataset.bsThemeValue
        if (theme === 'auto') {
          localStorage.removeItem('theme')
        } else {
          setStoredTheme(theme)
        }
        setTheme(theme)
        showActiveTheme(theme, true)
      })
    })
  })
})()
