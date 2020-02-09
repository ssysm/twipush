const webhookInstance = require('./index');

module.exports = {
    add: (url) => {
        webhookInstance.add('pool', url
        ).then(()=>{
            webhookInstance.trigger('pool',{ data: {
                    user: 'SYSTEM',
                    _id: '0',
                    text: 'A new webhook has been added: ' + url +'.'
                }})
            console.log('[INFO] Loaded ' + url + ' to webhook');
        })
    },
    remove: (url) =>{
        webhookInstance.remove('pool', url)
            .catch(function(err){console.error(err);})
        console.log('[INFO] Deleted ' + url + ' from hook pool.');
    },
    trigger: (data)=>{
        webhookInstance.trigger('pool', data)
        console.log('[INFO] Triggered Webhook, announcing in hook pool');
    }
}
