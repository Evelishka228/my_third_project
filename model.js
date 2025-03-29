import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.139.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.139.0/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightUniformsLib } from "RectAreaLightUniformsLib";

document.addEventListener("DOMContentLoaded", () => {
  initThree();
});

function initThree() {
  //находим контейнер
  const model = document.querySelector(".model");
  //сцена
  const scene = new THREE.Scene();
  scene.background = null;
  //создаём камеру
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.2,
    3000
  );
  camera.position.set(0, -700, 0);
  //создаём визуализатор-рендерер
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0); // Прозрачный фон
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  model.appendChild(renderer.domElement);

  //подключаем модель
  {
    const loader = new GLTFLoader();
    loader.load(
      "./honey_bee_mk4/scene.gltf",
      (gltf) => {
        scene.add(gltf.scene);
      },
      (error) => {
        console.log("Error:" + error);
      }
    );
  }
  //добавляем свет
  {
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);
  }
  {
    const light = new THREE.DirectionalLight(0x404040, 1);
    light.position.set(50, 100, 0);
    light.lookAt(100, 100, 0);
    scene.add(light);
  }
  {
    const light = new THREE.DirectionalLight(0x404040, 1);
    light.position.set(50, 100, 0);
    light.lookAt(100, 100, 0);
    scene.add(light);
  }

  //управление моделью
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 4;
  controls.maxDistance = 500;
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2.2;

  // Обработчик изменения размера окна
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Также обновляем размер контейнера модели
    const modelContainer = document.querySelector(".model");
    if (modelContainer) {
      renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
