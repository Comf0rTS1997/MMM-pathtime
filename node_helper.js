/* 
* MMM-pathtime helper
* By comf0rts
*/

let https = require("https");
let config;
let self;

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        switch(notification){
            case 'SET_CONFIG':
                config = payload;
                self = this;
                self.refresh();
                setInterval(this.refresh, config.interval);
                break;
        }
    },

    refresh: function(){

        if(config == null){
            console.log("[PATH Time helper]refresh function: config is null!");
            return;
        }

        let apiurl = config.api + config.station + "/realtime";
        let parsedData;

        if(!config.debug){console.log("[PATH Time helper] https get started");}
        https.get(apiurl, res => {
            let code = res.statusCode
            if(code < 200 && code >= 300){
                if(!config.debug){console.log("[PATH Time helper] HTTP error, Code = " + code)}
                return;
            }
        
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    console.error(e.message);
                }
                self.sendSocketNotification("DATA", parsedData);
                if(!config.debug){console.log("[PATH Time helper] sent DATA notification");}
            })
        })
        .on("error", err => {console.log("[PATH Time helper] Response error: " + err);})
        
        if(!config.debug){console.log("[PATH Time helper] https get finished");}
    },
});
