import { graphql, type ResultOf } from './graphql'

/** layouts/index.js:94-148 */
export const LayoutQuery = graphql(`
  query LayoutQuery {
    _site {
      faviconMetaTags {
        tag
        attributes
        content
      }
    }
  }
`)

export const BackgroundQuery = graphql(`
  query BackgroundQuery {
    background {
      id
      _editingUrl
      oeuvre {
        url
      }
      oeuvreDetail {
        url
      }
      archive {
        url
      }
      archiveDetail {
        url
      }
      about {
        url
      }
    }
  }
`)

/** Same selection on both models; kept as two literals so gql.tada can type them. */
export const PortfolioCollageItemFragment = graphql(`
  fragment PortfolioCollageItem on PagePortfolioRecord @_unmask {
    id
    _editingUrl
    _updatedAt
    _status
    title
    width
    xPosition
    speed
    slug
    yOffset
    baseFontSize
    baseFontSizeMobile
    imageOpacity
    previewImage {
      url
      format
    }
    previewText
    themeColor {
      red
      green
      blue
      alpha
    }
    textColor {
      red
      green
      blue
      alpha
    }
    subPages {
      id
      externalLink
    }
  }
`)

export const ArchiveCollageItemFragment = graphql(`
  fragment ArchiveCollageItem on PageArchiveRecord @_unmask {
    id
    _editingUrl
    _updatedAt
    _status
    title
    width
    xPosition
    speed
    slug
    yOffset
    baseFontSize
    baseFontSizeMobile
    imageOpacity
    previewImage {
      url
      format
    }
    previewText
    themeColor {
      red
      green
      blue
      alpha
    }
    textColor {
      red
      green
      blue
      alpha
    }
    subPages {
      id
      externalLink
    }
  }
`)

/** oeuvre.js:26-73 */
export const PortfolioCollageQuery = graphql(
  `
    query PortfolioCollageQuery {
      items: allPagePortfolios(orderBy: position_ASC, first: 500) {
        ...PortfolioCollageItem
      }
      background {
        oeuvre {
          url
        }
      }
    }
  `,
  [PortfolioCollageItemFragment]
)

/** ye-olden-stuffe.js:22-68 */
export const ArchiveCollageQuery = graphql(
  `
    query ArchiveCollageQuery {
      items: allPageArchives(orderBy: position_ASC, first: 500) {
        ...ArchiveCollageItem
      }
      background {
        archive {
          url
        }
      }
    }
  `,
  [ArchiveCollageItemFragment]
)

export const SubPageFragment = graphql(`
  fragment SubPage on ContentRecord @_unmask {
    id
    text
    externalLink
    baseFontSize
    baseFontSizeMobile
    opacity
    boldVideoId
    video {
      url
      provider
      providerUid
    }
    themeColor {
      red
      green
      blue
      alpha
    }
    textColor {
      red
      green
      blue
      alpha
    }
    image {
      url
      width
      height
    }
  }
`)

/** single-work.js:722-807 */
export const PortfolioWorkQuery = graphql(
  `
    query PortfolioWorkQuery($slug: String) {
      work: pagePortfolio(filter: { slug: { eq: $slug } }) {
        id
        _editingUrl
        title
        themeColor {
          red
          green
          blue
          alpha
        }
        textColor {
          red
          green
          blue
          alpha
        }
        subPages {
          ...SubPage
        }
      }
      background {
        detail: oeuvreDetail {
          url
        }
      }
    }
  `,
  [SubPageFragment]
)

export const ArchiveWorkQuery = graphql(
  `
    query ArchiveWorkQuery($slug: String) {
      work: pageArchive(filter: { slug: { eq: $slug } }) {
        id
        _editingUrl
        title
        themeColor {
          red
          green
          blue
          alpha
        }
        textColor {
          red
          green
          blue
          alpha
        }
        subPages {
          ...SubPage
        }
      }
      background {
        detail: archiveDetail {
          url
        }
      }
    }
  `,
  [SubPageFragment]
)

/** about.js:92-106 */
export const AboutQuery = graphql(`
  query AboutQuery {
    pageAbout {
      id
      _editingUrl
      content {
        ... on BlockRecord {
          id
          label
          body(markdown: true)
        }
      }
    }
    background {
      about {
        url
      }
    }
  }
`)

export const AllSlugsQuery = graphql(`
  query AllSlugsQuery {
    portfolio: allPagePortfolios(first: 500) {
      slug
    }
    archive: allPageArchives(first: 500) {
      slug
    }
  }
`)

/** Records with unpublished changes, for the preview toolbar (draft token only). */
export const UnpublishedQuery = graphql(`
  query UnpublishedQuery {
    portfolio: allPagePortfolios(first: 100, filter: { _status: { neq: published } }) {
      id
      title
      _status
      _editingUrl
    }
    archive: allPageArchives(first: 100, filter: { _status: { neq: published } }) {
      id
      title
      _status
      _editingUrl
    }
    pageAbout {
      id
      _status
      _editingUrl
    }
    background {
      id
      _status
      _editingUrl
    }
  }
`)

export type CollageItem = ResultOf<typeof PortfolioCollageItemFragment>
export type SubPage = ResultOf<typeof SubPageFragment>
export type WorkResult = ResultOf<typeof PortfolioWorkQuery>
export type AboutResult = ResultOf<typeof AboutQuery>
