function CalendarEventHtmlMaker() {
  this.rowTemplate = function(){
    var rowTemplate = '';
    rowTemplate += '<tr ${trAttribute}>';
    rowTemplate += '  <td rowspan="2">${date}</td>';
    rowTemplate += '  <td rowspan="2">${destination}</td>';
    rowTemplate += '  <td rowspan="2">${business}</td>';
    rowTemplate += '  <td rowspan="2">${round-trip}</td>';
    rowTemplate += '  <td colspan="3">${route1}</td>';
    rowTemplate += '  <td colspan="2">${route2}</td>';
    rowTemplate += '  <td colspan="2">${route3}</td>';
    rowTemplate += '  <td colspan="2">${route4}</td>';
    rowTemplate += '</tr>';
    rowTemplate += '<tr ${trAttribute}>';
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
    var html = '';
    var routeMaster = new RouteMaster();
    routeMaster.load();
    Logger.log('きたよー1');    
    for(var i = 0; i < events.length; i++){
      html += this.replaceRowTemplate(events[i], i, routeMaster.masterData);
    }
    
    return html;
  }
  
  this.replaceRowTemplate = function(event, index, routeMasterData){
    var rowHtml = this.rowTemplate();
    rowHtml = rowHtml.replace('${date}', event['date']);
    rowHtml = rowHtml.replace('${destination}', event['destination']);
    
    if(routeMasterData[event['destination']] == null){
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
      rowHtml = rowHtml.replace('${fare1}', routeMasterDataDetail['fare1']);
      rowHtml = rowHtml.replace('${fare2}', routeMasterDataDetail['fare2']);
      rowHtml = rowHtml.replace('${fare3}', routeMasterDataDetail['fare3']);
      rowHtml = rowHtml.replace('${fare4}', routeMasterDataDetail['fare4']);
    }
    // 行のストライプ化
    if(index % 2 === 0){
      rowHtml = rowHtml.replace(/\$\{trAttribute\}/g, 'class="active"');
    }
    
    return rowHtml;
  }
  
}
