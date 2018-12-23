module.exports = {
    
    scripts : [
        '/dist/fst/bundle.js', 
        'mdtex', 
        'mathjaxConf',
        'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js'
    ],

    sheets : [
        'main', 
        'fonts',
        '/media/fa/fontawesome-all.css'
    ],

    statique : [
        '../media', 
        '../lib', 
        '../dist', 
        '../style'
    ]

};

