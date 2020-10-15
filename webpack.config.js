const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const devMode = process.env.NODE_ENV === 'development';

module.exports = (env) => {
    const isProduction = env === 'production';

    console.log('env', env);
    return {
        entry: ['./src/app.js'],
        output: {
            path: path.join(__dirname, 'public'),
            filename: 'bundle.js',
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /base\.css$/,
                    use: [
                        {loader: MiniCssExtractPlugin.loader},
                        'css-loader',
                        'postcss-loader',
                    ]
                },
                {
                    test: /\.css$/,
                    exclude: /base\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: devMode,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: {
                                    localIdentName: '[name]-[local]__[hash:base64:5]',
                                },
                            }
                        },
                        'postcss-loader',
                    ]
                },
            ]
        },
        devtool: isProduction ? 'source-map' : 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            historyApiFallback: true,
            port: 8080,
            proxy: {
                '/api/**': {
                    target: 'http://localhost:3000',
                },
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[hash].css',
                chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
            }),
            new HtmlWebpackPlugin({
                title: 'Panic Station',
                filename: 'index.html'
            }),
            new FaviconsWebpackPlugin('./src/favicon.svg'),
        ],
    };
};
