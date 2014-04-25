'use strict'

 /*
  * test mongodb replication set (3 members) by shutting down primary node.
  * One of the secondary nodes should be elected as primary.
  *
  * Replication set is initialized on host1. This node will start as primary.
  * cfr. ./provisioning/mongo1.sh
  *
  * find a per node config in ./provisioning/mongo.conf.*
  *
  * ------------------------------------------------------------------------------
  * Start vagrant
  *
  * Check rs.config() and rs.status() on one of the active nodes.
  *
  * Following script writes 60 documents to the replset, with 500ms intervals.
  * During this 30sec period, try to shutdown mongodb process of primary node.
  * One of the seconary nodes should take writes over.
  * The script should progress and do a successful read of 60 documents at the end.
  */

var mongoose = require('mongoose')
  , format = require('util').format
  , async = require('async')

var host1 = '192.168.33.11'
  , host2 = '192.168.33.12'
  , host3 = '192.168.33.13'
  , port = 27017
  , url = format("mongodb://%s:%s,%s:%s,%s:%s/node-mongo-examples"
  , host1, port, host2, port, host3, port)

var testSchema = mongoose.Schema({
  a: Number
})

var User = mongoose.model('user', testSchema)

function save(user, cb) {
  setTimeout(function() {
    user.save(cb)
  }, 500)
}

mongoose.connect(url)

var db = mongoose.connection
db.on('error', console.log.bind(console, 'connection error:'))
db.once('open', function cb() {

  // Insert 60 records
  var data = []
  for(var i = 0; i < 60; i++) {
    data.push(new User({'a':i}))
  }

  async.eachSeries(data, save, function(err) {
    if (err) throw err
    User.find(function(err, items) {
      items.map(function(item) {
        if(item != null) {
          console.dir(item)
          console.log("created at " + new Date(item._id.generationTime) + "\n")
        }
      })
      console.log("There are " + items.length() + " records in the test collection")
      User.remove({}, function(err, collection) {
        if (err) throw err
        db.close()
      })
    })
  })
})