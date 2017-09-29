cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _popuproot:null,
        _settings:null,
        _dissolveNotice:null,
        // _btnSqjsfj:null,
        
        _endTime:-1,
        _extraInfo:null,
        _noticeLabel:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.popupMgr = this;
        
        this._popuproot = cc.find("Canvas/popups");
        this._settings = cc.find("Canvas/popups/settings");
        // this._btnSqjsfj = cc.find("Canvas/btn_sqjsfj")
        var btn_sqjsfj = cc.find("Canvas/btn_sqjsfj");
        // var Dissolve = cc.find("Canvas/prepare/Dissolve");
        
        this._dissolveNotice = cc.find("Canvas/popups/dissolve_notice");
        this._noticeLabel = this._dissolveNotice.getChildByName("info").getComponent(cc.Label);
        this._timess = this._dissolveNotice.getChildByName("timess").getComponent(cc.Label);
        this.closeAll();
        
        this.addBtnHandler("settings/btn_close");
        this.addBtnHandler("settings/btn_sqjsfj");
        this.addBtnHandlerRoom("btn_sqjsfj");
        // this.addBtnHandlerDissolve("Dissolve");
        
        this.addBtnHandler("dissolve_notice/btn_agree");
        this.addBtnHandler("dissolve_notice/btn_reject");
        this.addBtnHandler("dissolve_notice/btn_ok");
        
        var self = this;
        this.node.on("dissolve_notice",function(event){
            var data = event.detail;
            self.showDissolveNotice(data);
        });
        
        this.node.on("dissolve_cancel",function(event){
            self.closeAll();
        });
    },
    
    start:function(){
        if(cc.vv.gameNetMgr.dissoveData){
            this.showDissolveNotice(cc.vv.gameNetMgr.dissoveData);
        }
    },
    
    addBtnHandlerRoom:function(btnName){
        // console.log("+++====+++++++++=====111")
        // console.log(btnName)
        var btn = cc.find("Canvas/" + btnName);
        this.addClickEvent(btn,this.node,"PopupMgr","onBtnClicked");
    },

    // addBtnHandlerDissolve:function(btnName){
    //     console.log("申请解散按妞没有调用到？？？");
    //     console.log(btnName)
    //     var btn = cc.find("Canvas/prepare/" + btnName);
    //     this.addClickEvent(btn,this.node,"PopupMgr","onBtnClicked");
    // },
    
    addBtnHandler:function(btnName){
        var btn = cc.find("Canvas/popups/" + btnName);
        this.addClickEvent(btn,this.node,"PopupMgr","onBtnClicked");

    },
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnClicked:function(event){
        this.closeAll();
        var btnName = event.target.name;
        if(btnName == "btn_agree"){
    
            cc.vv.net.send("dissolve_agree");
        // var animCtrl = this._dissolveNotice.getComponent(cc.Animation);
        //     animCtrl.removeClip("showAlert");
        }
        else if(btnName == "btn_reject"){
  
            cc.vv.net.send("dissolve_reject");
        var animCtrl = this._dissolveNotice.getComponent(cc.Animation);
            animCtrl.play("hideAlert");
        }
        else if(btnName == "btn_sqjsfj"){
            cc.vv.net.send("dissolve_request"); 
        }
    },
    
    closeAll:function(){
        // this._popuproot.active = false;
        // this._settings.active = false;
        // this._dissolveNotice.active = false;
        // this._btnSqjsfj.active = false;
        var animCtrl = this._settings.getComponent(cc.Animation);
            animCtrl.play("hideAlert");
        var animCtrl = this._dissolveNotice.getComponent(cc.Animation);
            animCtrl.play("hideAlert");
    },
    
    showSettings:function(){
        this.closeAll();
        this._popuproot.active = true;
        this._settings.active = true;
        var animCtrl = this._settings.getComponent(cc.Animation);
            animCtrl.play("showAlert");

        // this._btnSqjsfj.active = true;
    },
    
    showDissolveRequest:function(){
        this.closeAll();
        // var animCtrl = this._popuproot.getComponent(cc.Animation);
        //     animCtrl.play("showAlert");
        this._popuproot.active = true;
    },
    
    showDissolveNotice:function(data){
        this._endTime = Date.now()/1000 + data.time;
        this._extraInfo = "";
        for(var i = 0; i < data.states.length; ++i){
            var b = data.states[i];
            var name = cc.vv.gameNetMgr.seats[i].name;
            if(b){
                this._extraInfo += "\n[已同意] "+ name;
            }
            else{
                this._extraInfo += "\n[待确认] "+ name;
            }
        }
        this.closeAll();
        this._popuproot.active = true;
        this._dissolveNotice.active = true;;
        var animCtrl = this._dissolveNotice.getComponent(cc.Animation);
            animCtrl.play("showAlert");
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._endTime > 0){
            var lastTime = this._endTime - Date.now() / 1000;
            if(lastTime < 0){
                this._endTime = -1;
            }
            
            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);
            
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            this._timess.string = str + s + 's';
            this._noticeLabel.string =this._extraInfo;
        }
    },
});
