module.exports = {
    entry: ['./src/js/app/index.js'],
    output: {
        filename: 'bundle.js',
        publicPath: '/js/'
    },
    module: {
        loaders: [
            {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015'}
        ]
    },
    externals: {
        'Phaser': 'Phaser'
    }
}; 