const bundle = require('bundle-js');

let output = bundle({
    entry : './src/js//hawk/HawkBundle.js',
    dest: './src/js//Hawk-v2.js',
    print: false
});

// let anotherOutput = bundle({
//     entry : './src/index.js',
//     dest: 'E:/john-weston/herocms/herocms/www/herocms4/public/herocms/js/hawk.js',
//     print: false
// });

console.log("Compilation successful!");