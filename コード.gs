function showMainDialog() {
  var html = HtmlService.createHtmlOutputFromFile('index');
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
  var seisansho = new Seisansho();
  seisansho.createSeisansho(calendarEvents, inputDate);
}

/*
 カレンダーから外出イベントを取得し、メイン画面表示用のHTMLに変換して返す。
*/
function createEventsHtml(inputDate){
  try{
  var calendarEvents = fetchCalendarEvents(inputDate);
  var events = createEventsInfo(calendarEvents);
  var html = createEventsRowHtml(events);
  }catch(e){Logger.log(e)}
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
    event['dayOfTheWeek'] = '日月火水木金土'[evt.getStartTime().getDay()];
    events.push(event);
  } 
   
  return events;
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