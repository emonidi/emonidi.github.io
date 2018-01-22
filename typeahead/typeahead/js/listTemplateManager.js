/**
 * A class that manages the behaviour of the result list in the ul element
 */
export default class TypeaheadListManager{
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