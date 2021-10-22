/* 
* MMM-pathtime
* By comf0rts
*/

Module.register("MMM-pathtime", {
	// Default module config.
	defaults: {
		api: "https://path.api.razza.dev/v1/stations/",
		station: "thirty_third_street",
		interval: 30000,
		debug: true,
	},

	start: function (){
		if(this.config.debug){Log.log('[PATH Time] sent SET_CONFIG notification')};
		this.sendSocketNotification('SET_CONFIG', this.config);
	},

	getDom: function() {
		if(this.config.debug){Log.log("[PATH Time] getDom function")};
		let wrapper = document.createElement("div");
		//let timestamp = document.createElement("div");
		//timestamp.innerHTML = Date.now();
		//wrapper.appendChild(timestamp);
		if(this.parsedData == null){
			if(this.config.debug){Log.error("[PATH Time] parsed Data is undefined")};
			return;
		}
		this.parsedData.upcomingTrains.forEach(a=>{
			let line = document.createElement("div");
			let sec = (Date.now() - Date.parse(a.projectedArrival)) / 1000;
			line.innerHTML =  a.headsign + ": in " + (0 - ( Math.floor(sec / 60 ) )) + " minutes";
			wrapper.appendChild(line);
		});
		return wrapper;
	},

	getHeader: function(){
		return 'PATH Trains @ ' + this.config.station;
	},

	socketNotificationReceived: function(notification, payload){
		switch(notification){
			case 'DATA':
				Log.log("[PATH Time] received signal DATA");
				this.parsedData = payload;
				this.updateDom();
				break;
		}
	},
});