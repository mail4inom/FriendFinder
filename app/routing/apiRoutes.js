
var users = require("../data/friends");

var newUser;
module.exports = function (app) {

  app.get("/api/friends", function (req, res) {
    res.json(users)
  })
 

  app.post("/api/friends", function (req, res) {
    newUser = req.body;
    var match = bestMatch([newUser], users);
    users.push(newUser);
    res.json(match);
  })

 
  function compare(arr1, arr2) {
    var sum = 0;
    for (var i = 0; i < arr1.length; i++) {
      var num1 = arr1[i];
      var num2 = arr2[i];
      if (num1 !== num2) {
        sum += Math.abs(num1 - num2);
      }
    }
    return sum;
  }

  function getScores(arrays) {
    var scores = [];
    for (var i = 0; i < arrays.length; i++) {
      var obj = arrays[i]
      for (var key in obj) {
        if (key === 'scores') {
          scores.push(obj[key])
        }
      }
    }
    return scores;
  }

  function switchArr(userArr, otherScores) {
    var user = userArr[0].scores;
    var otherScoresArr = [];
    var allSums = [];
    var scores = getScores(otherScores)
    for (var i = 0; i < scores.length; i++) {
      var eachArr = scores[i];
      allSums.push(compare(user, eachArr));
    }
    return allSums;
  }
 
  function findSmallest(array) {
    var smallest = null;
    for (var i = 0; i < array.length; i++) {
      var num = array[i];
      if (smallest === null || num < smallest) {
        smallest = num;
      }
    }
    return smallest;
  }

  function findTheOwner(scores, names) {
    var obj = {};
    for (var i = 0; i < names.length; i++) {
      var eachPerson = names[i];
      for (var key in eachPerson) {
        if (obj[eachPerson["name"]] === undefined) {
          obj[eachPerson["name"]] = scores[i];
        }
      }
    }
    return obj;
  }

  function test(obj) {
    var sma = null;
    var name = "";
    for (var key in obj) {
      if (sma === null || sma > obj[key]) {
        sma = obj[key];
        name = (key)
      }
    }
    return name;
  }

  function getPhoto(name, array) {
    var obj = {}
    for (var i = 0; i < array.length; i++) {
      var eachPer = array[i];
      for (var key in eachPer) {
        if (name === eachPer['name']) {
          return eachPer;
        }
      }
    }
  }

  function bestMatch(newUser, allUsers) {
    var scores = switchArr(newUser, allUsers);
    var allScores = findTheOwner(scores, allUsers)
    var smallest = test(allScores);
    var allInfo = getPhoto(smallest, allUsers)
    return allInfo;
  }

}