import { Injectable } from '@angular/core';

@Injectable()
export class ToolProvider {

  constructor() {}

  /**
   * Searching specific member in array
   * @param _searchID 
   * @param _myArray 
   * @param _rubID 
   */
  arraySearch(_searchID, _myArray, _rubID){
    if(!_rubID) {_rubID = "id"; } //default search on "id" member
    for (var i=0; i < _myArray.length; i++) {
        if (eval("_myArray[i]." + _rubID) === _searchID) {
            return i;
        }
    };
    return -1;
  }

  /**
   * Sort function
   * @param prop 
   */
  predicateBy(prop){
    return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
    }
  }

}
