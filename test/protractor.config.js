// tutorial https://www.youtube.com/watch?v=Obi0y0AEFZg
exports.config = {

  capabilities: {
    // You can use other browsers
    // like firefox, phantoms, safari, IE (-_-)
    'browserName': 'chrome'
  },

  specs: [
    'e2e/*_spec.coffee'
    ],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 10000,
    isVerbose: true,
  },

  allScriptsTimeout: 20000,

  onPrepare: function(){
    browser.driver.get('http://localhost:8100');
  },

};
