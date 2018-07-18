function Seisansho() {
  this.detailArr = []
  
  /*
  精算書を作成する
  */
  this.createSeisansho = function(calendarEvents, inputDate){
    this.createSeisanshoObj(calendarEvents);
    this.writeSeisansho(inputDate);
  }
  
  /*
  画面から取得した情報をもとに精算書に書き込む情報を作成する。
  */
  this.createSeisanshoObj = function(calendarEvents){
    for each(var evt in calendarEvents){
      var evtPrefix = evt.getTitle().substr(0,4);
      if(evtPrefix !== '[外出]' ){
        continue;
      }
      
      var evtDestination = evt.getTitle().substr(4,evt.getTitle().length); 
      this.add(evtDestination, evt.getStartTime().getDate());
    } 
  }
  
  /*
  イベントを精算書明細行を管理する配列に追加する。
  配列に行先が未追加の場合は新規の情報を作成・追加し
  配列に行先が追加済みの場合は外出日のみ追加する。
  */
  this.add = function(destination, day){
    var index = this.getIndexArrInMap('destination', destination, this.detailArr);
    if(index === -1){
      var event = {};
      event['destination'] = destination;
      event['firstDay'] = day; 
      event['days'] = [day]; 
      this.detailArr.push(event);
    } else {
      this.detailArr[index]['days'].push(day);
    }
  }
  
  /* 連想配列の配列に対し、指定したキーを持つ連想配列のインデックスを返す*/
  this.getIndexArrInMap = function(prop,val, arr) {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i][prop] === val) {
        return i;
      }
    }
    return -1; //値が存在しなかったとき
  } 
  
  /*
  精算書用のスプレッドシートに書き込む
  */
  this.writeSeisansho = function(inputDate){
    var sheet = SpreadsheetApp.getActive().getSheetByName('原紙');
    var range = sheet.getRange("A10:O69");
    
    for(var index = 0; index < this.detailArr.length; index++){
      var writeRowNum = index + 1 + index * 2;
      range.getCell(writeRowNum, 2).setValue(this.detailArr[index]['firstDay']);
      range.getCell(writeRowNum, 4).setValue(this.detailArr[index]['destination']);
      range.getCell(writeRowNum, 5).setValue('用件');
      range.getCell(writeRowNum, 12).setValue(this.detailArr[index]['days'].length);
      
      // 同じ行先が複数日ある場合は備考欄に日付範囲を記載し、ない場合は備考欄をクリアする
      if(this.detailArr[index]['days'].length !== 1){
        var inputDateArray = inputDate.split('-');
        var zeroSuppressMonth = parseInt(inputDateArray[1], 10);
        var convertedDayRange = this.dayRangeConvert(this.detailArr[index]['days']);
        var biko = zeroSuppressMonth + '/' + convertedDayRange;
        range.getCell(writeRowNum, 15).setValue(biko);
      } else {
        range.getCell(writeRowNum, 15).setValue('');
      }
    }
  }
  
  /*
  カンマ区切りの日付の配列をハイフンを使用した範囲表示に変換する。
  例）変換前：1,2,3,4,5,7,9,10,11,13,14
  変換後：1-5,7,9-11,13,14
  */
  this.dayRangeConvert = function(arr){
    var dayRange;
    
    for(var index = 0; index < arr.length; index++){ 
      var presentDay = arr[index];
      
      // 最初の日付は値を設定するだけ
      if(index == 0){
        dayRange = presentDay + '';
        continue;
      }
      
      var previousDay = arr[index -1];
      var nextDay = arr[index + 1];
      
      // カンマを追加
      if(previousDay + 1 !== presentDay || (presentDay +1 !== nextDay && dayRange.charAt(dayRange.length - 1) !== '-')){
        dayRange += ',';
      }
      // 日付を追加
      if(previousDay + 1 !== presentDay || presentDay + 1 !== nextDay){
        dayRange += presentDay;
      }
      // ハイフンを追加
      if(presentDay + 1 === nextDay && previousDay + 1 === presentDay && dayRange.charAt(dayRange.length - 1) !== '-'){
        dayRange += '-';
      } 
    }
    return dayRange;
  }
  
  
}
