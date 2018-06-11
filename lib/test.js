var sleep = ms => new Promise(
    (resolve, reject) => setTimeout(resolve, ms)
);

var rot = t => ({x,y}) => ({
    x: Math.cos(t) * x - Math.sin(t) * y,
    y: Math.cos(t) * y + Math.sin(t) * x
});

var add = v => ({x,y}) => ({
    x : x + v.x,
    y : y + v.y
});

var mul = r => ({x,y}) => ({
    x : r * x,
    y : r * y
});

var pipe = (...fs) => fs.length == 1
    ? fs[0]
    : (...xs) => pipe(...fs.slice(1,))(fs[0](...xs));
//    : (...xs) => fs.pop()(pipe(...fs)(...xs));

var circle = r => ({x,y}) => 
    dom(
        'circle',
        {cx:""+x, cy:""+y, r:""+r, fill:"#000"}
    )
    .svg(true)
    .plant('#svg');

var app = dom.app('circles')
    .model({x:1, y:1})
    .view(pipe(
        mul(20),
        add({x:50,y:50}), 
        circle(5)
    ))
    .on('tick', rot(2*Math.PI/60));

var tick = ms => sleep(ms)
    .then(dom.emit('tick#circles'))
    .then(() => tick(ms));

var svg = 
    dom(
        'svg#svg',
        {width:"100", height:"100"}
    )
    .plant('#win');

var main = () => {
    svg();
    app();
}

