var FIREBASE_URL = "https://incandescent-heat-7228.firebaseio.com/";

angular.module('starter.services', ['firebase'])

.service('Specialties', function($firebaseArray, $window){

  var specialtyList = $firebaseArray.$extend({
    all: function() {
      return this.$list;
    },
    getById: function(specialtyId) {
      return this.$list.filter(function(specialty){
        return specialty.id == specialtyId;
      });
    }
  });

  var ref = new $window.Firebase(FIREBASE_URL).child("specialties");
  var syncArray = new specialtyList(ref);

  return syncArray;
})

.service('Staff', function($firebaseArray, $window){

  var staffList = $firebaseArray.$extend({
    all: function() {
      return this.$list;
    },
    getById: function(staffId) {
      return this.$list.filter(function(staff){
        return staff.id == staffId;
      });
    },
    getBySpecialtyId: function(specialtyId) {
      return this.$list.filter(function(staff){
        return staff.specialty_id == specialtyId;
      });
    },
    getByTeamId: function(teamId) {
      return this.$list.filter(function(staff){
        return staff.team_id == teamId;
      });
    }
  });

  var ref = new $window.Firebase(FIREBASE_URL).child("staff");
  var syncArray = new staffList(ref);

  return syncArray;
})

.service('Teams', function($firebaseArray, $window){

  var teamList = $firebaseArray.$extend({
    all: function() {
      return this.$list;
    },
    getById: function(teamId) {
      return this.$list.filter(function(team){
        return team.id == teamId;
      });
    },
    getBySpecialtyId: function(specialtyId) {
      return this.$list.filter(function(team){
        return team.specialty_id == specialtyId;
      });
    }
  });

  var ref = new $window.Firebase(FIREBASE_URL).child("teams");
  var syncArray = new teamList(ref);

  return syncArray;
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Jon Appleseed',
    lastText: 'Call me about a new consult.',
    face: 'http://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_70,q_80,w_70,x_0,y_0,b_rgb:ffffff,g_face,r_max/v1/2/0/635630506260000000/jon_appleseed_jpg.jpg',
    lastUpdated: '10:30am',
    priority: 'low'
  }, {
    id: 1,
    name: 'Brian Stevens',
    lastText: 'Call me about an existing consult.',
    face: 'http://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_70,q_80,w_70,x_0,y_0,b_rgb:ffffff,g_face,r_max/v1/2/0/635630521190000000/brian_stevens_jpg.jpg',
    lastUpdated: 'Yesterday',
    priority: 'high'
  }, {
    id: 2,
    name: 'Alexandra Marcus',
    lastText: 'Check your email regarding test.',
    face: 'http://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_70,q_80,w_70,x_0,y_0,b_rgb:ffffff,g_face,r_max/v1/2/0/635630511260000000/alexandra_marcus_jpg.jpg',
    lastUpdated: 'Yesterday',
    priority: 'high'
  }];

  return {
    all: function() {
      return chats;
    },
    highPriority: function() {
      return chats.filter(function(chat){
        return chat.priority == 'high'
      });
    },
    lowPriority: function() {
      return chats.filter(function(chat){
        return chat.priority == 'low'
      });
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Calls', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var calls = [{
    id: 0,
    name: 'Jon Appleseed',
    face: 'http://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_70,q_80,w_70,x_0,y_0,b_rgb:ffffff,g_face,r_max/v1/2/0/635630506260000000/jon_appleseed_jpg.jpg',
    callTime: '11:00am',
    team: 'Cardiology Consult',
    isMissed: false
  }, {
    id: 1,
    name: 'Brian Stevens',
    face: 'http://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_70,q_80,w_70,x_0,y_0,b_rgb:ffffff,g_face,r_max/v1/2/0/635630521190000000/brian_stevens_jpg.jpg',
    callTime: 'Yesterday',
    team: 'Cardiology Consult',
    isMissed: true
  }, {
    id: 2,
    name: 'Alexandra Marcus',
    face: 'http://res.cloudinary.com/wodify/image/upload/a_exif,c_fill,h_70,q_80,w_70,x_0,y_0,b_rgb:ffffff,g_face,r_max/v1/2/0/635630511260000000/alexandra_marcus_jpg.jpg',
    callTime: 'Yesterday',
    team: 'Cardiology Consult',
    isMissed: false
  }];

  return {
    all: function() {
      return calls;
    },
    missed: function() {
      return calls.filter(function(call){
        return call.isMissed;
      });
    },
    remove: function(call) {
      calls.splice(calls.indexOf(call), 1);
    },
    get: function(callId) {
      for (var i = 0; i < calls.length; i++) {
        if (calls[i].id === parseInt(callId)) {
          return calls[i];
        }
      }
      return null;
    }
  };
});
