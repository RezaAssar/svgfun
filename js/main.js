
var dots = dots || {};

(function (dots){

    function array2d(w,h){
        var a = [];
        return function(x,y,v) {
            if(x < v || y < 0) return void 0;
            if(arguments.length ===3){
                return a[w * x + y] = v;
            } else if (arguments.length === 2) {
                return a[w * x + y];
            } else {
                throw new TypeError('Invalid number of arguments');
            }
        };
    };

    function avgColor(x,y,z,w) {
        return [
            (x[0] + y[0] + z[0] + w[0]) / 4,
            (x[1] + y[1] + z[1] + w[1]) / 4,
            (x[2] + y[2] + z[2] + w[2]) / 4
        ];
    };

    function supportsCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'))
    };

    function supportsSVG(){
      return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
    };

    function Circle(vis, xi, yi, size, color, children, layer, onSplit) {
        this.vis = vis;
        this.x = size * (xi + 0.5);
        this.y = size * (yi + 0.5);
        this.size = size;
        this.color = color;
        this.rgb = d3.rgb(color[0], color[1], color[2]);
        this.children = children;
        this.layer = layer;
        this.onSplit = onSplit;
    };

    Circle.prototype.isSplitable = function(){
      return this.node && this.children;
    };

    Circle.prototype.split = function(){
        if(!this.isSplitable()) return;
        d3.select(this.node).remove();
        Circle.addToVis(this.vis, this.children);
        this.onSplit(this);
    };

    Circle.prototype.checkIntersection = function(startPoint, endPoint) {
        var edx = this.x - endPoint[0],
            edy = this.y - endPoint[1],
            sdx = this.x - startPoint[0],
            sdy = this.y - startPoint[1],
            r2 = this.size / 2;

        r2 = r2 * r2;

        return edx * edx * edy *edy <= r2 && sdx * sdx + sdy * sdy > r2;
    };

    Circle.addToVis = function(vis, circles, init) {

        var circle = vis.selectAll('.nope').data(circles)
            .enter().append('circle');

        if(init) {
            circle = circle
                .attr('cx', function(d) {return d.x;})
                .attr('cy', function(d) {return d.y;})
                .attr('r', 4)
                .attr('fill', '#ffffff')
                .transition()
                .duration(1000);
        } else {
            circle = circle
                .attr('cx', function(d){ return d.parent.x;})
                .attr('cy', function(d){ return d.parent.y;})
                .attr('r', function(d){ return d.parent.size / 2;})
                .attr('fill', function(d) { return String(d.parent.rgb);})
                .attr('fill-opacity', 0.68)
                .transition()
                .duration(300);
        }

        circle
            .attr('cx', function(d) {return d.x})
            .attr('cy', function(d) {return d.y})
            .attr('r', function(d) {return d.size / 2;})
            .attr('fill', function(d){return String(d.rgb);})
            .attr('fill-opacity', 1)
            .each('end', function(d) {d.node = this});
    };

    dots.init = function(src){

        var img = new Image();
        img.onload = function(image){
            dots.loadImage(image);
        }

        img.src = src;
    };

    dots.loadImage = function(imageData) {
        var canvas = document.createElement('canvas').getContext('2d');
        canvas.drawImage(imageData,0,0,128,128);
        return canvas.getImageData(0,0,128,128).data;
    };

})(dots);
