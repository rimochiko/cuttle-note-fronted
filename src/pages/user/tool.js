export default {
    drawBackground
}

function drawBackground () {
    let cvs = document.getElementById('pageBackground'),
                width = window.innerWidth,
                height = window.innerHeight,
                circleNum = 15;
                cvs.width = width;
                cvs.height = height;

    let ctx = cvs.getContext('2d');
    for (let i = 0; i < circleNum; i++){
    let x = Math.random()*width,
        y = Math.random()*height,
        r = Math.random()*80 + 10;
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI,true);
    ctx.fillStyle="rgba(255, 255, 255, .1)";
    ctx.fill();
    ctx.closePath();
    }
}