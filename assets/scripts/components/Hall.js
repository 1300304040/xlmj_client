var Net = require("Net")
var Global = require("Global")
cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblMoney:cc.Label,
        lblGems:cc.Label,
        lblID:cc.Label,
        lblNotice:cc.Label,
        joinGameWin:cc.Node,
        createRoomWin:cc.Node,
        settingsWin:cc.Node,
        helpWin:cc.Node,
        xiaoxiWin:cc.Node,
        btnJoinGame:cc.Node,
        btnReturnGame:cc.Node,
        sprHeadImg:cc.Sprite,
        shareSpr:cc.Node,
        invite:cc.Node,
        btnExit:cc.Node,
        btnAddGems:cc.Node,
        recharge:cc.Node,
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
    
    initNetHandlers:function(){
        var self = this;
    },
    
    onShare:function(){
        cc.vv.anysdkMgr.share("血流麻将","血流麻将，包含了血战到底、血流成河等多种流行麻将玩法。");   
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        this.initLabels();
        
        if(cc.vv.gameNetMgr.roomId == null){
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
        }
        else{
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
        }
        
        //var params = cc.vv.args;
        var roomId = cc.vv.userMgr.oldRoomId 
        if( roomId != null){
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }
        
        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node,this.node,"Hall","onBtnClicked");
        
        
        this.addComponent("UserInfoShow");
        
        this.initButtonHandler("Canvas/menu_alert/btn_shezhi");
        this.initButtonHandler("Canvas/menu_alert/btn_help");
        this.initButtonHandler("Canvas/right_bottom/btn_xiaoxi");
        this.initButtonHandler("Canvas/btn_share");
        this.initButtonHandler("Canvas/toFriends");
        // this.initButtonHandler("Canvas/share/weixin");
        // this.initButtonHandler("Canvas/share/peng");
        this.initButtonHandler("Canvas/menu_alert/quit");
        this.initButtonHandler("Canvas/top_left/headinfo/btn_add_gems");

        this.helpWin.addComponent("OnBack");
        this.xiaoxiWin.addComponent("OnBack");
        this.shareSpr.addComponent("OnBack");
        this.invite.addComponent("OnBack");
        this.recharge.addComponent("OnBack");
        
        if(!cc.vv.userMgr.notice){
            cc.vv.userMgr.notice = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        if(!cc.vv.userMgr.gemstip){
            cc.vv.userMgr.gemstip = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        this.lblNotice.string = cc.vv.userMgr.notice.msg;
        
        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");
    },
    
    refreshInfo:function(){//获取用户房卡数量
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    this.lblGems.string = ret.gems;    
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_status",data,onGet.bind(this));
    },
    
    refreshGemsTip:function(){//获取用户旁边点击‘+’号后的信息(这里是从服务器获取，然后在存入userMgr。gemstip中，下面onBtnAddGemsClicked事件才是显示)
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.gemstip.version = ret.version;
                cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>","\n");
                console.log('#########'+ret.msg)
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"fkgm",
            version:cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    shareToFriend:function() {
        // console.log(cc.vv.userMgr.userId);
        var userId = cc.vv.userMgr.userId;

        cc.vv.http.sendRequest('/shareUserId',{userId:userId});
        
        if (this.isNativeIOS()) {
            jsb.reflection.callStaticMethod("AppController","wxShareHallFriend",);
        }
        else {//Android
            jsb.reflection.callStaticMethod("com/vivigames/scmj/WXAPI", "wxShareHallFriend", "()V");
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wxShareHallFriend", "()V");
        }
    },
    shareToTimeline:function() {
          // console.log(cc.vv.userMgr.userId);
          var userId = cc.vv.userMgr.userId;
        cc.vv.http.sendRequest('/shareUserId',{userId:userId});
        // this.shareAlertNode.getComponent('alert').dismissAction();
        if (this.isNativeIOS()) {
            jsb.reflection.callStaticMethod("AppController","wxShareHallTimeline",);
        }
        else {//Android
            jsb.reflection.callStaticMethod("com/vivigames/scmj/WXAPI", "wxShareHallTimeline", "()V");
        }
    },

    
    refreshNotice:function(){//获取滚动信息
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.notice.version = ret.version;
                cc.vv.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"notice",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    initButtonHandler:function(btnPath){//为大厅那些小按钮添加监听事件，onbtnclicked,那些都是大厅场景加载完成，信息初始化完成后并赋值之后的静态信息，并没有点击在服务器上拉去信息
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Hall","onBtnClicked");        
    },
    
    initLabels:function(){
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },
    
    onBtnClicked:function(event){
        if(event.target.name == "btn_shezhi"){
            this.settingsWin.active = true;
            var animCtrl = this.settingsWin.getComponent(cc.Animation);
				animCtrl.play("showAlert");
        }   
        else if(event.target.name == "btn_help"){
            this.helpWin.active = true;
            var animCtrl = this.helpWin.getComponent(cc.Animation);
				animCtrl.play("showAlert");
        }
        else if(event.target.name == "btn_xiaoxi"){

            this.xiaoxiWin.active = true;
            var animCtrl = this.xiaoxiWin.getComponent(cc.Animation);
			animCtrl.play("showAlert");
        }
        else if(event.target.name == "btn_share"){
            this.shareSpr.active = true;
         	var animCtrl = this.shareSpr.getComponent(cc.Animation);
			animCtrl.play("showAlert");
        }

        else if(event.target.name == "btn_add_gems"){
            this.recharge.active = true;
            var animCtrl = this.recharge.getComponent(cc.Animation);
            animCtrl.play("showAlert");
        }

        else if(event.target.name == "toFriends"){
            this.invite.active = true;
            var animCtrl = this.invite.getComponent(cc.Animation);
			animCtrl.play("showAlert");
        }else if(event.target.name == "quit"){
            console.log("gameover");
         if (!cc.sys.isNative) {
            cc.director.loadScene('login');
            hall.cacheImageInfo = null;
            return;
        }

           cc.director.end();
        // if (this.isNativeIOS()) {
        //     jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","exitApp");
        // } else 
        if (this.isNativeAndroid()) {//Android com.dongguandt.qianjianglzg
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exitApp", "()V");
        }

            // cc.director.end();
        }
        else if(event.target.name == "head"){
            cc.log(cc.vv.userMgr);
     
            cc.vv.userinfoShow.show(cc.vv.userMgr.userName,cc.vv.userMgr.userId,this.sprHeadImg,cc.vv.userMgr.sex,cc.vv.userMgr.ip,cc.vv.userMgr.city);
        }
    },
    isNativeIOS: function () {
    let platform = cc.sys.platform;
    if ((platform == cc.sys.IPHONE) || (platform == cc.sys.IPAD)) {
      return true;
    }
    return false;
  },

  isNativeAndroid: function () {
    let platform = cc.sys.platform;
    if (platform == cc.sys.ANDROID) {
      return true;
    }
    return false;
  },

    onJoinGameClicked:function(){
        if(this.lblGems.string <=0){
            cc.vv.alert.show("提示","房卡不足，无法加入游戏\n请充值后再尝试");
        }else{
        	var animCtrl = this.joinGameWin.getComponent(cc.Animation);
            	animCtrl.play("showAlert");
            this.joinGameWin.active = true;
        }     
    },
    
    onReturnGameClicked:function(){
        cc.director.loadScene("mjgame");  
    },
    
    onBtnAddGemsClicked:function(){
        /*cc.vv.alert.show("提示",cc.vv.userMgr.gemstip.msg);
        this.refreshInfo();*/
        cc.sys.openURL("http://wanmajiang.gd-dent.com/game_zhufu/index.php/Home/Index/index/userid/" + cc.vv.userMgr.userId);
    },
    
    onCreateRoomClicked:function(){

        if(cc.vv.gameNetMgr.roomId != null){
            cc.vv.alert.show("提示","房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        console.log("onCreateRoomClicked");
        var animCtrl = this.createRoomWin.getComponent(cc.Animation);
            animCtrl.play("showAlert");
        this.createRoomWin.active = true;   
    },

    onBtnInvite:function(){
        var editInput = cc.find("Canvas/invite/bingInvite/EditBox");
        var userId = cc.vv.userMgr.userId;
        var inviteCode = editInput.getComponent(cc.EditBox).string;
        // console.log("邀请按钮触发了");
        // console.log(userId);
        // console.log(inviteCode);
        if(inviteCode == null||inviteCode == ""){
            var tip = cc.find("Canvas/invite/tip");
            tip.active = true;
            return;
        }else {
            var tip = cc.find("Canvas/invite/tip");
            tip.active = false;
        }

        var data = {
            userId:userId,
            inviteCode:inviteCode
        }
        cc.vv.http.sendRequest("/inviteBind",data,function(data){
            // console.log('datadatadatadatadatadata');
            console.log(data);
            var news = cc.find("Canvas/inviteTip");
            var animCtrl = news.getComponent(cc.Animation);
			animCtrl.play("showAlert");
            news.active = true;
            switch(data.errcode){
                case 1:
                    news.children[2].getComponent(cc.Label).string = "更换成功";
                    break;
                case 2:
                    news.children[2].getComponent(cc.Label).string = "绑定失败，发生未知错误";
                    break;
                case 3:
                    news.children[2].getComponent(cc.Label).string = "绑定失败，存在多个与该推荐码绑定的代理，请与客服联系";
                    break;
                case 4:
                    news.children[2].getComponent(cc.Label).string = "绑定失败，不存在该推荐码";
                    break;
                case 5:
                    news.children[2].getComponent(cc.Label).string = "绑定失败,稍后再试";
                    break;
                case 6:
                    news.children[2].getComponent(cc.Label).string = "绑定成功";
                    break;
            }

        });

        var inviteAlert = cc.find("Canvas/invite");
  //       var animCtrl = inviteAlert.getComponent(cc.Animation);
		// animCtrl.play("hideAlert");
        inviteAlert.active = false;
        // cc.director.loadScene("hall");


    },

    btnInviteTip:function(){
        var news = cc.find("Canvas/inviteTip");
        // news.active = false;
        var animCtrl = news.getComponent(cc.Animation);
		animCtrl.play("hideAlert");
    },

    recharger:function(e,price){
        // {userId :cc.vv.userMgr.userId}
        var alert = cc.find("Canvas/inviteTip");
        var recharge = cc.find("Canvas/recharge");
        var animCtrl = alert.getComponent(cc.Animation);
        var userId = cc.vv.userMgr.userId;
        // var price = 0;
        // console.log('price-------------arguments----===============')
        // console.log(price)
        // console.log(arguments)
        cc.vv.http.sendRequest("/inUsersCodeExist",{userId :userId},function(res){
            // console.log('res----------------------data')
            // console.log(res)
            // console.log(userId)
            if(res.errcode == 1){
                // console.log('this.recharge------------------------')
                // console.log(recharge)
                recharge.active = false;
                animCtrl.play("showAlert");
                alert.active = true;
                alert.getChildByName("Tip").getComponent(cc.Label).string = "您未绑定邀请码，请先绑定邀请码哦。";
                return;
            }else if(res.errcode == 2){
                this.recharge.active = false;
                animCtrl.play("showAlert");
                alert.active = true;
                alert.getChildByName("Tip").getComponent(cc.Label).string = "未知错误。";
                return;
            }else if(res.errcode == 0){
                cc.sys.openURL("http://wanmajiang.gd-dent.com/game_zhufu/index.php/Home/Index/index/userid/" + cc.vv.userMgr.userId+"/price/"+price);
            }

        });
    },

    projectss:function(){
       var projectss =  cc.find('Canvas/projectss');
       var animCtrl = projectss.getComponent(cc.Animation);
		animCtrl.play("showAlert");
        projectss.active = true;
    },
    projectssBack:function(){
        var projectss =  cc.find('Canvas/projectss');
        // console.log("projectss~~~~~~~~~~~~~~~~~~~~~~");
        var animCtrl = projectss.getComponent(cc.Animation);
		animCtrl.play("hideAlert");
        // projectss.active = false;
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {//大厅notice滚动效果
        var x = this.lblNotice.node.x;
        x -= dt*100;
        if(x + this.lblNotice.node.width < -1000){
            x = 500;
        }
        this.lblNotice.node.x = x;
        
        if(cc.vv && cc.vv.userMgr.roomData != null){
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    },
});
