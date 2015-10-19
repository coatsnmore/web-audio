'use strict';

import SynthController from './SynthController';

routing.$inject = ['$urlRouterProvider', '$stateProvider'];

export default function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/synth');

  $stateProvider.state('synth', {
    url: '/synth',
    views: {
      'content': {
        templateUrl: 'templates/synth.html',
        controller: SynthController,
        controllerAs: 'synth'
      }
    }
  });
}
