// server.js
// 
var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

let mydb, cloudant;
var dbName = 'ivo';

// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { console.log(e) }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

// cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
let cloudantURL = process.env.CLOUDANT_URL || "https://47b4e133-47f2-4e95-b012-c07107ec01da-bluemix.cloudantnosqldb.appdomain.cloud/"
let cloudantAPIKey = process.env.CLOUDANT_IAM_API_KEY || "2mD3NMnP8QpKWp35HD22tpU7ekkYPynE6LNrNvf7EMMo"
cloudant = Cloudant({ url: cloudantURL, plugins: { iamauth: { iamApiKey: cloudantAPIKey } } });

// if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/[Cc][Ll][Oo][Uu][Dd][Aa][Nn][Tt]/)) {
  
//   // Initialize database with credentials
//   if (appEnv.services['cloudantNoSQLDB']) {
//     cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
//   } else {
//      // user-provided service with 'cloudant' in its name
//      cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
//   }
// } else if (process.env.CLOUDANT_URL){

//   if (process.env.CLOUDANT_IAM_API_KEY){ // IAM API key credentials
//     let cloudantURL = process.env.CLOUDANT_URL
//     let cloudantAPIKey = process.env.CLOUDANT_IAM_API_KEY
//     cloudant = Cloudant({ url: cloudantURL, plugins: { iamauth: { iamApiKey: cloudantAPIKey } } });
//   } else { //legacy username/password credentials as part of cloudant URL
//     cloudant = Cloudant(process.env.CLOUDANT_URL);
//   }
// }

cloudant.db.create(dbName, function(err, data) {
  if(!err) //err if database doesn't already exists
    console.log("Created database: " + dbName);
});

// Specify the database we are going to use (db)...
mydb = cloudant.db.use(dbName);



// app.get("/api/getall", function(req, res){
//     db.postAllDocs({
//       db: dbName,
//       includeDocs: true
//     }).then(res => {
//       console.log(res.result);
//     }).catch(err = console.log(err));
// })
    
app.get("/api/info", function(req, res){
  mydb.info({ include_docs: true })
    .then(function(data) {
      res.send(data)
  }).catch(function(err){console.log(err)});
})

app.get("/api/getall", function(req, res){
  docs = []
  mydb.list({ include_docs: true }) //attachments: true //db.allDocs({attachments:true})
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
  // mydb.list().then(function(data) {
  //   res.send(data)
  // }).catch(function(err){console.log(err)});
})

app.get("/api/getid", function(req, res){
  var id = req.params.id //uses url to insert ID from request
  //this works without params but the url GET call doesn't?
  
  mydb.get(id, { attachments: true })
      .then(function (doc) {
      res.send(doc); 
      }).catch(function(err){console.log(err)});
});

app.post("/api/getfile", function(req, res){
  var docId = req.params.docid
  var attachmentName = req.params.fileid

  // mydb.get(FILE_ID, { attachments: true })
  //     .then(function (doc) {
  //     res.send(doc); 
  //     }).catch(function(err){console.log(err)});

  mydb.getAttachment({
    db: dbName,
    docId: req.params.docid,
    attachmentName: req.params.fileid
  }).then(response => {
    let attachment = response.result //as Readable;
    attachment.pipe(process.stdout);
  });
})


var insertOne = {};
var getAll = {};


//serve static file (index.html, images, css)
// app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));


var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});


////POUCHDB OLD

// ////db queries
// const query = require('public/query.js')

// app.get('/all').all = function(req, res){  
//   var docs = []
//   db.allDocs({ include_docs: true }) //db.allDocs({attachments:true})
//     .then(function(doc) {
//       docs.push(doc)
//       //console.log(docs)
//       return docs
//     })
//     .then(function(all){
//       res.send(all)
//     })
//     .catch(function(err) {
//       console.log("err: " + err);
//     });
// };

// app.get('/query', query.all)
// app.get('/queryTextOnly', query.textOnly)
// app.get("/query/:id", query.one) //uses url to insert parameters?
// // app.post("/query", query.update) //uses url to insert parameters? ///:id/:updateKey/:updateValue"
// app.get('/bulkrev', query.bulk)
// app.get('/bulkadd', query.bulkAdd)
// app.get('/deletes', query.deletes)
// app.get('/dbinfo', query.info)
// // app.get('/find', query.findNoFile2)

// app.post("/file", (req, res) => {
//   console.log(req.body)
//   var name = req.body.name
//   var blob = req.files.blob
//   console.log(blob)
//   const path = __dirname + "/audio/" + blob.name //'https://cdn.glitch.com/155d0693-823a-4ff9-a75d-d5b22fccb7c1%2F'
//   const size = blob.size
//   const content_type = blob.mimetype
  
//   var createdAt = req.body.createdAt
//   console.log(createdAt)
  
//   blob.mv(path, (err) => {
//     if (err) {
//       console.error(err)
//       res.writeHead(500, {
//         'Content-Type': 'application/json'
//       })
//       res.end(JSON.stringify({ status: 'error', message: err }))
//       return
//     }
    
//     var newFile= {
//         "_id": `${name}`,
//         "name": `${blob.name}`,
//         "text": "",
//         "size": `${size}`,
//         "createdAt": `${createdAt}`,
//         "content_type": `${content_type}`,
//         "file1id": `${blob.name}`,
//         "file1url": `${path}`,
//         "file2id": "",
//         "file2url": ""
//       }
    
//     // newFile = JSON.stringify(newFile);
//     // console.log(typeof(newFile))
//     console.log(newFile)
//     // newFile = JSON.parse(newFile);
//     // console.log(typeof(newFile))
//     // console.log(newFile)

//     //NEED TO SEND FILE INSTEAD AND SAVE IT INTERNALLY

//     //res.send('<p>got it</p><p>${req.body.name}</p>')

//     db.put(newFile)
//       .then(function (res) {
//         console.log(res);
        
//     }).catch(function(err){  
//         console.error(err)
//         res.writeHead(500, {
//           'Content-Type': 'application/json'
//         })
//         res.end(JSON.stringify({ status: 'error', message: err }))
//         return
//     })
    
//     res.writeHead(200, {
//       'Content-Type': 'application/json'
//     })
//     res.end(JSON.stringify({ status: 'success', path: blob.name, newEntry: newFile }))
//   })
// });

////IBM DEFAULTS
  //insertOne = function(doc, response) {
  //   db.insert(doc, function(err, body, header) {
  //     if (err) {
  //       console.log('[db.insert] ', err.message);
  //       response.send("Error");
  //       return;
  //     }
  //     doc._id = body.id;
  //     response.send(doc);
  //   });
  // }
  
  // //was .list before .postAllDocs
  // getAll = function(response) {
  //   var names = [];  
  //   db.list({ include_docs: true }, function(err, body) {
  //     console.log('got here')
  //     if (!err) {
  //       body.rows.forEach(function(row) {
  //         if(row.doc.name)
  //           names.push(row.doc.name);
  //       });
  //       response.json(names);
  //     }
  //   });
  //   //return names;
  // }
  
  // /* Endpoint to greet and add a new visitor to database.
  // * Send a POST request to localhost:3000/api/visitors with body
  // * {
  // *   "name": "Bob"
  // * }
  // */
  // app.post("/api/visitors", function (request, response) {
  //   var userName = request.body.name;
  //   var doc = { "name" : userName };
  //   if(!db) {
  //     console.log("No database.");
  //     response.send(doc);
  //     return;
  //   }
  //   insertOne(doc, response);
  // });
  
  // app.get("/api/visitors", function (request, response) {
  //   var allData = [];
  //   if(db) {
  //     response.json(allData);
  //     console.log('reached GET')
  //     return;
  //   }
  //   getAll(response);
  // });
  