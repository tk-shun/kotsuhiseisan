function showMainDialog() {
  var html = HtmlService.createHtmlOutputFromFile('test');
  html.setHeight(1000).setWidth(1500).setTitle('交通費精算書作成');
  SpreadsheetApp.getActiveSpreadsheet().show(html);  
}

function doGet(){
  return HtmlService.createTemplateFromFile("index").evaluate();
}
// TODO //
// webアプリケーションとして公開
// カレンダーを開く
// イベント削除ボタン（物理削除？論理削除？）
// イベント手動追加
// ラベル⇔テキストボックス
// 表の列項目をちゃんと作る
// 表の段組みを考える。3行はちょっと縦長になっちゃうからねぇ。。。
// マスタ編集機能
// マスタをプルダウンで選択→普通のプルダウンだとクリックがめんどい＆マスタが多くなると表示が死ぬなので、何とかする。
// マスタ追加時のyahoo検索から取得した情報を表示→選択させる　☆　これはかなり手間の削減につながるので、ぜひ。
// マスタ情報の管理方法を考える。スプレッドシートで管理するの？そうだとして、使う時はユーザがスプレッドシートコピーして、みたいなことが必要？
// https://qiita.com/kakkiichan/items/a6a653bbe113a1dee2eb

/*
 交通費精算書を作成の
*/
function main(inputDate){
  var calendarEvents = fetchCalendarEvents(inputDate);
  var seisanshoObj = createSeisanshoObj(calendarEvents);
  writeSeisansho(seisanshoObj, inputDate); 
}

/*
 カレンダーから外出イベントを取得し、メイン画面表示用のHTMLに変換して返す。
*/
function createEventsHtml(inputDate){
  var calendarEvents = fetchCalendarEvents(inputDate);
  var events = createEventsInfo(calendarEvents);
  var html = createEventsRowHtml(events);

  return html;
}

function createEventsRowHtml(events){
  var html = new CalendarEventRowMaker().convertEventsToHtml(events);

  return html;
}

/*
指定月のカレンダーからイベントを取得する。
取得するカレンダーはログインされているGoogleアカウントが対象となる。
*/
function fetchCalendarEvents(inputDate) {
  var activeUser = Session.getActiveUser();
  var userCalendar = CalendarApp.getCalendarById(activeUser);
  
  var inputDateArray = inputDate.split('-');
  var startDate = new Date(inputDateArray[0],inputDateArray[1] - 1,'1','00','00','00'); //取得開始日 
  var endDate = new Date(inputDateArray[0],inputDateArray[1] ,'1','00','00','00'); //取得終了日(翌月初日の0時0分)
  
  var calendarEvents = userCalendar.getEvents(startDate, endDate);

  return calendarEvents;  
}

/*
 カレンダーイベントから外出イベントを抜き出し、行情報を作成する。
*/
function createEventsInfo(calendarEvents){
  var events = [];
  for each(var evt in calendarEvents){
    var evtPrefix = evt.getTitle().substr(0,4);
    if(evtPrefix !== '[外出]' ){
      continue;
    }
    
    var event = {};
    event['destination'] = evt.getTitle().substr(4,evt.getTitle().length);
    event['date'] = evt.getStartTime().getDate();
    events.push(event);
  } 
   
  return events;
}

/*
交通費精算書への書き込み用オブジェクトを作成する。
対象となるのは先頭に[外出]とついているカレンダーのイベント。
*/
function createSeisanshoObj(calendarEvents){
  var seisansho = new Seisansho();
  
  for each(var evt in calendarEvents){
    var evtPrefix = evt.getTitle().substr(0,4);
    if(evtPrefix !== '[外出]' ){
      continue;
    }
    
    var evtDestination = evt.getTitle().substr(4,evt.getTitle().length); 
    seisansho.add(evtDestination, evt.getStartTime().getDate());
  } 
  return seisansho;
}

/*
　精算書用のスプレッドシートに書き込む
*/
function writeSeisansho(seisanshoObj, inputDate){
  var sheet = SpreadsheetApp.getActive().getSheetByName('原紙');
  var range = sheet.getRange("A10:O69");
  
  for(var index = 0; index < seisanshoObj.detailArr.length; index++){
    var writeRowNum = index + 1 + index * 2;
    range.getCell(writeRowNum, 2).setValue(seisanshoObj.detailArr[index]['firstDay']);
    range.getCell(writeRowNum, 4).setValue(seisanshoObj.detailArr[index]['destination']);
    range.getCell(writeRowNum, 5).setValue('用件');
    range.getCell(writeRowNum, 12).setValue(seisanshoObj.detailArr[index]['days'].length);
    
  // 同じ行先が複数日ある場合は備考欄に日付範囲を記載し、ない場合は備考欄をクリアする
  if(seisanshoObj.detailArr[index]['days'].length !== 1){
    var inputDateArray = inputDate.split('-');
    var zeroSuppressMonth = parseInt(inputDateArray[1], 10);
    var convertedDayRange = dayRangeConvert(seisanshoObj.detailArr[index]['days']);
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
function dayRangeConvert(arr){
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

function getRouteMaster(){
    var routeMaster = new RouteMaster();
    routeMaster.load();
    
    return routeMaster.masterData;
}

function getRouteMasterDropdownValueTag(){
    var routeMaster = new RouteMaster();
    routeMaster.load();
    
    return routeMaster.createRouteMasterDropdownValueTag();
}



function test(){
  try{
    var routeMaster = new RouteMaster();
    routeMaster.load();
    var masterKeys = Object.keys(routeMaster.masterData);
    // 経路マスタからドロップダウン用のタグを生成する
    for(var i = 0; i < masterKeys.length; i++){
      Logger.log(masterKeys[i]);      
    }
  }catch(e){
    Browser.msgBox(e);
  }
    
 }