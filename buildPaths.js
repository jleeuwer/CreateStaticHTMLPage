const path = require('path');

module.exports = {
   buildPathHtml: function() {
      console.log(path.resolve('./'+this.voutputFile+'.html'));
      return path.resolve('./'+this.voutputFile+'.html');
   }
};
