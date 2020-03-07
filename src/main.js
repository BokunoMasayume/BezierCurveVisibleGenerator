

document.body.innerHTML = "";
// document.body.style.height = '100%';
/**
 * wrap
 *  */
var wrap = document.createElement('div');
wrap.style.position = "fixed";
wrap.style.top = "0";
wrap.style.left = "0";
wrap.style.right = "0";
wrap.style.bottom = "0";
wrap.style.zIndex = "999";
document.body.appendChild(wrap);

// wrap.style.backgroundColor = "red";

/**
 * controller 
 */
var controller = document.createElement('div');
controller.style.height  = "80px";
wrap.appendChild(controller);

controller.style.backgroundColor="blue";

/**
 * svg
 */
var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
svg.setAttribute('width' , window.innerWidth);
svg.setAttribute('height',(window.innerHeight - 80));
// svg.style.width = window.innerWidth+"px";
// svg.style.height = window.innerHeight+"px";
svg.setAttribute('viewBox', "0 0 "+window.innerWidth+" "+(window.innerHeight - 80));
wrap.appendChild(svg);

svg.style.border = "2px solid black";

// var testcir = document.createElementNS("http://www.w3.org/2000/svg",'circle');
// testcir.setAttribute('r', "100");
// testcir.setAttribute("cx","200");
// testcir.setAttribute("cy","300");
// svg.appendChild(testcir);
/**
 * bezier curve anchor points
 * anchors[i] is the attr of i/2 th point
 * i%2 ==0  anchors[i] is x attr else is y attr 
 */
var anchors = [];
// var anchors = [100,100,     150,150,        200,150,    250,200];

/**
 * layer points
 * 1st dimension is layer
 * 2nd dimension is points of this layer
 * 
 * point is{
 *      x:
 *      y:
 *      el:
 * }
 */
var layerPoints = [];

/**
 * layer lines
 * 1st dimension is layer
 * 2nd dimension is lines of this layer
 * 
 * line is{
 *      p1:
 *      p2:
 *      el:
 * }
 */
var layerLines = [];

/**
 * timing start
 */
var start ,duration = 5000;//5s

/**
 * stop animation id
 */
var stopAnimId;

/**
 * path 
 */
var path = document.createElementNS("http://www.w3.org/2000/svg",'path');
path.setAttribute('d', 'M 0 0 ');
svg.appendChild(path);

/**
 * define property
 */
function cookSVGobj(obj){
    Object.defineProperty(obj , 'x' , {
        enumerable:true,
        configurable:true,
       
        set:function(value){
            this.el.setAttribute('cx',value);
        },

        get:function(){
            return this.el.getAttribute('cx');
        }
    });

    Object.defineProperty(obj , 'y' , {
        enumerable:true,
        configurable:true,
       
        set:function(value){
            this.el.setAttribute('cy',value);
        },

        get:function(){
            return this.el.getAttribute('cy');
        }
    });

    Object.defineProperty(obj , 'x1' , {
        enumerable:true,
        configurable:true,
       
        set:function(value){
            this.el.setAttribute('x1',value);
        },

        get:function(){
            return this.el.getAttribute('x1');
        }
    });

    Object.defineProperty(obj , 'y1' , {
        enumerable:true,
        configurable:true,
       
        set:function(value){
            this.el.setAttribute('y1',value);
        },

        get:function(){
            return this.el.getAttribute('y1');
        }
    });

    Object.defineProperty(obj , 'x2' , {
        enumerable:true,
        configurable:true,
       
        set:function(value){
            this.el.setAttribute('x2',value);
        },

        get:function(){
            return this.el.getAttribute('x2');
        }
    });

    Object.defineProperty(obj , 'y2' , {
        enumerable:true,
        configurable:true,
       
        set:function(value){
            this.el.setAttribute('y2',value);
        },

        get:function(){
            return this.el.getAttribute('y2');
        }
    });

  
}

/**
 * init polys into svg tag
 * init layer points and lines
 */
function init(){
    svg.innerHTML = "";
    path = document.createElementNS("http://www.w3.org/2000/svg",'path');
    path.setAttribute('d', `M ${anchors[anchors.length-2]} ${anchors[anchors.length-1]}`);
    path.setAttribute('fill','none');
    path.setAttribute('stroke','black');
    path.setAttribute('stroke-width','6');
    // stroke="black" fill="none"
    svg.appendChild(path);
    layerPoints = Array.from({length:anchors.length/2 });
    for(let i=0;i<layerPoints.length;i++){
        layerPoints[i] = Array.from({length:i+1});

        for(let j=0; j<layerPoints[i].length; j++){
            layerPoints[i][j] = {  };
            cookSVGobj(layerPoints[i][j]);
            layerPoints[i][j].el = document.createElementNS("http://www.w3.org/2000/svg",'circle');
            layerPoints[i][j].el.setAttribute('fill' ,`rgb(${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)})` );
            layerPoints[i][j].el.setAttribute('r',"4");
            svg.appendChild(layerPoints[i][j].el);
        }
    }

    layerLines = Array.from({length:anchors.length/2 });
    for(let i=0 ; i<layerLines.length;i++){
        layerLines[i] = Array.from({length:i});

        for(let j=0; j<layerLines[i].length;j++){
            layerLines[i][j] = {};
            cookSVGobj(layerLines[i][j]);

            layerLines[i][j].el = document.createElementNS("http://www.w3.org/2000/svg",'line');
            layerLines[i][j].el.setAttribute('stroke' , `rgb(${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)} , ${Math.floor(Math.random()*256)})` );

            // layerLines[i][j].x1 = layerPoints[i][j].x;
            // layerLines[i][j].y1 = layerPoints[i][j].y;
            // layerLines[i][j].x2 = layerPoints[i][j+1].x;
            // layerLines[i][j].y2 = layerPoints[i][j+1].y;

            svg.appendChild(layerLines[i][j].el);

        }
    }
    
}  

function render(){

    let t = (new Date().getTime() - start)/duration;
    // console.log(t)
    if(t>1)return;

    let anc = anchors.slice();
    for(let i=0; i<anc.length/2 ;i++){
        layerPoints[anc.length/2 -1][i].x = anc[i*2];
        layerPoints[anc.length/2 -1][i].y = anc[i*2+1];
        if(i>0){
            layerLines[anc.length/2 -1][i-1].x1 = layerPoints[anc.length/2 -1][i-1].x;
            layerLines[anc.length/2 -1][i-1].y1 = layerPoints[anc.length/2 -1][i-1].y;
            layerLines[anc.length/2 -1][i-1].x2 = layerPoints[anc.length/2 -1][i].x;
            layerLines[anc.length/2 -1][i-1].y2 = layerPoints[anc.length/2 -1][i].y;
        }
    }

    for(let i=anc.length/2 -2; i>=0;i--){
        for(let j=0; j<=i;j++){
            layerPoints[i][j].x = t * layerPoints[i+1][j].x + (1-t) * layerPoints[i+1][j+1].x;
            layerPoints[i][j].y = t * layerPoints[i+1][j].y + (1-t) * layerPoints[i+1][j+1].y;
            if(j>0){
                layerLines[i][j-1].x1 = layerPoints[i][j-1].x;
                layerLines[i][j-1].y1 = layerPoints[i][j-1].y;
                layerLines[i][j-1].x2 = layerPoints[i][j].x;
                layerLines[i][j-1].y2 = layerPoints[i][j].y;

            }
        }
    }

    path.setAttribute('d' , path.getAttribute('d') + `L ${layerPoints[0][0].x} ${layerPoints[0][0].y} `);


    stopAnimId =  requestAnimationFrame(render);

}

svg.onclick = function(e){
    if(stopAnimId)cancelAnimationFrame(stopAnimId);
    anchors.push(e.offsetX);
    anchors.push(e.offsetY);
    init();
    start = new Date().getTime();

    stopAnimId = requestAnimationFrame(render);

}

// init();
// start = new Date().getTime();

// stopAnimId = requestAnimationFrame(render);

// console.log(layerPoints);
// console.log(layerLines);



