function bmp2svg () {

    let self = {
        width : null,
        height : null,
        pixSize : null,
        dest : null
    }

    function my (bmp) {
        let {width, height} = my.size(bmp);
        return svg = dom('svg', {width, height}, my.bitmap(bmp));
    }

    my.bitmap = bmp => 
        bmp
            .map((line, y) => line
                .map((rgba, x) => my.pixel({x,y}, rgba))
            )
            .reduce((a,b) => a.concat(b), []);

    my.pixel = ({x,y}, [r,g,b,a]) => 
        dom('rect', {
            x :             self.pixSize * x, 
            y :             self.pixSize * y,
            width :         self.pixSize,
            height :        self.pixSize,
            fill:           my.color(r,g,b),
            'fill-opacity': my.alpha(a) 
        });

    my.color = (r,g,b) => 
        '#' + [r,g,b].map(my.hex).join('');

    my.hex = n => 
        [Math.floor(n / 16), n % 16]
            .map(my.hexDigit)
            .join('');

    my.hexDigit = i => 
        ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'][i];

    my.alpha = a => a / 255;

    my.size = bmp => {
        let Nh = bmp.length,
            Nw = bmp[0].length;
        if (self.width || self.height) {
            if (self.width)
                self.height = self.width * Nh / Nw;
            if (self.height) 
                self.width = self.height * Nw / Nh;
            self.pixSize = self.width / Nw;
        }
        else if (self.pixSize) {
            self.width = self.pixSize * Nw;
            self.height = self.pixSize * Nh;
        }
        return {width : self.width, height: self.height};
    }

    return getset(my, self);

}

