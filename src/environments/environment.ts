// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  firebaseConfig: {
    apiKey: 'AIzaSyC5aZyFAlOc8E9BGnqIub06MYicKiXbAKs',
    authDomain: 'trello-200ok.firebaseapp.com',
    databaseURL: 'https://trello-200ok.firebaseio.com',
    projectId: 'trello-200ok',
    storageBucket: 'trello-200ok.appspot.com',
    messagingSenderId: '478556317415',
    appId: '1:478556317415:web:6207dc6723bb57f61f6442',
    measurementId: 'G-P743D48LHC'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
