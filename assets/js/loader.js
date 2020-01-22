function load(url){
    return new Promise((resolve, reject)=>{
        var promisedData = loadGoogleSpreadsheet(url);
        promisedData.then(function(result){
            resolve(result);
        })
        .catch(function(e){
            //resolve(getData(corsBypasserUrl+url,type))
        });
    })

    function loadGoogleSpreadsheet(url){
        return new Promise((resolve, reject)=>{
          Tabletop.init(
            {
              key: url,
              callback: function(data){
                resolve(data);
            },
             simpleSheet: false })
      })
      }
}
