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
        _guohu:null,
        _fangkaxiaobeijing:null,
        _info:null,
        _guohuTime:-1,
    },

    // use this for initialization
    onLoad: function () {
        this._guohu = cc.find("Canvas/tip_notice");
        var fangkaxiaobeijing = cc.find("Canvas/tip_notice/fangkaxiaobeijing");
        var shunshizhen = cc.find("Canvas/tip_notice/shunshizhen");
        var nishizhen = cc.find("Canvas/tip_notice/nishizhen");
        var duijia = cc.find("Canvas/tip_notice/duijia");
        this._guohu.active = false;
        fangkaxiaobeijing.active = false;
        shunshizhen.active = false;
        nishizhen.active = false;
        duijia.active = false;
        
        this._info = cc.find("Canvas/tip_notice/info").getComponent(cc.Label);
        
        var self = this;
        this.node.on('push_notice',function(data){
            var data = data.detail;
            self._guohu.active = true;
            self._guohuTime = data.time;
            if(data.info == "过胡"){
                fangkaxiaobeijing.active = true;
                self._info.string = data.info;
            }
            switch(data.info){
                case "换对家牌":
                    duijia.active = true;
                    break;
                case "顺时针换":
                    shunshizhen.active = true;
                    break;
                case "逆时针换":
                    nishizhen.active = true;
                    break;
            }
        });
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
       if(this._guohuTime > 0){
           this._guohuTime -= dt;
           if(this._guohuTime < 0){
               this._guohu.active = false;
           }
       }
    },
});
