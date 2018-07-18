function RouteMaster() {
  
  this.masterData;
  
  /*
  スプレッドシートから経路マスタを取得し、プロパティに設定する。
  また、取得した結果は連想配列形式に変換した上で設定する。
  */
  this.load = function(){
    var sheet = SpreadsheetApp.getActive().getSheetByName('経路');  
    var range = sheet.getRange(3, 1, sheet.getLastRow() - 1, 8);
    var routeMaster = range.getValues();  
    
    var formattedRouteMaster = this.formatRouteMaster(routeMaster);
    
    this.masterData = formattedRouteMaster;
  }
  
  /*
  スプレッドシート上の経路マスタを連想配列形式に変換する。
  */
  this.formatRouteMaster = function(unformattedRouteMaster){
    var formattedRouteMaster = {};
    for(var i = 0; i * 3 + 2 <= unformattedRouteMaster.length; i++ ){
      var routeMasterDetail = {};
      routeMasterDetail['routename'] = unformattedRouteMaster[i * 3][0];    
      routeMasterDetail['business'] = unformattedRouteMaster[i * 3][1];    
      routeMasterDetail['round-trip'] = unformattedRouteMaster[i * 3][7];    
      routeMasterDetail['route1'] = unformattedRouteMaster[i * 3][2];    
      routeMasterDetail['route2'] = unformattedRouteMaster[i * 3][4];    
      routeMasterDetail['route3'] = unformattedRouteMaster[i * 3][5];    
      routeMasterDetail['route4'] = unformattedRouteMaster[i * 3][6];    
      routeMasterDetail['departure'] = unformattedRouteMaster[i * 3 + 1][2];    
      routeMasterDetail['arrival1'] = unformattedRouteMaster[i * 3 + 1][3];    
      routeMasterDetail['arrival2'] = unformattedRouteMaster[i * 3 + 1][4];    
      routeMasterDetail['arrival3'] = unformattedRouteMaster[i * 3 + 1][5];    
      routeMasterDetail['arrival4'] = unformattedRouteMaster[i * 3 + 1][6];    
      routeMasterDetail['fare1'] = unformattedRouteMaster[i * 3 + 2][2];    
      routeMasterDetail['fare2'] = unformattedRouteMaster[i * 3 + 2][4];    
      routeMasterDetail['fare3'] = unformattedRouteMaster[i * 3 + 2][5];    
      routeMasterDetail['fare4'] = unformattedRouteMaster[i * 3 + 2][6];    
      
      var destination = unformattedRouteMaster[i * 3][0];
      formattedRouteMaster[destination] = routeMasterDetail;
    }
    
    return formattedRouteMaster;  
  }
  
  /*
  経路マスタの情報をドロップダウンで選択する際のタグを作成する。
  ※GASとHTML間でマスタ情報を受け渡す際、連想配列で渡すと謎ソートされるっぽいので先にテキストで作っておく。
  */
  this.createRouteMasterDropdownValueTag = function (){
    var routeMasterDropdownValueTag = '';
    Object.keys(this.masterData).forEach(
      function(key){
        routeMasterDropdownValueTag += '<option value="';
        routeMasterDropdownValueTag += this[key]['routename'];
        routeMasterDropdownValueTag += '">';
        routeMasterDropdownValueTag += this[key]['routename'];
        routeMasterDropdownValueTag += '</option>';
      }, this.masterData)
    
    return routeMasterDropdownValueTag;
  }
  
  /*
  経路マスタのキーを返す
  */
  this.getRouteMasterKyes = function (){
    return Object.keys(this.masterData);
  }
  
  
}
