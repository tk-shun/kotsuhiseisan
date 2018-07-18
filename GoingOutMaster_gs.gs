function GoingOutMaster() {
  
  this.masterData;
  
  /*
  スプレッドシートから経路マスタを取得し、プロパティに設定する。
  また、取得した結果は連想配列形式に変換した上で設定する。
  */
  this.load = function(){
    var sheet = SpreadsheetApp.getActive().getSheetByName('経路');  
    var range = sheet.getRange(3, 1, sheet.getLastRow() - 1, 9);
    var goingOutMaster = range.getValues();  
    
    var formattedGoingOutMaster = this.formatGoingOutMaster(goingOutMaster);
    
    this.masterData = formattedGoingOutMaster;
  }
  
  /*
  スプレッドシート上の経路マスタを連想配列形式に変換する。
  */
  this.formatGoingOutMaster = function(unformattedGoingOutMaster){
    var formattedGoingOutMaster = {};
    for(var i = 0; i * 3 + 2 <= unformattedGoingOutMaster.length; i++ ){
      var goingOutMasterDetail = {};
      goingOutMasterDetail['goingOutName'] = unformattedGoingOutMaster[i * 3][0];    
      goingOutMasterDetail['destination'] = unformattedGoingOutMaster[i * 3][1];    
      goingOutMasterDetail['business'] = unformattedGoingOutMaster[i * 3][2];    
      goingOutMasterDetail['round-trip'] = unformattedGoingOutMaster[i * 3][8];    
      goingOutMasterDetail['route1'] = unformattedGoingOutMaster[i * 3][3];    
      goingOutMasterDetail['route2'] = unformattedGoingOutMaster[i * 3][5];    
      goingOutMasterDetail['route3'] = unformattedGoingOutMaster[i * 3][6];    
      goingOutMasterDetail['route4'] = unformattedGoingOutMaster[i * 3][7];    
      goingOutMasterDetail['departure'] = unformattedGoingOutMaster[i * 3 + 1][3];    
      goingOutMasterDetail['arrival1'] = unformattedGoingOutMaster[i * 3 + 1][4];    
      goingOutMasterDetail['arrival2'] = unformattedGoingOutMaster[i * 3 + 1][5];    
      goingOutMasterDetail['arrival3'] = unformattedGoingOutMaster[i * 3 + 1][6];    
      goingOutMasterDetail['arrival4'] = unformattedGoingOutMaster[i * 3 + 1][7];    
      goingOutMasterDetail['fare1'] = unformattedGoingOutMaster[i * 3 + 2][3];    
      goingOutMasterDetail['fare2'] = unformattedGoingOutMaster[i * 3 + 2][5];    
      goingOutMasterDetail['fare3'] = unformattedGoingOutMaster[i * 3 + 2][6];    
      goingOutMasterDetail['fare4'] = unformattedGoingOutMaster[i * 3 + 2][7];    
      
      var goingOutName = unformattedGoingOutMaster[i * 3][0];
      formattedGoingOutMaster[goingOutName] = goingOutMasterDetail;
    }
    
    return formattedGoingOutMaster;  
  }
  
  /*
  経路マスタの情報をドロップダウンで選択する際のタグを作成する。
  ※GASとHTML間でマスタ情報を受け渡す際、連想配列で渡すと謎ソートされるっぽいので先にテキストで作っておく。
  */
  this.createGoingOutMasterDropdownValueTag = function (){
    var goingOutMasterDropdownValueTag = '';
    Object.keys(this.masterData).forEach(
      function(key){
        goingOutMasterDropdownValueTag += '<option value="';
        goingOutMasterDropdownValueTag += this[key]['goingOutName'];
        goingOutMasterDropdownValueTag += '">';
        goingOutMasterDropdownValueTag += this[key]['goingOutName'];
        goingOutMasterDropdownValueTag += '</option>';
      }, this.masterData)
    
    return goingOutMasterDropdownValueTag;
  }
  
  /*
  経路マスタのキーを返す
  */
  this.getGoingOutMasterKyes = function (){
    return Object.keys(this.masterData);
  }
  
  
}
