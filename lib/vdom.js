/* 
 * L'ARBRE DOM VIRTUEL
 */

function live (name,{model, view, update}) {
    var model = model,
        node = view(model)().node();
    node.addEventListener(name, msg => refresh(msg));
    
    function refresh (msg) {
        model = update(msg.detail, model);
        newNode = view(model)(1).node()
        newNode.addEventListener(name, refresh);
        node.replaceWith(newNode);
        node = newNode;
    }
}
    
function dom (tag, attr, branch) {

    var {tag, attr, branch} = parse(tag, attr, branch);
    
    var self = {
        tag :       tag,
        branch :    branch,
        stem :      null,
        node :      null,
        doc :       document,
        fragment :  null,
        html :      '',
        plant :     null,
        svg:        tag == 'svg'
    };
    var attributes = attr, 
        events = {};

    function my (append = 1) {
        /** create **/
        my.nodeCreate();
        forEachKey(attributes)(
            key => my.nodeSet(key, my.attr(key))
        );
        forEachKey(events)(
            key => my.on(key).forEach(
                list => my.node().addEventListener(key, ...list)
            )
        );
        my.node().innerHTML = my.html();
        /** append **/
        var parentNode = self.stem 
                ? self.stem.node()
                : self.doc.createDocumentFragment();
        parentNode.appendChild(self.node);
        /** branch **/
        my.branch()
            .map(b => b.link(my))
            .forEach(b => b());
        /** plant **/
        var target = self.plant
            ? self.doc.querySelector(self.plant)
            : self.doc.body;
        if (!self.stem) {
            if (append) 
                target.appendChild(parentNode);
            else
                my.fragment(parentNode);
        }
        return my;
    }
    
    my.link = (stem) => my
        .stem(stem)
        .svg(stem.svg())
        .doc(stem.doc());

    my.attr = obj => {
        if (typeof obj == 'string')
            return attributes[obj];
        Object.assign(attributes, obj);
        return my;
    }

    my.on = (evt, listener, capture=false) => {
        if (!listener)
            return events[evt];
        if (events[evt])
            events[evt].push([listener, capture]);
        else
            events[evt] = [[listener, capture]];
        return my;
    }
    
    my.show = () => console.log(self);

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
        /** empty {} attr is boring **/
        if (Array.isArray(attr))
            [attr, branch] = [{}, attr];
        /** match "tagname#id.class.class2" **/
        var re = /^(\w)+|(#[\w\-]*)|(\.[\w\-]*)/g,
            classes = [],
            tagname = 'div',
            matches = tag.match(re);
        /** push to attributes **/
        matches.forEach(m => {
            if (m[0] === '#')
                Object.assign(attr, {id: m.slice(1,)});
            else if (m[0] === '.')
                classes.push(m.slice(1,));
            else
                tagname = m.length ? m : 'div';
        });
        if (classes.length) 
            Object.assign(attr, {class: classes.join(' ')});
        /** create text nodes if any **/
        branch = branch.map(
            b => typeof b === 'string'
                ? dom('text').html(b)
                : b
        );
        /** out! **/
        return {tag: tagname, attr, branch};
    }

    return getset(my,self);

}

dom.emit = function (name, data) {
    return evt => {
        if (typeof data === 'function')
            data = data(evt.target);
        var msg = new CustomEvent(name, {bubbles:true, detail:data});
        evt.target.dispatchEvent(msg);
    }
}

/****** GETSET ******/
function getset (obj, attrs) {
    
    Object.keys(attrs).forEach(
        key => obj[key] = function (val) {
            if (!arguments.length) return attrs[key];
            attrs[key] = val;
            return obj;
        }
    );
    return obj;
}
