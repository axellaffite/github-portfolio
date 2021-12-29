const path = require('path');

module.exports = {
    entry: './src/index.ts',
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
};