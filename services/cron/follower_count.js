const cron = require('node-cron');
const {Tracker} = require('../../models');

// cron.schedule('0 0 * * *', async function () {
//   await Tracker.findOneAndUpdate({uid: followIDs[dbIdx]},
//     { followers:docs.user.followers_count },{new: true});
// }, {
//     scheduled: true,
//     timezone: 'Asia/Tokyo'
// });

