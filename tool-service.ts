import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular';
import {File} from '@ionic-native/file';

@Injectable()
export class ToolProvider {

  constructor(private file: File, 
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {}
  
  /**
   * Generate unique GUID string
   */
  generateGUID() {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3 | 0x8);
      return v.toString(16);
    });
    return guid;
  }

  /**
   * Searching specific member in array
   * @param searchedId 
   * @param jsonArray 
   * @param attributeName 
   */
  arraySearch(searchedId, jsonArray, attributeName) {
    if (!attributeName) {attributeName = 'id'; } //default search on "id" member
    for (let i = 0; i < jsonArray.length; i++) {
        if (eval("jsonArray[i]." + attributeName) === searchedId) {
            return i;
        }
    }
    return -1;
  }
  arraySearch2() {
    return this.myArray.find(item => {
      return item.id === this.selectedId;
   });
  }
  
  /**
   * Array filtering with multiple criteria
   * @param arr : JSON object array like [{name:"aaa",surname:"bbb",job:"ccc"}]
   * @param criteria : JSON criteria object like {"lastName":"AAA","firstName":"BBB"}
   */
  filter(arr, criteria) {
    return arr.filter(function(obj) {
      return Object.keys(criteria).every(function(c) {
        return obj[c].includes(criteria[c].toUpperCase());  // get element if contains searched value
        //return obj[c] == criteria[c].toUpperCase();
      });
    });
  }
  
  /**
   * Array filtering with filter() above function
   **/
  getItemByMultiCriteria(name?: string,surname?: string,job?: string,anything?: string){
    
    let filters = {};
    if(name !== "" && name !== undefined){
      filters['name'] = name.toUpperCase()
    }
    if(surname !== "" && surname !== undefined){
      filters['surname'] = surname.toUpperCase();
    }
    if(job !== "" && job !== undefined){
      filters['job'] = job.toUpperCase();
    }
    if(anything !== "" && anything !== undefined){
      filters['anything'] = anything.toUpperCase();
    }
    return this.filter(this.myArray, filters);
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
  
  /**
   * JSON format validator
   * @param str : string to check
   */
  IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }
  
  /**
   * Alert dialogbox
   * @param title 
   * @param message 
   */
  info(title: string = "", message: string = ""){
    let alert = this.alertCtrl.create({
      title: title ||"",
      subTitle: message || "",
      buttons: ['OK']
    });

    alert.present();
  }

  /**
   * Show toast message
   * @param message 
   */
  toast(message: string, duration: number = 2000){
    if(message !== ""){
      let toast = this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'top'
      });
      toast.present();
    }
  }
  
   /**
   * Convert received data stream (ascii) to hexadecimal
   * @param str 
   */
  ascii_to_hexa(str)
  {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n ++) 
    {
      var hex = ("0" + parseInt(str.charCodeAt(n).toString(16).match(/.{1,2}/g),16).toString(16)).slice(-2).toUpperCase();
      arr1.push(hex);
    }
    return arr1.join(' ');
  }
  
  /**
   * Get the timestamp with hh:mm:ss:sss format
   * @param displayDate 
   */
  getTimestamp(displayDate: boolean = true){
    var timestamp = new Date();
    // info : month start at index 0, that's why we add 1 to getMonth()
    return (displayDate ? ("0"+(timestamp.getDate())).slice(-2) + "/" + ("0"+(timestamp.getMonth()+1)).slice(-2) + "/" + timestamp.getFullYear() + " - ": "") + ("0" + timestamp.getHours()).slice(-2) + ":" + ("0" + timestamp.getMinutes()).slice(-2) + ":" + ("0" + timestamp.getSeconds()).slice(-2) + ":" + timestamp.getMilliseconds();
  }

  /**
   * Log messages
   * @param textToLog 
   */
  async log(textToLog: string = ""){
    // Create file if does not exists
    this.file.createFile(this.file.externalDataDirectory,this.filename,false);

    // Write some text
    await this.file.writeFile(this.file.externalDataDirectory,this.filename,this.getTimestamp() + " : \r\n" + textToLog + "\r\n\r\n", {replace: false, append: true})
    .then(() => {
      console.log('write success');
    })
    .catch((err) => console.log("error " + JSON.stringify(err)))
  }

  /**
   * Log Error messages
   * @param textToLog 
   */
  logError(textToLog: string = ""){
    // Create file if does not exists
    this.file.createFile(this.file.externalDataDirectory,"error-log.txt",false);

    // Write some text
    this.file.writeFile(this.file.externalDataDirectory,"error-log.txt",this.getTimestamp() + " : \r\n" + textToLog + "\r\n\r\n", {replace: false, append: true})
    .then(() => {
      console.log('write success');
    })
    .catch((err) => console.log("error " + JSON.stringify(err)))
  }
  
   /** 
   * Get RTC between current date and 01/01/2010 00:00:00
   * The result is returned in hexadecimal (on 4 bytes)
   * @param GMTFormat : if true, return timestamp in GMT time
   */
  onGetRTC(GMTFormat: boolean = false){
    var currentDate = new Date();
    var refDate = new Date(2010,0,1,0,0,0,0); // month start at 0
    var RTC;

    if(GMTFormat == false){
    
      RTC = parseInt((((currentDate.getTime() - refDate.getTime())/1000).toFixed(0)));  // note : getTime() return time in millisecond
    
    } else {
    
      let offset = currentDate.getTimezoneOffset() * 60000;
      var GMTTime = currentDate.getTime() + offset;
      RTC = parseInt((((GMTTime - refDate.getTime())/1000).toFixed(0)));  // note : getTime() return time in millisecond
    }

    return ("0" + RTC.toString(16)).slice(-8);   // Add "0" before result and keep the last 4 bytes
  }
  
  /**
   * PWA : Write data in file and download it
   **/
  onWriteToFile(filename: string, data: string){
    if(filename === ""){
      return; 
    } else {
      var blob = new Blob([data],{type:'text/plain'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        e.initEvent('click', true, false);
        a.dispatchEvent(e);
      }
    }
  }
  
  /**
   * Return an object containing the difference between 2 dates in day, hour, minute, second
   * @param date1 
   * @param date2 
   */
  getDateDiff(date1, date2){
    var diff: any = {}; // difference in day, hour, minute, second

    if(date1 !== null && date1 !== undefined && date2 !== null && date2 !== undefined){

      var tmp = +date1 - date2;               // get the difference between the 2 dates
    
      tmp = Math.floor(tmp/1000);             // number of seconds between the 2 dates
      diff.sec = tmp % 60;                    // extract the number of seconds
    
      tmp = Math.floor((tmp-diff.sec)/60);    // number of minutes between the 2 dates
      diff.min = tmp % 60;                    // extract the number of minutes
    
      tmp = Math.floor((tmp-diff.min)/60);    // number of entire hours between the 2 dates
      diff.hour = tmp % 24;                   // extract the number of hours
        
      tmp = Math.floor((tmp-diff.hour)/24);   // number of remaining days
      diff.day = tmp;
    }

    return diff;
  }
  /**
   * Image compression
  **/
  compressImage(src: string) {
    return new Promise((res, rej) => {
      let originalX: number;
      let originalY: number;
      let newX : number;
      let newY: number;
      const originalImg = new Image();
      originalImg.onerror = error => rej(error);
      originalImg.onload = () => {
        originalX = originalImg.width;
        originalY = originalImg.height;
 
        if (originalX > 2000 || originalY > 2000) {
          if (originalX > originalY) {
            newX = 2000;
            newY = newX * originalY / originalX;
          } else {
            newY = 2000;
            newX = newY * originalX / originalY;
          }
        } else {
          newX = originalX;
          newY = originalY;
        }
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(originalImg, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL('image/jpeg',0.85);
        res(data);
      };
      originalImg.src = src;
    });
  }

}
