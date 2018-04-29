const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

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
      }
    `).then(result => {
      result.data.work.edges.map(({ node: news }) => {
        createPage({
          path: `oeuvre/${news.slug}`,
          component: path.resolve(`./src/pages/single-work.js`),
          context: {
            slug: news.slug,
          },
        })
      })
      resolve()
    })
  })
}
