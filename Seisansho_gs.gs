function Seisansho() {
  this.detailArr = []
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
}
