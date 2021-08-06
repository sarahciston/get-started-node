// var PouchDB = require("pouchdb");
// PouchDB.plugin(require("pouchdb-find"));

// // //puts all database files in a folder other than pwd
// var TempPouchDB = PouchDB.defaults({ prefix: ".data" });
// var PouchDB = PouchDB.defaults({ prefix: ".data" });

// let db = new PouchDB("files");
let db = 'ivo'

// module.exports = (req, res) => { //for making whole file a module
// exports.nameOfFunction = function(req, res){ } //for making that function export then use query.nameOfFunction in other file
  
  
//INSERT/MODIFY

let fs = require("fs");

//bulkAdd
exports.bulkAdd = (req, res) => {
  let cleanData = fs.readFileSync("../json/cleanData.json");
  cleanData = JSON.parse(cleanData);
  
  db.bulkDocs(cleanData)
    .then(function(r){
      console.log(r)
      res.send(r)
  }).catch(err=>{console.log(err)}) 
}
      // var newList = []
      // newList.push({
      //   _id: cleanData._id,
      //   name: cleanData.name,
      //   text: cleanData.text,
      //   size: cleanData.size,
      //   createdAt: cleanData.createdAt,
      //   content_type: cleanData.content_type,
      //   fileid: cleanData.file1id,
      //   file1url: cleanData.file1url, 
      //   file2id: cleanData._id,
      //   file2url: cleanData.file2url
      // })
    // console.log(cleanData)

//   //singleAdd
//   db.put(doc)
//     .then(function (res) {
//       console.log(res);
//     }).catch(function(err){console.log(err)});

let ids = [] //['cjuyntr8b0usf01600kmkbikq', 'cjuyct48y0u7g0160mxmmvrjz', cjuvtljys0t6e0160b4h8ip80, "cjuyk1a9z0ujp0160ucv0f3bb", 'cjshtszqf05es01607u4wupzs', '66609c9d-dae8-4d10-80bc-2f78176f301d', '4823b922-fa7d-439d-9433-82ef989bb31b', '4dae9091-22c2-4901-8440-4c30fb7e1b39', '609a5612-91f6-4b84-8562-f134ffde9b06', '_design/idx-d1e523fffe323fcf38f35cbc0f96072b', '615c76fa-eeee-4b9b-be36-bee10d20452b']


//   //Delete IDs
exports.deletes = function(req, res){  
  for (var i = 0; i < ids.length; i++ ) {
    db.get(ids[i]).then(function(doc){
      console.log(ids[i] + 'done');
      return db.remove(doc);
  }).catch(function(err){console.log(err)});  
  };
};

  /////////////////////////
  //QUERIES

  //Count items in DB
exports.info = (req, res) => {
  db.info().then(function(r) {
    console.log(r)
    res.send(r)
  }).catch(function(err){console.log(err)});
}

//calls all DB items for client
exports.all = function(req, res){  
  var docs = []
  db.allDocs({ include_docs: true }) //db.allDocs({attachments:true})
    .then(function(doc) {
      docs.push(doc)
      //console.log(docs)
      return docs
    })
    .then(function(all){
      res.send(all)
    })
    .catch(function(err) {
      console.log("err: " + err);
    });
};


  
  //Get one by ID
exports.one = function(req, res){
  var id = req.params.id //uses url to insert ID from request
  
  db.get(id, { attachments: true })
      .then(function (doc) {
      console.log(doc);
      res.send(doc); 
      }).catch(function(err){console.log(err)});
}; 

//update one
exports.update = function(req, res){
  var id = req.body.id
  var updateKey = req.body.updateKey
  var updateValue = req.body.updateValue  
  
  db.get(id).then(function (doc) {
    doc.updateKey = updateValue
    return db.put(doc);
  }).then(function() {
    return db.get(id);
  }).then(function (doc){
    console.log(doc)
    res.send('/query/:id', doc)
  }).catch(function(err){console.log(err)});
};


exports.findNoFile2 = (req, res) => {
//   // make index
  // db.createIndex({
  //   index: {
  //     fields: ['file2Id']
  //     // fields: ['size', 'text', 'createdAt', 'file1id', 'file1url', 'file2id', 'file2url'] 
  //   }
  // }).then(function(result){
  //   console.log(result)
  // }).catch(function(err){
  //   console.log(err)
  // });
  
  // db.getIndexes().then(res => {
  //   console.log(res)
  // }).catch(function(err){
  //   console.log(err)
  // });

  db.find({
    selector: {
     // size: {$gt: 97324}
      // name: 'cjuuihtg20s1g0160aus236wdtts.wav'
     file2Id: ''
    },
    use_index: '_design/idx-0d964714d26e453c2a510199aaa77d92'//for file2id, use_index: 'idx-2cf0ed32af3059b18efbd80cd4cebda1'
  }).then(function(res){
    console.log(res)
    //save to hard drive, then from hard drive i'll wget the files and process them
    res = JSON.stringify(res)
  
    fs.writeFile('../json/noFile2.json', res, function (err) {
        if (err) throw err;
        console.log('saved');
      });
  }).catch(function(err){
    console.log(err)
  }); 
}

//calls all DB items for client
exports.textOnly = (req, res) => {  
  
  // make index
  // db.createIndex({
  //   index: {
  //     fields: ['text']
  //     // fields: ['size', 'text', 'createdAt', 'file1id', 'file1url', 'file2id', 'file2url'] 
  //   }
  // }).then(function(result){
  //   console.log(result)
  // }).catch(function(err){
  //   console.log(err)
  // });
  
//   db.getIndexes().then(function (result) {
//   // handle result
//       console.log(result)
//   }).catch(function (err) {
//     console.log(err);
//   });
  
  db.find({
    selector: {
    //  // size: {$gt: 97324}
    //   // name: 'cjuuihtg20s1g0160aus236wdtts.wav'
     text: {$ne: ''}
    },
    fields: ['text'] //,
    // use_index: '_all_docs' //'_design/idx-03f33323a3c7b3553eb4eac3bf2a4546' //'_design/idx-0d964714d26e453c2a510199aaa77d92'//for file2id, use_index: 'idx-2cf0ed32af3059b18efbd80cd4cebda1'
  }).then(function(res){
    console.log(res)
    //save to hard drive, then from hard drive i'll wget the files and process them
    res = JSON.stringify(res)
  
    fs.writeFile('../json/textOnly.json', res, function (err) {
        if (err) throw err;
        console.log('saved');
      });
  }).catch(function(err){
    console.log(err)
  });
  
};




//ROUTES FOR DB MANIP
//app.get('/cleanup', cleanup);
// app.use('/cleanup', (req, res) => {
//   res.send(cleanup);
// });

// app.get('/upload', upload);
// app.use('/upload', (req, res) => {
//   res.send(upload);
// });



//BULK UPDATE
// exports.bulk = function (req, res) {
  
//   var docs = []
//   var list = []
  
//   db.allDocs({ include_docs: true }) //startkey: 'cjsj', endkey: 
//     .then(function(d) {
//       d = d.rows
//       console.log(d.length)
//       // console.log(d)
//     //map allDocs list to clean data list
    
//     //parses full database call into list
//       for (var i = 0; i < d.length; i++){
//         list.push({
//           _id: d[i].id, 
//           _rev: d[i].value.rev, 
//           // file1Id: d[i].doc.file1Id,
//           // file1url: d[i].doc.file1url,
//           // file2Id: d[i].doc.file2Id,
//           // file2url: d[i].doc.file2url
//         })
//       }
//       return list
//     })
//     .then(function(list){
//     //update list with new URL here
//       for (var i = 0; i < list.length; i++){
//         list[i].file1url = "http://innervoiceover.glitch.me/audio/"+list[i].file1Id +".wav"
//         list[i].file2url = "http://innervoiceover.glitch.me/audio/"+list[i].file2Id+".wav"
//       }
//             // console.log(list)
//       return list
//     })
  
//   .then(function(list){
//     db.bulkDocs(list).then(function(r){console.log(r)}).catch(err=>{console.log(err)})

//   }).then(function(all){
//     res.send('/pathfix', all)
//   })
//   .catch(function(err) {
//     console.log("err: " + err);
//   })
// }



//BULK UPDATE
exports.bulk = function (req, res) {
  
  var docs = []
  var revs = []
  
  db.allDocs({ include_docs: true }) //startkey: 'cjsj', endkey: 
    .then(function(d) {
      d = d.rows
      console.log(d.length)
      // console.log(d)
      
    // let revs = d.map(d => return d.id)
  
    // //parses full database call into list
      for (var i = 0; i < d.length; i++){
        // console.log(d[i].id, d[i].value.rev)
        revs.push({
          _id: d[i].id, 
          _rev: d[i].value.rev,
          ///include all items, update ones you want to update here
          name: d[i].name,
          text: d[i].text,
          size: d[i].size,
          createdAt: d[i].createdAt,
          content_type: d[i].content_type,
          fileid: d[i].file1id,
          file1url: d[i].file1url, 
          file2id: d[i]._id,
          file2url: d[i].file2url
        })
      }
      console.log(revs[0])
    
  .then(function(revs){

//     db.bulkDocs(revs).then(function(r){console.log(r)}).catch(err=>{console.log(err)})

  }).then(function(all){
    res.status(200).body(all)
  })
  .catch(function(err) {
    console.log("err: " + err);
  })
})
};



  //how to map two arrays
// cleanData.map(cleanData => { 
//         revs.map(revs =>{
//           fullList.push({
//             _id: cleanData._id,
//             name: cleanData.name,
//             text: cleanData.text,
//             size: cleanData.size,
//             createdAt: cleanData.createdAt,
//             content_type: cleanData.content_type,
//             fileid: cleanData.file1Id,
//             file1url: cleanData.file1url, 
//             file2id: cleanData._id,
//             file2url: cleanData.file2url
//           })
//         })
//       })