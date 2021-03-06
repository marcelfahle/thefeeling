require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
	siteMetadata: {
		title: 'THE FEELING',
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		'gatsby-transformer-remark',
		'gatsby-plugin-styled-components',
		'gatsby-plugin-layout',
		{
			resolve: 'gatsby-source-datocms',
			options: {
				apiToken: process.env.DATO_API,
				preview: false,
				disableLiveReload: false,
			},
		},
	],
}
