/**
 * Creates an instance of an HTMLElement containing the input, label and ul element
 * of the typeahead
 * 
 * @param {String | null} label the label of the search input if such is desired
 * @returns {HTMLElement} container
 */
export default function mainTemplate(label){
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