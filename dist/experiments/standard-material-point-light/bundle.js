/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/experiments/standard-material-point-light/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/experiments/standard-material-point-light/index.js":
/*!****************************************************************!*\
  !*** ./src/experiments/standard-material-point-light/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var SCREEN_WIDTH = window.innerWidth;\nvar SCREEN_HEIGHT = window.innerHeight;\nvar VIEW_ANGLE = 45;\nvar ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;\nvar NEAR = 1;\nvar FAR = 10000;\nvar scene;\nvar camera;\nvar renderer; // let axisHelper;\n// let gridHelper;\n\nvar orbitControls;\nvar pointLight;\nvar pointLightHelper;\nvar ambientLight;\nvar material;\nvar geometry;\nvar mesh;\nvar controls;\nvar stats;\nvar bumpTexture;\nvar textureLoader = new THREE.TextureLoader();\nvar origin = new THREE.Vector3(0, 0, 0);\n\nfunction initStats() {\n  stats = new Stats();\n  stats.domElement.style.position = 'absolute';\n  stats.domElement.style.left = '0px';\n  stats.domElement.style.top = '20px';\n  stats.setMode(0); // 0: fps, 1: ms\n\n  document.getElementById('stats').appendChild(stats.domElement);\n}\n\nfunction initControls() {\n  controls = {\n    metalness: 0,\n    roughness: 0,\n    distance: 10,\n    bumpMap: false\n  };\n  var gui = new dat.GUI();\n  gui.add(controls, 'metalness', 0, 1);\n  gui.add(controls, 'roughness', 0, 1);\n  gui.add(controls, 'distance', 10, 50);\n  gui.add(controls, 'bumpMap');\n}\n\nfunction init() {\n  scene = new THREE.Scene(); // gridHelper = new THREE.GridHelper(100, 10);\n  // scene.add(gridHelper);\n  // axisHelper = new THREE.AxisHelper(100);\n  // scene.add(axisHelper);\n\n  geometry = new THREE.BoxGeometry(100, 10, 100);\n  material = new THREE.MeshStandardMaterial({\n    color: 0xffffff\n  });\n  mesh = new THREE.Mesh(geometry, material);\n  scene.add(mesh);\n  textureLoader.load('../../assets/textures/bump/stone-001-500x500.jpg', function (texture) {\n    bumpTexture = texture;\n  });\n  ambientLight = new THREE.AmbientLight(0xffffff, 0.03);\n  scene.add(ambientLight);\n  pointLight = new THREE.PointLight(0xffffff, 1, 200);\n  scene.add(pointLight);\n  pointLightHelper = new THREE.PointLightHelper(pointLight, 1);\n  scene.add(pointLightHelper);\n  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);\n  camera.position.set(100, 100, 100);\n  camera.lookAt(origin);\n  renderer = new THREE.WebGLRenderer({\n    antialias: true\n  });\n  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);\n  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);\n  THREEx.WindowResize(renderer, camera);\n  document.body.appendChild(renderer.domElement);\n  initStats();\n  initControls();\n}\n\nfunction update() {\n  var t = new Date().getTime() / 1000;\n  var x = Math.sin(t) * controls.distance;\n  var y = controls.distance;\n  var z = Math.cos(t) * controls.distance;\n  pointLight.position.x = x;\n  pointLight.position.y = y;\n  pointLight.position.z = z;\n  material.metalness = controls.metalness;\n  material.roughness = controls.roughness;\n\n  if (controls.bumpMap && !material.bumpMap) {\n    material.bumpMap = bumpTexture;\n    material.needsUpdate = true;\n  } else if (!controls.bumpMap && material.bumpMap) {\n    material.bumpMap = null;\n    material.needsUpdate = true;\n  }\n\n  stats.update();\n  orbitControls.update();\n}\n\nfunction render() {\n  renderer.render(scene, camera);\n}\n\nfunction tick() {\n  update();\n  render();\n  requestAnimationFrame(tick);\n}\n\ninit();\ntick();\n\n//# sourceURL=webpack:///./src/experiments/standard-material-point-light/index.js?");

/***/ })

/******/ });