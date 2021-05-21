'use strict';
// за что отвечает if
if (typeof module !== 'undefined') module.exports.heatmapfromdata = heatmapfromdata;
// // module.exports.heatmapfromdata = heatmapfromdata;

function heatmapfromdata(canvas) {

    // защита от НЕПРАВИЛЬНОЙ привязки контекста 
    if (!(this instanceof heatmapfromdata)) return new heatmapfromdata(canvas);

    this._canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    this._ctx = this._canvas.getContext("2d");
    this._width = this._canvas.width;
    this._height = this._canvas.height;

    this._data = [];
    this._grad = [],
    this._sizeColors = 1000; // кол-ва цветов в градиенте 
}

heatmapfromdata.prototype = {

    changeCanvas: function(width, height = 0) {
        if (height == 0) {
            this._canvas.width = width;
            this._canvas.height = width;
        } else {
            this._canvas.width = width;
            this._canvas.height = height;
        }

        return this;
    },

    sizeColors: function(sizeColors) {
        this._sizeColors = sizeColors;

        return this;
    },

    clear: function() {
        this._data = [];

        return this;
    }, 

    data: function(data) {
        this._data = data;

        return this;
    },

    gradient: function(grad) {
        this._grad = grad;

        return this;
    },

    draw: function(X) {

        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);


        
        let start= new Date().getTime();

        var side = this._data.length,
            step = 1;

        for(var i = 0; i < side - 1; i++) {
        
            for(var j = 0; j < side - 1; j++) {
                
                var colors = this._grad[Math.trunc(X * this._data[i][j])];

                try {
                    var asdasda = colors[0];
                } catch {
                    console.log("X * this._data[i][j]): ", X * this._data[i][j]);
                    console.log("X: ", X);
                    console.log("i: ", i, "j ", j);
                }

                var R = colors[0],
                    G = colors[1],
                    B = colors[2];

                this._ctx.fillStyle = `rgb(${R}, ${G}, ${B})`;
                this._ctx.fillRect(j, i, step, step);
            }
        }

        let end = new Date().getTime();
        console.log(`Draw: ${end - start}ms`);

        return this;
    },

    parseColors: function(colors) {
        var i = 0,
            data = [];
        
        while (colors.indexOf(`(`, i) && i < colors.length) {
            var indexLeft = colors.indexOf(`(`, i),
                indexRight = colors.indexOf(`)`, indexLeft + 1),
                arrColors = colors.slice(indexLeft + 1, indexRight).split(',');
            
            data.push(arrColors);

            i = indexRight + 1;
        }

        return data;
    },

    linearInterpolation: function (colors) {
        var data = [];

        for (var i = 0; i < colors.length - 1; i++) {   
            var firstColorR = +colors[i][0],
                firstColorG = +colors[i][1],
                firstColorB = +colors[i][2],
                secondColorR = +colors[i + 1][0],
                secondColorG = +colors[i + 1][1],
                secondColorB = +colors[i + 1][2],
                limit = this._sizeColors / (colors.length - 1),
                step = 1 / limit;
           
            for (var t = 0, count = 0; count < limit;  t += step, count++) {
                var R = (Math.floor(firstColorR * (1 - t) + secondColorR * t)),
                    G = (Math.floor(firstColorG * (1 - t) + secondColorG * t)),
                    B = (Math.floor(firstColorB * (1 - t) + secondColorB * t));
                
                data.push([R, G, B])
            }
    
        }

        return data;
    },
}

// module.exports.heatmapfromdata = heatmapfromdata;