import gameOfLifeTemplate from './game-of-life.html';

function gameOfLifeDirective($interval) {
    'ngInject';

    return {
        link: (scope) => {
            scope.cells = {};
            scope.width = 8;
            scope.height = 6;
            scope.generation = 1;
            scope.maxWidth = 999;
            scope.maxHeight = 999;

            scope.isPlaying = false;

            scope.getCount = (key, size) => {
                var loopObject = {};
                for(var i=0; i<size; i++){
                    loopObject[key + i] = i;
                }
                return loopObject;
            }

            scope.startGame = () => {
                scope.isPlaying = true;
            }

            scope.swapCellAt = (x, y) => {
                var key = x + ':' + y;

                scope.cells[key].currentState = !scope.cells[key].currentState;
            }

            scope.cellIsAlive = (x, y) => {
                var key = x + ':' + y;

                if(scope.cells[key] === undefined) {
                    scope.cells[key] = {};
                    scope.cells[key].currentState = false;
                }

                return scope.cells[key].currentState;
            }

            scope.$watch(() => {
                return scope.isPlaying;
            }, () => {
                if(scope.isPlaying === true){
                    var generationsLeft = scope.generation;
                    var stop = $interval(() =>{
                        scope.determineCellFutureStates();
                        scope.updateCellStates();
                        generationsLeft -= 1;
                        if(generationsLeft === 0) {
                            $interval.cancel(stop);
                            stop = undefined;
                            scope.isPlaying = false;
                        }
                    }, 500);
                }
            });

            scope.$watch(() => {
               return scope.height + scope.width;
            }, ()=> {
                scope.cells = {};
            });

            scope.determineCellFutureStates = () => {
                angular.forEach(scope.cells, (value, key) => {
                    var location = key.split(':');
                    scope.setCellFutureState(location[0], location[1]);
                });
            }

            scope.updateCellStates = () => {
                angular.forEach(scope.cells, (value, key) => {
                    scope.cells[key].currentState = scope.cells[key].futureState;
                });
            }

            scope.setCellFutureState = (x, y) => {
                var thisCellKey = x + ':' + y;

                scope.setLivingCellFriendsCount(x, y);

                if(scope.cells[thisCellKey].currentState){
                    if(scope.cells[thisCellKey].liveFriends < 2){
                        scope.cells[thisCellKey].futureState = false;
                    } else if(scope.cells[thisCellKey].liveFriends > 3){
                        scope.cells[thisCellKey].futureState = false;
                    } else {
                        scope.cells[thisCellKey].futureState = true;
                    }
                } else {
                    if(scope.cells[thisCellKey].liveFriends === 3) {
                        scope.cells[thisCellKey].futureState = true;
                    } else {
                        scope.cells[thisCellKey].futureState = false;
                    }
                }
            }

            scope.setLivingCellFriendsCount = (x, y) => {
                var thisCellKey = x + ':' + y;
                scope.cells[thisCellKey].liveFriends = 0;

                if(scope.topLeftAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.topCenterAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.topRightAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.centerLeftAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.centerRightAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.bottomLeftAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.bottomCenterAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
                if(scope.bottomRightAlive(x, y)){
                    scope.cells[thisCellKey].liveFriends += 1;
                }
            }

            scope.topLeftAlive = (x, y) => {
                var key = (parseInt(x)-1) + ':' + (parseInt(y)-1);
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.topCenterAlive = (x, y) => {
                var key = x + ':' + (parseInt(y)-1)
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.topRightAlive = (x, y) => {
                var key = (parseInt(x)+1) + ':' + (parseInt(y)-1);
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.centerLeftAlive = (x, y) => {
                var key = (parseInt(x)-1) + ':' + y;
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.centerRightAlive = (x, y) => {
                var key = (parseInt(x)+1) + ':' + y;
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.bottomLeftAlive = (x, y) => {
                var key = (parseInt(x)-1) + ':' + (parseInt(y)+1);
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.bottomCenterAlive = (x, y) => {
                var key = x + ':' + (parseInt(y)+1)
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }

            scope.bottomRightAlive = (x, y) => {
                var key = (parseInt(x)+1) + ':' + (parseInt(y)+1);
                return scope.cells[key] !== undefined && scope.cells[key].currentState;
            }
        },
        restrict: 'E',
        scope: {},
        template: gameOfLifeTemplate,
    }
}

export default gameOfLifeDirective;
