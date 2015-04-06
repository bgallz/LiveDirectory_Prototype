angular.module('starter.controllers', ['firebase'])

// Controllers
.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

// Triggered on a button click, or some other target
$scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="password" ng-model="data.wifi">',
    title: 'Enter Wi-Fi Password',
    subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 3000);
 };
 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Consume Ice Cream',
     template: 'Are you sure you want to eat this ice cream?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };

 // An alert dialog
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Don\'t eat that!',
     template: 'It might taste good'
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
})

.controller('DirectoryCtrl', function($scope, $ionicScrollDelegate, Specialties) {
	var letters = $scope.letters = [];
	var currentCharCode = 'A'.charCodeAt(0) - 1;
	var directoryList = $scope.directoryList = [];

	function sortList(a, b){
		return a.name > b.name ? 1: -1;
	}
	function addLetter(code){
		var letter = String.fromCharCode(code);
		directoryList.push({
			isLetter: true,
			letter: letter
		});
		letters.push(letter);
	}

	Specialties.$watch(function(event){
		// Sort the list
		Specialties.sort(sortList);

		directoryList = [];
		letters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Specialties
		.forEach(function(specialty){
			// Get first letter of the specialty
			// Put the letter in the letters array

			var specialtyCharCode = specialty.name.toUpperCase().charCodeAt(0);
			var difference = specialtyCharCode - currentCharCode;

			for(var i=1; i<=difference; i++){
				addLetter(currentCharCode + i);
			}
			
			currentCharCode = specialtyCharCode;
			directoryList.push(specialty);
		});

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addLetter(i);
		}
	});

	var letterHasMatch = {};
	$scope.getDirectory = function(){
		letterHasMatch = {};
		// Filter contacts by $scope.search
		// Additionally, filter letters so that they only show if there
		// is one or more matching contact
		return directoryList.filter(function(item){
			var itemDoesMatch = !$scope.search || item.isLetter ||
			item.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

			if(!item.isLetter && itemDoesMatch){
				var letter = item.name.charAt(0).toUpperCase();
				letterHasMatch[letter] = true;
			}

			return itemDoesMatch;
		}).filter(function(item){
			// Finally, re-filter all of the letters and take out ones that don't have a match
			if(item.isLetter && !letterHasMatch[item.letter]){
				return false;
			}
			return true;
		});
	};

	$scope.getItemHeight = function(specialty){
		if(specialty){
			return specialty.isLetter ? 30:55;
		} else {
			return 100;
		}
	};
	$scope.getItemLineHeight = function(specialty){
		if(specialty){
			return specialty.isLetter ? 0:25;
		} else {
			return 25;
		}
	};
	$scope.clearSearch = function(){
		$scope.search = '';
	};
	$scope.scrollToTop = function(){
		$ionicScrollDelegate.scrollTop(true);
	};
	$scope.getLink = function(specialtyId){
		if(specialtyId){
			return '#/tab/specialty/' + specialtyId + '';
		} else {
			return '#';
		}
	};
})

.filter('searchDirectory', function(){
 return function (items, query) {
    var filtered = [];
    var letterMatch = new RegExp(query, 'i');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (query) {
        if (letterMatch.test(item.name.substring(0, query.length))) {
          filtered.push(item);
        }
      } else {
        filtered.push(item);
      }
    }
    return filtered;
  };
})

.controller('SpecialtyCtrl', function($scope, $stateParams, Specialties, Staff, Teams){

	var specialtyId = $stateParams.specialtyId;

	var staffLetters = [];
	var teamLetters = [];
	var currentCharCode = 'A'.charCodeAt(0) - 1;

	var consultsList = $scope.consultsList = [];
	var allStaff = $scope.allStaff = [];
	var teamList = $scope.teamList = [];
	var specialtyObj = $scope.specialty = {};
	var letterHasMatch = {};

	// Default all to false until we have the Firebase data to decide
	$scope.isAllActive = false;
	$scope.isConsultsActive = false;
	$scope.isTeamsActive = false;
	$scope.hasConsults = false;

	function getHasConsults(staffList){
		var hasConsults = false;
		for(var i=0; i<staffList.length; i++){
			if(staffList[i].is_consult){
				hasConsults = true;
			}
		}
		return hasConsults;
	}
	function sortList(a, b){
		return a.name > b.name ? 1: -1;
	}
	function addStaffLetter(code){
		var letter = String.fromCharCode(code);
		consultsList.push({
			isLetter: true,
			letter: letter
		});
		allStaff.push({
			isLetter: true,
			letter: letter
		});
		staffLetters.push(letter);
	}
	function addTeamLetter(code){
		var letter = String.fromCharCode(code);
		teamList.push({
			isLetter: true,
			letter: letter
		});
		teamLetters.push(letter);
	}
	function addTeamsToStaff(teamList, staffList){
		console.log(teamList);
		console.log(staffList);
		for(var i=0; i<staffList.length; i++){
			// Going through the list of staff members
			// find the team that matches their team_id
			// and add it to the staff record
			for(var k=0; k<teamList.length; k++){
				// Find the team
				if(staffList[i].team_id == teamList[k].id){
					staffList[i].team_name = teamList[k].name;
					break;
				}
			}
		}
	}

	Staff.$loaded().then(function(array){
		Staff.sort(sortList);

		var allArray = array.getBySpecialtyId(specialtyId);
		$scope.hasConsults = getHasConsults(allArray);

		if($scope.hasConsults){
			// Default to consults if we have them
			$scope.isConsultsActive = true;
		} else {
			// If no consults, default to all
			$scope.isAllActive = true;
		}

		// Reset the local variables
		consultsList = [];
		allStaff = [];
		staffLetters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Staff
		.forEach(function(staff){
			if(staff.specialty_id == specialtyId){
				// Get first letter of the specialty
				// Put the letter in the letters array
				var specialtyCharCode = staff.name.toUpperCase().charCodeAt(0);
				var difference = specialtyCharCode - currentCharCode;

				for(var i=1; i<=difference; i++){
					addStaffLetter(currentCharCode + i);
				}
				
				currentCharCode = specialtyCharCode;

				// Assign the link href
				staff.hrefVal = '#/tab/staff/' + staff.username;
				if(staff.is_consult){
					consultsList.push(staff);
				}
				allStaff.push(staff);
			}
		});

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addStaffLetter(i);
		}
	});

	Staff.$watch(function(event){
		Staff.sort(sortList);

		// Reset the local variables
		consultsList = [];
		allStaff = [];
		staffLetters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Staff
		.forEach(function(staff){
			if(staff.specialty_id == specialtyId){
				// Get first letter of the specialty
				// Put the letter in the letters array
				var specialtyCharCode = staff.name.toUpperCase().charCodeAt(0);
				var difference = specialtyCharCode - currentCharCode;

				for(var i=1; i<=difference; i++){
					addStaffLetter(currentCharCode + i);
				}
				
				currentCharCode = specialtyCharCode;

				// Assign the link href
				staff.hrefVal = '#/tab/staff/' + staff.username;
				if(staff.is_consult){
					consultsList.push(staff);
				}
				allStaff.push(staff);
			}
		});

		$scope.hasConsults = getHasConsults(consultsList);

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addStaffLetter(i);
		}

		addTeamsToStaff(teamList, allStaff);
		addTeamsToStaff(teamList, consultsList);
	});

	Teams.$loaded().then(function(array){
		Teams.sort(sortList);

		// Reset the local variables
		teamList = [];
		teamLetters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Teams
		.forEach(function(team){
			if(team.specialty_id == specialtyId){
				// Get first letter of the specialty
				// Put the letter in the letters array
				var specialtyCharCode = team.name.toUpperCase().charCodeAt(0);
				var difference = specialtyCharCode - currentCharCode;

				for(var i=1; i<=difference; i++){
					addTeamLetter(currentCharCode + i);
				}
				
				currentCharCode = specialtyCharCode;

				// Assign the link href
				team.hrefVal = '#/tab/team/' + team.id;
				teamList.push(team);
			}
		});

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addTeamLetter(i);
		}

		addTeamsToStaff(teamList, allStaff);
		addTeamsToStaff(teamList, consultsList);
	});

	// Watch for new/updated/removed teams for this specialty
	Teams.$watch(function(event){
		Teams.sort(sortList);

		// Reset the local variables
		teamList = [];
		teamLetters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Teams
		.forEach(function(team){
			if(team.specialty_id == specialtyId){
				// Get first letter of the specialty
				// Put the letter in the letters array
				var specialtyCharCode = team.name.toUpperCase().charCodeAt(0);
				var difference = specialtyCharCode - currentCharCode;

				for(var i=1; i<=difference; i++){
					addTeamLetter(currentCharCode + i);
				}
				
				currentCharCode = specialtyCharCode;

				// Assign the link href
				team.hrefVal = '#/tab/team/' + team.id;
				teamList.push(team);
			}
		});

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addTeamLetter(i);
		}
	});

	// Watch for updates to the specialty we are on
	Specialties.$loaded().then(function(array){
		var syncArray = array.getById(specialtyId);
		if(syncArray.length > 0){
			$scope.specialty = syncArray[0];
		}
	});

	// Watch for updates to the specialty we are on
	Specialties.$watch(function(event){
		var syncArray = Specialties.getById(specialtyId);
		if(syncArray.length > 0){
			$scope.specialty = syncArray[0];
		}
	});

	// Scope functions
	$scope.getStaff = function(){
		letterHasMatch = {};

		if($scope.isAllActive){
			return allStaff.filter(function(item){
				var itemDoesMatch = !$scope.search || item.isLetter ||
				item.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

				if(!item.isLetter && itemDoesMatch){
					var letter = item.name.charAt(0).toUpperCase();
					letterHasMatch[letter] = true;
				}

				return itemDoesMatch;
			}).filter(function(item){
				// Finally, re-filter all of the letters and take out ones that don't have a match
				if(item.isLetter && !letterHasMatch[item.letter]){
					return false;
				}
				return true;
			});
		}
		else if($scope.isConsultsActive){
			return consultsList.filter(function(item){
				var itemDoesMatch = !$scope.search || item.isLetter ||
				item.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

				if(!item.isLetter && itemDoesMatch){
					var letter = item.name.charAt(0).toUpperCase();
					letterHasMatch[letter] = true;
				}

				return itemDoesMatch;
			}).filter(function(item){
				// Finally, re-filter all of the letters and take out ones that don't have a match
				if(item.isLetter && !letterHasMatch[item.letter]){
					return false;
				}
				return true;
			});
		}
		else if($scope.isTeamsActive){
			return teamList.filter(function(item){
				var itemDoesMatch = !$scope.search || item.isLetter ||
				item.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

				if(!item.isLetter && itemDoesMatch){
					var letter = item.name.charAt(0).toUpperCase();
					letterHasMatch[letter] = true;
				}

				return itemDoesMatch;
			}).filter(function(item){
				// Finally, re-filter all of the letters and take out ones that don't have a match
				if(item.isLetter && !letterHasMatch[item.letter]){
					return false;
				}
				return true;
			});
		}
	};
	$scope.getItemHeight = function(staff){
		if(staff){
			return staff.isLetter ? 30:60;
		} else {
			return 60;
		}
	};
	$scope.getItemLineHeight = function(staff){
		if(staff){
			return staff.isLetter ? 0:25;
		} else {
			return 25;
		}
	};
	$scope.getItemMargin = function(staff){
		if(staff.team_name){
			return '10px 0';
		} else {
			return '20px 0';
		}
	};
	$scope.clearSearch = function(){
		$scope.search = '';
	};
	$scope.scrollToTop = function(){
		$ionicScrollDelegate.scrollTop(true);
	};
	$scope.showAll = function(){
		$scope.isAllActive = true;
		$scope.isConsultsActive = false;
		$scope.isTeamsActive = false;
	};
	$scope.showConsults = function(){
		$scope.isAllActive = false;
		$scope.isConsultsActive = true;
		$scope.isTeamsActive = false;
	};
	$scope.showTeams = function(){
		$scope.isAllActive = false;
		$scope.isConsultsActive = false;
		$scope.isTeamsActive = true;
	};
})

.controller('TeamCtrl', function($scope, $stateParams, Staff, Teams){
	var teamId = $stateParams.teamId;

	var staffList = $scope.staffList = [];
	var staffLetters = [];
	var letterHasMatch = {};

	$scope.team = {};

	function sortList(a, b){
		return a.name > b.name ? 1: -1;
	}
	function addStaffLetter(code){
		var letter = String.fromCharCode(code);
		staffList.push({
			isLetter: true,
			letter: letter
		});
		staffLetters.push(letter);
	}

	Teams.$loaded().then(function(array){
		var syncArray = array.getById(teamId);
		if(syncArray.length > 0){
			$scope.team = syncArray[0];
		}
	});

	Staff.$loaded().then(function(array){
		Staff.sort(sortList);

		// Reset the local variables
		staffList = [];
		staffLetters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Staff
		.forEach(function(staff){
			if(staff.team_id == teamId){
				// Get first letter of the specialty
				// Put the letter in the letters array
				var specialtyCharCode = staff.name.toUpperCase().charCodeAt(0);
				var difference = specialtyCharCode - currentCharCode;

				for(var i=1; i<=difference; i++){
					addStaffLetter(currentCharCode + i);
				}
				
				currentCharCode = specialtyCharCode;

				// Assign the link href
				staff.hrefVal = '#/tab/staff/' + staff.username;
				staffList.push(staff);
			}
		});

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addStaffLetter(i);
		}
	});

	Staff.$watch(function(event){
		Staff.sort(sortList);

		// Reset the local variables
		staffList = [];
		staffLetters = [];
		currentCharCode = 'A'.charCodeAt(0) - 1;

		Staff
		.forEach(function(staff){
			if(staff.team_id == teamId){
				// Get first letter of the specialty
				// Put the letter in the letters array
				var specialtyCharCode = staff.name.toUpperCase().charCodeAt(0);
				var difference = specialtyCharCode - currentCharCode;

				for(var i=1; i<=difference; i++){
					addStaffLetter(currentCharCode + i);
				}
				
				currentCharCode = specialtyCharCode;

				// Assign the link href
				staff.hrefVal = '#/tab/staff/' + staff.username;
				staffList.push(staff);
			}
		});

		// If names ended before Z, add everything up to Z
		for(var i=currentCharCode + 1; i<= 'Z'.charCodeAt(0); i++){
			addStaffLetter(i);
		}
	});

	$scope.getStaff = function(){
		letterHasMatch = {};

		return staffList.filter(function(item){
			var itemDoesMatch = !$scope.search || item.isLetter ||
			item.name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

			if(!item.isLetter && itemDoesMatch){
				var letter = item.name.charAt(0).toUpperCase();
				letterHasMatch[letter] = true;
			}

			return itemDoesMatch;
		}).filter(function(item){
			// Finally, re-filter all of the letters and take out ones that don't have a match
			if(item.isLetter && !letterHasMatch[item.letter]){
				return false;
			}
			return true;
		});
	};
	$scope.getItemHeight = function(staff){
		if(staff){
			return staff.isLetter ? 30:55;
		} else {
			return 100;
		}
	};
	$scope.getItemLineHeight = function(staff){
		if(staff){
			return staff.isLetter ? 0:25;
		} else {
			return 25;
		}
	};
})

.controller('StaffCtrl', function($scope, $stateParams, Staff, Teams){
	var staffUsername = $stateParams.staffId;

	$scope.staff = {};

	// Load and listen for the staff member
	Staff.$loaded().then(function(array){
		Staff
		.forEach(function(staff){
			if(staff.username == staffUsername){
				// Found the staff member!
				$scope.staff = staff;
				console.log(staff);
				Teams.$loaded().then(function(array){
					var syncArray = array.getById(staff.team_id);
					if(syncArray.length > 0){
						$scope.team = syncArray[0];
					}
				});
			}
		});
	});

	Staff.$watch(function(event){
		Staff
		.forEach(function(staff){
			if(staff.username == staffUsername){
				// Found the staff member!
				$scope.staff = staff;
				console.log(staff);
			}
		});
	});
})

.filter('messagesFilter', function(){
	return 
})

.controller('MessagesCtrl', function($scope, Chats) {
	$scope.chats = Chats.all();

	$scope.isAllActive = true;
	$scope.isHighPriorityActive = false;
	$scope.isLowPriorityActive = false;

	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
 	$scope.showAll = function(){
		$scope.isAllActive = true;
		$scope.isHighPriorityActive = false;
		$scope.isLowPriorityActive = false;
		$scope.chats = Chats.all();
	};
	$scope.showHighPriority = function(){
		$scope.isAllActive = false;
		$scope.isHighPriorityActive = true;
		$scope.isLowPriorityActive = false;
		$scope.chats = Chats.highPriority();
	};
	$scope.showLowPriority = function(){
		$scope.isAllActive = false;
		$scope.isHighPriorityActive = false;
		$scope.isLowPriorityActive = true;
		$scope.chats = Chats.lowPriority();
	};
})

.controller('MessageDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('CallLogCtrl', function($scope, Calls) {
	$scope.calls = Calls.all();

	$scope.isAllActive = true;
	$scope.isMissedActive = false;

 	$scope.showAll = function(){
		$scope.isAllActive = true;
		$scope.isMissedActive = false;
		$scope.calls = Calls.all();
	};
 	$scope.showMissed = function(){
		$scope.isAllActive = false;
		$scope.isMissedActive = true;
		$scope.calls = Calls.missed();
	};
});
