const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(
		{
			...env,
			babel: { dangerouslyAddModulePathsToTranspile: ['moti', '@miblanchard/react-native-slider'] },
		},
		argv
	)

	config.resolve.alias['framer-motion'] = 'framer-motion/dist/framer-motion'

	return config
}
