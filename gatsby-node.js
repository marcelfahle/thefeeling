const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    graphql(`
      {
        work: allDatoCmsPagePortfolio {
          edges {
            node {
              slug
            }
          }
        }
        archive: allDatoCmsPageArchive {
          edges {
            node {
              slug
            }
          }
        }
      }
    `).then((result) => {
      result &&
        result.data &&
        result.data.work &&
        result.data.work.edges.map(({ node: news }) => {
          createPage({
            path: `oeuvre/${news.slug}`,
            component: path.resolve(`./src/pages/single-work.js`),
            context: {
              slug: news.slug,
            },
          })
        })
      result.data &&
        result.data.archive &&
        result.data.archive.edges.map(({ node: news }) => {
          createPage({
            path: `ye-olden-stuffe/${news.slug}`,
            component: path.resolve(`./src/pages/single-work.js`),
            context: {
              slug: news.slug,
              archive: true,
            },
          })
        })
      resolve()
    })
  })
}
