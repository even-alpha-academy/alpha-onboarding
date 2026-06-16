// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// NOTE: `site` and `base` are set for GitHub Pages project-site hosting.
// Adjust `base` to '/' if served from a custom domain / org root.
export default defineConfig({
  site: 'https://even-alpha-academy.github.io',
  base: '/alpha-onboarding',
  integrations: [
    // Diagrams: ```mermaid blocks → SVG, client-side. Brand-tuned dark theme. MUST be before starlight.
    mermaid({
      theme: 'dark',
      mermaidConfig: {
        // htmlLabels:false → SVG <text> labels (measured direction-agnostically), so the
        // RTL page doesn't clip them. Use \n for line breaks instead of <br/>.
        htmlLabels: false,
        flowchart: { htmlLabels: false, curve: 'basis', useMaxWidth: true },
        themeVariables: {
          primaryColor: '#15273f',          // node fill (dark navy)
          primaryBorderColor: '#56B8FF',    // node border (brand sky-blue)
          primaryTextColor: '#e8eef5',      // node text
          lineColor: '#56B8FF',             // edges
          secondaryColor: '#1c2433',
          tertiaryColor: '#101620',
          fontFamily: 'inherit',
          clusterBkg: '#0e1726',            // subgraph background
          clusterBorder: '#2c4a6b',
        },
      },
    }),
    starlight({
      title: 'חפיפת צוות אלפא',
      // Brand logo (white wolf emblem) + favicon (white wolf on navy).
      logo: { src: './src/assets/alpha-logo.svg', alt: 'אלפא' },
      favicon: '/favicon.png',
      // Brand accent (sky-blue, from alpha-mobile) + code blocks LTR on the RTL page.
      customCss: ['./src/styles/brand.css', './src/styles/rtl-code.css', './src/styles/mermaid.css'],
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
            { label: 'תרגיל סיכום — מבחן מדרגה 1', link: '/foundations/gate1/' },
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
