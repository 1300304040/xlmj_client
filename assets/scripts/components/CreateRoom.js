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
        _difen:null,
        _zimo:1,
        _wanfaxuanze:null,
        _zuidafanshu:null,
        _jushuxuanze:null,
        _dianganghua:null,
        _leixingxuanze:null,
        _fangfei: null,
        _dingpiao: null,
        _gaojiip:null,
        jjj:1,
    },
    // use this for initialization
    onLoad: function () {
        console.log(this.jjj);
        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._leixingxuanze.push(n);
            }
        }
        this._difen = this.jjj;
        this._zimo = this._zimo;
        // var t = this.node.getChildByName("zimojiacheng");
        // for(var i = 0; i < t.childrenCount; ++i){
        //     var n = t.children[i].getComponent("RadioButton");
        //     if(n != null){
        //         this._zimo.push(n);
        //     }
        // }
        //console.log(this._zimo);
        this._wanfaxuanze = [];
        var t = this.node.getChildByName("wanfaxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("CheckBox");
            if(n != null){
                this._wanfaxuanze.push(n);
            }
        }
        this._gaojiip=[];
        var t = this.node.getChildByName('gaojiip');
        for(var i=0;i<t.childrenCount;++i){
            var n = t.children[i].getComponent("CheckBox");
            if(n != null){
                this._gaojiip.push(n);
            }
        }
        console.log(this._gaojiip);
        //console.log(this._wanfaxuanze);
        this._zuidafanshu = [];
        var t = this.node.getChildByName("zuidafanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._zuidafanshu.push(n);
            }
        }
        //console.log(this._zuidafanshu);
        this._jushuxuanze = [];
        var t = this.node.getChildByName("xuanzejushu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jushuxuanze.push(n);
            }
        }
        this._dianganghua = [];
        var t = this.node.getChildByName("dianganghua");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._dianganghua.push(n);
            }
        }
        //console.log(this._jushuxuanze);
        this._difen = this.jjj;
        // var t = this.node.getChildByName("difenxuanze");
        // for(var i = 0; i < t.childrenCount; ++i){
        //     var n = t.children[i].getComponent("RadioButton");
        //     if(n != null){
        //         this._difen.push(n);
        //     }
        // }
        //console.log(this._difenxuanze);
        this._fangfei = [];
        var t = this.node.getChildByName("fangfei");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._fangfei.push(n);
            }
        }
       // console.log(this._fangfei);
        this._dingpiao = [];
        var t = this.node.getChildByName("dingpiao");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._dingpiao.push(n);
            }
        }
        //console.log(this._dingpiao);
       // var jjj = 0;
    },
    onBtnBack:function(){
        var animCtrl = this.node.getComponent(cc.Animation);
            animCtrl.play("hideAlert");
        // this.node.active = false;
    },
    onBtnOK:function(){
        // var animCtrl = this.node.getComponent(cc.Animation);
        //     animCtrl.play("hideAlert");
        this.node.active = false;
        this.createRoom();
    },
    tjia:function(){//点击增加建房积分
        var difens = cc.find('Canvas/CreateRoom/difenxuanze/difen2');
        var difenss = cc.find('Canvas/CreateRoom/difenxuanze/difen');
        console.log(this.jjj);
        this.jjj++;
        if(this.jjj>difenss.children.length-1){
             this.jjj=difenss.children.length-1;
         }
         console.log(this.jjj);
         difens.getComponent(cc.Label).string=difenss.children[this.jjj].getComponent(cc.Label).string;
         this._difen = this.jjj;
        },
    tjian:function(){//点击减少建房积分
        var difens = cc.find('Canvas/CreateRoom/difenxuanze/difen2');
        var difenss = cc.find('Canvas/CreateRoom/difenxuanze/difen');
        this.jjj--;
        if(this.jjj<0){
             this.jjj=0;
         }
         difens.getComponent(cc.Label).string=difenss.children[this.jjj].getComponent(cc.Label).string;
        this._difen = this.jjj;
    },
    createRoom:function(){
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
                if(ret.errcode == 2222){
                    cc.vv.alert.show("提示","房卡不足，创建房间失败!");  
                }
                else{
                    cc.vv.alert.show("提示","创建房间失败,错误码:" + ret.errcode);
                    cc.vv.console.log(ret.errcode);
                }
            }
            else{
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };
        var difen = self._difen;
        if(difen==null){
            difen = 1;
        }
        var zimo = 1;
        // for(var i = 0; i < self._zimo.length; ++i){
        //     if(self._zimo[i].checked){
        //         zimo = i;
        //         break;
        //     }     
        // }
        var huansanzhang = self._wanfaxuanze[0].checked;        
        var jiangdui = self._wanfaxuanze[1].checked;
        var menqing = self._wanfaxuanze[2].checked;
        var tiandihu = self._wanfaxuanze[3].checked;
        var gaojiip=self._gaojiip[0].checked;
        var type = 0;
        for(var i = 0; i < self._leixingxuanze.length; ++i){
            if(self._leixingxuanze[i].checked){
                type = i;
                break;
            }     
        }
        if(type == 0){
            type = "xzdd";
        }
        else{
            type = "xlch";
        }
        var zuidafanshu = 0;
        for(var i = 0; i < self._zuidafanshu.length; ++i){
            if(self._zuidafanshu[i].checked){
                zuidafanshu = i;
                break;
            }     
        }
        var jushuxuanze = 0;
        for(var i = 0; i < self._jushuxuanze.length; ++i){
            if(self._jushuxuanze[i].checked){
                jushuxuanze = i;
                break;
            }     
        }
        var dianganghua = 0;
        for(var i = 0; i < self._dianganghua.length; ++i){
            if(self._dianganghua[i].checked){
                dianganghua = i;
                break;
            }     
        }
        var difen = this._difen;
        var fangfei = 0;
        for(var i = 0; i < self._fangfei.length; ++i){
            if(self._fangfei[i].checked){
                fangfei = i;
                break;
            }     
        }
        var dingpiao = 0;
        for(var i = 0; i < self._dingpiao.length; ++i){
            if(self._dingpiao[i].checked){
                dingpiao = i;
                break;
            }     
        }
        // var gaojiip = 0;
        // if(self._gaojiip.checked){
        //     gaojiip=1;
        // }else{
        //     gaojiip=0;
        // }
        // for(var i=0;i<self._gaojiip.length;++i){
        //     if(self._gaojiip[i].checked){
        //         gaojiip=i;
        //         break;
        //     }
        // }
        var conf = {
            type:type,
            difen:difen,
            zimo:zimo,
            jiangdui:jiangdui,
            huansanzhang:huansanzhang,
            zuidafanshu:zuidafanshu,
            jushuxuanze:jushuxuanze,
            dianganghua:dianganghua,
            menqing:menqing,
            tiandihu:tiandihu,
            fangfei:fangfei,
            dingpiao:dingpiao,
            gaojiip:gaojiip  
        };
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf)
        };
        console.log("正在进入房间");
        console.log(data);
        cc.vv.wc.show("正在进入房间");

        cc.vv.http.sendRequest("/create_private_room",data,onCreate);   
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});
