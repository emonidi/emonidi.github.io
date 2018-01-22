import mainTemplate from './template';
import {dashToCamelCase, getValueFromObjectPath} from './helpers';
import TypeaheadListManager from './listTemplateManager';
import * as listTemplates from './list-templates';
import debounce from 'lodash.debounce';


export default class Typeahead{
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
           let attributeName = dashToCamelCase(attributes[i].nodeName); 
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
        return mainTemplate(label);
    }

    /**
     * sets the events on which the text input should react
     * 
     * @param {HtmlElement} input;
     * @returns void
     */
    setInputEvents(input){
        if(this.attributes.url){
            input.addEventListener('keyup',debounce(event=> this.searchHandler(event)(this),100),false);
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
            list = getValueFromObjectPath(this.attributes.listWrapper,resultObject);
        }
        if(!list || list.length === 0) return null;
        
        return list.map((item)=>{
            let obj = {};
            if(this.attributes.pathToTitle){
                obj.title = getValueFromObjectPath(this.attributes.pathToTitle,item);
            }
            if(this.attributes.pathToSubtitle){
                obj.subtitle =  getValueFromObjectPath(this.attributes.pathToSubtitle,item);
            }
            if(this.attributes.pathToImage){
                obj.image = getValueFromObjectPath(this.attributes.pathToImage,item);
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
                this.listTemplate = listTemplates.titleOnly
            }
            if(this.attributes.pathToTitle && this.attributes.pathToSubtitle && !this.attributes.pathToImage){
                this.listTemplate = listTemplates.titleSubtitle;
            }    
            if(this.attributes.pathToTitle && this.attributes.pathToSubtitle && this.attributes.pathToImage){
                this.listTemplate = listTemplates.titleSubtitleImage;
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
        this.listManager = new TypeaheadListManager(this.list);
        return this;
    }
    /** Sets a callback when an listItem is clicked */
    onItemClicked(callback){
        this.onItemClickedHandler = callback;
        return this;
    }
}

