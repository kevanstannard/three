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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 109);
/******/ })
/************************************************************************/
/******/ ({

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45;
var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
var NEAR = 1;
var FAR = 100;

var scene = void 0;
var camera = void 0;
var renderer = void 0;
var gridHelper = void 0;
var orbitControls = void 0;
var stats = void 0;

var origin = new THREE.Vector3();

function Vector3Helper(vector, color) {
  THREE.AxisHelper.call(this, 2);
  this.material.transparent = true;
  this.material.opacity = 0.5;
  //
  this.vector = vector;
  this.length = vector.length();
  this.vectorUnit = vector.clone().normalize();
  var arrow = new THREE.ArrowHelper(this.vectorUnit, origin, this.length, color);
  this.add(arrow);
}

Vector3Helper.prototype = Object.assign(Object.create(THREE.AxisHelper.prototype), {
  constructor: Vector3Helper
});

function Matrix3Helper(m) {
  THREE.AxisHelper.call(this, 2);
  this.material.transparent = true;
  this.material.opacity = 0.5;
  //
  var e = m.elements;
  this.v1 = new THREE.Vector3(e[0], e[1], e[2]);
  this.v2 = new THREE.Vector3(e[3], e[4], e[5]);
  this.v3 = new THREE.Vector3(e[6], e[7], e[8]);
  this.v1Normal = this.v1.clone().normalize();
  this.v2Normal = this.v2.clone().normalize();
  this.v3Normal = this.v3.clone().normalize();
  this.v1Arrow = new THREE.ArrowHelper(this.v1Normal, this.position, this.v1.length(), 0xff0000);
  this.v2Arrow = new THREE.ArrowHelper(this.v2Normal, this.position, this.v2.length(), 0x00ff00);
  this.v3Arrow = new THREE.ArrowHelper(this.v3Normal, this.position, this.v3.length(), 0x0000ff);
  this.add(this.v1Arrow);
  this.add(this.v2Arrow);
  this.add(this.v3Arrow);
}

Matrix3Helper.prototype = Object.assign(Object.create(THREE.AxisHelper.prototype), {
  constructor: Matrix3Helper
});

var a = new THREE.Vector3(1, 1, 1);
var aHelper = new Vector3Helper(a, 0xff00ff);

var b = new THREE.Vector3(2, 0, 2);
var bHelper = new Vector3Helper(b, 0xffff00);

var a2 = a.clone();
var b2 = b.clone();

// Project a onto b

// METHOD 1

// First we need a normal of the vector
// we are projecting onto
var bNormal = b.clone().normalize();

// The dot product of the vector with the normal
// gives us the magnitude of the projection
var dotProduct = bNormal.dot(a);

// Then we can create the projection vector
var projection = bNormal.clone();
projection.multiplyScalar(dotProduct);
var projectionHelper = new Vector3Helper(projection, 0xffffff);

console.log('Method 1', projection);

// METHOD 2

a2.projectOnVector(b2);
console.log('Method 2', a2);

// RESULTS

// Method 1 = {x: 0.9999999999999998, y: 0, z: 0.9999999999999998}
// Method 2 = {x: 1, y: 0, z: 1}
//
// Method 2 is better here.
//
// Why? Not sure.
//
// Method 1 algorithm:
//
//  bNormal = b.normalize()
//  scalar = bNormal.dot(a)
//  projection = bNormal.multiplyScalar(scalar)
//
// Method 2 algorithm:
//
//  scalar = b.dot(a) / b.lengthSq()
//  projection = b.multiplyScalar(scalar)
//

function initStats() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '20px';
  stats.setMode(0); // 0: fps, 1: ms
  document.getElementById('stats').appendChild(stats.domElement);
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(0, 4, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

  THREEx.WindowResize(renderer, camera);

  document.body.appendChild(renderer.domElement);

  initStats();

  gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;
  scene.add(gridHelper);

  scene.add(aHelper);
  scene.add(bHelper);
  scene.add(projectionHelper);
}

function update() {
  stats.update();
  orbitControls.update();
}

function render() {
  renderer.render(scene, camera);
}

function tick() {
  update();
  render();
  requestAnimationFrame(tick);
}

init();
tick();

/***/ })

/******/ });