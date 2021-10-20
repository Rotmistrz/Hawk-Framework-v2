module.exports = {
    entry: './src/js/master.js',
    output: {
        path: __dirname + '/dist/js',
        filename: 'master.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}