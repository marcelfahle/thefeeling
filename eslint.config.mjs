import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Raw DatoCMS image URLs are kept on purpose for pixel parity with the old site.
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      'datocms/editor-plugin/**',
      'public/**',
      'node_modules/**',
      'src/lib/datocms/graphql-env.d.ts',
      'next-env.d.ts',
      'playwright-report/**',
      'test-results/**',
    ],
  },
]

export default config
