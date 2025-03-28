// Обработчик движения курсора
document.addEventListener("mousemove", (e) => {
  const cursor = document.getElementById("custom-cursor");
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Добавляем обработчик ресайза
window.addEventListener("resize", handleResize);

function handleResize() {
  // Обновляем размер курсора
  const cursorSize = Math.min(32, window.innerWidth * 0.05);
  const cursor = document.getElementById("custom-cursor");
  if (cursor) {
    cursor.style.width = `${cursorSize}px`;
    cursor.style.height = `${cursorSize}px`;
  }

  // Другие адаптивные изменения при ресайзе
  updateElementsOnResize();
}

function updateElementsOnResize() {
  // Здесь можно добавить логику обновления других элементов при изменении размера
  // Например, пересчет позиций или размеров элементов
}

const drawingArea = document.querySelector(".drawing-area");
const brushImageSrc = "./img/kistochka.svg";
let isDrawing = false;

const image = document.getElementById("svg-image");
const originalSrc = "./img/simvol.svg";
const replacementSrc = "./img/text-simvol.svg";
const delay = 2000;

if (image) {
  image.addEventListener("click", function () {
    this.src = replacementSrc;
    setTimeout(() => {
      this.src = originalSrc;
    }, delay);
  });
}

// Предзагрузка изображения кисти
const brushImage = new Image();
brushImage.src = brushImageSrc;
brushImage.style.position = "absolute";
brushImage.style.pointerEvents = "none";

brushImage.onload = function () {
  const size = Math.min(36, window.innerWidth * 0.05);
  this.style.width = `${size}px`;
  this.style.height = `${size}px`;
  if (drawingArea) {
    drawingArea.appendChild(this);
  }
};

function getDrawingAreaCoordinates(e) {
  if (!drawingArea) return { x: 0, y: 0 };
  const rect = drawingArea.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function draw(e) {
  if (!brushImage.complete || !drawingArea) return;

  const coords = getDrawingAreaCoordinates(e);

  if (
    coords.x < 0 ||
    coords.y < 0 ||
    coords.x > drawingArea.offsetWidth ||
    coords.y > drawingArea.offsetHeight
  ) {
    return;
  }

  brushImage.style.left = coords.x - brushImage.width / 2 + "px";
  brushImage.style.top = coords.y - brushImage.height / 2 + "px";

  if (isDrawing) {
    const trail = brushImage.cloneNode(true);
    drawingArea.appendChild(trail);
  }
}

if (drawingArea) {
  drawingArea.addEventListener("mousedown", (e) => {
    isDrawing = true;
    draw(e);
  });

  drawingArea.addEventListener("mousemove", draw);

  drawingArea.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  drawingArea.addEventListener("mouseleave", () => {
    isDrawing = false;
  });
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", function () {
  handleResize(); // Инициализируем размеры элементов

  // Навигация по секциям
  const navItems = [
    { trigger: ".header-text-2", target: ".window-1" },
    { trigger: ".header-text-3", target: ".window-2" },
    { trigger: ".header-text-4", target: ".window-3" },
    { trigger: ".header-text-5", target: ".window-4" },
  ];

  navItems.forEach((item) => {
    const trigger = document.querySelector(item.trigger);
    const target = document.querySelector(item.target);

    if (trigger && target) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      trigger.style.cursor = "pointer";
    }
  });

  // Обработчики для .flo элементов
  let floElements = document.querySelectorAll(".flo");
  let window2 = document.querySelector(".window-2");

  floElements.forEach(function (flo) {
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;
    let currentX = parseFloat(flo.style.left) || 0;
    let currentY = parseFloat(flo.style.top) || 0;

    flo.addEventListener("mousedown", function (e) {
      isDragging = true;
      const rect = flo.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      // Сохраняем начальные координаты
      startX = e.clientX;
      startY = e.clientY;

      // Получаем текущие координаты из transform
      const transform = window.getComputedStyle(flo).transform;
      if (transform !== "none") {
        const matrix = new DOMMatrix(transform);
        currentX = matrix.m41;
        currentY = matrix.m42;
      }

      flo.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!isDragging) return;

      // Вычисляем новые координаты
      const newX = currentX + (e.clientX - startX);
      const newY = currentY + (e.clientY - startY);

      // Применяем transform для плавного перемещения
      flo.style.transform = `translate(${newX}px, ${newY}px)`;
    });

    document.addEventListener("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        flo.style.cursor = "grab";

        // Обновляем текущие координаты
        const transform = window.getComputedStyle(flo).transform;
        if (transform !== "none") {
          const matrix = new DOMMatrix(transform);
          currentX = matrix.m41;
          currentY = matrix.m42;
        }
      }
    });

    // Инициализация курсора
    flo.style.cursor = "grab";
  });

  // Остальной код для других перетаскиваемых элементов
  let draggableElements = document.querySelectorAll(".draggable:not(.flo)");

  draggableElements.forEach(function (element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener("mousedown", function (event) {
      isDragging = true;
      offsetX = event.clientX - element.getBoundingClientRect().left;
      offsetY = event.clientY - element.getBoundingClientRect().top;

      element.style.left = event.clientX - offsetX + "px";
      element.style.top = event.clientY - offsetY + "px";
      element.style.position = "absolute";

      function onMouseMove(event) {
        if (isDragging) {
          let x = event.clientX - offsetX;
          let y = event.clientY - offsetY;

          element.style.left = x + "px";
          element.style.top = y + "px";

          const cursor = document.getElementById("custom-cursor");
          if (cursor) {
            cursor.style.left = event.clientX + "px";
            cursor.style.top = event.clientY + "px";
          }
        }
      }

      function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      event.preventDefault();
    });
  });

  // Обработчик для кнопки "правила компании"
  const rulesButton = document.getElementById("rules-button");
  if (rulesButton) {
    rulesButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Кнопка правил компании нажата");
      makeScreenBlack();
    });
  }

  // Функция для анимации кружочков
  function animateCircles() {
    const circles = document.querySelectorAll(".circle img");

    circles.forEach((circle, index) => {
      // Задержка для каждого кружочка
      setTimeout(() => {
        // Анимация исчезновения
        circle.style.transition = "opacity 0.1s ease";
        circle.style.opacity = "0";

        // Через некоторое время возвращаем видимость
        setTimeout(() => {
          circle.style.opacity = "1";
        }, 1000);
      }, index * 300); // Задержка между анимациями кружочков
    });
  }

  // Анимация сразу
  animateCircles();

  // И затем каждые 3 секунды
  setInterval(animateCircles, 3000);
});

// Функция для кастомной плавной прокрутки
function smoothScroll(target) {
  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition;
  const duration = 800;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(
      0,
      easeInOutQuad(progress, startPosition, distance, duration)
    );
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  window.requestAnimationFrame(step);
}

// Функция для создания черного экрана
function makeScreenBlack() {
  // Создаем черный экран
  let blackScreen = document.querySelector(".black-screen");
  if (!blackScreen) {
    blackScreen = document.createElement("div");
    blackScreen.className = "black-screen";
    document.body.appendChild(blackScreen);
  }

  // Стили для черного экрана
  blackScreen.style.position = "fixed";
  blackScreen.style.top = "0";
  blackScreen.style.left = "0";
  blackScreen.style.width = "100%";
  blackScreen.style.height = "100%";
  blackScreen.style.backgroundColor = "black";
  blackScreen.style.zIndex = "9998";
  blackScreen.style.display = "block";

  // Скрыть через 3 секунды
  setTimeout(() => {
    blackScreen.style.display = "none";
  }, 3000);
}

// Обработчик для плашки "ВНИМАНИЕ"
const attentionOverlay = document.querySelector(".attention-overlay");
const closeButton = document.querySelector(".attention-close");

if (attentionOverlay && closeButton) {
  // Показываем плашку при загрузке
  attentionOverlay.style.display = "flex";

  // Закрытие по крестику
  closeButton.addEventListener("click", function () {
    attentionOverlay.style.display = "none";
  });

  // Закрытие по клику вне плашки
  attentionOverlay.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });
}
