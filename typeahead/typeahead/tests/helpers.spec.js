import {dashToCamelCase, getValueFromObjectPath} from '../js/helpers';

describe('helpers',()=>{
    describe('dastToCamelCase',()=>{
        it('should return same string when no dash is in input param',()=>{
            let result = dashToCamelCase('string');
            expect(result).toEqual('string');
        });
        it('should return camelCase string when input param with dash is given',()=>{
            let result = dashToCamelCase('very-long-and-hairy-string-is-this');
            expect(result).toEqual('veryLongAndHairyStringIsThis');
        });
    });

    describe('getValueFromObjectPath',()=>{
        let object = {
            my:{
                very:{
                    very:{
                        deep:{
                            object:['Yeah!']
                        }
                    }
                }
            }
        }
        it('should return the same object if path is null',()=>{
            let result = getValueFromObjectPath(null,object);
            expect(result).toEqual(object);
        });
        it('should return [\'Yeah!\] when path is my.very.very.deep.object',()=>{
            let result = getValueFromObjectPath('my.very.very.deep.object',object);
            expect(result).toEqual(['Yeah!']);
        });
        it('should return \'Yeah!\ when path is my.very.very.deep.object.0',()=>{
            let result = getValueFromObjectPath('my.very.very.deep.object.0',object);
            expect(result).toEqual('Yeah!');
        });
    });
})