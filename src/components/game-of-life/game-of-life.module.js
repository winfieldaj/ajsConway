import angular from 'angular';
import gameOfLifeDirective from './game-of-life.directive';

const GameOfLifeModule = angular.module('ajsajw.game-of-life', [])
    .directive('ajsajwGameOfLife', gameOfLifeDirective);

export default GameOfLifeModule;
