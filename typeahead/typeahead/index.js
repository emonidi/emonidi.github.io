import Typeahead from './js/typeahead';
let elements = document.querySelectorAll('typeahead');
elements.forEach((el)=>{
    new Typeahead(el);
});