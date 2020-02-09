require('./loadenv')
console.log('[LOG] Loaded Env.')
require('./database');
console.log('[LOG] Loaded Databse Connection')
require('./twitterStream')
console.log('[LOG] Loaded Twitter Stream')
require('./webhook')
console.log('[LOG] Loaded Webhook')
