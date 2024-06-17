let canvas = document.querySelector('canvas');
let lineWidth = document.querySelector('#line-width');
let lineWidthValue = 5;
let stroke = document.querySelector('#stroke');
let clear = document.querySelector('button')
let eraser = document.querySelector('.eraser');
let x = canvas.offsetLeft;
let y = canvas.offsetTop;
let startx ;
let starty ; 
canvas.width = window.innerWidth -x;
canvas.height = window.innerHeight-y;
let pantingMode = false;
let ctx = canvas.getContext('2d');
function drow(e){
    if (pantingMode ==false){
        return;
    }
    ctx.lineWidth =lineWidthValue;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX-x , e.clientY -y)
    ctx.stroke();
}
clear.addEventListener('click', function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})
lineWidth.addEventListener('change', function(e){
    lineWidthValue = e.target.value;
})
canvas.addEventListener('mousedown', function(e){
    pantingMode = true;
    startx = e.clientX;
    starty = e.clientY;
})
canvas.addEventListener('mouseup', function(){
    pantingMode = false;
    ctx.stroke();
    ctx.beginPath();
})
canvas.addEventListener('mousemove', drow)
stroke.addEventListener('change', function(e){
    ctx.strokeStyle = e.target.value;
})
