'use strict';

import routing from './app-config';

// need this to inject templates into cache
angular.module('templates', []);

angular.module('web-audio', [ 'ui.router', 'templates']).config(routing);
