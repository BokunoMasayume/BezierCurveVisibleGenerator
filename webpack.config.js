const path = require('path');

module.exports = {
    mode:"development",
    entry: './src/main.js',

    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname , './build')
    },


    module:{
        rules:[
            {
                test: /\.js$/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:["@babel/preset-env"]
                    }
                },
                exclude:/node_modules/
            }
        ]
    },
};