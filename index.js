let floorTex=[[1,1,1,1,1,1,1],
             [1,0,0,1,0,0,1],
             [1,0,0,1,0,0,1],
             [1,1,1,1,1,1,1],
             [1,0,0,1,0,0,1],
             [1,0,0,1,0,0,1],
             [1,1,1,1,1,1,1]];
class object{
    constructor(x,y,vel,spriteImg){
        this.x=x;
        this.y=y;
        this.vel=vel;
        this.img=spriteImg;
        }
    update(){
        if(this.vel==0)return;
        let vecX=px-this.x;
        let vecY=py-this.y;
        let distanceToPlayer=Math.sqrt(vecX*vecX+vecY*vecY);
        if(distanceToPlayer<10 && distanceToPlayer>1){
            if(this.x<px){
                this.x+=this.vel*elapsedTime;
                if(isWall(Math.floor(this.x),Math.floor(this.y))){
                    this.x-=this.vel*elapsedTime;
                    }
            }else if(this.x>px){
                this.x-=this.vel*elapsedTime;
                if(isWall(Math.floor(this.x),Math.floor(this.y))){
                    this.x+=this.vel*elapsedTime;
                    }
                }
            if(this.y<py){
                this.y+=this.vel*elapsedTime;
                if(isWall(Math.floor(this.x),Math.floor(this.y))){
                    this.y-=this.vel*elapsedTime;
                  }  
            }else if(this.y>py){
                this.y-=this.vel*elapsedTime;
                if(isWall(Math.floor(this.x),Math.floor(this.y))){
                    this.y+=this.vel*elapsedTime;
                    }
                }
            if(Math.abs(this.x-px)<0.1){
                this.x=px;
                
                }
            if(Math.abs(this.y-py)<0.1){
                this.y=py;
                
                }
            }else{
            return;
            }
        }
    }
let skeletonlarge=document.getElementById("skeletonlarge");
let objects=[];
function generateMaze(w,h){
        let x=1;
        let y=1;
        let mult=4;
        let m=[];
        let floor=0;
        let wall=1;
        for(let i=0;i<h;i++){
            let arr=[];
            for(let j=0;j<w;j++){
                
                    arr.push(wall);
                    
            }
            m.push(Array(...arr));
            }
   
     let stack=[];
    stack.push(Array(x,y));
    let visited=0;
    while(visited<w*h && stack.length!=0){
            visited++;
            current=stack[stack.length-1];
            x=current[0];
            y=current[1];
            for(let i=0;i<mult-1;i++){
            for(let j=0;j<mult-1;j++){
                if(y+i<h-1 && x+j<w-1){
                m[y+i][x+j]=floor;
                    }
                }
                }
            
            let neighbors=[];
            if(x-mult>0){
                if(m[y][x-mult]==wall)neighbors.push(3);
                }
        if(x+mult<w-1){
                if(m[y][x+mult]==wall)neighbors.push(1);
                }
        if(y-mult>0){
                if(m[y-mult][x]==wall)neighbors.push(0);
                }
        if(y+mult<h-1){
                if(m[y+mult][x]==wall)neighbors.push(2);
                }
        
        if(neighbors.length>0){
            let rand=neighbors[Math.floor(Math.random()*neighbors.length)];
            if(rand==0){
               //m[y-1][x]=floor;
                //m[y-1][x+1]=floor;
                
                  for(let j=0;j<mult-1;j++)m[y-1][x+j]=floor;
                y-=mult;
                stack.push(Array(x,y));
                }else if(rand==2){
                
                    for(let j=0;j<mult-1;j++)m[y+mult-1][x+j]=floor;
            y+=mult;
                stack.push(Array(x,y));
                }else if(rand==1){
                 for(let j=0;j<mult-1;j++)m[y+j][x+mult-1]=floor;
                
            x+=mult;
                stack.push(Array(x,y));
                }else if(rand==3){

              for(let j=0;j<mult-1;j++)m[y+j][x-1]=floor; 
               
            x-=mult;
                stack.push(Array(x,y));
                }
            }else{
                stack.pop();
                
                    
            }
        
        }
    for(let i=0;i<m.length;i++){
        for(let j=0;j<m[0].length;j++){
            if(m[i][j]==0){
                let rand=Math.random()*100;
                if(rand<5){
                objects.push(new object(j+0.5,i+0.5,2,skeletonlarge));
                    }
                }
            if(m[i][j]==1){
                m[i][j]=Math.floor(Math.random()*6)+1;
                }
        }
        }
    
    
    return m;
    }

let canvas;
let ctx;
let map;
let px=5.5;
let py=5.5;
let pa=0;
let targetA=0;
let forwardBlockX=px-Math.cos(targetA);
let forwardBlockY=py-Math.sin(targetA);
let backBlockX=px-Math.cos(targetA);
let backBlockY=py-Math.sin(targetA);
let leftBlockX=Math.floor(px-Math.cos(targetA))+0.5;
let leftBlockY=Math.floor(py+Math.sin(targetA))+0.5;
let rightBlockX=Math.floor(px+Math.cos(targetA))+0.5;
let rightBlockY=Math.floor(py-Math.sin(targetA))+0.5;
let targetX=px;
let targetY=py;
let fov=Math.PI/4;
let depth=32;
let h=32;
let wPressed=false;
let aPressed=false;
let sPressed=false;
let dPressed=false;
let qPressed=false;
let ePressed=false;
let moving=false;
let swordOut=false;
let mouseX=0;
let mouseY=0;
let currentTime=new Date();
let lastTime=new Date();
let elapsedTime=(currentTime-lastTime)/1000.0;
let sword=document.getElementById("sword");
let floor=document.createElement("canvas");


let walls=[document.getElementById("wall_vines0"),
           document.getElementById("wall_vines1"),
           document.getElementById("wall_vines2"),
           document.getElementById("wall_vines3"),
           document.getElementById("wall_vines4"),
           document.getElementById("wall_vines5"),
           document.getElementById("wall_vines6")];

let zBuffer;
let context;
window.onload=function(){
    map=generateMaze(100,100);
    canvas=document.getElementById("canvas");
    canvas.width=640;
    canvas.height=320;
    
   
    floor.width=walls[0].width;
    floor.height=walls[0].height;
    
    zBuffer=new Array(canvas.width);
    canvas.style.background="black";
    ctx=canvas.getContext("2d");
    context=floor.getContext("2d");
    context.drawImage(walls[0],0,0);
    floorData=context.getImageData(0,0,walls[0].width,walls[0].height);
    generateFloor();
    redraw();
    }

    let near=0.01;
    let far=3;
function generateFloor(){
    context.clearRect(0,0,floor.width,floor.height);

    let farX1=px+Math.sin(pa-fov/2)*far;
    let farY1=py+Math.cos(pa-fov/2)*far;

    let farX2=px+Math.sin(pa+fov/2)*far;
    let farY2=py+Math.cos(pa+fov/2)*far;

    let nearX1=px+Math.sin(pa-fov/2)*near;
    let nearY1=py+Math.cos(pa-fov/2)*near;

    let nearX2=px+Math.sin(pa+fov/2)*near;
    let nearY2=py+Math.cos(pa+fov/2)*near;
    for(let ly=0;ly<canvas.height/2;ly++){
        let sampleDepth=ly/(canvas.height/2);

        let startX=(farX1-nearX1)/(sampleDepth)+nearX1;
        let startY=(farY1-nearY1)/(sampleDepth)+nearY1;

        let endX=(farX2-nearX2)/(sampleDepth)+nearX2;
        let endY=(farY2-nearY2)/(sampleDepth)+nearY2;

        for(let lx=0;lx<canvas.width;lx++){
            let sampleWidth=lx/canvas.width;

            let sampleX=((endX-startX)*sampleWidth+startX);
            let sampleY=((endY-startY)*sampleWidth+startY); 
            let vecX=px-sampleX;
            let vecY=py-sampleY;
            let distance=Math.sqrt(vecX*vecX+vecY*vecY);
            if(distance<zBuffer[lx] && !isNaN(sampleX) && !isNaN(sampleY) && !isWall(sampleX,sampleY)){
                    sampleX=sampleX-Math.floor(sampleX);
                sampleY=sampleY-Math.floor(sampleY);
                context.fillStyle="gray";
                
                context.fillRect(lx,ly,1,1);
                }
            
            }
        
        }
    }
function redraw(){
    
    currentTime=new Date();
    elapsedTime=(currentTime-lastTime)/1000.0;
    lastTime=currentTime;
    ctx.reset();
    ctx.fillStyle="black";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    generateFloor();
    ctx.putImageData(context.getImageData(0,0,floor.width,floor.height),0,0);
    forwardBlockX=Math.floor(px+Math.sin(targetA))+0.5;
    forwardBlockY=Math.floor(py+Math.cos(targetA))+0.5;
    backBlockX=Math.floor(px-Math.sin(targetA))+0.5;
    backBlockY=Math.floor(py-Math.cos(targetA))+0.5;
    leftBlockX=Math.floor(px-Math.cos(targetA))+0.5;
    leftBlockY=Math.floor(py+Math.sin(targetA))+0.5;
    rightBlockX=Math.floor(px+Math.cos(targetA))+0.5;
    rightBlockY=Math.floor(py-Math.sin(targetA))+0.5;
    if(sPressed){
        if(map[Math.floor(backBlockY)][Math.floor(backBlockX)]==0){
        targetX=backBlockX;
        targetY=backBlockY;
            }
        }else if(wPressed){
        if(map[Math.floor(forwardBlockY)][Math.floor(forwardBlockX)]==0){
        targetX=forwardBlockX;
        targetY=forwardBlockY;
            }
        }else if(aPressed){
        if(map[Math.floor(leftBlockY)][Math.floor(leftBlockX)]==0){
        targetX=leftBlockX;
        targetY=leftBlockY;
            }
        }else if(dPressed){
        if(map[Math.floor(rightBlockY)][Math.floor(rightBlockX)]==0){
        targetX=rightBlockX;
        targetY=rightBlockY;
            }
        }
    if(ePressed && pa==targetA ){
        targetA+=Math.PI/2;
        
        }else if(qPressed && pa==targetA){
        targetA-=Math.PI/2;
        
        }
    
    if(px<targetX)px+=5*elapsedTime;
    
    if(px>targetX)px-=5*elapsedTime;
    
    if(py<targetY)py+=5*elapsedTime;
   
    if(py>targetY)py-=5*elapsedTime;
   
    if(Math.abs(px-targetX)<0.1 && Math.abs(py-targetY)<0.1){
        px=Math.floor(targetX)+0.5;
        py=Math.floor(targetY)+0.5;
        
        
        }
    
    if(pa>targetA){
        
        pa-=3*elapsedTime;
        }
    if(pa<targetA)pa+=3*elapsedTime;
    if(Math.abs(pa-targetA)<0.2){
        pa=targetA;
        
        }

    for(let x=0;x<canvas.width;x++){
        let rayAngle=(pa-fov/2)+((x/canvas.width)*fov);
        let distanceToWall=0;
        let hitWall=false;
        let eyeX=Math.sin(rayAngle);
        let eyeY=Math.cos(rayAngle);
        let testX;
        let testY;
        while(!hitWall && distanceToWall<depth){
            distanceToWall+=0.2;
            testX=px+eyeX*distanceToWall;
            testY=py+eyeY*distanceToWall;
            if(testX<0 || testX>map[0].length || testY<0 || testY>map.length){
                hitWall=true;
                distanceToWall=depth;
                }else{
                    if(isWall(Math.floor(testX),Math.floor(testY))){
                        distanceToWall-=0.5;
                        while(!hitWall && distanceToWall<depth){
            distanceToWall+=0.01;
            testX=px+eyeX*distanceToWall;
            testY=py+eyeY*distanceToWall;
            if(testX<0 || testX>map[0].length || testY<0 || testY>map.length){
                hitWall=true;
                distanceToWall=depth;
                }else{
                    if(isWall(Math.floor(testX),Math.floor(testY))){
                        hitWall=true;
                        
                        }
                }
            }
                        }
                }
            }
        if(distanceToWall==depth)continue;
        distanceToWall=distanceToWall*Math.cos(pa-rayAngle);
        zBuffer[x]=distanceToWall;
        let ceiling=canvas.height/2-canvas.height/distanceToWall;
        let floor=canvas.height-ceiling;
        let wallHeight=floor-ceiling;
        let sampleX=0;
        let testA=Math.atan2((testY-(Math.floor(testY)+0.5)),(testX-(Math.floor(testX)+0.5)));
        
        if(testA>=-Math.PI*0.25 && testA<Math.PI*0.25){
            sampleX=testY-Math.floor(testY);
            
            }
        if(testA>=Math.PI*0.25 && testA<Math.PI*0.75){
            sampleX=testX-Math.floor(testX);
            }
        if(testA<-Math.PI*0.25 && testA>=-Math.PI*0.75){
            sampleX=testX-Math.floor(testX);
            }
        if(testA>=Math.PI*0.75 || testA<-Math.PI*0.75){
            sampleX=testY-Math.floor(testY);
            }
        if(map[Math.floor(testY)][Math.floor(testX)]-1>=0 && map[Math.floor(testY)][Math.floor(testX)]-1<walls.length){
            let shade=1.0-0.1*distanceToWall;
            if(shade>1)shade=1;
            if(shade<0)shade=0;
            ctx.globalAlpha=shade;
        ctx.drawImage(walls[map[Math.floor(testY)][Math.floor(testX)]],(sampleX*32),0,1,32,x,Math.floor(ceiling),1,Math.floor(wallHeight));
            ctx.globalAlpha=1;
            }
        
        

        
        }

    
    for(let i=0;i<objects.length;i++){
        objects[i].update();
        let vecX=px-objects[i].x;
        let vecY=py-objects[i].y;
        let distanceFromPlayer=Math.sqrt(vecX*vecX+vecY*vecY);

        let eyeX=Math.sin(-pa);
        let eyeY=Math.cos(-pa);
        let objectAngle=Math.atan2(vecY,vecX)-Math.atan2(-eyeY,eyeX);
        if(objectAngle<-Math.PI){objectAngle+=Math.PI*2;}
        if(objectAngle>Math.PI){objectAngle-=Math.PI*2;}
        let inFov=Math.abs(objectAngle)<fov/2;
        if(inFov && distanceFromPlayer>=0.5 && distanceFromPlayer<depth){
            let objectCeil=canvas.height/2-canvas.height/distanceFromPlayer;
            let objectFloor=canvas.height-objectCeil;
            let objectHeight=objectFloor-objectCeil;
            let aspectRatio=objects[i].img.width/objects[i].img.height;
            let objectWidth=objectHeight/aspectRatio;

            let objectMid=canvas.width-(0.5*(objectAngle/(fov/2.0))+0.5)*canvas.width;
            if(swordOut && distanceFromPlayer<1.5 && mouseX>objectMid-objectWidth/2 && mouseX<objectMid+objectWidth/2 && mouseY>objectCeil && mouseY<objectFloor){
                objects.splice(i,1);
                continue;
                }
            for(let x=0;x<objectWidth;x++){
                let sampleX=x/objectWidth;
                if(objectMid-(objectWidth/2)+x>=0 && objectMid-(objectWidth/2)+x<canvas.width){
                     if(zBuffer[Math.floor(objectMid-(objectWidth/2)+x)]>distanceFromPlayer){
                         zBuffer[Math.floor(objectMid-(objectWidth/2)+x)]=distanceFromPlayer
                ctx.drawImage(objects[i].img,(sampleX*objects[i].img.width),0,1,objects[i].img.height,objectMid-objectWidth/2+x,objectCeil,1,objectHeight);
                         }
                    }
                }
            //
            

            
            }
        }
    if(swordOut){
        ctx.translate(mouseX,mouseY);
        ctx.rotate(Math.PI/2+Math.atan2((canvas.height-mouseY),(canvas.width-canvas.width/3)-mouseX));
        ctx.drawImage(sword,0,0,sword.width,sword.height,-sword.width*2,-sword.height*4,sword.width*4,sword.height*4);
        ctx.rotate(-(Math.PI/2+Math.atan2((canvas.height-mouseY),(canvas.width-canvas.width/3)-mouseX)));
        ctx.translate(-mouseX,-mouseY);
        }

    let overlay=ctx.createRadialGradient(canvas.width/2,canvas.height/2,canvas.width/4,canvas.width/2,canvas.height/2,canvas.width/2);
    overlay.addColorStop(0,"transparent");
    overlay.addColorStop(1,"black");
    ctx.fillStyle=overlay;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    requestAnimationFrame(redraw);
    }
function isWall(x,y){
    if(x<0 || x>map[0].length-1 || y<0 || y>map.length-1 || isNaN(x) || isNaN(y)) return false;
    if(map[Math.floor(y)][Math.floor(x)]==1 || map[Math.floor(y)][Math.floor(x)]==2 || map[Math.floor(y)][Math.floor(x)]==3 || map[Math.floor(y)][Math.floor(x)]==4 || map[Math.floor(y)][Math.floor(x)]==5 || map[Math.floor(y)][Math.floor(x)]==6 || map[Math.floor(y)][Math.floor(x)]==7)return true;

    return false;
    }
window.addEventListener("keydown",(e)=>{
        if(e.key=="w")wPressed=true;
        else if(e.key=="a")aPressed=true;
        else if(e.key=="s")sPressed=true;
        else if(e.key=="d")dPressed=true;
        else if(e.key=="q")qPressed=true;
        else if(e.key=="e")ePressed=true;
    });
window.addEventListener("keyup",(e)=>{
        if(e.key=="w")wPressed=false;
        else if(e.key=="a")aPressed=false;
        else if(e.key=="s")sPressed=false;
        else if(e.key=="d")dPressed=false;
        else if(e.key=="q")qPressed=false;
        else if(e.key=="e")ePressed=false;
    });
window.addEventListener("mousedown",(e)=>{
    if(e.button==0){
        swordOut=true;
        }
    });
window.addEventListener("mousemove",(e)=>{
        mouseX=e.clientX;
        mouseY=e.clientY;
    });
window.addEventListener("mouseup",(e)=>{
    if(e.button==0){
        swordOut=false;
        }
    });