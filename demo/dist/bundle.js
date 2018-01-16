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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Paguin__ = __webpack_require__(1);


document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector('.preview-box');
  const cutButton = document.querySelector('.button__cut');
  const nextButton = document.querySelector('.button__next');
  const previousButton = document.querySelector('.button__previous');

  let paginator;

  // --
  // Handlers
  // --
  cutButton.onclick = function () {
    paginator = new __WEBPACK_IMPORTED_MODULE_0__src_Paguin__["a" /* default */](root, root, { ignoreElements: true });
    // const currentPage = paginator.getCurrentPage()
    // root.innerHTML = currentPage.innerHTML
  };

  nextButton.onclick = function () {
    paginator.nextPage();
  };

  previousButton.onclick = function () {
    paginator.previousPage();
  };
}, false);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Paguin {
  constructor(rootElement, containerElement, options) {
    this.hiddenNodes = [];
    this.innerNodes = [];
    this.root = rootElement;
    this.container = containerElement;
    this.states = [];
    this.completed = false;
    this.currentPage = 0;
    this.totalPages = 1;
    this.ignoreElements = options.ignoreElements;
    this.ignoredList = ['dont-hide-me'];
    this.paginate();
  }

  paginate() {
    const containerRect = this.container.getBoundingClientRect();
    this.checkVisible(this.root, containerRect);
    this.hideNodes();
    this.states.push({
      visible: this.innerNodes.slice(),
      hidden: this.hiddenNodes.slice()
    });
  }

  // --
  // Main parser
  // --
  checkVisible(node, containerRect) {
    let sum = 0;
    const children = node.childNodes;

    if (node.nodeType === 3) {
      if (this.ignoreElements && this.checkClassNameContains(this.ignoredList, node.parentNode.className)) {
        return 1;
      }

      if (node.wholeText.trim() !== '') {
        const parentNodeRect = node.parentNode.getBoundingClientRect();
        if (!this.fitsIn(parentNodeRect, containerRect)) {
          this.hiddenNodes.push(node.parentNode);
          return 0;
        } else {
          this.innerNodes.push(node.parentNode);
          return 1;
        }
      } else {
        return 1;
      }
    }

    if (node.nodeType === 1) {
      if (this.getStyleValue(node, 'breakInside') === 'avoid') {
        if (this.ignoreElements && this.checkClassNameContains(this.ignoredList, node.className)) {
          return 0;
        }

        const nodeRect = node.getBoundingClientRect();
        if (!this.fitsIn(nodeRect, containerRect)) {
          this.hiddenNodes.push(node);
          return 0;
        } else {
          this.innerNodes.push(node);
          return 1;
        }
      }

      if (this.getStyleValue(node, 'display') === 'inline') {
        const parentNodeRect = node.parentNode.getBoundingClientRect();
        if (!this.fitsIn(parentNodeRect, containerRect)) return 1;
        this.innerNodes.push(node);
        return 0;
      }

      if (children.length === 0) {
        if (this.ignoreElements && this.checkClassNameContains(this.ignoredList, node.className)) {
          return 0;
        }

        if (!this.fitsIn(node.getBoundingClientRect(), containerRect)) {
          this.hiddenNodes.push(node);
          return 0;
        } else {
          this.innerNodes.push(node);
          return 1;
        }
      }
    }

    for (var i = 0; i < children.length; ++i) {
      const res = this.checkVisible(children[i], containerRect);
      sum += res;
    }

    if (sum === children.length && children.length !== 0) {
      if (this.ignoreElements && this.checkClassNameContains(this.ignoredList, node.className)) {
        return 0;
      }

      this.innerNodes.push(node);
      return 1;
    }
    return 0;
  }

  recursiveCleaner(node) {
    const children = node.childNodes;

    if (this.hiddenNodes.indexOf(node) !== -1) {
      return 0;
    }

    if (node.nodeType === 3) {
      if (node.parentNode.childNodes.length === 1) return 0;else return 1;
    }

    if (this.getStyleValue(node, 'display') === 'none') return 1;

    let sum = 0;
    for (var i = 0; i < children.length; ++i) {
      const res = this.recursiveCleaner(children[i]);
      sum += res;
    }

    if (children.length !== 0) {
      if (this.ignoreElements && this.checkClassNameContains(this.ignoredList, node.className)) {
        return 0;
      }

      if (sum === children.length) {
        node.style.display = 'none';
        return 1;
      }
    }

    return 0;
  }

  recursiveVisualisator(node) {
    const children = node.childNodes;

    if (!node.style || node.nodeType === 3) {
      return this.getStyleValue(node.parentNode, 'display') === 'none' ? 1 : 0;
    }

    if (node.nodeType === 1) {
      if (this.getStyleValue(node, 'breakInside') === 'avoid') {
        return this.getStyleValue(node, 'display') === 'none' ? 1 : 0;
      }

      if (this.getStyleValue(node, 'display') === 'inline') {
        return this.getStyleValue(node.parentNode, 'display') === 'none' ? 1 : 0;
      }

      if (children.length === 0) {
        return this.getStyleValue(node, 'display') === 'none' ? 1 : 0;
      }
    }

    let sum = 0;
    for (var i = 0; i < children.length; ++i) {
      const res = this.recursiveVisualisator(children[i]);
      sum += res;
    }

    if (children.length !== 0) {
      if (sum !== children.length) {
        node.style.display = '';
      }
    }

    return this.getStyleValue(node, 'display') === 'none' ? 1 : 0;
  }

  getStyleValue(node, field) {
    return window.getComputedStyle(node)[field];
  }

  checkClassNameContains(classes, className) {
    const splitedClasses = className.split(' ');
    return splitedClasses.some(elt => {
      return classes.indexOf(elt) !== -1;
    });
  }

  fitsIn(source, dest) {
    return source.left >= dest.left && source.left + source.width <= dest.left + dest.width && source.top >= dest.top && source.top + source.height <= dest.top + dest.height;
  }

  checkFinalElementVisible(node, containerRect) {
    const nodeRect = node.getBoundingClientRect();
    return this.fitsIn(nodeRect, containerRect);
  }

  hideNodes() {
    this.hiddenNodes.forEach(function (item, i, arr) {
      item.style.display = 'none';
    });
  }

  nextPage() {
    if (this.completed && this.currentPage === this.totalPages - 1) return null;
    ++this.currentPage;

    const containerRect = this.container.getBoundingClientRect();

    // innerNodes of previous page
    this.innerNodes.forEach(function (item, i, arr) {
      item.style.display = 'none';
    }, this);
    this.innerNodes = [];

    // hide hiddenNodes of previous page if they !fits,
    // otherwice add to new innerNodes
    let hiddenNodesTemp = [];
    this.hiddenNodes.every(function (item, i) {
      // if object is inline then we need to check it's parent
      let curItem = item;
      if (this.getStyleValue(item, 'display') === 'inline') {
        curItem = item.parentNode;
      }

      curItem.style.display = '';

      if (!this.checkFinalElementVisible(curItem, containerRect)) {
        curItem.style.display = 'none';
        hiddenNodesTemp = this.hiddenNodes.slice(i, this.hiddenNodes.length);
        return false;
      } else {
        this.innerNodes.push(curItem);
        return true;
      }
    }, this);

    this.recursiveCleaner(this.root);

    this.hiddenNodes = hiddenNodesTemp.slice();
    this.states.push({
      visible: this.innerNodes.slice(),
      hidden: this.hiddenNodes.slice()
    });

    if (!this.completed) this.totalPages++;

    if (this.hiddenNodes.length === 0) {
      this.completed = true;
    }
  }

  previousPage() {
    if (!this.currentPage) return;

    --this.currentPage;
    // load hiddenNodes and innerNodes of the current page
    this.hiddenNodes = this.states[this.currentPage].hidden;
    this.innerNodes = this.states[this.currentPage].visible;

    this.hiddenNodes.forEach(function (item, i, arr) {
      item.style.display = 'none';
    });

    this.innerNodes.forEach(function (item, i, arr) {
      item.style.display = '';
    });

    this.recursiveVisualisator(this.root);
  }

  getCurrentPage() {
    return this.root;
  }

  isComplete() {
    return this.completed;
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Paguin);

/***/ })
/******/ ]);