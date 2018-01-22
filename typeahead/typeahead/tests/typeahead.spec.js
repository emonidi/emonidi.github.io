import Typeahead from '../js/typeahead';
import TypeaheadListManager from '../js/listTemplateManager';
import { setTimeout } from 'timers';

const createElement = (attributes)=>{
    const el = document.createElement('typeahead');
    if(attributes){
        Object.keys(attributes).forEach((attr)=>{
            el.setAttribute(attr,attributes[attr]);
        })
    }
    return new Typeahead(el);
}

describe('Typeahead class',()=>{
   let typeahead; 
   beforeEach(()=>{
        typeahead = createElement();
   });
   it('should instatntiate',()=>{
       expect(typeahead).not.toBe(undefined);
   });
   describe('methods',()=>{
    beforeEach(()=>{
        typeahead = createElement({url:"http://example.com",'path-to-title':'my.title'});
    })
    it('should set the attributes properly',()=>{
        expect(typeahead.attributes).toBeDefined();
        expect(typeahead.attributes.url).toBeDefined();
        expect(typeahead.attributes.url).toEqual('http://example.com');
        expect(typeahead.attributes.pathToTitle).toBeDefined();
        expect(typeahead.attributes.pathToTitle).toEqual('my.title');
    });
    it('should call the createTemplate method',()=>{
        spyOn(typeahead, 'createTemplate').and.callThrough();
        typeahead.initialize();
        expect(typeahead.createTemplate).toHaveBeenCalled();
    })
    it('should call setInputEvents',()=>{
        spyOn(typeahead, 'setInputEvents').and.callThrough();
        typeahead.initialize();
        expect(typeahead.setInputEvents).toHaveBeenCalled();
    });
    it('after calling initialize there should be an input element,template and list',()=>{
        typeahead.initialize();
        expect(typeahead.template).toBeDefined();
        expect(typeahead.template instanceof HTMLElement).toBe(true);
        expect(typeahead.input).toBeDefined();
        expect(typeahead.input instanceof HTMLElement).toBe(true);
        expect(typeahead.list).toBeDefined();
        expect(typeahead.list instanceof HTMLElement).toBe(true);
    });
    it('should have a listManager instance',()=>{
         typeahead.initialize();
         expect(typeahead.listManager).toBeDefined();
         expect(typeahead.listManager instanceof TypeaheadListManager).toBe(true);
    });
   });
   describe('setting the list templates',()=>{
        it('the list template to be titleOnly when only title attribute is provided',()=>{
            const typeahead = createElement({'url':'http://example.com','path-to-title':'my.path.to.title'});
            expect(typeahead.listTemplate()).toContain('title-only')
        });

        it('the list template to be titleOnly when path-to-title and path-to-subtitle attributes are provided',()=>{
            const typeahead = createElement(
                {
                    'url':'http://example.com',
                    'path-to-title':'my.path.to.title',
                    'path-to-subtitle':'my.path.to.title'
                }
            );
            expect(typeahead.listTemplate()).toContain('title-subtitle')
        });

        it('the list template to be titleOnly when path-to-title and path-to-subtitle attributes are provided',()=>{
            const typeahead = createElement(
                {
                    'url':'http://example.com',
                    'path-to-title':'my.path.to.title',
                    'path-to-subtitle':'my.path.to.title',
                    'path-to-image':'path.to.my.image'
                }
            );
            expect(typeahead.listTemplate()).toContain('title-subtitle-image')
        });
   });
});