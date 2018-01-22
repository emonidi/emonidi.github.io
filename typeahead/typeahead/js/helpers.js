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
export function dashToCamelCase(string){
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

export function getValueFromObjectPath(objectPath,object){
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