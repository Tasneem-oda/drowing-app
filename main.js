document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("drawing-board");
  const ctx = canvas.getContext("2d");
  const clearBtn = document.getElementById("clear-btn");
  const eraserBtn = document.getElementById("eraser-btn");
  const undoBtn = document.getElementById("undo-btn");
  const redoBtn = document.getElementById("redo-btn");
  const saveBtn = document.getElementById("save-btn");
  const strokeColorInput = document.getElementById("stroke");
  const lineWidthInput = document.getElementById("line-width");
  const lineWidthValueSpan = document.getElementById("line-width-value");
  const opacityInput = document.getElementById("opacity");
  const opacityValueSpan = document.getElementById("opacity-value");

  // ضبط أبعاد اللوحة لتناسب الشاشة
  function resizeCanvas() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.putImageData(imageData, 0, 0);
    // استعادة إعدادات الرسم بعد تغيير الحجم
    ctx.strokeStyle = strokeColorInput.value;
    ctx.lineWidth = lineWidthInput.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = opacityInput.value;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // متغيرات حالة الرسم
  let isDrawing = false;
  let isErasing = false;
  let lastX = 0;
  let lastY = 0;

  // مصفوفة لحفظ حالات الرسم للتراجع والإعادة
  let history = [];
  let historyIndex = -1;

  function saveState() {
    if (historyIndex < history.length - 1) {
      history = history.slice(0, historyIndex + 1);
    }
    const imageData = canvas.toDataURL();
    history.push(imageData);
    historyIndex++;
    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
  }

  // إعدادات الرسم الافتراضية
  ctx.strokeStyle = strokeColorInput.value;
  ctx.lineWidth = lineWidthInput.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = opacityInput.value;

  saveState(); // حفظ الحالة الأولية للوحة

  // دالة لبدء الرسم
  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  // دالة للرسم
  function draw(e) {
    if (!isDrawing) return;

    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeColorInput.value;
    }

    ctx.lineWidth = lineWidthInput.value;
    ctx.globalAlpha = opacityInput.value;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  // دالة لإيقاف الرسم
  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      ctx.beginPath();
      saveState(); // حفظ الحالة بعد كل عملية رسم مكتملة
    }
  }

  // ربط الأحداث باللوحة
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // ربط أحداث الأدوات
  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  });

  eraserBtn.addEventListener("click", () => {
    isErasing = !isErasing;
    eraserBtn.classList.toggle("active", isErasing);
  });

  strokeColorInput.addEventListener("input", (e) => {
    ctx.strokeStyle = e.target.value;
    isErasing = false;
    eraserBtn.classList.remove("active");
  });

  lineWidthInput.addEventListener("input", (e) => {
    lineWidthValueSpan.textContent = e.target.value;
  });

  opacityInput.addEventListener("input", (e) => {
    ctx.globalAlpha = e.target.value;
    opacityValueSpan.textContent = e.target.value;
  });

  // منطق التراجع
  undoBtn.addEventListener("click", () => {
    if (historyIndex > 0) {
      historyIndex--;
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        updateUndoRedoButtons();
      };
      image.src = history[historyIndex];
    }
  });

  // منطق الإعادة
  redoBtn.addEventListener("click", () => {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        updateUndoRedoButtons();
      };
      image.src = history[historyIndex];
    }
  });

  // منطق حفظ الصورة
  saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
