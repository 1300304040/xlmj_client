cc.Class({
    extends: cc.Component,
    properties: {
        roomid: cc.Label,
        roomdifen:cc.Label,
        roomjushu: cc.Label,
        roomlistpeos:cc.Label,
    },
    init: function (data) {
    	// cc.log('123456789');
    	console.log(data);
    	// console.log(data.rooms.length);
    	// cc.log('123456789');
    	// var roomcenten = cc.find('Canvas/room_content');
    	
		// console.log(data[3]);
		this.roomid.string = data[0];
		this.roomdifen.string = data[1];
		this.roomjushu.string = data[2];
		this.roomlistpeos.string = data[3];
	    	// for(var i=0;i<data.rooms.length;i++){

	    	// 	for(var item in data.rooms){
	    			
	    	// 	}		
	    	// }
        // var roomLists = cc.find('Canvas/roomlists/roomlist/content/roomlistbg');
        // console.log(roomLists);
    },
    onBtnWeichatClicked:function(){
        var title = "<血战到底>";
        if(cc.vv.gameNetMgr.conf.type == "xlch"){
            var title = "<血战成河>";
        }
        cc.vv.anysdkMgr.share("血战麻将" + title,"房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa());
    },

});

