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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__template__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__listTemplateManager__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__list_templates__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_debounce__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_debounce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_debounce__);







class Typeahead{
    /**
     * A constructor of the Typeahead class
     * 
     * @constructor
     * @param {HTMLElement} el 
     * 
     */
    constructor(el){
      this.el = el;
      this.attributes  = this.setAttributesObject(el.attributes);
      if(this.attributes.url){
        this.initialize();
      }
    }

    /**
     * Converts the Map of the element attributes to a simple 
     * object literal which can be easely reffered in the class
     * 
     * @param {NodeMap} attributes 
     * @returns Object 
     */
    setAttributesObject(attributes){
        let attributesObject = {};
        for(let i = 0; i < attributes.length; i++){
           let attributeName = Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* dashToCamelCase */])(attributes[i].nodeName); 
           attributesObject[attributeName] = attributes[i].value;
        }
        return attributesObject;
    }

    /** 
       returns an istantiated HtmlElement containing the tempalte for the typeahead
       consisting of a label (if provided), a text input and an unordered list

       @param {String} label - the label before the text input
       @returns {Function} mainTemplate
    */
    createTemplate(label){
        return Object(__WEBPACK_IMPORTED_MODULE_0__template__["a" /* default */])(label);
    }

    /**
     * sets the events on which the text input should react
     * 
     * @param {HtmlElement} input;
     * @returns void
     */
    setInputEvents(input){
        if(this.attributes.url){
            input.addEventListener('keyup',__WEBPACK_IMPORTED_MODULE_4_lodash_debounce___default()(event=> this.searchHandler(event)(this),100),false);
            input.addEventListener('focus',ev=>this.searchHandler(ev)(this),false);
        }
        input.addEventListener('blur',ev => {
            this.listManager.hide();
            this.input.value === '' && this.el.setAttribute('class',this.el.getAttribute('class').replace('focused',''));
        },true);
    }

    /**
     * A closure implementation of the keyup and focus event triggered by the input
     * 
     * @param {Event} event 
     * @returns {Function}
     */
    searchHandler(event){
        return function(scope){
            let query = event.target.value;
                let symbolCount = scope.attributes.minSymbols || 3;
                if(query.length >= symbolCount){
                    scope.search(query)
                }else{
                    scope.listManager.hide();
                }

                scope.el.setAttribute('class','focused');
        }
    }

    /**
     * makes an ajax request to the url (this.attributes.url)
     * and when it takes recieves the resulting JSON it calls 
     * the mapToListItemInterface method.
     * 
     * @param {String} query 
     * @returns void
     *
     */
    search(query){   
        if(this.attributes.url){
            fetch(this.attributes.url+query)
            .then(res=> res.ok ? res.json() : null, err => this.listManager.close)
            .then((result)=>{
                if(this.onResultsRecievedHandler){
                    this.onResultsRecievedHandler(result,this);
                    return;
                }
                if(!result){
                    this.listManager.hide();
                    return;
                };
                let resultList = this.mapToListItemInterface(result);
                if(!resultList){
                    this.listManager.hide();
                    return;
                }
                
                this.listManager.render(resultList,this.listTemplate);
            },err=>this.listManager.close)
        }
    }

    /**
     *  
     * Accepts as a parameter array or object.
     * Since we we are looking for an API that would list things the 
     * resultObject could be be an object but it would contain the list
     * like {wrapper:{object:[{listitems,listitems,listitems}]}}, 
     * so we check if its only an array or not.
     * If it is not an array we find the array by calling the getValueFromObjectPath
     * whith the value of the listWrapper attribute e.g. 'wrapper.object' and the result 
     * object which would return only the [{listitems,listitems,listitems}] part of 
     * its object.
     * Then we iterate over the array and with the help of the 
     * pathToTitle attribute we find the value we have to show as title and we do the same for
     * pathToSubtitle, and pathToImage and generate new array which contains objects with the 
     * following structure:
     * {title, subtitle, picture}
     * 
     * @param {Array,Object} resultObject 
     */
    mapToListItemInterface(resultObject){
        let list;
        if(Array.isArray(resultObject)){
            list = resultObject;
        }else{
            list = Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getValueFromObjectPath */])(this.attributes.listWrapper,resultObject);
        }
        if(!list || list.length === 0) return null;
        
        return list.map((item)=>{
            let obj = {};
            if(this.attributes.pathToTitle){
                obj.title = Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getValueFromObjectPath */])(this.attributes.pathToTitle,item);
            }
            if(this.attributes.pathToSubtitle){
                obj.subtitle =  Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getValueFromObjectPath */])(this.attributes.pathToSubtitle,item);
            }
            if(this.attributes.pathToImage){
                obj.image = Object(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getValueFromObjectPath */])(this.attributes.pathToImage,item);
            }
            return obj;
        });
    }

    /**
     * 
     * 
     * @param {Function | null} template - it shoudl be a function returning 
     * an with strings as params, returnning HTML string, if the param is null
     * then it is going to figure out which template to set based on what the 
     * pathToTitle, pathToImage and pathToImageParams are
     * 
     * Sets the list template
     * In case that the setListTemplate(template) is called from outside this class
     * it is going to return "this" to allow method chaining 
     * 
     */
    setListTemplate(template){
        if(template){
            this.listTemplate = template;
            return this;
        }else{
            if(this.attributes.pathToTitle && !this.attributes.pathToSubtitle && !this.attributes.pathToImage){
                this.listTemplate = __WEBPACK_IMPORTED_MODULE_3__list_templates__["a" /* titleOnly */]
            }
            if(this.attributes.pathToTitle && this.attributes.pathToSubtitle && !this.attributes.pathToImage){
                this.listTemplate = __WEBPACK_IMPORTED_MODULE_3__list_templates__["b" /* titleSubtitle */];
            }    
            if(this.attributes.pathToTitle && this.attributes.pathToSubtitle && this.attributes.pathToImage){
                this.listTemplate = __WEBPACK_IMPORTED_MODULE_3__list_templates__["c" /* titleSubtitleImage */];
            }        
        }
    }

    /**
     * Sets the list template
     * @param {String} template 
     */
    setUrl(url){
        this.attributes.url = url;
        return this;
    }

    setLabel(label){
        this.attributes.label = label;
        return this;
    }
    /**
     * Method to initialize the class. It is not in the constructor to allow 
     * overriding calls and finally to call initialize
     * 
     */
    initialize(){
        this.template = this.createTemplate(this.attributes.label);
        this.input = this.template.querySelector('input');
        this.list = this.template.querySelector('ul');
        this.setListTemplate();
        this.setInputEvents(this.input);
        this.setListManager();
        this.template.addEventListener('itemClicked',(ev)=>{
            
            this.input.value = ev.detail.value;
            this.listManager.hide();
            this.onItemClickedHandler && this.onItemClickedHandler(ev.detail.value);
        });
        this.el.appendChild(this.template);
        return this;
    }

    /**
     * A callback called when the results are recieced from the Ajax call
     * @param {Function} callback 
     */
    onResultsRecieved(callback){
        this.onResultsRecievedHandler = callback;
        return this;
    }
    /**
     * 
     * @param {TypeaheadListManager instance} listManager 
     */
    setListManager(listManager){
        this.listManager = new __WEBPACK_IMPORTED_MODULE_2__listTemplateManager__["a" /* default */](this.list);
        return this;
    }
    /** Sets a callback when an listItem is clicked */
    onItemClicked(callback){
        this.onItemClickedHandler = callback;
        return this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Typeahead;




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * A class that manages the behaviour of the result list in the ul element
 */
class TypeaheadListManager{
    /**
     * Initializes the class and sets an "el" property 
     * which is the root of the list e.g. ul
     * 
     * @constructor
     * @param {HTMLElement} listElement 
     */
    constructor(listElement){
        this.el = listElement;
    }

    /**
     * Renders the results in the ul 
     * 
     * @param {Array} resultList 
     * @param {Function} template A template function that returns html
     * @return void
     */
    render(resultList,template){
        this.hide();
        const html = resultList.map((item)=>{
            return template(item.title, item.subtitle,item.image);
        }).join('');
        this.el.innerHTML = html;
        this.setEvents();
    }
    /**
     * Removes the events of the all the children of the ul 
     * and sets the html content of the ul to an empty string
     * 
     * @return void
     */
    hide(){
        const listElements = this.el.childNodes;
        for(let i = 0; i < listElements.length; i++){
            listElements[i].removeEventListener('click',this.onItemClickedEvent);
        }
        this.el.innerHTML = '';
    }

    /**
     * sets the onItemClickedEvetn (passed from the TypeAhead class) to each of the newly 
     * created children of the ul element
     * 
     * @return void
     */
    setEvents(){
        const listElements = this.el.childNodes;
        for(let i = 0; i < listElements.length; i++){
            listElements[i].addEventListener('mousedown',this.onItemClickedEvent,true);
        }
    }

    /**
     * 
     * Sends a custom event up the dom with the title of the selected item title
     * 
     * @param {Event} callback 
     */
     onItemClickedEvent(ev){
        let title = getDataTitle(ev.target);
        const event =  new CustomEvent('itemClicked',{
            bubbles:true,
            cancelable: false,
            detail:{
                value:title}
            });
        ev.target.dispatchEvent(event);

        function getDataTitle(element){
            const dataTitle = element.getAttribute('data-title');
                if(dataTitle){
                    return dataTitle
                }else{
                    return getDataTitle(element.parentElement);
                }
        }
     }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TypeaheadListManager;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__typeahead__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__typeahead_js_typeahead__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__typeahead_js_listTemplateManager__ = __webpack_require__(1);




const selectedAddress = document.getElementById('selected-address');
let renderer = new __WEBPACK_IMPORTED_MODULE_2__typeahead_js_listTemplateManager__["a" /* default */]();
//the custom listItemTempalte function
//this function must contain as parameters title and/or subtitle and/or image
/**
 also the root element of the list item should contain  data-title="${title}"
 so we can get the title string and put it as a value of the input
*/
let listItemTemplate = title => `<div class="custom-template" data-title="${title}"><span class="title">${title}</span></div>`;

//initiate a type ahead manualy by querying the element
let manualTypeahead = new __WEBPACK_IMPORTED_MODULE_1__typeahead_js_typeahead__["a" /* default */](document.getElementById('manual-typeahead'))
    //set the url for the ajax data request
    .setUrl('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCjm_5NIX5Jr_PGFVO5Te3EHYFPpPG26Qw&address=')
    //set the input label if desired
    .setLabel('Search Addres:')
    //callback when the results from the search are recieved
    //here we can get the listManager instance from the TypeAhead class instance e.g instance.listManager
    //format the data from the resultList as we wish 
    //and invoke the render method of the list manager and show the results
    .onResultsRecieved((resultList,instance)=>{
        let formatted  = resultList.results.map((item)=>{return {title:item.formatted_address}});
        instance.listManager.render(formatted,listItemTemplate);
    })
    .onItemClicked((value)=>{
        selectedAddress.innerHTML = "Selected address: <strong>"+value+"</strong>";
    })
    .initialize();


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_typeahead__ = __webpack_require__(0);

let elements = document.querySelectorAll('typeahead');
elements.forEach((el)=>{
    new __WEBPACK_IMPORTED_MODULE_0__js_typeahead__["a" /* default */](el);
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mainTemplate;
/**
 * Creates an instance of an HTMLElement containing the input, label and ul element
 * of the typeahead
 * 
 * @param {String | null} label the label of the search input if such is desired
 * @returns {HTMLElement} container
 */
function mainTemplate(label){
    const container = document.createElement('div');
    container.setAttribute('class','typeahead');
    
    if(label){
        const elementLabel = document.createElement('label');
        elementLabel.innerText = label;
        container.appendChild(elementLabel);
    }
    const input = document.createElement('input');
    input.setAttribute('class','form-control');

    const resultList = document.createElement('ul');
    resultList.setAttribute('class','result-list list-group');

    container.appendChild(input);
    container.appendChild(resultList);
    return container;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = dashToCamelCase;
/* harmony export (immutable) */ __webpack_exports__["b"] = getValueFromObjectPath;
/**
 * Transforms a "string" to "String"
 * @param {String} string 
 * @returns {String}
 */
const toUpperFirstCase = function(string){
    return [string.charAt(0).toUpperCase(),string.slice(1)].join('');
}

/**
 * Transforms "this-string" to "thisString" or
 * this-long-attribute-name to "thisLongAttributeName"
 * @param {String} string 
 * @return {String}
 */
function dashToCamelCase(string){
    let split = string.split('-');
    let array = [];
    if(split.length > 1){
        return split.map((item,index)=>{
            if(index > 0){
                return toUpperFirstCase(item);
            }else{
                return item;
            }
        }).join('');
    }else{
      return string;
    }
}

/**
 * It takes a map to an subobject in a literal e.g. "my.nested.object"
 * and an object literal eg. "{my:{nested:{object:"something"}}"
 * and returns the value of the subobject e.g. "something"
 * 
 * @param {Strins} objectPath 
 * @param {Obejct} object
 * @return {*}
 */

function getValueFromObjectPath(objectPath,object){
    if(!objectPath) return object;
    var path = objectPath.split('.');
    var value = getValue(object,path);
    
    function getValue(obj,path){
        if(path.length === 0){
            return obj;
        }else{
          return obj ? getValue(obj[path.splice(0,1)],path) : null
        }
    }

    return value;
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const titleOnly = (title) => {
   return `<button class="typeahead-list-item title-only list-group-item" data-title="${title}">
       <div class="title strong"><strong data-title>${title}</strong></div>
    </button>`;
}
/* harmony export (immutable) */ __webpack_exports__["a"] = titleOnly;


const titleSubtitle = (title,subtitle) => {
    return `<button class="typeahead-list-item title-subtitle list-group-item" data-title="${title}">
        <div class="title"><strong>${title}</strong></div>
        <div class="subtitle">${subtitle}</div>
    </button>`;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = titleSubtitle;


const titleSubtitleImage = (title,subtitle,image) => {
    return `<button class="typeahead-list-item title-subtitle-image list-group-item" data-title="${title}">
        <div clas="row">
            <div class="col-xs-2 image-holder">
                <img class="img-fluid img-thumbnail rounded mx-auto d-block" src='${image}'/>
            </div>
            <div class="col-xs-10 text-holder">
                <div class="title"><strong>${title}</strong></div>
                <div class="subtitle">${subtitle}</div>
            </div>
        </div>
</button>`
};
/* harmony export (immutable) */ __webpack_exports__["c"] = titleSubtitleImage;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjM3YjcxNTEwY2NkZDM1Y2UyZjIiLCJ3ZWJwYWNrOi8vLy4vdHlwZWFoZWFkL2pzL3R5cGVhaGVhZC5qcyIsIndlYnBhY2s6Ly8vLi90eXBlYWhlYWQvanMvbGlzdFRlbXBsYXRlTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi90eXBlYWhlYWQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdHlwZWFoZWFkL2pzL3RlbXBsYXRlLmpzIiwid2VicGFjazovLy8uL3R5cGVhaGVhZC9qcy9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL3R5cGVhaGVhZC9qcy9saXN0LXRlbXBsYXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQzdEQTtBQUNnRDtBQUNoRDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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a0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3hYQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjM3YjcxNTEwY2NkZDM1Y2UyZjIiLCJpbXBvcnQgbWFpblRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnO1xuaW1wb3J0IHtkYXNoVG9DYW1lbENhc2UsIGdldFZhbHVlRnJvbU9iamVjdFBhdGh9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgVHlwZWFoZWFkTGlzdE1hbmFnZXIgZnJvbSAnLi9saXN0VGVtcGxhdGVNYW5hZ2VyJztcbmltcG9ydCAqIGFzIGxpc3RUZW1wbGF0ZXMgZnJvbSAnLi9saXN0LXRlbXBsYXRlcyc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoLmRlYm91bmNlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUeXBlYWhlYWR7XG4gICAgLyoqXG4gICAgICogQSBjb25zdHJ1Y3RvciBvZiB0aGUgVHlwZWFoZWFkIGNsYXNzXG4gICAgICogXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgXG4gICAgICogXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZWwpe1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy5hdHRyaWJ1dGVzICA9IHRoaXMuc2V0QXR0cmlidXRlc09iamVjdChlbC5hdHRyaWJ1dGVzKTtcbiAgICAgIGlmKHRoaXMuYXR0cmlidXRlcy51cmwpe1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGUgTWFwIG9mIHRoZSBlbGVtZW50IGF0dHJpYnV0ZXMgdG8gYSBzaW1wbGUgXG4gICAgICogb2JqZWN0IGxpdGVyYWwgd2hpY2ggY2FuIGJlIGVhc2VseSByZWZmZXJlZCBpbiB0aGUgY2xhc3NcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge05vZGVNYXB9IGF0dHJpYnV0ZXMgXG4gICAgICogQHJldHVybnMgT2JqZWN0IFxuICAgICAqL1xuICAgIHNldEF0dHJpYnV0ZXNPYmplY3QoYXR0cmlidXRlcyl7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzT2JqZWN0ID0ge307XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgbGV0IGF0dHJpYnV0ZU5hbWUgPSBkYXNoVG9DYW1lbENhc2UoYXR0cmlidXRlc1tpXS5ub2RlTmFtZSk7IFxuICAgICAgICAgICBhdHRyaWJ1dGVzT2JqZWN0W2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlc1tpXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc09iamVjdDtcbiAgICB9XG5cbiAgICAvKiogXG4gICAgICAgcmV0dXJucyBhbiBpc3RhbnRpYXRlZCBIdG1sRWxlbWVudCBjb250YWluaW5nIHRoZSB0ZW1wYWx0ZSBmb3IgdGhlIHR5cGVhaGVhZFxuICAgICAgIGNvbnNpc3Rpbmcgb2YgYSBsYWJlbCAoaWYgcHJvdmlkZWQpLCBhIHRleHQgaW5wdXQgYW5kIGFuIHVub3JkZXJlZCBsaXN0XG5cbiAgICAgICBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSB0aGUgbGFiZWwgYmVmb3JlIHRoZSB0ZXh0IGlucHV0XG4gICAgICAgQHJldHVybnMge0Z1bmN0aW9ufSBtYWluVGVtcGxhdGVcbiAgICAqL1xuICAgIGNyZWF0ZVRlbXBsYXRlKGxhYmVsKXtcbiAgICAgICAgcmV0dXJuIG1haW5UZW1wbGF0ZShsYWJlbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0cyB0aGUgZXZlbnRzIG9uIHdoaWNoIHRoZSB0ZXh0IGlucHV0IHNob3VsZCByZWFjdFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7SHRtbEVsZW1lbnR9IGlucHV0O1xuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBzZXRJbnB1dEV2ZW50cyhpbnB1dCl7XG4gICAgICAgIGlmKHRoaXMuYXR0cmlidXRlcy51cmwpe1xuICAgICAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLGRlYm91bmNlKGV2ZW50PT4gdGhpcy5zZWFyY2hIYW5kbGVyKGV2ZW50KSh0aGlzKSwxMDApLGZhbHNlKTtcbiAgICAgICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJyxldj0+dGhpcy5zZWFyY2hIYW5kbGVyKGV2KSh0aGlzKSxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsZXYgPT4ge1xuICAgICAgICAgICAgdGhpcy5saXN0TWFuYWdlci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID09PSAnJyAmJiB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnJlcGxhY2UoJ2ZvY3VzZWQnLCcnKSk7XG4gICAgICAgIH0sdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBjbG9zdXJlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBrZXl1cCBhbmQgZm9jdXMgZXZlbnQgdHJpZ2dlcmVkIGJ5IHRoZSBpbnB1dFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBzZWFyY2hIYW5kbGVyKGV2ZW50KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlKXtcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgICAgICBsZXQgc3ltYm9sQ291bnQgPSBzY29wZS5hdHRyaWJ1dGVzLm1pblN5bWJvbHMgfHwgMztcbiAgICAgICAgICAgICAgICBpZihxdWVyeS5sZW5ndGggPj0gc3ltYm9sQ291bnQpe1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWFyY2gocXVlcnkpXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmxpc3RNYW5hZ2VyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS5lbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnZm9jdXNlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFrZXMgYW4gYWpheCByZXF1ZXN0IHRvIHRoZSB1cmwgKHRoaXMuYXR0cmlidXRlcy51cmwpXG4gICAgICogYW5kIHdoZW4gaXQgdGFrZXMgcmVjaWV2ZXMgdGhlIHJlc3VsdGluZyBKU09OIGl0IGNhbGxzIFxuICAgICAqIHRoZSBtYXBUb0xpc3RJdGVtSW50ZXJmYWNlIG1ldGhvZC5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqXG4gICAgICovXG4gICAgc2VhcmNoKHF1ZXJ5KXsgICBcbiAgICAgICAgaWYodGhpcy5hdHRyaWJ1dGVzLnVybCl7XG4gICAgICAgICAgICBmZXRjaCh0aGlzLmF0dHJpYnV0ZXMudXJsK3F1ZXJ5KVxuICAgICAgICAgICAgLnRoZW4ocmVzPT4gcmVzLm9rID8gcmVzLmpzb24oKSA6IG51bGwsIGVyciA9PiB0aGlzLmxpc3RNYW5hZ2VyLmNsb3NlKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCk9PntcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uUmVzdWx0c1JlY2lldmVkSGFuZGxlcil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25SZXN1bHRzUmVjaWV2ZWRIYW5kbGVyKHJlc3VsdCx0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZighcmVzdWx0KXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0TWFuYWdlci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHRMaXN0ID0gdGhpcy5tYXBUb0xpc3RJdGVtSW50ZXJmYWNlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgaWYoIXJlc3VsdExpc3Qpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RNYW5hZ2VyLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RNYW5hZ2VyLnJlbmRlcihyZXN1bHRMaXN0LHRoaXMubGlzdFRlbXBsYXRlKTtcbiAgICAgICAgICAgIH0sZXJyPT50aGlzLmxpc3RNYW5hZ2VyLmNsb3NlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIFxuICAgICAqIEFjY2VwdHMgYXMgYSBwYXJhbWV0ZXIgYXJyYXkgb3Igb2JqZWN0LlxuICAgICAqIFNpbmNlIHdlIHdlIGFyZSBsb29raW5nIGZvciBhbiBBUEkgdGhhdCB3b3VsZCBsaXN0IHRoaW5ncyB0aGUgXG4gICAgICogcmVzdWx0T2JqZWN0IGNvdWxkIGJlIGJlIGFuIG9iamVjdCBidXQgaXQgd291bGQgY29udGFpbiB0aGUgbGlzdFxuICAgICAqIGxpa2Uge3dyYXBwZXI6e29iamVjdDpbe2xpc3RpdGVtcyxsaXN0aXRlbXMsbGlzdGl0ZW1zfV19fSwgXG4gICAgICogc28gd2UgY2hlY2sgaWYgaXRzIG9ubHkgYW4gYXJyYXkgb3Igbm90LlxuICAgICAqIElmIGl0IGlzIG5vdCBhbiBhcnJheSB3ZSBmaW5kIHRoZSBhcnJheSBieSBjYWxsaW5nIHRoZSBnZXRWYWx1ZUZyb21PYmplY3RQYXRoXG4gICAgICogd2hpdGggdGhlIHZhbHVlIG9mIHRoZSBsaXN0V3JhcHBlciBhdHRyaWJ1dGUgZS5nLiAnd3JhcHBlci5vYmplY3QnIGFuZCB0aGUgcmVzdWx0IFxuICAgICAqIG9iamVjdCB3aGljaCB3b3VsZCByZXR1cm4gb25seSB0aGUgW3tsaXN0aXRlbXMsbGlzdGl0ZW1zLGxpc3RpdGVtc31dIHBhcnQgb2YgXG4gICAgICogaXRzIG9iamVjdC5cbiAgICAgKiBUaGVuIHdlIGl0ZXJhdGUgb3ZlciB0aGUgYXJyYXkgYW5kIHdpdGggdGhlIGhlbHAgb2YgdGhlIFxuICAgICAqIHBhdGhUb1RpdGxlIGF0dHJpYnV0ZSB3ZSBmaW5kIHRoZSB2YWx1ZSB3ZSBoYXZlIHRvIHNob3cgYXMgdGl0bGUgYW5kIHdlIGRvIHRoZSBzYW1lIGZvclxuICAgICAqIHBhdGhUb1N1YnRpdGxlLCBhbmQgcGF0aFRvSW1hZ2UgYW5kIGdlbmVyYXRlIG5ldyBhcnJheSB3aGljaCBjb250YWlucyBvYmplY3RzIHdpdGggdGhlIFxuICAgICAqIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gICAgICoge3RpdGxlLCBzdWJ0aXRsZSwgcGljdHVyZX1cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0FycmF5LE9iamVjdH0gcmVzdWx0T2JqZWN0IFxuICAgICAqL1xuICAgIG1hcFRvTGlzdEl0ZW1JbnRlcmZhY2UocmVzdWx0T2JqZWN0KXtcbiAgICAgICAgbGV0IGxpc3Q7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkocmVzdWx0T2JqZWN0KSl7XG4gICAgICAgICAgICBsaXN0ID0gcmVzdWx0T2JqZWN0O1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxpc3QgPSBnZXRWYWx1ZUZyb21PYmplY3RQYXRoKHRoaXMuYXR0cmlidXRlcy5saXN0V3JhcHBlcixyZXN1bHRPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCFsaXN0IHx8IGxpc3QubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBsaXN0Lm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0cmlidXRlcy5wYXRoVG9UaXRsZSl7XG4gICAgICAgICAgICAgICAgb2JqLnRpdGxlID0gZ2V0VmFsdWVGcm9tT2JqZWN0UGF0aCh0aGlzLmF0dHJpYnV0ZXMucGF0aFRvVGl0bGUsaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLmF0dHJpYnV0ZXMucGF0aFRvU3VidGl0bGUpe1xuICAgICAgICAgICAgICAgIG9iai5zdWJ0aXRsZSA9ICBnZXRWYWx1ZUZyb21PYmplY3RQYXRoKHRoaXMuYXR0cmlidXRlcy5wYXRoVG9TdWJ0aXRsZSxpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMuYXR0cmlidXRlcy5wYXRoVG9JbWFnZSl7XG4gICAgICAgICAgICAgICAgb2JqLmltYWdlID0gZ2V0VmFsdWVGcm9tT2JqZWN0UGF0aCh0aGlzLmF0dHJpYnV0ZXMucGF0aFRvSW1hZ2UsaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uIHwgbnVsbH0gdGVtcGxhdGUgLSBpdCBzaG91ZGwgYmUgYSBmdW5jdGlvbiByZXR1cm5pbmcgXG4gICAgICogYW4gd2l0aCBzdHJpbmdzIGFzIHBhcmFtcywgcmV0dXJubmluZyBIVE1MIHN0cmluZywgaWYgdGhlIHBhcmFtIGlzIG51bGxcbiAgICAgKiB0aGVuIGl0IGlzIGdvaW5nIHRvIGZpZ3VyZSBvdXQgd2hpY2ggdGVtcGxhdGUgdG8gc2V0IGJhc2VkIG9uIHdoYXQgdGhlIFxuICAgICAqIHBhdGhUb1RpdGxlLCBwYXRoVG9JbWFnZSBhbmQgcGF0aFRvSW1hZ2VQYXJhbXMgYXJlXG4gICAgICogXG4gICAgICogU2V0cyB0aGUgbGlzdCB0ZW1wbGF0ZVxuICAgICAqIEluIGNhc2UgdGhhdCB0aGUgc2V0TGlzdFRlbXBsYXRlKHRlbXBsYXRlKSBpcyBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoaXMgY2xhc3NcbiAgICAgKiBpdCBpcyBnb2luZyB0byByZXR1cm4gXCJ0aGlzXCIgdG8gYWxsb3cgbWV0aG9kIGNoYWluaW5nIFxuICAgICAqIFxuICAgICAqL1xuICAgIHNldExpc3RUZW1wbGF0ZSh0ZW1wbGF0ZSl7XG4gICAgICAgIGlmKHRlbXBsYXRlKXtcbiAgICAgICAgICAgIHRoaXMubGlzdFRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZih0aGlzLmF0dHJpYnV0ZXMucGF0aFRvVGl0bGUgJiYgIXRoaXMuYXR0cmlidXRlcy5wYXRoVG9TdWJ0aXRsZSAmJiAhdGhpcy5hdHRyaWJ1dGVzLnBhdGhUb0ltYWdlKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RUZW1wbGF0ZSA9IGxpc3RUZW1wbGF0ZXMudGl0bGVPbmx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLmF0dHJpYnV0ZXMucGF0aFRvVGl0bGUgJiYgdGhpcy5hdHRyaWJ1dGVzLnBhdGhUb1N1YnRpdGxlICYmICF0aGlzLmF0dHJpYnV0ZXMucGF0aFRvSW1hZ2Upe1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFRlbXBsYXRlID0gbGlzdFRlbXBsYXRlcy50aXRsZVN1YnRpdGxlO1xuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0cmlidXRlcy5wYXRoVG9UaXRsZSAmJiB0aGlzLmF0dHJpYnV0ZXMucGF0aFRvU3VidGl0bGUgJiYgdGhpcy5hdHRyaWJ1dGVzLnBhdGhUb0ltYWdlKXtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RUZW1wbGF0ZSA9IGxpc3RUZW1wbGF0ZXMudGl0bGVTdWJ0aXRsZUltYWdlO1xuICAgICAgICAgICAgfSAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsaXN0IHRlbXBsYXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIFxuICAgICAqL1xuICAgIHNldFVybCh1cmwpe1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMudXJsID0gdXJsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRMYWJlbChsYWJlbCl7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcy5sYWJlbCA9IGxhYmVsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHRvIGluaXRpYWxpemUgdGhlIGNsYXNzLiBJdCBpcyBub3QgaW4gdGhlIGNvbnN0cnVjdG9yIHRvIGFsbG93IFxuICAgICAqIG92ZXJyaWRpbmcgY2FsbHMgYW5kIGZpbmFsbHkgdG8gY2FsbCBpbml0aWFsaXplXG4gICAgICogXG4gICAgICovXG4gICAgaW5pdGlhbGl6ZSgpe1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5jcmVhdGVUZW1wbGF0ZSh0aGlzLmF0dHJpYnV0ZXMubGFiZWwpO1xuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy50ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLnRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG4gICAgICAgIHRoaXMuc2V0TGlzdFRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMuc2V0SW5wdXRFdmVudHModGhpcy5pbnB1dCk7XG4gICAgICAgIHRoaXMuc2V0TGlzdE1hbmFnZXIoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5hZGRFdmVudExpc3RlbmVyKCdpdGVtQ2xpY2tlZCcsKGV2KT0+e1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gZXYuZGV0YWlsLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5saXN0TWFuYWdlci5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLm9uSXRlbUNsaWNrZWRIYW5kbGVyICYmIHRoaXMub25JdGVtQ2xpY2tlZEhhbmRsZXIoZXYuZGV0YWlsLnZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy50ZW1wbGF0ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHJlc3VsdHMgYXJlIHJlY2llY2VkIGZyb20gdGhlIEFqYXggY2FsbFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFxuICAgICAqL1xuICAgIG9uUmVzdWx0c1JlY2lldmVkKGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5vblJlc3VsdHNSZWNpZXZlZEhhbmRsZXIgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7VHlwZWFoZWFkTGlzdE1hbmFnZXIgaW5zdGFuY2V9IGxpc3RNYW5hZ2VyIFxuICAgICAqL1xuICAgIHNldExpc3RNYW5hZ2VyKGxpc3RNYW5hZ2VyKXtcbiAgICAgICAgdGhpcy5saXN0TWFuYWdlciA9IG5ldyBUeXBlYWhlYWRMaXN0TWFuYWdlcih0aGlzLmxpc3QpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqIFNldHMgYSBjYWxsYmFjayB3aGVuIGFuIGxpc3RJdGVtIGlzIGNsaWNrZWQgKi9cbiAgICBvbkl0ZW1DbGlja2VkKGNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5vbkl0ZW1DbGlja2VkSGFuZGxlciA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHlwZWFoZWFkL2pzL3R5cGVhaGVhZC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIEEgY2xhc3MgdGhhdCBtYW5hZ2VzIHRoZSBiZWhhdmlvdXIgb2YgdGhlIHJlc3VsdCBsaXN0IGluIHRoZSB1bCBlbGVtZW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFR5cGVhaGVhZExpc3RNYW5hZ2Vye1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBjbGFzcyBhbmQgc2V0cyBhbiBcImVsXCIgcHJvcGVydHkgXG4gICAgICogd2hpY2ggaXMgdGhlIHJvb3Qgb2YgdGhlIGxpc3QgZS5nLiB1bFxuICAgICAqIFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGxpc3RFbGVtZW50IFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGxpc3RFbGVtZW50KXtcbiAgICAgICAgdGhpcy5lbCA9IGxpc3RFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhlIHJlc3VsdHMgaW4gdGhlIHVsIFxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHJlc3VsdExpc3QgXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdGVtcGxhdGUgQSB0ZW1wbGF0ZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgaHRtbFxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHJlbmRlcihyZXN1bHRMaXN0LHRlbXBsYXRlKXtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIGNvbnN0IGh0bWwgPSByZXN1bHRMaXN0Lm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShpdGVtLnRpdGxlLCBpdGVtLnN1YnRpdGxlLGl0ZW0uaW1hZ2UpO1xuICAgICAgICB9KS5qb2luKCcnKTtcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBldmVudHMgb2YgdGhlIGFsbCB0aGUgY2hpbGRyZW4gb2YgdGhlIHVsIFxuICAgICAqIGFuZCBzZXRzIHRoZSBodG1sIGNvbnRlbnQgb2YgdGhlIHVsIHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgICAqIFxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGhpZGUoKXtcbiAgICAgICAgY29uc3QgbGlzdEVsZW1lbnRzID0gdGhpcy5lbC5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbGlzdEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGxpc3RFbGVtZW50c1tpXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsdGhpcy5vbkl0ZW1DbGlja2VkRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2V0cyB0aGUgb25JdGVtQ2xpY2tlZEV2ZXRuIChwYXNzZWQgZnJvbSB0aGUgVHlwZUFoZWFkIGNsYXNzKSB0byBlYWNoIG9mIHRoZSBuZXdseSBcbiAgICAgKiBjcmVhdGVkIGNoaWxkcmVuIG9mIHRoZSB1bCBlbGVtZW50XG4gICAgICogXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0RXZlbnRzKCl7XG4gICAgICAgIGNvbnN0IGxpc3RFbGVtZW50cyA9IHRoaXMuZWwuY2hpbGROb2RlcztcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGxpc3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBsaXN0RWxlbWVudHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyx0aGlzLm9uSXRlbUNsaWNrZWRFdmVudCx0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFxuICAgICAqIFNlbmRzIGEgY3VzdG9tIGV2ZW50IHVwIHRoZSBkb20gd2l0aCB0aGUgdGl0bGUgb2YgdGhlIHNlbGVjdGVkIGl0ZW0gdGl0bGVcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBjYWxsYmFjayBcbiAgICAgKi9cbiAgICAgb25JdGVtQ2xpY2tlZEV2ZW50KGV2KXtcbiAgICAgICAgbGV0IHRpdGxlID0gZ2V0RGF0YVRpdGxlKGV2LnRhcmdldCk7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gIG5ldyBDdXN0b21FdmVudCgnaXRlbUNsaWNrZWQnLHtcbiAgICAgICAgICAgIGJ1YmJsZXM6dHJ1ZSxcbiAgICAgICAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZGV0YWlsOntcbiAgICAgICAgICAgICAgICB2YWx1ZTp0aXRsZX1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBldi50YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RGF0YVRpdGxlKGVsZW1lbnQpe1xuICAgICAgICAgICAgY29uc3QgZGF0YVRpdGxlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcbiAgICAgICAgICAgICAgICBpZihkYXRhVGl0bGUpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVRpdGxlXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXREYXRhVGl0bGUoZWxlbWVudC5wYXJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHlwZWFoZWFkL2pzL2xpc3RUZW1wbGF0ZU1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICcuL3R5cGVhaGVhZCc7XG5pbXBvcnQgVHlwZWFoZWFkIGZyb20gJy4vdHlwZWFoZWFkL2pzL3R5cGVhaGVhZCc7XG5pbXBvcnQgVHlwZWFoZWFkTGlzdE1hbmFnZXIgZnJvbSAnLi90eXBlYWhlYWQvanMvbGlzdFRlbXBsYXRlTWFuYWdlcic7XG5cbmNvbnN0IHNlbGVjdGVkQWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RlZC1hZGRyZXNzJyk7XG5sZXQgcmVuZGVyZXIgPSBuZXcgVHlwZWFoZWFkTGlzdE1hbmFnZXIoKTtcbi8vdGhlIGN1c3RvbSBsaXN0SXRlbVRlbXBhbHRlIGZ1bmN0aW9uXG4vL3RoaXMgZnVuY3Rpb24gbXVzdCBjb250YWluIGFzIHBhcmFtZXRlcnMgdGl0bGUgYW5kL29yIHN1YnRpdGxlIGFuZC9vciBpbWFnZVxuLyoqXG4gYWxzbyB0aGUgcm9vdCBlbGVtZW50IG9mIHRoZSBsaXN0IGl0ZW0gc2hvdWxkIGNvbnRhaW4gIGRhdGEtdGl0bGU9XCIke3RpdGxlfVwiXG4gc28gd2UgY2FuIGdldCB0aGUgdGl0bGUgc3RyaW5nIGFuZCBwdXQgaXQgYXMgYSB2YWx1ZSBvZiB0aGUgaW5wdXRcbiovXG5sZXQgbGlzdEl0ZW1UZW1wbGF0ZSA9IHRpdGxlID0+IGA8ZGl2IGNsYXNzPVwiY3VzdG9tLXRlbXBsYXRlXCIgZGF0YS10aXRsZT1cIiR7dGl0bGV9XCI+PHNwYW4gY2xhc3M9XCJ0aXRsZVwiPiR7dGl0bGV9PC9zcGFuPjwvZGl2PmA7XG5cbi8vaW5pdGlhdGUgYSB0eXBlIGFoZWFkIG1hbnVhbHkgYnkgcXVlcnlpbmcgdGhlIGVsZW1lbnRcbmxldCBtYW51YWxUeXBlYWhlYWQgPSBuZXcgVHlwZWFoZWFkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYW51YWwtdHlwZWFoZWFkJykpXG4gICAgLy9zZXQgdGhlIHVybCBmb3IgdGhlIGFqYXggZGF0YSByZXF1ZXN0XG4gICAgLnNldFVybCgnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9rZXk9QUl6YVN5Q2ptXzVOSVg1SnJfUEdGVk81VGUzRUhZRlBwUEcyNlF3JmFkZHJlc3M9JylcbiAgICAvL3NldCB0aGUgaW5wdXQgbGFiZWwgaWYgZGVzaXJlZFxuICAgIC5zZXRMYWJlbCgnU2VhcmNoIEFkZHJlczonKVxuICAgIC8vY2FsbGJhY2sgd2hlbiB0aGUgcmVzdWx0cyBmcm9tIHRoZSBzZWFyY2ggYXJlIHJlY2lldmVkXG4gICAgLy9oZXJlIHdlIGNhbiBnZXQgdGhlIGxpc3RNYW5hZ2VyIGluc3RhbmNlIGZyb20gdGhlIFR5cGVBaGVhZCBjbGFzcyBpbnN0YW5jZSBlLmcgaW5zdGFuY2UubGlzdE1hbmFnZXJcbiAgICAvL2Zvcm1hdCB0aGUgZGF0YSBmcm9tIHRoZSByZXN1bHRMaXN0IGFzIHdlIHdpc2ggXG4gICAgLy9hbmQgaW52b2tlIHRoZSByZW5kZXIgbWV0aG9kIG9mIHRoZSBsaXN0IG1hbmFnZXIgYW5kIHNob3cgdGhlIHJlc3VsdHNcbiAgICAub25SZXN1bHRzUmVjaWV2ZWQoKHJlc3VsdExpc3QsaW5zdGFuY2UpPT57XG4gICAgICAgIGxldCBmb3JtYXR0ZWQgID0gcmVzdWx0TGlzdC5yZXN1bHRzLm1hcCgoaXRlbSk9PntyZXR1cm4ge3RpdGxlOml0ZW0uZm9ybWF0dGVkX2FkZHJlc3N9fSk7XG4gICAgICAgIGluc3RhbmNlLmxpc3RNYW5hZ2VyLnJlbmRlcihmb3JtYXR0ZWQsbGlzdEl0ZW1UZW1wbGF0ZSk7XG4gICAgfSlcbiAgICAub25JdGVtQ2xpY2tlZCgodmFsdWUpPT57XG4gICAgICAgIHNlbGVjdGVkQWRkcmVzcy5pbm5lckhUTUwgPSBcIlNlbGVjdGVkIGFkZHJlc3M6IDxzdHJvbmc+XCIrdmFsdWUrXCI8L3N0cm9uZz5cIjtcbiAgICB9KVxuICAgIC5pbml0aWFsaXplKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBUeXBlYWhlYWQgZnJvbSAnLi9qcy90eXBlYWhlYWQnO1xubGV0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndHlwZWFoZWFkJyk7XG5lbGVtZW50cy5mb3JFYWNoKChlbCk9PntcbiAgICBuZXcgVHlwZWFoZWFkKGVsKTtcbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHlwZWFoZWFkL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhbiBIVE1MRWxlbWVudCBjb250YWluaW5nIHRoZSBpbnB1dCwgbGFiZWwgYW5kIHVsIGVsZW1lbnRcbiAqIG9mIHRoZSB0eXBlYWhlYWRcbiAqIFxuICogQHBhcmFtIHtTdHJpbmcgfCBudWxsfSBsYWJlbCB0aGUgbGFiZWwgb2YgdGhlIHNlYXJjaCBpbnB1dCBpZiBzdWNoIGlzIGRlc2lyZWRcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gY29udGFpbmVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW5UZW1wbGF0ZShsYWJlbCl7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCd0eXBlYWhlYWQnKTtcbiAgICBcbiAgICBpZihsYWJlbCl7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIGVsZW1lbnRMYWJlbC5pbm5lclRleHQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnRMYWJlbCk7XG4gICAgfVxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnZm9ybS1jb250cm9sJyk7XG5cbiAgICBjb25zdCByZXN1bHRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICByZXN1bHRMaXN0LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdyZXN1bHQtbGlzdCBsaXN0LWdyb3VwJyk7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZXN1bHRMaXN0KTtcbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdHlwZWFoZWFkL2pzL3RlbXBsYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVHJhbnNmb3JtcyBhIFwic3RyaW5nXCIgdG8gXCJTdHJpbmdcIlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbmNvbnN0IHRvVXBwZXJGaXJzdENhc2UgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHJldHVybiBbc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpLHN0cmluZy5zbGljZSgxKV0uam9pbignJyk7XG59XG5cbi8qKlxuICogVHJhbnNmb3JtcyBcInRoaXMtc3RyaW5nXCIgdG8gXCJ0aGlzU3RyaW5nXCIgb3JcbiAqIHRoaXMtbG9uZy1hdHRyaWJ1dGUtbmFtZSB0byBcInRoaXNMb25nQXR0cmlidXRlTmFtZVwiXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGFzaFRvQ2FtZWxDYXNlKHN0cmluZyl7XG4gICAgbGV0IHNwbGl0ID0gc3RyaW5nLnNwbGl0KCctJyk7XG4gICAgbGV0IGFycmF5ID0gW107XG4gICAgaWYoc3BsaXQubGVuZ3RoID4gMSl7XG4gICAgICAgIHJldHVybiBzcGxpdC5tYXAoKGl0ZW0saW5kZXgpPT57XG4gICAgICAgICAgICBpZihpbmRleCA+IDApe1xuICAgICAgICAgICAgICAgIHJldHVybiB0b1VwcGVyRmlyc3RDYXNlKGl0ZW0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmpvaW4oJycpO1xuICAgIH1lbHNle1xuICAgICAgcmV0dXJuIHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBtYXAgdG8gYW4gc3Vib2JqZWN0IGluIGEgbGl0ZXJhbCBlLmcuIFwibXkubmVzdGVkLm9iamVjdFwiXG4gKiBhbmQgYW4gb2JqZWN0IGxpdGVyYWwgZWcuIFwie215OntuZXN0ZWQ6e29iamVjdDpcInNvbWV0aGluZ1wifX1cIlxuICogYW5kIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBzdWJvYmplY3QgZS5nLiBcInNvbWV0aGluZ1wiXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5zfSBvYmplY3RQYXRoIFxuICogQHBhcmFtIHtPYmVqY3R9IG9iamVjdFxuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWVGcm9tT2JqZWN0UGF0aChvYmplY3RQYXRoLG9iamVjdCl7XG4gICAgaWYoIW9iamVjdFBhdGgpIHJldHVybiBvYmplY3Q7XG4gICAgdmFyIHBhdGggPSBvYmplY3RQYXRoLnNwbGl0KCcuJyk7XG4gICAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LHBhdGgpO1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFZhbHVlKG9iaixwYXRoKXtcbiAgICAgICAgaWYocGF0aC5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgcmV0dXJuIG9iaiA/IGdldFZhbHVlKG9ialtwYXRoLnNwbGljZSgwLDEpXSxwYXRoKSA6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3R5cGVhaGVhZC9qcy9oZWxwZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjb25zdCB0aXRsZU9ubHkgPSAodGl0bGUpID0+IHtcbiAgIHJldHVybiBgPGJ1dHRvbiBjbGFzcz1cInR5cGVhaGVhZC1saXN0LWl0ZW0gdGl0bGUtb25seSBsaXN0LWdyb3VwLWl0ZW1cIiBkYXRhLXRpdGxlPVwiJHt0aXRsZX1cIj5cbiAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGUgc3Ryb25nXCI+PHN0cm9uZyBkYXRhLXRpdGxlPiR7dGl0bGV9PC9zdHJvbmc+PC9kaXY+XG4gICAgPC9idXR0b24+YDtcbn1cblxuZXhwb3J0IGNvbnN0IHRpdGxlU3VidGl0bGUgPSAodGl0bGUsc3VidGl0bGUpID0+IHtcbiAgICByZXR1cm4gYDxidXR0b24gY2xhc3M9XCJ0eXBlYWhlYWQtbGlzdC1pdGVtIHRpdGxlLXN1YnRpdGxlIGxpc3QtZ3JvdXAtaXRlbVwiIGRhdGEtdGl0bGU9XCIke3RpdGxlfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj48c3Ryb25nPiR7dGl0bGV9PC9zdHJvbmc+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdWJ0aXRsZVwiPiR7c3VidGl0bGV9PC9kaXY+XG4gICAgPC9idXR0b24+YDtcbn07XG5cbmV4cG9ydCBjb25zdCB0aXRsZVN1YnRpdGxlSW1hZ2UgPSAodGl0bGUsc3VidGl0bGUsaW1hZ2UpID0+IHtcbiAgICByZXR1cm4gYDxidXR0b24gY2xhc3M9XCJ0eXBlYWhlYWQtbGlzdC1pdGVtIHRpdGxlLXN1YnRpdGxlLWltYWdlIGxpc3QtZ3JvdXAtaXRlbVwiIGRhdGEtdGl0bGU9XCIke3RpdGxlfVwiPlxuICAgICAgICA8ZGl2IGNsYXM9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMiBpbWFnZS1ob2xkZXJcIj5cbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiaW1nLWZsdWlkIGltZy10aHVtYm5haWwgcm91bmRlZCBteC1hdXRvIGQtYmxvY2tcIiBzcmM9JyR7aW1hZ2V9Jy8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTAgdGV4dC1ob2xkZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj48c3Ryb25nPiR7dGl0bGV9PC9zdHJvbmc+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN1YnRpdGxlXCI+JHtzdWJ0aXRsZX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbjwvYnV0dG9uPmBcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi90eXBlYWhlYWQvanMvbGlzdC10ZW1wbGF0ZXMuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9