cc.Class({
    extends: cc.Component,

    properties: {
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
        room_switch_node:cc.Node,
        bang_switch_node:cc.Node,
        room_con_node:cc.Node,
        bang_con_node:cc.Node,
        room_list_node:cc.Node,
        room_title_node:cc.Node,
        room_content_nose:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        
    },
    onBangClick:function(){
        if(this.bang_switch_node.y === 40){
            this.bang_switch_node.y = -38;
            this.room_switch_node.y = -38; 
            this.room_con_node.active = false;
            this.room_title_node.active=false;
            this.room_list_node.active=false;
            this.bang_con_node.active = true;
            this.room_content_nose.active=false;
        }
    },
    onRoomClick:function(){
        var roomlist = cc.find('Cnavas/scroll_top_twich/room');
        if(this.room_switch_node.y === -38){
            this.room_switch_node.y = 40; 
            this.bang_switch_node.y = 40;
            this.room_con_node.active = true;
            this.room_title_node.active=true;
            this.room_list_node.active=true;
            this.bang_con_node.active = false;
            this.room_content_nose.actve=true;
            cc.director.loadScene("hall");
            // roomlist.getComponent('room_onload').getRoomList(); 
        }
        // this.scheduleOnce(function(){
        //         cc.log('成功调用计时器');
        //         cc.director.loadScene("hall");
        // },7);
    },
    // onwinnerClick:function(){
    //     alert(111);
    // }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
