var connectedRef = new Firebase("https://decisionmaker.firebaseio.com/.info/connected");
connectedRef.on("value", function (snap) {
    if (snap.val() === true) {
        $("#connected").slideDown();
        $("#dced").slideUp();
        console.log("connected");
    } else {
        $("#connected").slideUp();
        $("#dced").slideDown();
    }
});
var app = angular.module('DecMak', ['ngMaterial', 'firebase', 'ui.bootstrap', 'ngTouch']);
app
    .controller('AppCtrl', function ($scope, $rootScope, $location, $firebase) {
        var ref = new Firebase("https://decisionmaker.firebaseio.com/questions");
        var sync = $firebase(ref);
        var rq = new Array();
        $scope.Math = window.Math;
        var messagesArray = sync.$asArray();
        $scope.questions = messagesArray;
        $scope.questions.$loaded()
            .then(function () {
                $scope.getrandq();
                $scope.myquestions();
                $scope.questions.$watch(function () {
                    console.log("data changed!");
                    $scope.myquestions();
                });
            })
            .catch(function (error) {
                console.log("Error:", error);
            });
        var cho = [];
        var qun = new Array("Yes", "No");
        $scope.data = {
            selectedIndex: 1
        };
        $scope.next = function () {
            $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 3);
        };
        $scope.previous = function () {
            $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
        };
        $scope.remove = function () {
            var e = window.event,
                btn = e.target || e.srcElement;
            str = btn.id.substring(0, btn.id.length - 1);
            var index = cho.indexOf(str);
            if (index > -1) {
                cho.splice(index, 1);
            }
            if (cho.length < 1) {
                document.getElementById("initialopt").style.display = 'none';
                document.getElementById("optchange").innerHTML = "My Options are:";
            }
        };
        $scope.tryagain = function () {
            location.reload();
        };
        $scope.retryagain = function () {
            if (cho.length === 0) {
                alertify.alert('Please add some options first');
            } else {
                document.getElementById("optchange").innerHTML = "My Options are:";
                for (i = 0; i < $scope.cho.length; i++) {
                    $('[id="' + $scope.cho[i] + '"]').animate({
                        rotate: '0deg',
                        opacity: 1,
                        height: "toggle"
                    }, 0, function () {
                        // Animation complete.
                    }).show();
                }
                $scope.cho = cho;
            }
        };
        $scope.putchoice = function () {
            var a = cho.indexOf(document.getElementById("choicebox").value);
            var letters = /^[0-9a-zA-Z-',]+(\s{0,1}[0-9a-zA-Z-', ])*$/;
            if (document.getElementById("choicebox").value.match(letters)) {
                if (document.getElementById("choicebox").value.length < 2) {
                    alertify.alert('Option too short, please ammend');
                    return false;
                }
            } else {
                alertify.alert("Invalid Characters found. Please ammend choice");
                return false;
            }
            if (a < 0) {
                document.getElementById("initialopt").style.display = 'block';
                cho.push(document.getElementById("choicebox").value);
                $scope.cho = cho;
                document.getElementById("choicebox").value = "";
            } else {
                alertify.alert("Value already exists, can't add");
            }
        };
        $scope.ques = function () {
            var letters = /^[0-9a-zA-Z-'?,]+(\s{0,1}[0-9a-zA-Z-'?, ])*$/;
            if (document.getElementById("quesbox").value.match(letters)) {
                if (document.getElementById("quesbox").value.length < 2) {
                    alertify.alert('Question too short, please ammend');
                    return false;
                }
            } else {
                alertify.alert("Invalid Characters found. Please ammend Question");
                return false;
            }
            var rand = qun[Math.floor(Math.random() * qun.length)];
            $scope.qun = rand;
            $("#rotatingha").slideUp(400);
            $("#spinningSquaresG").delay(400).toggle();
            $("#spinningSquaresG").delay(3500).slideUp();
            $("#answerq").delay(4000).slideDown(600);
            document.getElementById("quesbox").value = "";

        };
        $scope.makedecision = function () {
            if (cho.length === 0) {
                alertify.alert('Please add some options first');
            } else {
                document.getElementById("optchange").innerHTML = "My Decision is:";
                console.log($scope.cho);
                var rand = $scope.cho[Math.floor(Math.random() * $scope.cho.length)];
                for (i = 0; i < $scope.cho.length; i++) {
                    if ($scope.cho[i] == rand) {

                    } else {
                        $('[id="' + $scope.cho[i] + '"]').animate({
                            rotate: '45deg',
                            opacity: 0,
                            height: "toggle"
                        }, 1000, function () {
                            // Animation complete.
                        });
                    }
                }
            }
        };
        $scope.myquestions = function () {
            var authData = ref.getAuth();
            var uid = authData.uid;
            var qx = new Array();
            for (i = 0; i < $scope.questions.length; i++) {
                if ($scope.questions[i].userid == uid) {
                    var total = +$scope.questions[i].Yes + +$scope.questions[i].No + +$scope.questions[i].Skip;

                    qx.push($scope.questions[i]);
                }
            }
            $scope.myqs = qx;
        }
        $scope.worldqask = function (text) {
            var authData = ref.getAuth();
            var uid = authData.uid;
            var d = new Date();
            var n = d.toISOString();
            $scope.questions.$add({
                Question: text,
                Yes: 0,
                No: 0,
                Skip: 0,
                userid: uid,
                timestamp: n
            });
            document.getElementById("quesbox").value = "";
        }
        $scope.getrandq = function () {
            var rand = $scope.questions[Math.floor(Math.random() * $scope.questions.length)];
            $scope.rq = rand.Question;
            $scope.Yes = rand.Yes;
            $scope.No = rand.No;
            $scope.Skip = rand.Skip;
            $scope.qid = rand.$id;
            $scope.randomStacked();
        };
        $scope.upvote = function () {
            var aRecordKey = $scope.qid;
            if ($scope.questions.$getRecord(aRecordKey) == null) {
                alertify.error("Error Connecting to Server. Please Try again", 1500);
            } else {
                var item = $scope.questions.$getRecord(aRecordKey);
                item.Yes = +item.Yes + +1;
                $scope.questions.$save(item).then(function () {
                    alertify.success("Record Collected", 1500);
                    $scope.getrandq();
                });
            }
        }
        $scope.downvote = function () {
            var aRecordKey = $scope.qid;
            if ($scope.questions.$getRecord(aRecordKey) == null) {
                alertify.error("Error Connecting to Server. Please Try again", 1500);
            } else {
                var item = $scope.questions.$getRecord(aRecordKey);
                item.No = +item.No + +1;
                $scope.questions.$save(item).then(function () {
                    alertify.success("Record Collected", 1500);
                    $scope.getrandq();
                });
            }
        }
        $scope.skipvote = function () {
            var aRecordKey = $scope.qid;
            if ($scope.questions.$getRecord(aRecordKey) == null) {
                alertify.error("Error Connecting to Server. Please Try again", 1500);
            } else {
                var item = $scope.questions.$getRecord(aRecordKey);
                item.Skip = +item.Skip + +1;
                $scope.questions.$save(item).then(function () {
                    alertify.success("Record Collected", 1500);
                    $scope.getrandq();
                });
            }
        }
        $scope.randomStacked = function () {
            $scope.stacked = [];
            var total = +$scope.Yes + +$scope.No + +$scope.Skip;
            if (+parseFloat($scope.Yes / total * 100).toFixed(0) + +parseFloat($scope.No / total * 100).toFixed(0) + +parseFloat($scope.Skip / total * 100).toFixed(0) > 100) {
                $scope.Skip = +parseFloat($scope.Skip / total * 100).toFixed(0) - 1;
            } else {
                $scope.Skip = +parseFloat($scope.Skip / total * 100).toFixed(0);
            }
            $scope.stacked.push({
                value: parseFloat($scope.Yes / total * 100).toFixed(0),
                type: "success"
            });
            $scope.stacked.push({
                value: parseFloat($scope.No / total * 100).toFixed(0),
                type: "danger"
            });
            $scope.stacked.push({
                value: $scope.Skip,
                type: "info"
            });
        };
    });
