'use strict'

var mongoose = require('mongoose')
  , format = require('util').format

var host1 = '192.168.33.11'
  , host2 = '192.168.33.12'
  , host3 = '192.168.33.13'
  , port = 27017
  , url = format("mongodb://%s:%s,%s:%s,%s:%s/node-mongo-examples"
  , host1, port, host2, port, host3, port)

mongoose.connect(url, function(err, db) {
  if(err) throw err

  db.dropDatabase(function(err, result) {
    var collection = db.collection('test')

    collection.remove(function(err, collection) {
      // Insert 3 records
      for(var i = 0 i < 3; i++) {
        collection.insert({'a':i})
      }


      collection.count(function(err, count) {
        function(){


        console.log("There are " + count + " records in the test collection. Here they are:")

        collection.find().each(function(err, item) {
          if(item != null) {
            console.dir(item)
            console.log("created at " + new Date(item._id.generationTime) + "\n")
          }

          // Null signifies end of iterator
          if(item == null) {
            // Destory the collection
            collection.drop(function(err, collection) {
              db.close()
            })
          }
        })
      })
    })
  })
})