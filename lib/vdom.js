/* 
 * L'ARBRE DOM VIRTUEL
 */

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
        properties: {},
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
        forEachKey(self.properties)(
            key => my.node()[key] = self.properties[key]
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
    
    my.show = (str) => {
        console.log(str);
        console.log(self);
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

/*** emit ***/
dom.emit = function (tag, data) {
    var [name, app] = tag.split('#');
    return evt => {
        console.log('emit '+tag);
        if (typeof data === 'function')
            data = data(evt.target);
        var msg = new CustomEvent(
            app || 'dom',
            {detail : {data, name}, bubbles:true}
        );
       return (document).dispatchEvent(msg);
    }
}

/*** app ***/
dom.app = function (name) {

    var self = {
        model : {},
        view : () => dom('#dom'),
        node : null
    };

    var name = name || 'dom',
        listeners = {};

    function my () {
        my.node(my.render(1));
        return my;
    }

    my.refresh = (msg) => {
        my.model(my.update(msg));
        my.paint(my.render(0));
    };

    my.update = (msg) =>
        listeners[msg.detail.name](my.model(), msg.detail.data);
    
    my.render = bool => {
        var vdom = self.view(self.model)(bool)
        if (bool)
            vdom.doc().addEventListener(name, my.refresh);
        return vdom.node();
    }
    
    my.paint = node => {
        my.node().replaceWith(node);
        return my.node(node);
    }

    my.on = function (evt, listener) {
        console.log(arguments);
        if (!listener)
            return listeners[evt];
        listeners[evt] = listener;
        return my;
    };

    return getset(my,self);
}
    
/****** GETSET ******/
function forEachKey (obj) {
    return f => Object.keys(obj).forEach(f);
}

function getset (obj, attrs) {
    
    Object.keys(attrs).forEach(
        key => obj[key] = method(key, attrs[key])
    );

    function method (key, val0) {
        // if (val0 === null || !(typeof val0 === 'object')) 
            return getsetter1(key);
        //else 
          //  return getsetter2(key);
    }

    function getsetter1(key) {
        return function (val) {
            if (!arguments.length) {
                return attrs[key];
            }
            attrs[key] = val;
            return obj;
        }
    }

    function getsetter2(key) {
        return function (k, v) {
            if (typeof k === 'string' && v === undefined)
                return attrs[key][k] 
            else if (typeof key == 'string')
                attrs[key][k] = v;
            else if (typeof k === 'object')
                Object.assign(attrs[key], v)
            return obj;
        }
    }

    return obj;
}
