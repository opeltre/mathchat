

var circle = (x,y) => dom(
    'circle',
    {cx:""+x, cy:""+y, r:"10", fill:"#000"}
).on('click');

var svg = centers => 
    dom(
        'svg#svg',
        {width: "100", height:"100"},
        centers.map(([x,y]) => circle(x,y))
    )
    .on('click', dom.emit('msg'))
    .plant('#win');

var c1 = [[20,20],[50,50],[80,80]],
    c2 = [[20,80],[50,50],[80,20]],
    svg1 = svg(c1),
    svg2 = svg(c2);

var model = 0;
var view = m => svg([c1,c2][m]);
var update = (msg, m) => {console.log(m); return (m+1)%2;}

var app = () => live('msg', {model, view, update});

document.addEventListener('DOMContentLoaded', app);

