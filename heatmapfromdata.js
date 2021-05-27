'use strict';
// за что отвечает if
if (typeof module !== 'undefined') module.exports.heatmapfromdata = heatmapfromdata;
// // module.exports.heatmapfromdata = heatmapfromdata;

function heatmapfromdata(canvas) {

    // защита от НЕПРАВИЛЬНОЙ привязки контекста 
    if (!(this instanceof heatmapfromdata)) return new heatmapfromdata(canvas);

    this._canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    this._ctx = this._canvas.getContext("2d");

    this._data = [];
    this._grad = [],
    this._sizeColors = 1000; // кол-ва цветов в градиенте 
}

heatmapfromdata.prototype = {

    getColors: function() {
        return this._sizeColors;
    },

    changeCanvas: function(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;

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

    draw: function(X, minElem) {
        var start= new Date().getTime();
        var step = 1;

        for(var i = 0; i < this._canvas.height - 1; i++) {
        
            for(var j = 0; j < this._canvas.width - 1; j++) {
                
                var colors = this._grad[Math.trunc(X * (this._data[i][j] + Math.abs(minElem)))];

                try {
                    var asdasda = colors[0];
                } catch {
                    console.log("this._grad[Math.trunc(X * (this._data[i][j]) + Math.abs(minElem))]; ", this._grad[Math.trunc(X * (this._data[i][j] + Math.abs(minElem)))]);
                    console.log("X * this._data[i][j]): ", Math.trunc(X * (this._data[i][j] + Math.abs(minElem))));
                    console.log("this._data[i][j]: ", this._data[i][j]);
                    console.log("Math.abs(minElem): ", Math.abs(minElem));
                    console.log("this._sizeColors: ", this._sizeColors);
                    console.log("X: ", X);
                    console.log("i: ", i, "j ", j);
                    console.log("this._canvas.width: ", this._canvas.width, "this._canvas.height: ", this._canvas.height);
                }

                var R = colors[0],
                    G = colors[1],
                    B = colors[2];

                if (minElem == this._data[i][j]) {
                    this._ctx.fillStyle = `rgb(255, 255, 255)`;
                    this._ctx.fillRect(j, i, step, step);
                } else {
                    this._ctx.fillStyle = `rgb(${R}, ${G}, ${B})`;
                    this._ctx.fillRect(j, i, step, step);
                }

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