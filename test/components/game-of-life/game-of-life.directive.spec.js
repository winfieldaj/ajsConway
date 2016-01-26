import _ from 'lodash';
import angular from 'angular';
import 'angular-mocks';

import GameOfLifeModule from '../../../src/components/game-of-life/game-of-life.module.js';

describe('gameOfLifeDirective', () => {
    let element;
    let parentScope;
    let scope;
    let timeout;

    beforeEach(angular.mock.module(GameOfLifeModule.name));

    beforeEach(() => {_setup()});

    it('should compile', () => {
       expect(element).toBeDefined();
    });

    it('should display table with 8 columns and 6 rows', () => {
        expect(element[0].lastElementChild.getAttribute('class')).toContain('table');
        expect(element[0].lastElementChild.children.length).toBe(6);
        expect(element[0].lastElementChild.firstElementChild.children.length).toBe(8);
    });

    it('should display table with updated columns and rows on user input change', () => {
        scope.height = 8;
        scope.width = 6;
        parentScope.$digest();
        expect(element[0].lastElementChild.getAttribute('class')).toContain('table');
        expect(element[0].lastElementChild.children.length).toBe(8);
        expect(element[0].lastElementChild.firstElementChild.children.length).toBe(6);

    });


    describe('when allFriend Cells Alive', () => {
        beforeEach(() => {
            allFriendCellsAlive();
        });

        it('should say bottom right cell is alive when true', () => {
            expect(scope.bottomRightAlive(1, 1)).toBe(true);
        });

        it('should say bottom center cell is alive when true', () => {
            expect(scope.bottomCenterAlive(1, 1)).toBe(true);
        });

        it('should say bottom left cell is alive when true', () => {
            expect(scope.bottomLeftAlive(1, 1)).toBe(true);
        });

        it('should say center left cell is alive when true', () => {
            expect(scope.centerLeftAlive(1, 1)).toBe(true);
        });

        it('should say center right cell is alive when true', () => {
            expect(scope.centerRightAlive(1, 1)).toBe(true);
        });

        it('should say top left cell is alive when true', () => {
            expect(scope.topLeftAlive(1, 1)).toBe(true);
        });

        it('should say top center cell is alive when true', () => {
            expect(scope.topCenterAlive(1, 1)).toBe(true);
        });

        it('should say top right cell is alive when true', () => {
            expect(scope.topRightAlive(1, 1)).toBe(true);
        });

        it('should have living friend count of 8', () => {
            scope.setLivingCellFriendsCount(1, 1);

            expect(scope.cells['1:1'].liveFriends).toBe(8);
        });
    });

    describe('when allFriend Cells Dead', () => {
        beforeEach(() => {
            allFriendCellsDead();
        });

        it('should say bottom right cell is dead when true', () => {
            expect(scope.bottomRightAlive(1, 1)).toBe(false);
        });

        it('should say bottom center cell is dead when true', () => {
            expect(scope.bottomCenterAlive(1, 1)).toBe(false);
        });

        it('should say bottom left cell is dead when true', () => {
            expect(scope.bottomLeftAlive(1, 1)).toBe(false);
        });

        it('should say center left cell is dead when true', () => {
            expect(scope.centerLeftAlive(1, 1)).toBe(false);
        });

        it('should say center right cell is dead when true', () => {
            expect(scope.centerRightAlive(1, 1)).toBe(false);
        });

        it('should say top left cell is dead when true', () => {
            expect(scope.topLeftAlive(1, 1)).toBe(false);
        });

        it('should say top center cell is dead when true', () => {
            expect(scope.topCenterAlive(1, 1)).toBe(false);
        });

        it('should say top right cell is dead when true', () => {
            expect(scope.topRightAlive(1, 1)).toBe(false);
        });

        it('should have living friend count of 0', () => {
            scope.setLivingCellFriendsCount(1, 1);

            expect(scope.cells['1:1'].liveFriends).toBe(0);
        });
    });

    describe('when cell future state will be alive', () => {
        it('should be alive when it is alive and has 2 living friends', () => {
            scope.cells['1:0'].currentState = true;
            scope.cells['2:0'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(true);
        });

        it('should be alive when it is alive and has 3 living friends', () => {
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(true);
        });

        it('should be alive when it is dead and has 3 living friends', () => {
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:1'].currentState = false;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(true);
        });
    });

    describe('when cell future state will be dead', () => {
        it('should be dead when it is alive and has 1 living friends', () => {
            scope.cells['1:0'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is alive and has 0 living friends', () => {
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is alive and has 8 living friends', () => {
            scope.cells['0:0'].currentState = true;
            scope.cells['1:0'].currentState = true;
            scope.cells['2:0'].currentState = true;
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is alive and has 7 living friends', () => {
            scope.cells['1:0'].currentState = true;
            scope.cells['2:0'].currentState = true;
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is alive and has 6 living friends', () => {
            scope.cells['2:0'].currentState = true;
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is alive and has 5 living friends', () => {
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is alive and has 4 living friends', () => {
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = true;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });

        it('should be dead when it is dead and does not have exactly 3 living friends', () => {
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].currentState = false;
            scope.setCellFutureState(1, 1);
            parentScope.$digest();

            expect(scope.cells['1:1'].futureState).toBe(false);
        });
    });

    describe('when update cells states', () => {
        it('should update all current states to future states', () => {
            scope.cells['1:1'].currentState = true;
            scope.cells['0:0'].currentState = true;
            scope.cells['1:0'].currentState = true;
            scope.cells['2:0'].currentState = true;
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            scope.cells['2:2'].currentState = true;
            scope.cells['1:1'].futureState = false;
            scope.cells['0:0'].futureState = false;
            scope.cells['1:0'].futureState = false;
            scope.cells['2:0'].futureState = false;
            scope.cells['0:1'].futureState = false;
            scope.cells['2:1'].futureState = false;
            scope.cells['0:2'].futureState = false;
            scope.cells['1:2'].futureState = false;
            scope.cells['2:2'].futureState = false;
            parentScope.$digest();

            expect(scope.cells['1:1'].currentState).toBe(true);
            expect(scope.cells['0:0'].currentState).toBe(true);
            expect(scope.cells['1:0'].currentState).toBe(true);
            expect(scope.cells['2:0'].currentState).toBe(true);
            expect(scope.cells['0:1'].currentState).toBe(true);
            expect(scope.cells['2:1'].currentState).toBe(true);
            expect(scope.cells['0:2'].currentState).toBe(true);
            expect(scope.cells['1:2'].currentState).toBe(true);
            expect(scope.cells['2:2'].currentState).toBe(true);

            scope.updateCellStates();
            parentScope.$digest();

            expect(scope.cells['1:1'].currentState).toBe(false);
            expect(scope.cells['0:0'].currentState).toBe(false);
            expect(scope.cells['1:0'].currentState).toBe(false);
            expect(scope.cells['2:0'].currentState).toBe(false);
            expect(scope.cells['0:1'].currentState).toBe(false);
            expect(scope.cells['2:1'].currentState).toBe(false);
            expect(scope.cells['0:2'].currentState).toBe(false);
            expect(scope.cells['1:2'].currentState).toBe(false);
            expect(scope.cells['2:2'].currentState).toBe(false);
        });
    });

    describe('when game size changes', () => {
        it('should update cells to empty when height changes', () => {
            scope.cells['1:1'].currentState = true;
            scope.cells['0:0'].currentState = true;
            scope.cells['1:0'].currentState = true;
            scope.cells['2:0'].currentState = true;
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            parentScope.$digest();

            expect(scope.cells['1:1'].currentState).toBe(true);
            expect(scope.cells['0:0'].currentState).toBe(true);
            expect(scope.cells['1:0'].currentState).toBe(true);
            expect(scope.cells['2:0'].currentState).toBe(true);
            expect(scope.cells['0:1'].currentState).toBe(true);
            expect(scope.cells['2:1'].currentState).toBe(true);
            expect(scope.cells['0:2'].currentState).toBe(true);
            expect(scope.cells['1:2'].currentState).toBe(true);

            scope.height = 2;
            parentScope.$digest();

            expect(scope.cells['1:1'].currentState).toBe(false);
            expect(scope.cells['0:0'].currentState).toBe(false);
            expect(scope.cells['1:0'].currentState).toBe(false);
            expect(scope.cells['2:0'].currentState).toBe(false);
            expect(scope.cells['0:1'].currentState).toBe(false);
            expect(scope.cells['2:1'].currentState).toBe(false);
            expect(scope.cells['0:2']).toBe(undefined);
            expect(scope.cells['1:2']).toBe(undefined);
        });

        it('should update cells to empty when width changes', () => {
            scope.cells['1:1'].currentState = true;
            scope.cells['0:0'].currentState = true;
            scope.cells['1:0'].currentState = true;
            scope.cells['2:0'].currentState = true;
            scope.cells['0:1'].currentState = true;
            scope.cells['2:1'].currentState = true;
            scope.cells['0:2'].currentState = true;
            scope.cells['1:2'].currentState = true;
            parentScope.$digest();

            expect(scope.cells['1:1'].currentState).toBe(true);
            expect(scope.cells['0:0'].currentState).toBe(true);
            expect(scope.cells['1:0'].currentState).toBe(true);
            expect(scope.cells['2:0'].currentState).toBe(true);
            expect(scope.cells['0:1'].currentState).toBe(true);
            expect(scope.cells['2:1'].currentState).toBe(true);
            expect(scope.cells['0:2'].currentState).toBe(true);
            expect(scope.cells['1:2'].currentState).toBe(true);

            scope.width = 2;
            parentScope.$digest();

            expect(scope.cells['1:1'].currentState).toBe(false);
            expect(scope.cells['0:0'].currentState).toBe(false);
            expect(scope.cells['1:0'].currentState).toBe(false);
            expect(scope.cells['2:0']).toBe(undefined);
            expect(scope.cells['0:1'].currentState).toBe(false);
            expect(scope.cells['2:1']).toBe(undefined);
            expect(scope.cells['0:2'].currentState).toBe(false);
            expect(scope.cells['1:2'].currentState).toBe(false);
        });
    });

    describe('when cell is alive called', () => {
       it('should create new cell for undefind cell', () => {
           scope.cells = {}
           scope.cellIsAlive(1, 1);
           parentScope.$digest();

           expect(scope.cells['1:1']).not.toBe(undefined);
           expect(scope.cellIsAlive(1, 1)).toBe(false);
       })
    });

    function _setup(options){
        options = _.extend({}, options);

        if(element) element.remove();

        angular.mock.inject(($compile, $timeout, $rootScope) => {
            parentScope = $rootScope.$new();
            timeout = $timeout;
            element = $compile('<ajsajw-game-of-life></ajsajw-game-of-life>')(parentScope);
            parentScope.$digest();

            scope = element.isolateScope();
            scope.$apply();

            angular.element(document.body).append(element);
        });
    }

    function allFriendCellsAlive() {
        scope.cells['0:0'].currentState = true;
        scope.cells['1:0'].currentState = true;
        scope.cells['2:0'].currentState = true;
        scope.cells['0:1'].currentState = true;
        scope.cells['2:1'].currentState = true;
        scope.cells['0:2'].currentState = true;
        scope.cells['1:2'].currentState = true;
        scope.cells['2:2'].currentState = true;
        parentScope.$digest();
    }

    function allFriendCellsDead() {
        scope.cells['0:0'].currentState = false;
        scope.cells['1:0'].currentState = false;
        scope.cells['2:0'].currentState = false;
        scope.cells['0:1'].currentState = false;
        scope.cells['2:1'].currentState = false;
        scope.cells['0:2'].currentState = false;
        scope.cells['1:2'].currentState = false;
        scope.cells['2:2'].currentState = false;
        parentScope.$digest();
    }
});
