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
        _alert:null,
        _btnOK:null,
        _btnCancel:null,
        _title:null,
        _content:null,
        _onok:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        this._alert = cc.find("Canvas/alert");
        this._title = cc.find("Canvas/alert/title").getComponent(cc.Label);
        this._content = cc.find("Canvas/alert/content").getComponent(cc.Label);
        
        this._btnOK = cc.find("Canvas/alert/btn_ok");
        this._btnCancel = cc.find("Canvas/alert/btn_cancel");
        
        cc.vv.utils.addClickEvent(this._btnOK,this.node,"Alert","onBtnClicked");
        cc.vv.utils.addClickEvent(this._btnCancel,this.node,"Alert","onBtnClicked");
        
        this._alert.active = false;
        cc.vv.alert = this;
    },
    
    onBtnClicked:function(event){
        if(event.target.name == "btn_ok"){
            if(this._onok){
                this._onok();
            }
        }
        var animCtrl = this._alert.getComponent(cc.Animation);
        animCtrl.play("hideAlert");
        // this._alert.active = false;
        this._onok = null;
    },
    onBtnToggle:function(){
        var slideMenuBg = cc.find("Canvas/prepare/slideMenuBg");
        
       
        
        var slideMenu = cc.find("Canvas/prepare/slideMenu");
        var toggleBtn = cc.find("Canvas/prepare/toggleBtn");
        var toggleBtnTop = cc.find("Canvas/prepare/toggleBtnTop");
        
        var btn_settings = cc.find("Canvas/prepare/btn_settings");
        var btnBack = cc.find("Canvas/prepare/btnBack");
        var btnExit = cc.find("Canvas/prepare/btnExit");
        var btnDissolve = cc.find("Canvas/prepare/btnDissolve");
        
      
        
        slideMenuBg.active = true;
        slideMenu.active = true;
        toggleBtnTop.active = true;
        btn_settings.active = true;
        btnBack.active = true;
        btnExit.active = true;
        btnDissolve.active = true;
        toggleBtn.active = false;
        var animCtrl = slideMenuBg.getComponent(cc.Animation);
            animCtrl.play("slideDown");
        var animCtrl = slideMenu.getComponent(cc.Animation);
            animCtrl.play("slideDown");
        
    },
    newOnBtnToggle:function(){
        var slideMenuBgNew = cc.find("Canvas/slideMenuBg");
        var btn_sqjsfj = cc.find("Canvas/btn_sqjsfj");
        var toggleBtnNew = cc.find("Canvas/toggleBtn");
        var toggleBtnTopNew = cc.find("Canvas/toggleBtnTop");
        toggleBtnNew.active = false;
        slideMenuBgNew.active = true;
        toggleBtnTopNew.active = true;
        btn_sqjsfj.active = true;
        var animCtrl = slideMenuBgNew.getComponent(cc.Animation);
            animCtrl.play("slideDown");
        var animCtrl = btn_sqjsfj.getComponent(cc.Animation);
            animCtrl.play("slideDown");
        
    },
    onBtnToggleTop:function(){
        var slideMenuBg = cc.find("Canvas/prepare/slideMenuBg");

        var slideMenu = cc.find("Canvas/prepare/slideMenu");
        var toggleBtn = cc.find("Canvas/prepare/toggleBtn");
        var toggleBtnTop = cc.find("Canvas/prepare/toggleBtnTop");
        var btn_settings = cc.find("Canvas/prepare/btn_settings");
        var btnBack = cc.find("Canvas/prepare/btnBack");
        var btnExit = cc.find("Canvas/prepare/btnExit");
        var btnDissolve = cc.find("Canvas/prepare/btnDissolve");
        
    
        
        // slideMenuBg.active = false;
        // slideMenu.active = false;
        toggleBtnTop.active = false;
        btn_settings.active = false;
        btnBack.active = false;
        btnExit.active = false;
        btnDissolve.active = false;
        toggleBtn.active = true;

        var animCtrl = slideMenuBg.getComponent(cc.Animation);
            animCtrl.play("slideUp");
        var animCtrl = slideMenu.getComponent(cc.Animation);
            animCtrl.play("slideUp");

    },

    onBtnToggleTopNew:function(){
        var slideMenuBg = cc.find("Canvas/prepare/slideMenuBg");
        
     
        
        var slideMenu = cc.find("Canvas/prepare/slideMenu");
        var toggleBtn = cc.find("Canvas/prepare/toggleBtn");
        var toggleBtnTop = cc.find("Canvas/prepare/toggleBtnTop");
        var btn_settings = cc.find("Canvas/prepare/btn_settings");
        var btnBack = cc.find("Canvas/prepare/btnBack");
        var btnExit = cc.find("Canvas/prepare/btnExit");
        var btnDissolve = cc.find("Canvas/prepare/btnDissolve");
        
    
        
        slideMenuBg.active = false;
        slideMenu.active = false;
        toggleBtnTop.active = false;
        btn_settings.active = false;
        btnBack.active = false;
        btnExit.active = false;
        btnDissolve.active = false;
        toggleBtn.active = true;

        // var animCtrl = slideMenuBg.getComponent(cc.Animation);
        //     animCtrl.play("slideUp");
        // var animCtrl = slideMenu.getComponent(cc.Animation);
        //     animCtrl.play("slideUp");

    },

    newOnBtnToggleTop:function(){
        var slideMenuBgNew = cc.find("Canvas/slideMenuBg");
        var btn_sqjsfj = cc.find("Canvas/btn_sqjsfj");
        var toggleBtnNew = cc.find("Canvas/toggleBtn");
        var toggleBtnTopNew = cc.find("Canvas/toggleBtnTop");   
        toggleBtnNew.active = true;
        // slideMenuBgNew.active = false;
        toggleBtnTopNew.active = false;
        // btn_sqjsfj.active = false;
        var animCtrl = slideMenuBgNew.getComponent(cc.Animation);
            animCtrl.play("slideUp");
        var animCtrl = btn_sqjsfj.getComponent(cc.Animation);
            animCtrl.play("slideUp");
    },
    show:function(title,content,onok,needcancel){
        var animCtrl = this._alert.getComponent(cc.Animation);
        animCtrl.play("showAlert");
        this._alert.active = true;
        this._onok = onok;
        this._title.string = title;
        this._content.string = content;
        if(needcancel){
            this._btnCancel.active = true;
            this._btnOK.x = -150;
            this._btnCancel.x = 150;
        }
        else{
            this._btnCancel.active = false;
            // var animCtrl = this._alert.getComponent(cc.Animation);
            //     animCtrl.play("showAlert");
            this._btnOK.x = 0;
        }
    },
    // showss:function(title,content,onok,needcancel){
    //     var loadingRoom = cc.find("Canvas/WaitingConnection")
    //     loadingRoom.active = true;
    //     // var amint = this._alert.getComponent(cc.Animation);
    //     // amint.play("up");
    //     // // this._alert.active = true;
    //     // this._onok = onok;
    //     // this._title.string = title;
    //     // this._content.string = content;
    //     // if(needcancel){
    //     //     this._btnCancel.active = true;
    //     //     this._btnOK.x = -150;
    //     //     this._btnCancel.x = 150;
    //     // }
    //     // else{
    //     //     this._btnCancel.active = false;
    //     //     this._btnOK.x = 0;
    //     // }
    // },
    
    onDestory:function(){
        if(cc.vv){
            cc.vv.alert = null;    
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
