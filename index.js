"use strict";

var mapDataString = [],
    mapDataStringName = [],
    canvasAnim = new heatmapfromdata('animation'),
    arrFramesName = [],
    arrData = [],
    X = 0,
    width = 0, 
    height = 0,
    i = 0,
    minElem = 0, 
    maxElem = 0;


var canvasPict = new heatmapfromdata("picture"),
    dataPict = "";




// export image
document.getElementById("exportPNG").onclick = function() {
    var canvas = document.getElementById('canvas3'),
        ctx = canvas.getContext('2d'),
        picture = document.getElementById('picture'),
        legend_pict = document.getElementById('legend_pict');
    
    canvas.width = picture.width + legend_pict.width;
    canvas.height = picture.height;

    ctx.drawImage(picture, 0, 0);
    ctx.drawImage(legend_pict, picture.width, 0);

   
    var dataURL = canvas.toDataURL("image/png"),
    link = document.createElement("a");

    document.body.appendChild(link); 
    link.href = dataURL;
    link.download = "heatMap.png";
    link.click();
    document.body.removeChild(link);
};

function drawLegend(canvas, gradientData, height) {
    console.log("height", height);
    var legend_pict = document.getElementById(String(canvas));
    legend_pict.height = height;

    var ctx = legend_pict.getContext('2d'),
        step = legend_pict.height / canvasPict.getColors();
        ctx.clearRect(0, 0, legend_pict.width, legend_pict.height);
    for(var j = canvasPict.getColors(); j > 0; j--) {
        var colors = gradientData[canvasPict.getColors() - j],
            R = colors[0],
            G = colors[1],
            B = colors[2];

        ctx.fillStyle = `rgb(${R}, ${G}, ${B})`;
        ctx.fillRect(10, j * step, 20, step);
    }
    var size = Math.trunc((legend_pict.height) / 40),
        val = (maxElem + Math.abs(minElem)) / (size),
        temp = maxElem;
    console.log("val, ", val);
    for(var j = 0; j <= size; j++) {
        ctx.fillStyle = "black";
        ctx.font = "15px Times New Roman";
        ctx.fillText(`-   ${Math.trunc(temp)}`, 30, 15 + j * 40, 100);
        temp -= val;
    }
}

function dataNormalization(matrix) {
    for(var i = 0; i < matrix.length; i++) {

        height = Math.max(height, matrix.length);
        width = Math.max(width, matrix[i].length);
        for(var j = 0; j < matrix[i].length; j++) {
            maxElem = Math.max(matrix[i][j], maxElem);
            minElem = Math.min(matrix[i][j], minElem);
        }
    }    

    return maxElem;
};


function parseDataFromFile(data) {
    return data.split("\n").map(e => {
        return e.trim().slice(0).split(",").map(e => +e);
    });
};


document.getElementById('switchpallette').addEventListener('click', function() {
    var pallette = document.getElementById('wrap_pallette');

    if (pallette.hidden === false) {
        pallette.hidden = true;
    } else {
        document.getElementById('pallette').style.cssText = 'display: flex;';
        pallette.hidden = false;
    }
});

// User_pallette
document.getElementById('pallette').querySelectorAll('li').forEach(e => {
    e.addEventListener('click', () => {
        var color = document.getElementById('user_pallette'),
            a = e.cloneNode(true),
            flag = true;

        a.style.cssText = `list-style: none;`;

        color.querySelectorAll('li').forEach(el => {
            if (a.getAttribute('id') === el.getAttribute('id')) {
                flag = false;
            }
        })

        if (flag) {
            color.append(a);
        }

    });
});


document.getElementById('button_reset').addEventListener('click', () => {
   document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        e.remove();
    });
});


document.getElementById('button_save').addEventListener('click', () => {
    var pallette = document.getElementById('wrap_pallette');
    pallette.hidden = true;
});


document.getElementById('Information').addEventListener('click', () => {
    
});

// canvas for picture
document.getElementById('button_draw').addEventListener('click', () => {
    var colors = "";
    minElem = 0;
    maxElem = 0;
    width = 0;
    height = 0;
    
    document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button_draw").style.cssText = `list-style: none;`;
    
    var dataColors = canvasPict.parseColors(colors),
        gradientData = canvasPict.linearInterpolation(dataColors);

    canvasPict.gradient(gradientData);

    var data = parseDataFromFile(dataPict), 
        temp = dataNormalization(data);
    X = (canvasAnim._sizeColors - 1) / (Math.abs(minElem) + Math.abs(maxElem));

    canvasPict.changeCanvas(width, height);

    drawLegend("legend_pict", gradientData, document.getElementById("picture").height);


    canvasPict.data(data);
    canvasPict.draw(X, minElem);

});


document.getElementById('button_file').addEventListener('change', () => {
    var el = document.getElementById('buttons_pict');
    
    for(var i = 0; i < el.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader(),
            file = el.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = function(e) {
            dataPict = e.target.result;
        
            document.getElementById("button_draw").style.cssText = `background: green;`;
        }
    }
});

// canvas for Animation
document.getElementById('button_animation').addEventListener('click', () => {
    var colors = "";
    i = 0;

    document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button_animation").style.cssText = `list-style: none;`;
    
    var dataColors = canvasAnim.parseColors(colors),
        gradientData = canvasAnim.linearInterpolation(dataColors);

    canvasAnim.gradient(gradientData);   

    drawLegend("legend_anim", gradientData, document.getElementById("animation").height);
    
    window.requestAnimationFrame(drawFrame);
});


document.getElementById('button_folder').addEventListener('change', () => {
    var el = document.getElementById('buttons_anim'),
        VAL = 0; 

    arrData.length = 0;
    width = 0;
    height = 0;
    arrFramesName.length = 0;
    mapDataString.length = 0;
    mapDataStringName.length = 0;
    minElem = 0;
    maxElem = 0;
    
    
    for(var i = 0; i < el.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader(),
            file = el.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = (function(file) {
            return function(e) {
                mapDataString.push(e.target.result); 
                mapDataStringName.push(file.name);
                VAL++; 

                if (VAL == el.querySelector("input[type=file]").files.length) {

                    for(var j = 0; j < el.querySelector("input[type=file]").files.length; j++) {
                        arrFramesName.push(el.querySelector('input[type=file]').files[j].name);
                    }

                    arrFramesName.sort(function compare(a, b) {
                        var valA = Number(a.slice(a.indexOf('_') + 1, a.indexOf('.'))),
                            valB = Number(b.slice(b.indexOf('_') + 1, b.indexOf('.')));

                        if (valA > valB) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                

                    for(var j = 0; j < el.querySelector("input[type=file]").files.length; j++) {
                        var data = parseDataFromFile(mapDataString[j]),
                            val = dataNormalization(data);

                        arrData.push(data);
                    }

                    X = (canvasAnim._sizeColors - 1) / (Math.abs(minElem) + Math.abs(maxElem));

                    canvasAnim.changeCanvas(width, height);
                    
                    document.getElementById("button_animation").style.cssText = `background: green;`;
                
                }
            }
        })(file);
    }
});

function drawFrame() {
    var el = document.getElementById('buttons_anim'),
        data = [];
    
    for(var j = 0; j < el.querySelector("input[type=file]").files.length; j++) {
        if (mapDataStringName[j] == arrFramesName[i]) {
            data = arrData[j];
            break;
        }
    }

    canvasAnim.data(data);  
    canvasAnim.draw(X, minElem);

    if (i < el.querySelector("input[type=file]").files.length - 1) {
        i++;
        window.requestAnimationFrame(drawFrame);
    } else {
        alert("done");
    }
};
