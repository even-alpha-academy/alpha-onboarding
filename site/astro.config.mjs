// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// NOTE: `site` and `base` are set for GitHub Pages project-site hosting.
// Adjust `base` to '/' if served from a custom domain / org root.
export default defineConfig({
  site: 'https://even-alpha-academy.github.io',
  base: '/alpha-onboarding',
  integrations: [
    starlight({
      title: 'חפיפת צוות אלפא',
      // Force code blocks LTR on the RTL page (Hebrew comments stay RTL within the line).
      customCss: ['./src/styles/rtl-code.css'],
      // Single-language site rooted in Hebrew → built-in Hebrew UI strings + full RTL.
      defaultLocale: 'root',
      locales: {
        root: { label: 'עברית', lang: 'he', dir: 'rtl' },
      },
      social: [],
      sidebar: [
        { label: 'ברוכים הבאים', link: '/welcome/' },
        { label: 'לוח זמנים', link: '/schedule/' },
        { label: 'הקמת סביבה', link: '/setup/' },
        {
          label: 'עבודה עם AI',
          items: [
            { label: 'עקרונות', link: '/working-with-ai/principles/' },
            { label: 'כלים חינמיים', link: '/working-with-ai/free-tools/' },
            { label: 'Claude Code', link: '/working-with-ai/claude-code/' },
          ],
        },
        {
          label: 'יסודות',
          items: [
            { label: 'Kotlin למפתחי TS', link: '/foundations/kotlin/' },
            { label: 'Coroutines ו-Flow', link: '/foundations/coroutines/' },
            { label: 'יסודות Android', link: '/foundations/android/' },
            { label: 'Compose למפתחי React', link: '/foundations/compose/' },
            { label: 'MVVM ו-Koin', link: '/foundations/mvvm-koin/' },
            { label: 'תרגיל סיכום — שער 1', link: '/foundations/gate1/' },
          ],
        },
        {
          label: 'פרויקט הגמר',
          items: [
            { label: 'סקירה', link: '/final-project/overview/' },
            { label: 'Backend עם agent', link: '/final-project/backend/' },
            { label: 'שלב 1 — התחברות', link: '/final-project/login/' },
            { label: 'שלב 2 — מפה', link: '/final-project/map-skyline/' },
            { label: 'שלב 3 — תיעוד והיסטוריה', link: '/final-project/logging-history/' },
            { label: 'הרחבות', link: '/final-project/extensions/' },
          ],
        },
        {
          label: 'אלפא',
          items: [
            { label: 'דומיין ו-GIS', link: '/alpha/domain-gis/' },
            { label: 'סיור ארכיטקטורה', link: '/alpha/architecture/' },
            { label: 'סודות ורשתות', link: '/alpha/secrets-networks/' },
            { label: 'משימה ראשונה', link: '/alpha/first-ticket/' },
          ],
        },
      ],
    }),
  ],
});
