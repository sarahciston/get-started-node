//deleted urls:
//"https://files.graph.cool/cjrfet7u94als0129de33wha3/cjt0oi86h0a980160et14gmjf"
//"https://files.graph.cool/cjrfet7u94als0129de33wha3/cjt0oi5iu0a940160e4egt89h"
//"https://files.graph.cool/cjrfet7u94als0129de33wha3/cjt0oifsr0a9l0160gkpgwm7h"
//"https://files.graph.cool/cjrfet7u94als0129de33wha3/cjt0o_idtw0a9h0160bs5bs5ee"

const express = require("express");
const app = express();

var PouchDB = require('pouchdb');
var TempPouchDB = PouchDB.defaults({prefix: '.data'})

let db = new PouchDB('files');

let fs = require('fs');
let data = fs.readFileSync('json/test.json')

let d = JSON.parse(data);

  // var doc = {
  //   "_id": d[i]._id,
  //   "name": d[i].name,
  //   "text": d[i].text,
  //   "size": d[i].size,
  //   "createdAt": d[i].createdAt,
  //   "content_type": d[i].content_type,
  //   "file1Id": d[i].file1Id,
  //   "file1url": d[i].file1url,
  //   "file2Id": d[i].file2Id,
  //   "file2url": d[i].file2url
  // }

for (var i = 0; i < d.length; i++ ) {
  var urlOne = d[i]._attachments.file1.url; //{ urlOne, encoding: null }, (err, resp, buffer) => {}
  var urlTwo = d[i]._attachments.file2.url;
  let doc = {
    "_id": d[i]._id,
    "name": d[i].name,
    "text": d[i].text,
    "createdAt": d[i].createdAt,
    "_attachments": {
      "file1": {
        "_id": d[i]._attachments.file1._id,
        "data": urlOne, //blob/buffer
        "content_type": d[i]._attachments.file1.content_type
      },
      "file2": {
        "_id": d[i]._attachments.file2._id,
        "data": urlOne, //buffer
        "content_type": d[i]._attachments.file2.content_type
      }
      }
    }
  
  request({uri: urlOne, encoding: null})
  .then(function (res) {
    urlOne = res //Buffer.from(res, 'audio/wav'); //replaces URL with buffer object?
  })
  .then(request({uri: urlTwo, encoding: null}).then (function (res) {
    let buffTwo = res //Buffer.from(res, 'audio/wav'); //or can write it out as two steps // buffer, 'utf-8', 'audio/wav'
    urlTwo = buffTwo;
    
    urlOne = 'assets/' + d[i]._attachments.file1._id + '.wav'
    urlTwo = 'assets/' + d[i]._attachments.file2._id + '.wav'
  })
  .then(db.put(doc))
  .then(function (res) {
    console.log(res);
  })
  .catch(function (err){
    console.log(err)
  }) 
).catch(function (unhandledRejection) {
    console.log(unhandledRejection)
  });
  
  
};

app.use('db/', require('express-pouchdb')(TempPouchDB))

// for (var i = 0; i < d.length; i++ ) {
//   // var blobOne = new Blob(d[i]._attachments.file1.url, {type: 'audio/x-wav'});
//   // var blobTwo = new Blob(d[i]._attachments.file2.url, {type: 'audio/x-wav'});
  
  
//   var doc = {
//     "_id": d[i]._id,
//     "name": d[i].name,
//     "text": d[i].text,
//     "createdAt": d[i].createdAt,
//     "_attachments": {
//       "file1": {
//         "_id": d[i]._attachments.file1._id,
//         "data": d[i]._attachments.file1.url, //blob
//         "content_type": d[i]._attachments.file1.content_type
//       },
//       "file2": {
//         "_id": d[i]._attachments.file2._id,
//         "data": d[i]._attachments.file2.url, //blob
//         "content_type": d[i]._attachments.file2.content_type
//       }
//     }
//   }
//   //console.log(doc);
//   db.put(doc)
//     .catch(function (err){
//       console.log(err)
//     });
// }



db.get("cjt0oie9v0a9j0160els5r44ptts-glitchUrl", {attachments: true})
  .then(function (doc) {
  console.log(doc);
  })
  .catch(function (err) {
    console.log(err)
  });


// const blob = (url, callback) => {
  //   const xhr = new XMLHttpRequest()
  //   xhr.open('GET', url)
  //   xhr.responseType = 'blob'
  //   xhr.onload = () => {
  //     callback(xhr.response)
  //   }
  //   xhr.send(null)
  // } //return to old version w base strings? 
  // return blob


//HTML requests for turning stored file URL into blob to upload to DB
// function getBlob(url) {
//   request({method: "POST", uri: url, encoding: null})
//   .then(function (res) {
//     //console.log(res) //files are already buffers
//     // var buff = Buffer.from(res, 'utf8'); //replaces URL with buffer object? 'audio/wav'
//     // buff = buff.toString('base64'); //remakes buffer as string
//     // console.log(buff)
//     return res //buff
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
// }
//getBlob("https://files.graph.cool/cjrfet7u94als0129de33wha3/cjt0o_idtw0a9h0160bs5bs5ee")



//saves new audio
//   function getNew(r){
//     var url = r
//     console.log(url)
//     var slice = url.slice(38)
//     var newPath = "audio/" + slice + ".wav"
//     var command = `wget ${url}`;
//     var command2 = `mv ${slice} ${newPath}`;

//     try {
//         // terminal(command)
//         console.log(command)
//         // terminal(command2)
//         console.log(command);
//         return newPath
//     } catch(err) {
//         console.log(err)
//     }
//   }
  
  // getNew(reqUrl).then(newPath => {
      // res.send('<a href="http://innervoiceover.glitch.me/${newPath}">audio file</a>');
    // }).catch(err=>{console.log(err)})

