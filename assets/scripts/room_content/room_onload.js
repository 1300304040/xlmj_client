var Item = cc.Class({
    name: 'Item',
    properties: {
        roomid: cc.Node,
        roomdifen:cc.Node,
        roomjushu: cc.Node,
        roomlistpeos:cc.Node,
       
    },
});
cc.Class({
    extends: cc.Component,
    properties: {
        roomlistbg:cc.Prefab,
        items: {
            default: [],
            type: Item
        },
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        t:null,
         count:cc.Node
    },
    // use this for initialization
    onLoad: function () {
        console.log();
      this.getRoomList();
    },
    getRoomList:function(){
        var self = this;
        var onGet = function(ret){
            var roomcentenss = cc.find('Canvas/room_content');

            if(ret.rooms.length==0){
                roomcentenss.getComponent(cc.Label).string = '暂无房间信息！';
            }else{
                roomcentenss.active=false;
                for(var i=0;i<ret.rooms.length;i++){
                    var roomlist = cc.instantiate(this.roomlistbg);
                    var data = ret;
                    // console.log('我在这里调用创建的房间的信息如下：');
                    // console.log(ret);           
                    // console.log(roomlist);
                    // console.log("123321--" + this.count.childrenCount);
                    // console.log(data.rooms[i]);
                     roomlist.getComponent('roomlists').init(data.rooms[i]); 
                     this.count.addChild(roomlist);
                     var tPrefab = roomlist;
                    tPrefab.parent = this.count;
                    // tPrefab.setPosition(-210,100);
            
                    // init(data);
                }
        }
          // console.log(ret.rooms);
        };      
        var data = {userId:cc.vv.userMgr.userId};
         //  this.scheduleOnce(function(){
         //       cc.log('成功调用计时器');
         //       cc.director.loadScene("hall");
         // },60);
        cc.vv.http.sendRequest("/get_roomList",data,onGet.bind(this));
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    	// console.log(dt);
        this.t += dt;
        // console.log(this.t);
        if(this.t>=2&&this.t<4){
            // this.room_content.getComponent(cc.Label).string = '暂无房间信息！'
        }
    },
});
