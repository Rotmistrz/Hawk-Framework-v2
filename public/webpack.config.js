module.exports = {
    entry: {
        //'Hawk-v2': __dirname + '/src/js/Hawk-v2.js',
        master: __dirname + '/src/js/master.js'
    },
    output: {
        path: __dirname + '/dist/js',
        filename: '[name]-20260101.js'
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