var mapDataString = [];
var canvasAnim = new heatmapfromdata('animation');
var arrFramesName = [];
var arrData = [];
var Xanimation = 0;
var i = 0;


var canvasPict = new heatmapfromdata('canvas');
var Xpict = 0;
var dataPict = "";




document.getElementById("exportPNG").onclick = function() {
    var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    document.body.appendChild(link); 
    link.href = dataURL;
    link.download = "vizData.png";
    link.click();
    document.body.removeChild(link);
};



function dataNormalization(matrix) {
    let maxElem = 0.0;
    for(let i = 0; i < matrix.length - 1; i++) {
        for(let j = 0; j < matrix.length - 1; j++) {
            maxElem = Math.max(Math.abs(matrix[i][j]), Math.abs(maxElem));
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


document.getElementById('pallette').querySelectorAll('li').forEach(e => {
    e.addEventListener('click', () => {
        var color = document.getElementById('user_pallette');
        var a = e.cloneNode(true);
        a.style.cssText = `list-style: none;`;

        var flag = true;
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

// для картинки //////////////////////////////////////////////////////

document.getElementById('button_draw').addEventListener('click', () => {
    var colors = "";
    
    document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button_draw").style.cssText = `list-style: none;`;
    
    var dataColors = canvasPict.parseColors(colors),
        gradientData = canvasPict.linearInterpolation(dataColors);

    canvasPict.gradient(gradientData);

    var data = parseDataFromFile(dataPict);
    Xpict = (canvasAnim._sizeColors - 1) / dataNormalization(data);

    canvasPict.data(data);
    canvasPict.draw(Xpict);

});


document.getElementById('button_file').addEventListener('change', () => {
    var el = document.getElementById('buttons_pict');
    
    for(var i = 0; i < el.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader();
         
        var file = el.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = function(e) {
            dataPict = e.target.result;
        
            document.getElementById("button_draw").style.cssText = `background: green;`;
        }
    }
});


// для анимации //////////////////////////////////////////////////////

document.getElementById('button_animation').addEventListener('click', () => {
    var colors = "";

    document.getElementById('user_pallette').querySelectorAll('li').forEach((e) => {
        colors += e.dataset.value;
    });

   document.getElementById("button_animation").style.cssText = `list-style: none;`;
    
    var dataColors = canvasAnim.parseColors(colors),
        gradientData = canvasAnim.linearInterpolation(dataColors);

    canvasAnim.gradient(gradientData);
    
    window.requestAnimationFrame(drawFrame);

});


document.getElementById('button_folder').addEventListener('change', () => {
    console.log("first");   
    var el = document.getElementById('buttons_anim');
    var VAL = 0;
    arrData.length = 0;
    arrFramesName.length = 0;
    mapDataString.length = 0;

    el.querySelector("input[type=file]").files.length = 0;
    
    
    for(var i = 0; i < el.querySelector("input[type=file]").files.length; i++) {
        var reader = new FileReader();
         
        var file = el.querySelector('input[type=file]').files[i];

        reader.readAsText(file);
        
        reader.onload = function(e) {
            mapDataString.push(e.target.result); 
            VAL++; 

            if (VAL == el.querySelector("input[type=file]").files.length) {

                for(var j = 0; j < el.querySelector("input[type=file]").files.length; j++) {
                    arrFramesName.push(el.querySelector('input[type=file]').files[j].name);
                }

                arrFramesName = arrFramesName.sort(function compare(a, b) {
                    var valA = Number(a.slice(a.indexOf('_') + 1, a.indexOf('.')));
                    var valB = Number(b.slice(b.indexOf('_') + 1, b.indexOf('.')));

                    if (valA > valB) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                
                console.log("arrFramesName: ",arrFramesName);

                var maxValue = 0;
                for(var j = 0; j < el.querySelector("input[type=file]").files.length; j++) {
                    var data = parseDataFromFile(mapDataString[j]),
                        val = dataNormalization(data);

                    maxValue = Math.max(maxValue, val);

                    arrData.push(data);
                }

                console.log(arrData);

                Xanimation = (canvasAnim._sizeColors - 1) / maxValue;
                
                console.log("arrFramesName : ", arrFramesName);
                document.getElementById("button_animation").style.cssText = `background: green;`;
            }
        }
    }
});

function drawFrame() {
    var el = document.getElementById('buttons_anim'),
        data = [];
    
    for(var j = 0; j < el.querySelector("input[type=file]").files.length; j++) {
        var el = document.getElementById('buttons_anim'); 
        var fileName = el.querySelector('input[type=file]').files[j].name;
        console.log("fileName", fileName);
        if (fileName == arrFramesName[i]) {
            data = arrData[j];
            console.log("fileName", fileName);
            break;
        }
    }
    
    // console.log("data: ", data);

    canvasAnim.data(data);
    canvasAnim.draw(Xanimation);

    if (i < el.querySelector("input[type=file]").files.length - 1) {
        i++;
        window.requestAnimationFrame(drawFrame);
    }
};