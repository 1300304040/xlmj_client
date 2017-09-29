cc.Class({
    extends: cc.Component,
    properties: {
        nums:{
            default:[],
            type:[cc.Label]
        },
        _inputIndex:0,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    // use this for initialization
    onLoad: function () {
      
    },
    
    onEnable:function(){
        this.onResetClicked();
    },
    
    onInputFinished:function(roomId){
        cc.vv.userMgr.enterRoom(roomId,function(ret){
            if(ret.errcode == 0){
                // var animCtrl = this.node.getComponent(cc.Animation);
                //     animCtrl.play("hideAlert");
                this.node.active = false;
            }
            else{
                var content = "房间["+ roomId +"]不存在，请重新输入!";
                if(ret.errcode == 4){
                    content = "房间["+ roomId + "]已满!";
                }else if (ret.errcode == 5){
                    content = "房间内存在相同IP的玩家,无法进入!";
                }
                // cc.vv.alert.show("提示",content);
            var contents = cc.find('Canvas/JoinGame/baocuotishi');
                contents.getComponent(cc.Label).string = content;
                
                 this.scheduleOnce(function(){//定时显示错误消息
                    // 这里的 this 指向 component
                     contents.getComponent(cc.Label).node.active = false;//隐藏
                }, 1);
                 contents.getComponent(cc.Label).node.active = true;//显示
               this.onResetClicked(); 
            }
        }.bind(this)); 
    },
    onInput:function(num){
            if(this._inputIndex >= this.nums.length){
                //console.log(num);
                return;
            }
             this.nums[this._inputIndex].string = num;
             this._inputIndex += 1;
            
             if(this._inputIndex == this.nums.length){
                 var roomId = this.parseRoomID();
                 console.log("ok:" + roomId);
                 return roomId;
                 // this.onInputFinished(roomId);
             }
    },
    joinGameok:function(roomId){//点击按钮提交验证新增功能
        var roomId = this.parseRoomID();
        if(roomId.length==6){
           this.onInputFinished(roomId);
         }else{
            var contents = cc.find('Canvas/JoinGame/baocuotishi');
                contents.getComponent(cc.Label).string ='请正确输入6位房间号！';
                 this.scheduleOnce(function(){//定时显示错误消息
                    // 这里的 this 指向 component
                     contents.getComponent(cc.Label).node.active = false;//隐藏
                }, 2);
                 contents.getComponent(cc.Label).node.active = true;//显示
         }
    },
    onN0Clicked:function(){
        this.onInput(0);  
    },
    onN1Clicked:function(){
        this.onInput(1);  
    },
    onN2Clicked:function(){
        this.onInput(2);
    },
    onN3Clicked:function(){
        this.onInput(3);
    },
    onN4Clicked:function(){
        this.onInput(4);
    },
    onN5Clicked:function(){
        this.onInput(5);
    },
    onN6Clicked:function(){
        this.onInput(6);
    },
    onN7Clicked:function(){
        this.onInput(7);
    },
    onN8Clicked:function(){
        this.onInput(8);
    },
    onN9Clicked:function(){
        this.onInput(9);
    },
    onResetClicked:function(){
        for(var i = 0; i < this.nums.length; ++i){
            this.nums[i].string = "";
        }
        this._inputIndex = 0;
    },
    onDelClicked:function(){
        if(this._inputIndex > 0){
            this._inputIndex -= 1;
            this.nums[this._inputIndex].string = "";
        }
    },
    onCloseClicked:function(){
        var animCtrl = this.node.getComponent(cc.Animation);
            animCtrl.play('hideAlert');
        // this.node.active = false;
    },
    parseRoomID:function(){
        var str = "";
        for(var i = 0; i < this.nums.length; ++i){
            str += this.nums[i].string;
        }
        return str;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

     //},
});
