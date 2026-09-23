import Link from 'next/link'
import { breadcrumbs, collectionPage, graph } from '@/lib/seo/jsonld'
import type { ProjectSeo } from '@/lib/seo/projects'
import CrawlerContent from './CrawlerContent'
import JsonLd from './JsonLd'

/** Structured data + crawler text for a collage page. */
export default function CollageSeo(props: { path: string; name: string; description: string; projects: ProjectSeo[] }) {
  const listed = props.projects.filter((p) => p.path || p.externalUrl)
  return (
    <>
      <JsonLd
        data={graph(
          collectionPage(props),
          breadcrumbs([
            { name: 'THE FEELING', path: '/' },
            { name: props.name, path: props.path },
          ])
        )}
      />
      <CrawlerContent>
        <h1>{props.name} — THE FEELING</h1>
        <p>{props.description}</p>
        <ul>
          {listed.map((p) => (
            <li key={p.slug}>
              {p.path ? <Link href={p.path}>{p.name}</Link> : <a href={p.externalUrl!}>{p.name}</a>}
              {p.subject ? ` — ${p.subject}` : ''}. {p.description}
            </li>
          ))}
        </ul>
      </CrawlerContent>
    </>
  )
}
