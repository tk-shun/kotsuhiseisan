function CalendarEventRowMaker() {
  this.rowTemplate = function(){
    var rowTemplate = '';
    rowTemplate += '<tr class="${trAttribute} row${rownum} upperRow">';
    rowTemplate += '  <td rowspan="2">${date}</td>';
    rowTemplate += '  <td rowspan="2">${destination}</td>';
    rowTemplate += '<td rowspan="2">';
    rowTemplate += '<div class="ui-widget">';
    rowTemplate += '  <select class="combobox">';
    rowTemplate += '   ${routeMasterDropdownValueTag}';
    rowTemplate += '  </select>';
    rowTemplate += '</div>';
    rowTemplate += '</td>';
    rowTemplate += '  <td rowspan="2">${business}</td>';
    rowTemplate += '  <td rowspan="2">${round-trip}</td>';
    rowTemplate += '  <td colspan="3">${route1}</td>';
    rowTemplate += '  <td colspan="2">${route2}</td>';
    rowTemplate += '  <td colspan="2">${route3}</td>';
    rowTemplate += '  <td colspan="2">${route4}</td>';
    rowTemplate += '</tr>';
    rowTemplate += '<tr class="${trAttribute} row${rownum}">';
    rowTemplate += '  <td>${departure}</td>';
    rowTemplate += '  <td>${arrival1}</td>';
    rowTemplate += '  <td>${fare1}</td>';
    rowTemplate += '  <td>${arrival2}</td>';
    rowTemplate += '  <td>${fare2}</td>';
    rowTemplate += '  <td>${arrival3}</td>';
    rowTemplate += '  <td>${fare3}</td>';
    rowTemplate += '  <td>${arrival4}</td>';
    rowTemplate += '  <td>${fare4}</td>';
    rowTemplate += '</tr>';
    
    return rowTemplate;
  }
  
  this.convertEventsToHtml = function(events){
    var routeMaster = new RouteMaster();
    routeMaster.load();
    var routeMasterDropdownValueTag = routeMaster.createRouteMasterDropdownValueTag();

    var html = '';
    for(var i = 0; i < events.length; i++){
      html += this.createRow(events[i], i, routeMaster.masterData, routeMasterDropdownValueTag);
    }
    return html;
  }
  
  
  /*
    行データを作成する。
    行データは行テンプレートの変数部分を書き換えて作成する。
  */  
  this.createRow = function(event, index, routeMasterData, routeMasterDropdownValueTag){
    var rowHtml = this.rowTemplate();
    rowHtml = rowHtml.replace('${date}', event['date']);
    rowHtml = rowHtml.replace('${destination}', event['destination']);
    
    // 経路マスタの有無に関係なく設定
    rowHtml = rowHtml.replace(/\$\{rownum\}/g, index); // 正規表現を使用して、複数個所の一括置換
    rowHtml = rowHtml.replace('${routeMasterDropdownValueTag}', routeMasterDropdownValueTag);
    
    if(routeMasterData[event['destination']] == null){
      rowHtml = rowHtml.replace(/\$\{routename}/g, '-');
      rowHtml = rowHtml.replace('${business}', '');
      rowHtml = rowHtml.replace('${round-trip}', '');
      rowHtml = rowHtml.replace('${route1}', '');
      rowHtml = rowHtml.replace('${route2}', '');
      rowHtml = rowHtml.replace('${route3}', '');
      rowHtml = rowHtml.replace('${route4}', '');
      rowHtml = rowHtml.replace('${departure}', '');
      rowHtml = rowHtml.replace('${arrival1}', '');
      rowHtml = rowHtml.replace('${arrival2}', '');
      rowHtml = rowHtml.replace('${arrival3}', '');
      rowHtml = rowHtml.replace('${arrival4}', '');
      rowHtml = rowHtml.replace('${fare1}', '');
      rowHtml = rowHtml.replace('${fare2}', '');
      rowHtml = rowHtml.replace('${fare3}', '');
      rowHtml = rowHtml.replace('${fare4}', '');      
    } else {     
      var routeMasterDataDetail = routeMasterData[event['destination']];
      rowHtml = rowHtml.replace(/\$\{routename}/g, routeMasterDataDetail['routename']);
      rowHtml = rowHtml.replace('${business}', routeMasterDataDetail['business']);
      rowHtml = rowHtml.replace('${round-trip}', routeMasterDataDetail['round-trip']);
      rowHtml = rowHtml.replace('${route1}', routeMasterDataDetail['route1']);
      rowHtml = rowHtml.replace('${route2}', routeMasterDataDetail['route2']);
      rowHtml = rowHtml.replace('${route3}', routeMasterDataDetail['route3']);
      rowHtml = rowHtml.replace('${route4}', routeMasterDataDetail['route4']);
      rowHtml = rowHtml.replace('${departure}', routeMasterDataDetail['departure']);
      rowHtml = rowHtml.replace('${arrival1}', routeMasterDataDetail['arrival1']);
      rowHtml = rowHtml.replace('${arrival2}', routeMasterDataDetail['arrival2']);
      rowHtml = rowHtml.replace('${arrival3}', routeMasterDataDetail['arrival3']);
      rowHtml = rowHtml.replace('${arrival4}', routeMasterDataDetail['arrival4']);
      var fare1Yen = routeMasterDataDetail['fare1'] == '' ? '' : '￥'; 
      rowHtml = rowHtml.replace('${fare1}', fare1Yen + routeMasterDataDetail['fare1']);
      var fare2Yen = routeMasterDataDetail['fare2'] == '' ? '' : '￥'; 
      rowHtml = rowHtml.replace('${fare2}', fare2Yen + routeMasterDataDetail['fare2']);
      var fare3Yen = routeMasterDataDetail['fare3'] == '' ? '' : '￥'; 
      rowHtml = rowHtml.replace('${fare3}', fare3Yen + routeMasterDataDetail['fare3']);
      var fare4Yen = routeMasterDataDetail['fare4'] == '' ? '' : '￥'; 
      rowHtml = rowHtml.replace('${fare4}', fare4Yen + routeMasterDataDetail['fare4']);
    }
    // 行のストライプ・・・をしようとした残骸
    if(index % 2 === 0){
//      rowHtml = rowHtml.replace(/\$\{trAttribute\}/g, 'active');
    } else {
      rowHtml = rowHtml.replace(/\$\{trAttribute\}/g, 'active');
    }
    
    return rowHtml;
  }
  
}