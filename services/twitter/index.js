(async()=>{
    //const cron = require('node-cron');
    const twstream = require('./twitterStream');
    await twstream.runner();
    // cron.schedule('*/1 * * * *', async function () {
    //     console.log('Cron Job Started at ' + new Date());
    //     _tsInstance.stop;
    //     _tsInstance = await twstream();
    // }, {
    //     scheduled: true,
    //     timezone: 'Asia/Tokyo'
    // });
})();
