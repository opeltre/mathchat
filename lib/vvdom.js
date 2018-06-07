/* 
 * L'ARBRE DOM VIRTUEL
 *
dom('body')
    .branch([
        dom('h1').html('Le dom virtuel'),
        dom('p').html("C'est trop cool")
    ])
    (document);
*/

function dom (tag, attr, branch) {

    var {tag, attr, branch} = parse(tag, attr, branch);
    
    var self = {
        tag :       tag,
        branches :  branch,
        stem :      null,
        node :      null,
        doc :       document,
        plant :     null,
        attributes : attr,
        events :    {},
        html :      '',
        svg:        tag == 'svg'
    }

    function my (wait) {
        /** create **/
        my.nodeCreate();
        forEachKey(self.attributes)(
            key => my.nodeSet(key, my.attr(key))
        );
        forEachKey(self.events)(
            key => my.on(key).forEach(
                l => self.node.addEventListener(key, l)
            )
        );
        self.node.innerHTML = my.html();
        /** append **/
        var parentNode = self.stem 
                ? self.stem.node()
                : self.doc.createDocumentFragment();
        parentNode.appendChild(self.node);
        /** branch **/
        my.branch()
            .map(b => b.stem(my))
            .forEach(b => b());
        /** plant **/
        if (!self.stem && !wait) 
            (self.plant || self.doc.body)
                .appendChild(parentNode);
    }

    my.branch = (...branches) => {
        if (!branches.length)
            return self.branches;
        self.branches = branches;
        return my;
    }

    my.stem = stem => {
        if (!stem) 
            return self.stem;
        self.stem = stem;
        return my
            .svg(stem.svg())
            .doc(stem.doc());
    }

    my.svg = bool => {
        if (bool === undefined)
            return self.svg;
        self.svg = bool;
        return my;
    }

    my.attr = obj => {
        if (typeof obj == 'string')
            return self.attributes[obj];
        Object.assign(self.attributes, obj);
        return my;
    }

    my.on = (evt, listener) => {
        if (!listener)
            return self.events[evt];
        if (self.events[evt])
            self.events[evt].push(listener);
        else
            self.events[evt] = [listener];
        return my;
    }

    my.html = str => {
        if (!str) 
            return self.html;
        self.html = str;
        return my;
    }

    my.doc = doc => {
        if (!doc) 
            return self.doc;
        self.doc = doc;
        return my;
    }

    my.node = (node) => {
        if (!node)
            return self.node;
        self.node = node;
        return my;
    }
    
    my.show = () => console.log(self);

    my.plant = (selector) => {
        self.plant = document.querySelector(selector);
        return my;
    }

    my.nodeCreate = () => my.node(
        my.svg()
            ? createSvg(my.doc(), tag)
            : my.doc().createElement(tag)
    );

    my.nodeSet = (key, val) => {
        my.svg()
            ? setSvg(key, val, my.node())
            : my.node().setAttribute(key,val);
        return my;
    }

    function createSvg (doc, tag) {
        var svgNS = "http://www.w3.org/2000/svg"
        var node = doc.createElementNS(svgNS, tag)
        if (tag == 'svg')
            node.setAttributeNS(
                "http://www.w3.org/2000/xmlns/", 
                "xmlns:xlink", 
                "http://www.w3.org/1999/xlink"
            );
        return node;
    }

    function setSvg (key, val, node) {
        node.setAttributeNS(null, key, val);
    }

    function forEachKey (obj) {
        return f => Object.keys(obj).forEach(f);
    }

    function parse (tag, attr={}, branch=[]) {
        /** match "tagname#id.class.class2" **/
        var re = /^(\w)*|(#[\w\-]*)|(\.[\w\-]*)/g,
            classes = [],
            tagname = 'div',
            matches = tag.match(re);
        /** push to attributes **/
        matches.forEach(m => {
            if (m[0] === '#')
                Object.assign(attr, {id: m.slice(1,)})
            else if (m[0] === '.')
                classes.push(m.slice(1,))
            else
                tagname = m
        });
        Object.assign(attr, {class: classes.join(' ')});
        /** create text nodes if any **/
        branch = branch.map(
            b => typeof b === 'string'
                ? dom('text').html(b)
                : b
        );
        /** and out **/
        return {tag: tagname, attr, branch};
    }

    return my;

}

var circle = (x,y) => dom(
    'circle',
    {cx:""+x, cy:""+y, r:"10", fill:"#000"}
);

var svg = centers => dom(
    'svg#svg',
    {width: "100", height:"100"},
    centers.map(([x,y]) => circle(x,y))
)
    .plant('#win');

var c1 = [[20,20],[50,50],[80,80]],
    c2 = [[20,80],[50,50],[80,20]],
    svg1 = svg(c1),
    svg2 = svg(c2);

document.addEventListener('DOMContentLoaded', svg1);

