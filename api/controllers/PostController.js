/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const pager = require('sails-pager');
const extend = require('util')._extend;
const striptags = require('striptags');

module.exports = {

  index: function (req, res) {
    var perPage = req.query.per_page || 20;
    var currentPage = req.query.page || 1;
    var conditions = {};
    var userId = null;

    if (req.user) {
      userId = req.user.id
    }

    pager.paginate(
      Post, conditions, currentPage, perPage, ["owner", "attachment"], 'createdAt DESC')
      .then(function (records) {
        async.map(records.data,
          function (item, cb) {
            Insights.get(item.id, userId).then(function (data) {
              extend(item, data);
              cb(null, item)
            }, function (err) {
              cb(err);
            })
          },
          function (err, result) {
            if (err) return res.json(400, Errors.build(err, Errors.ERROR_UNKNOWN));
            records.data = result;
            return res.json(records);
          });
      }).catch(function (err) {
      return res.json(400, err)
    });
  },
  create: function (req, res) {

    var data = req.body;
    data.owner = req.user.id;

    data.text = striptags(data.text);

    Post.create(data).then(function (post) {
      return res.json(post)
    }).catch(function (err) {
      return res.json(400, Errors.build(err, Errors.ERROR_UNKNOWN));
    })
  },

  edit: function (req, res) {


    return res.json({
      "text": "string",
      "owner": "59f2219ac48fe41c182ffc4e",
      "clc": 0,
      "createdAt": "2017-11-08T11:34:47.332Z",
      "updatedAt": "2017-11-08T11:34:47.332Z",
      "id": "post_37607ac28d3220fe891530b5551bb021"
    });
  },
  delete: function (req, res) {


    return res.json(204, {});
  }

};

