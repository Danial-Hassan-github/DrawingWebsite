let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let fillColor = document.querySelector('#checkbox');
let save = document.querySelector('.btnSave');
let clearCanvas = document.querySelector('.btnClearCanvas');
let undoButton = document.querySelector('.btnUndo');
let redoButton = document.querySelector('.btnRedo')
let isDrawing = false;
let color = 'black';
let previousSnapshots = []; // Array to store previous snapshots
let redoSnapshots = [];
let snapshot;
let selectedTool='brush'
let prevMouseX
let prevMouseY

// Set up canvas size on window load
window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

// Function to handle drawing actions
const drawing=(e)=>{
    if (!isDrawing) return;

    ctx.putImageData(snapshot, 0, 0)
    ctx.strokeStyle=color;
    ctx.fillStyle=color
    ctx.lineWidth=document.getElementById('slider').value
    if (selectedTool=='brush') {//Working on brush tool
        ctx.lineTo(e.offsetX,e.offsetY)
        ctx.stroke()
    }else if(selectedTool=='Rectangle') {
        drawRect(e)
    }else if (selectedTool=='Circle') {
        drawCircle(e)
    }else if (selectedTool=='Triangle') {
        drawTriangle(e)
    }else if(selectedTool=='Eraser'){//Working for erase tool
        ctx.strokeStyle='white'
        ctx.lineTo(e.offsetX,e.offsetY)
        ctx.stroke()
    }
    // snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // previousSnapshots.push(snapshot);
};

// Start drawing on mouse down
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Continue drawing on mouse move
canvas.addEventListener('mousemove', drawing);

// Stop drawing on mouse up
canvas.addEventListener('mouseup', () => {
    previousSnapshots.push(snapshot);
	// redoSnapshots.push(snapshot)
    isDrawing = false;
});

// Draw rectangle
const drawRect=(e)=> {
    if (fillColor.checked) {
       return ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

// Draw circle
const drawCircle=(e)=> {
    ctx.beginPath()
    let radius=Math.sqrt(Math.pow(prevMouseX-e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

// Draw triangle
const drawTriangle=(e)=> {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX*2 - e.offsetX, e.offsetY)
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

var slider = document.getElementById("slider");
var output = document.getElementById("size");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

// Function to handle changing active tool
function ChangeActiveClass(id) {
    document.querySelector('.active').classList.remove('active');
    var shapeCursor = document.querySelector('.shapeCursor');
    var brushCursor = document.querySelector('.brushCursor');
    var eraseCursor = document.querySelector('.eraseCursor');
    document.getElementById(id).classList.add('active');
    if (shapeCursor != null) {
        shapeCursor.classList.remove('shapeCursor');
    }
    if (brushCursor != null) {
        brushCursor.classList.remove('brushCursor');
    }
    if (eraseCursor != null) {
        eraseCursor.classList.remove('eraseCursor');
    }
    if (id == 'Triangle' || id == 'Rectangle' || id == 'Circle') {
        document.querySelector('.board').classList.add('shapeCursor');
    } else if (id == 'Eraser') {
        document.querySelector('.board').classList.add('eraseCursor');
    } else if (id == 'brush') {
        document.querySelector('.board').classList.add('brushCursor');
    }
    selectedTool = id;
}

// Clear canvas
clearCanvas.addEventListener('click', () => {
    previousSnapshots.push(snapshot); // Store the current snapshot
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Redo action
redoButton.addEventListener('click', () => {
    if (redoSnapshots.length > 0) {
        const redoSnapshot = redoSnapshots.pop(); // Pop the last redo snapshot
        // if (redoSnapshots.length == 0) {
        //     ctx.putImageData(snapshot, 0, 0);
        //     alert(0)
        //     return;
        // }
        previousSnapshots.push(redoSnapshot); // Add the current snapshot to the undo history
        ctx.putImageData(redoSnapshot, 0, 0); // Restore the redo snapshot
        snapshot = redoSnapshot; // Set the redo snapshot as the current snapshot
    }
});

// Undo action
undoButton.addEventListener('click', () => {
    if (previousSnapshots.length > 0) {
        const previousSnapshot = previousSnapshots.pop(); // Pop the last snapshot from the undo history
        // if (previousSnapshots.length == 0) {
        //     ctx.putImageData(previousSnapshot, 0, 0);
        //     redoSnapshots.push(snapshot);
        //     // snapshot = previousSnapshot;
        //     alert(0)
        //     return;
        // }
        redoSnapshots.push(previousSnapshot); // Add the current snapshot to the redo history
        ctx.putImageData(previousSnapshot, 0, 0); // Restore the previous snapshot
        snapshot = previousSnapshot; // Set the previous snapshot as the current snapshot
    }
});

// Save canvas
save.addEventListener('click', () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.pdf`;
    link.href = canvas.toDataURL();
    link.click();
});

// Function to change drawing color
function ChangeColor(id) {
    document.querySelector('.selectedColor').classList.remove('selectedColor');
    var selectedColor = document.getElementById(id);
    selectedColor.classList.add('selectedColor');
    color = getComputedStyle(selectedColor).backgroundColor;
}
