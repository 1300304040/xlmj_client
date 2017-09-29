 window.chaTingId = null;
 window.optionData = null;
 // window.huPaiData = null;

cc.Class({
    extends: cc.Component,

    properties: {        
        gameRoot:{
            default:null,
            type:cc.Node
        },
        
        prepareRoot:{
            default:null,
            type:cc.Node   
        },
        
        _myMJArr:[],
        _options:null,
        _selectedMJ:null,
        _chupaiSprite:[],
        _mjcount:null,
        _gamecount:null,
        _hupaiTips:[],
        // _tingBtn:null,
        _hupaiLists:[],
        _playEfxs:[],
        _opts:[],
        _huPaiData:null,
        // _lblScore:null,
    },

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
        this.addComponent("NoticeTip");
        this.addComponent("GameOver");
        this.addComponent("DingQue");
        this.addComponent("PengGangs");
        this.addComponent("MJRoom");
        this.addComponent("TimePointer");
        this.addComponent("GameResult");
        this.addComponent("Chat");
        this.addComponent("Folds");
        this.addComponent("ReplayCtrl");
        this.addComponent("PopupMgr");
        this.addComponent("HuanSanZhang");
        this.addComponent("ReConnect");
        this.addComponent("Voice");
        this.addComponent("UserInfoShow");

        // this._lblScore = this.node.getChildByName("score").getComponent(cc.Label);
        
        this.initView();
        this.initEventHandlers();
        
        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        this.initWanfaLabel();
        this.onGameBeign();
        cc.vv.audioMgr.playBGM("bgFight.mp3");

        // var chaTingBtn = cc.find("Canvas/chaTingBtn");
        //  chaTingBtn.active = false;

        // cc.vv.chaTingBtn = cc.find('Canvas/chaTingBtn');
        // console.log('hkjhkjhihjkghj4553536');
        // console.log(cc.vv.chaTingBtn)
    },
    
    initView:function(){


        //搜索需要的子节点
        var gameChild = this.node.getChildByName("game");
        
        this._mjcount = gameChild.getChildByName('mjcount').getComponent(cc.Label);
        this._mjcount.string = "剩余" + cc.vv.gameNetMgr.numOfMJ + "张";
        this._gamecount = gameChild.getChildByName('gamecount').getComponent(cc.Label);
        this._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";

        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");
        
        for(var i = 0; i < myholds.children.length; ++i){
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            this._myMJArr.push(sprite);
            sprite.spriteFrame = null;
        }
        
        var realwidth = cc.director.getVisibleSize().width;
        myholds.scaleX *= realwidth/1280;
        myholds.scaleY *= realwidth/1280;  
        
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var side = sides[i];
            
            var sideChild = gameChild.getChildByName(side);
            this._hupaiTips.push(sideChild.getChildByName("HuPai"));
            this._hupaiLists.push(sideChild.getChildByName("hupailist"));

               // for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
               //      var seatData = cc.vv.gameNetMgr.seats[i];
               //      var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
               //      var hupailist = this._hupaiLists[localIndex];
               //          hupailist.active = false;
               //  }

            this._playEfxs.push(sideChild.getChildByName("play_efx").getComponent(cc.Animation));
            this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[0].getComponent(cc.Sprite));
            
            var opt = sideChild.getChildByName("opt");
            opt.active = false;
            var sprite = opt.getChildByName("pai").getComponent(cc.Sprite);
            var data = {
                node:opt,
                sprite:sprite
            };
            this._opts.push(data);
        }
        
        var opts = gameChild.getChildByName("ops");
        var tingBtn = cc.find('Canvas/chaTingBtn');
        this._options = opts;
        this._tingBtn = tingBtn;
 
        this.hideOptions();
        this.hideChupai();

    },
    
    hideChupai:function(){
        for(var i = 0; i < this._chupaiSprite.length; ++i){
            this._chupaiSprite[i].node.active = false;
        }        
    },
    
    initEventHandlers:function(){
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        
        //初始化事件监听器
        var self = this;
        
        this.node.on('game_holds',function(data){
           self.initMahjongs();
           self.checkQueYiMen();
        });
        
        this.node.on('game_begin',function(data){
            self.onGameBeign();
        });
        
        this.node.on('game_sync',function(data){
            console.log("game_sync.............");
            self.onGameBeign();
        });
        
        this.node.on('game_chupai',function(data){
            data = data.detail;
            self.hideChupai();
            self.checkQueYiMen();
            if(data.last != cc.vv.gameNetMgr.seatIndex){
                self.initMopai(data.last,null);   
            }
            if(!cc.vv.replayMgr.isReplay() && data.turn != cc.vv.gameNetMgr.seatIndex){
                self.initMopai(data.turn,-1);
            }
        });
        
        this.node.on('game_mopai',function(data){
            self.hideChupai();
            data = data.detail;
            var pai = data.pai;
            // moPaiId = pai;
            // console.log(moPaiId);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
            if(localIndex == 0){
                var index = 13;
                var sprite = self._myMJArr[index];
                self.setSpriteFrameByMJID("M_",sprite,pai,index);
                sprite.node.mjId = pai;

            }
            else if(cc.vv.replayMgr.isReplay()){
                self.initMopai(data.seatIndex,pai);
            }
        });
        
        this.node.on('game_action',function(data){
            self.showAction(data.detail);
        });
        
        this.node.on('hupai',function(data){

            var data = data.detail;
            console.log('data--??----------------------------===============hupai==========')
            console.log(data)
            //如果不是玩家自己，则将玩家的牌都放倒
            var seatIndex = data.seatindex;
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            var hupai = self._hupaiTips[localIndex];
            hupai.active = true;
            // self._tingBtn.active = true;
            if(localIndex == 0){
                self.hideOptions();
            }
            var seatData = cc.vv.gameNetMgr.seats[seatIndex];
            seatData.hued = true;
            console.log('seatData---------------------------------seatData?????----------')
            console.log(seatData)
            if(cc.vv.gameNetMgr.conf.type == "xlch"){
                console.log('xlch --------------------------xlch?????')
                // switch(data.pattern){
                //         case "normal":
                //             hupai.getChildByName("jihu").active = true;
                //             break;
                //         case "qingyise":
                //             hupai.getChildByName("qingyise").active = true;
                //             break;
                //         case "duidui":
                //             hupai.getChildByName("pengpenghu").active = true;
                //             break
                //         case "qingpeng":
                //             hupai.getChildByName("qingpeng").active = true;
                //             break;
                //     }
                // hupai.getChildByName("sprHu").active = true;
                // hupai.getChildByName("sprZimo").active = false;
                // console.log('data.hupai==================')
                // console.log(data.hupai)
                self._huPaiData = data.hupai

                self.initHupai(localIndex,data.hupai,data.target);
                if(data.iszimo){
                    if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                        seatData.holds.pop();
                        self.initMahjongs();                
                    }
                    else{
                        self.initOtherMahjongs(seatData);
                    }
                } 
            }
            else{

                 console.log('xlch ----daodi血战到底----------------------xlch?????')
                hupai.getChildByName("sprHu").active = !data.iszimo;
                hupai.getChildByName("sprZimo").active = data.iszimo;
                
                if(!(data.iszimo && localIndex==0))
                {
                    //if(cc.vv.replayMgr.isReplay() == false && localIndex != 0){
                    //    self.initEmptySprites(seatIndex);                
                    //}
                    self.initMopai(seatIndex,data.hupai);
                }                                         
            }
            
            if(cc.vv.replayMgr.isReplay() == true && cc.vv.gameNetMgr.conf.type != "xlch"){
                var opt = self._opts[localIndex];
                opt.node.active = true;
                opt.sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",data.hupai);                
            }
            //播放胡牌动画
            switch(data.pattern){
                case "normal":
                    self.playEfx(localIndex,"play_jihu");    
                    break;
                case "qingyise":
                    self.playEfx(localIndex,"play_qingyise"); 
                    break;
                case "duidui":
                    self.playEfx(localIndex,"play_duidui"); 
                    break
                case "qingpeng":
                    self.playEfx(localIndex,"play_qingpeng"); 
                    break;
            }
            // if(data.iszimo){
            //     self.playEfx(localIndex,"play_zimo");    
            // }
            // else{
            //     self.playEfx(localIndex,"play_hu");
            // }
            
            cc.vv.audioMgr.playSFX("nv/hu.mp3");
        });
        
        this.node.on('mj_count',function(data){
            self._mjcount.string = "剩余" + cc.vv.gameNetMgr.numOfMJ + "张";
        });
        
        this.node.on('game_num',function(data){
            self._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";
        });
        
        this.node.on('game_over',function(data){
            self.gameRoot.active = false;
            self.prepareRoot.active = true;
        });
        
        
        this.node.on('game_chupai_notify',function(data){
            self.hideChupai();
            var seatData = data.detail.seatData;
            //如果是自己，则刷新手牌
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();                
            }
            else{
                self.initOtherMahjongs(seatData);
            }
            self.showChupai();
            var audioUrl = cc.vv.mahjongmgr.getAudioURLByMJID(data.detail.pai)
            cc.vv.audioMgr.playSFX(audioUrl);
        });
        
        this.node.on('guo_notify',function(data){
            self.hideChupai();
            self.hideOptions();
            var seatData = data.detail;
            //如果是自己，则刷新手牌
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();                
            }
            cc.vv.audioMgr.playSFX("give.mp3");
        });
        
        this.node.on('guo_result',function(data){
            self.hideOptions();
        });
        
        this.node.on('game_dingque_finish',function(data){
            self.initMahjongs();
        });
        
        this.node.on('peng_notify',function(data){    
            self.hideChupai();
            
            var seatData = data.detail;
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();                
            }
            else{
                self.initOtherMahjongs(seatData);
            }
            var localIndex = self.getLocalIndex(seatData.seatindex);
            self.playEfx(localIndex,"play_peng");
            cc.vv.audioMgr.playSFX("nv/peng.mp3");
            self.hideOptions();
        });
        
        this.node.on('gang_notify',function(data){
            self.hideChupai();
            var data = data.detail;
            var seatData = data.seatData;
            var gangtype = data.gangtype;
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();                
            }
            else{
                self.initOtherMahjongs(seatData);
            }
            
            var localIndex = self.getLocalIndex(seatData.seatindex);
            if(gangtype == "wangang"){
                self.playEfx(localIndex,"play_guafeng");
                cc.vv.audioMgr.playSFX("guafeng.mp3");
            }
            else{
                self.playEfx(localIndex,"play_xiayu");
                cc.vv.audioMgr.playSFX("rain.mp3");
            }
        });
        
        this.node.on("hangang_notify",function(data){
            var data = data.detail;
            var localIndex = self.getLocalIndex(data);
            self.playEfx(localIndex,"play_gang");
            cc.vv.audioMgr.playSFX("nv/gang.mp3");
            self.hideOptions();
        });
        // this.node.on("chating",function(data){
        //     var data = data.detail;
        //     self.chating(data);
        // });
        
        this.node.on('game_sameIP_push',function(){
            console.log('game_sameIP_push');
            // self.showSameip();
            console.log('有相同ip的玩家进入房间');
        });

    },
    

    showChupai:function(){
        var pai = cc.vv.gameNetMgr.chupai; 
        if( pai >= 0 ){
            //
            var localIndex = this.getLocalIndex(cc.vv.gameNetMgr.turn);
            var sprite = this._chupaiSprite[localIndex];
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            sprite.node.active = true;   
        }
    },
    
    addOption:function(btnName,pai){
        for(var i = 0; i < this._options.childrenCount; ++i){
            var child = this._options.children[i]; 
            if(child.name == "op" && child.active == false){
                child.active = true;
                var sprite = child.getChildByName("opTarget").getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
                var btn = child.getChildByName(btnName); 
                btn.active = true;
                btn.pai = pai;
                return;
            }
        }
    },
    
    hideOptions:function(data){
        this._options.active = false;
        for(var i = 0; i < this._options.childrenCount; ++i){
            var child = this._options.children[i]; 
            if(child.name == "op"){
                child.active = false;
                child.getChildByName("btnPeng").active = false;
                child.getChildByName("btnGang").active = false;
                child.getChildByName("btnHu").active = false;
            }
        }
    },
    
    showAction:function(data){
        optionData = data;
       
        if(this._options.active){
            this.hideOptions();
        }
        
        if(data && (data.hu || data.gang || data.peng)){
            this._options.active = true;
            if(data.hu){
                var chaTingBtn = cc.find("Canvas/chaTingBtn");
                chaTingBtn.active = true;
                this.addOption("btnHu",data.pai);
            }
            if(data.peng){
                this.addOption("btnPeng",data.pai);
            }
            
            if(data.gang){
                for(var i = 0; i < data.gangpai.length;++i){
                    var gp = data.gangpai[i];
                    this.addOption("btnGang",gp);
                }
                var holds = cc.find("Canvas/game/myself/holds");
                for(var k=0;k<holds.children.length;k++){
                    holds.children[k].children[0].active = false;
                }
            }   
        }
    },
    
    initWanfaLabel:function(){
        var wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
    },
    
    initHupai:function(localIndex,pai,index){
        // console.log('pai-------------------index--======================pai')
        if(cc.vv.gameNetMgr.conf.type == "xlch"){
            var hupailist = this._hupaiLists[localIndex];
            for(var i = 0; i < hupailist.children.length; ++i){
                var hupainode = hupailist.children[i]; 
                if(hupainode.active == false){
                    var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
                    hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,pai);
                    hupainode.active = true;
                    // switch(index - cc.vv.gameNetMgr.seatIndex){
                    //     case :
                    // }
                    // hupainode.children[index - cc.vv.gameNetMgr.seatIndex]
                    var turn = cc.vv.gameNetMgr.turn;

                    var localIndex = cc.vv.gameNetMgr.getLocalIndex(turn);
                    console.log('----turn------------------localIndex----------------index-------')
                    console.log(turn)
                    console.log(localIndex)
                    console.log(index)
                    for(var ii = 0; ii < hupainode.children[0].children.length; ++ii){
                        hupainode.children[0].children[ii].active = ii == localIndex;
                    }
                    break;
                }
            }   
        }

    },
    
    playEfx:function(index,name){
        this._playEfxs[index].node.active = true;
        this._playEfxs[index].play(name);
    },
    
    onGameBeign:function(){
        
        for(var i = 0; i < this._playEfxs.length; ++i){
            this._playEfxs[i].node.active = false;
        }
        
        for(var i = 0; i < this._hupaiLists.length; ++i){
            for(var j = 0; j < this._hupaiLists[i].childrenCount; ++j){
                this._hupaiLists[i].children[j].active = false;
                // this._hupaiLists[i].children[j].active = true;
            }
        }

        // initHupai()
     
        for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
            var seatData = cc.vv.gameNetMgr.seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);        
            var hupai = this._hupaiTips[localIndex];
            hupai.active = seatData.hued;
            console.log('seatData+++++++++++++++++++++++++++++++++')
            console.log(seatData)
            if(seatData.hued){
                // console.log('seatData.hued----------------------==?????')
                for(var j = 0; j < seatData.huinfo.length; ++j){
                    var info = seatData.huinfo[j];
                    // switch(info.pattern){
                    //     case "normal":
                    //         hupai.getChildByName("jihu").active = true;
                    //         break;
                    //     case "qingyise":
                    //         hupai.getChildByName("qingyise").active = true;
                    //         break;
                    //     case "duidui":
                    //         hupai.getChildByName("pengpenghu").active = true;
                    //         break;
                    //     case "qingpeng":
                    //         hupai.getChildByName("qingpeng").active = true;
                    //         break;
                    // }
                }
                // hupai.getChildByName("sprHu").active = !seatData.iszimo;
                // hupai.getChildByName("sprZimo").active = seatData.iszimo;

            }
            
            if(seatData.huinfo){
                for(var j = 0; j < seatData.huinfo.length; ++j){
                    var info = seatData.huinfo[j];
                    if(info.ishupai){
                        console.log('info------------------------=================info=====')
                        console.log(info)
                        this.initHupai(localIndex,info.pai,info.target);    
                    }
                }
            }

        }
        var seatsData = cc.vv.gameNetMgr.seats;
        // console.log('seatsData===============seatsData=======seatsData')
        // console.log(seatsData)
        var seatIndex = cc.vv.gameNetMgr.seatIndex;
        // console.log('seatIndex==========seatsData=========seatIndex')
        // console.log(seatIndex)
        // console.log(tingPaiData)
        // console.log(seatsData)
        if(tingPaiData != null){
            for(var k=0;k<seatsData.length;k++){
               if(k==seatIndex){
                    this._tingBtn.active = tingPaiData.seats[k].tingpai;      
               }
            }
        }


        var huedPai = cc.vv.gameNetMgr._huedPai;
        // console.log('huedPai========huedPai=============huedPai=')
        // console.log(huedPai)
        if(huedPai != null && huedPai.length == 0){
            // console.log('this.initHupai(localIndex,info.pai);====================')
            // this.initHupai(localIndex,info.pai);
            for(var n = 0; n < cc.vv.gameNetMgr.seats.length; ++n){
                var seatData = cc.vv.gameNetMgr.seats[n];
                var localIndex = cc.vv.gameNetMgr.getLocalIndex(n);
                var hupailist = this._hupaiLists[localIndex];
                var huanpaiinfo = cc.find('Canvas/game/huanpaiinfo');
                this._tingBtn.active = false;
                huanpaiinfo.active = false;
 
                for(var t=0;t<hupailist.childrenCount;t++){
                    hupailist.children[t].active = false;
                }

            }  
            
        }
      

        this.hideChupai();
        this.hideOptions();
        var sides = ["right","up","left"];        
        var gameChild = this.node.getChildByName("game");
        for(var i = 0; i < sides.length; ++i){
            var sideChild = gameChild.getChildByName(sides[i]);
            var holds = sideChild.getChildByName("holds");
            for(var j = 0; j < holds.childrenCount; ++j){
                var nc = holds.children[j];
                nc.active = true;
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;
                var sprite = nc.getComponent(cc.Sprite); 
                sprite.spriteFrame = cc.vv.mahjongmgr.holdsEmpty[i+1];
            }            
        }
      
        if(cc.vv.gameNetMgr.gamestate == "" && cc.vv.replayMgr.isReplay() == false){
            return;
        }

        this.gameRoot.active = true;
        this.prepareRoot.active = false;
        this.initMahjongs();
        var seats = cc.vv.gameNetMgr.seats;
        for(var i in seats){
            if(seats.length==1){
                console.log('--------4人在场---------');
            }
            // console.log(seats)
            var seatData = seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            if(localIndex != 0){
                this.initOtherMahjongs(seatData);
                if(i == cc.vv.gameNetMgr.turn){
                    this.initMopai(i,-1);
                }
                else{
                    this.initMopai(i,null);    
                }
            }
        }
        this.showChupai();
        if(cc.vv.gameNetMgr.curaction != null){
            this.showAction(cc.vv.gameNetMgr.curaction);
            cc.vv.gameNetMgr.curaction = null;
        }

        
        this.checkQueYiMen();
        
        var toggleBtn = cc.find("Canvas/toggleBtn");
        toggleBtn.active = true;


    },
    
    onMJClicked:function(event){
        var ting = cc.find("Canvas/game/myself/chatingsss"); //听牌可以胡的牌的父级
        var chatins = cc.find('Canvas/game/myself/holds');
        var chaTingBtn = cc.find("Canvas/chaTingBtn");
        // 出牌时隐藏听按钮
        
        
    

        

        if(cc.vv.gameNetMgr.isHuanSanZhang){
            this.node.emit("mj_clicked",event.target);

            return;
        }
        
        //如果不是自己的轮子，则忽略
        if(cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex){
            //console.log("not your turn." + cc.vv.gameNetMgr.turn);
            return;
        }
        //弹出可以胡的牌
        var tips = cc.find("Canvas/game/myself/chatingsss");
        for(var i = 0; i < this._myMJArr.length; ++i){
            if(event.target == this._myMJArr[i].node){

                //如果是再次点击，则出牌
                var chaTingData = cc.vv.gameNetMgr._chaTingData;
                for(var key in chaTingData){
                    if(this._myMJArr[i].node.mjId == key){
                        chaTingId = key;
                        for(var j=0; j<chaTingData[key].length;j++){
                            ting.children[j].children[2].getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",chaTingData[key][j].pai);
                            ting.children[j].children[0].getComponent(cc.Label).string = chaTingData[key][j].FAN+'番';
                            ting.children[j].children[1].getComponent(cc.Label).string = chaTingData[key][j].num+'张';
                            for(var m=0; m<ting.children.length-1;m++){
                                if(m<chaTingData[key].length){
                                    ting.children[m].active = true;
                                    ting.width = 380 + m*260;
                                    ting.height = 210;
                                    ting.y = 10;
                                    if(m>3){
                                        ting.width = 380 + 3*260;
                                        ting.height = 360;
                                        ting.y = 140;
                                    }
                                }else{
                                    ting.children[m].active = false;
                                }
                            }
                        }
                    }
                }
                
                chaTingBtn.active = false;
                if( this._myMJArr[i].node.children[0].active == true){
                    tips.active = true;
                }else {
                    tips.active = false;
                    chaTingBtn.active = false;
                    var seatsData = cc.vv.gameNetMgr.seats;
                    var seatIndex = cc.vv.gameNetMgr.seatIndex;
                    for(var x=0;x<seatsData.length;x++){
                        if(seatIndex == x && seatsData[x].hued){
                            chaTingBtn.active = true;
                        }
                    }
 
                }
                
                if(event.target == this._selectedMJ){
                    this.shoot(this._selectedMJ.mjId); 
                    this._selectedMJ.y = 0;
                    this._selectedMJ = null;
                    
                    if( this._myMJArr[i].node.children[0].active == true){
                        chaTingBtn.active = true;
                    }
                    // chaTingBtn.active = true;

                    var folds = cc.find("Canvas/game/myself/holds");
                    var arrowTip = cc.find("Canvas/arrowTip");
                    for(var n=0;n<arrowTip.children.length;n++){
                        arrowTip.children[n].active = false;
                    }
        

                    for(var i=0 ;i<folds.children.length; i++){
                        folds.children[i].children[0].active = false;
                    }
                    tips.active = false;
                    return;
                }
                if(this._selectedMJ != null){
                    this._selectedMJ.y = 0;
                }
                event.target.y = 15;
                this._selectedMJ = event.target;
                return;
            }
        }
    },
    
    //出牌
    shoot:function(mjId){
        if(mjId == null){
            return;
        }
        cc.vv.net.send('chupai',mjId);
    },
    
    getMJIndex:function(side,index){
        if(side == "right" || side == "up"){
            return 13 - index;
        }
        return index;
    },
    
    initMopai:function(seatIndex,pai){
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");

        var lastIndex = this.getMJIndex(side,13);
        var nc = holds.children[lastIndex];

        nc.scaleX = 1.0;
        nc.scaleY = 1.0;
                        
        if(pai == null){
            nc.active = false;
        }
        else if(pai >= 0){
            nc.active = true;
            if(side == "up"){
                nc.scaleX = 0.73;
                nc.scaleY = 0.73;                    
            }
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,pai);
        }
        else if(pai != null){
            nc.active = true;
            if(side == "up"){
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;                    
            }
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = cc.vv.mahjongmgr.getHoldsEmptySpriteFrame(side);
        }

    },
    
    initEmptySprites:function(seatIndex){
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");
        var spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
        for(var i = 0; i < holds.childrenCount; ++i){
            var nc = holds.children[i];
            nc.scaleX = 1.0;
            nc.scaleY = 1.0;
            
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = spriteFrame;
        }
    },
    
    initOtherMahjongs:function(seatData){
        //console.log("seat:" + seatData.seatindex);
        var localIndex = this.getLocalIndex(seatData.seatindex);
        if(localIndex == 0){
            return;
        }
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        // console.log(sideRoot)
        var sideHolds = sideRoot.getChildByName("holds");
        // console.log(sideHolds)
        var num = seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length;
        num *= 3;
        for(var i = 0; i < num; ++i){
            var idx = this.getMJIndex(side,i);
            sideHolds.children[idx].active = false;
        }
        
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var holds = this.sortHolds(seatData);
        if(holds != null && holds.length > 0){
            //回放问题解决
            if(holds.length == 14 || holds.length == 11 || holds.length == 8 || holds.length == 5 || holds.length == 2){

                seatData.holds.pop();
            }

            for(var i = 0; i < holds.length; ++i){
                var idx = this.getMJIndex(side,i + num);
                console.log('idx=' + idx);
                console.log('children idx=' + sideHolds.children[idx]);
                var sprite = sideHolds.children[idx].getComponent(cc.Sprite); 
                if(side == "up"){
                    sprite.node.scaleX = 0.73;
                    sprite.node.scaleY = 0.73;                    
                }
                sprite.node.active = true;
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,holds[i]);
            }
            
            if(holds.length + num == 13){
                var lasetIdx = this.getMJIndex(side,13);
                sideHolds.children[lasetIdx].active = false;
            }
        }
    },
    
    sortHolds:function(seatData){
        var holds = seatData.holds;
        if(holds == null){
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length 
        if( l == 2 || l == 5 || l == 8 || l == 11 || l == 14){
            mopai = holds.pop();
        }
        
        var dingque = seatData.dingque;
        cc.vv.mahjongmgr.sortMJ(holds,dingque);
        
        //将摸牌添加到最后
        if(mopai != null){
            holds.push(mopai);
        }
        return holds;

    },
    
    initMahjongs:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if(holds == null){
            return;
        }
        
        //初始化手牌
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length)*3;
        for(var i = 0; i < holds.length; ++i){
            var mjid = holds[i];
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            this.setSpriteFrameByMJID("M_",sprite,mjid);
        }
        for(var i = 0; i < lackingNum; ++i){
            var sprite = this._myMJArr[i]; 
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }
        for(var i = lackingNum + holds.length; i < this._myMJArr.length; ++i){
            var sprite = this._myMJArr[i]; 
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;            
        }
    },
    
    setSpriteFrameByMJID:function(pre,sprite,mjid){
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid);
        sprite.node.active = true;
    },
    
    //如果玩家手上还有缺的牌没有打，则只能打缺牌
    checkQueYiMen:function(){
        if(cc.vv.gameNetMgr.conf==null || cc.vv.gameNetMgr.conf.type != "xlch" || !cc.vv.gameNetMgr.getSelfData().hued){
            //遍历检查看是否有未打缺的牌 如果有，则需要将不是定缺的牌设置为不可用
            var dingque = cc.vv.gameNetMgr.dingque;
    //        console.log(dingque)
            var hasQue = false;
            if(cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn){
                for(var i = 0; i < this._myMJArr.length; ++i){
                    var sprite = this._myMJArr[i];
    //                console.log("sprite.node.mjId:" + sprite.node.mjId);
                    if(sprite.node.mjId != null){
                        var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
                        if(type == dingque){
                            hasQue = true;
                            break;
                        }
                    }
                }            
            }

    //        console.log("hasQue:" + hasQue);
            for(var i = 0; i < this._myMJArr.length; ++i){
                var sprite = this._myMJArr[i];
                if(sprite.node.mjId != null){
                    var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
                    if(hasQue && type != dingque){
                        sprite.node.getComponent(cc.Button).interactable = false;
                    }
                    else{
                        sprite.node.getComponent(cc.Button).interactable = true;
                    }
                }
            }   
        }
        else{
            if(cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn){
                for(var i = 0; i < 14; ++i){
                    var sprite = this._myMJArr[i]; 
                    if(sprite.node.active == true){
                        sprite.node.getComponent(cc.Button).interactable = i == 13;
                    }
                }
            }
            else{
                for(var i = 0; i < 14; ++i){
                    var sprite = this._myMJArr[i]; 
                    if(sprite.node.active == true){
                        sprite.node.getComponent(cc.Button).interactable = true;
                    }
                }
            }
        }
    },
    
    getLocalIndex:function(index){
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 4) % 4;
        //console.log("old:" + index + ",base:" + cc.vv.gameNetMgr.seatIndex + ",new:" + ret);
        return ret;
    },
    
    onOptionClicked:function(event){
      
        // console.log(event.target.pai);
        if(event.target.name == "btnPeng"){
            cc.vv.net.send("peng");
        }
        else if(event.target.name == "btnGang"){

            cc.vv.net.send("gang",event.target.pai);

        }
        else if(event.target.name == "btnHu"){
            var holds = cc.find("Canvas/game/myself/holds");
            for(var k=0;k<holds.children.length;k++){
                holds.children[k].children[0].active = false;
            }

            for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
                // var seatData = cc.vv.gameNetMgr.seats[i];
                // var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
                var hupailist = this._hupaiLists[i];
                    hupailist.active = true;
                }

            cc.vv.net.send("hu",event.target.pai);
        }
        else if(event.target.name == "btnGuo"){
            cc.vv.net.send("guo");
            // var turn = cc.vv.gameNetMgr.turn;
            // var localIndex = cc.vv.gameNetMgr.getLocalIndex(turn);
        var seatIndex = cc.vv.gameNetMgr.seatIndex;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");

        var lastIndex = this.getMJIndex(side,13);
        var nc = holds.children[lastIndex];

        // console.log(nc)
        // console.log(nc.active)
        // console.log(holds)
        //     console.log('过按钮点击后=========')
        //     console.log('首牌ID=========')
        //     console.log(optionData)
            if(optionData.gang && nc.active){
                // console.log('进来了=========')
                var holds = cc.find("Canvas/game/myself/holds");
                var chaTingData = cc.vv.gameNetMgr._chaTingData;
                // console.log('chaTingData chaTingData chaTingData========')
                // console.log(chaTingData)
                // console.log(HoldsId)
                if(chaTingData == null){
                    return;
                }else {
                    for(var key in chaTingData){
                        for(var j=0;j<HoldsId.length;j++){
                            if(key == HoldsId[j]){
                                holds.children[j].children[0].active = true;
                            }
                        }
                    }
                }
            }    
          
        }
    },
    getMjRoom: function () {
        var gameResult = cc.find("Canvas/game_result");
        var animCtrl = gameResult.getComponent(cc.Animation);
        animCtrl.play("hideAlert");
         cc.director.loadScene("hall");
        // this.getComponent('MJRoom').onBtnBackClicked();
    },

    chaTingBtn:function(){
        cc.vv.net.send('ting');
   
    },


    // chating:function(data){//seatIndex：自己的手牌    suggestPai：后台传过来的牌
    //     console.log("后台传来的数据")
    //     console.log(data)
    //     var shouPaiId = data[1];
    //     // var seatData = this.seats[seatIndex];//自己手里的牌
    //     var suggestPai = data[0];//后台传过来的
    //     this._chaTingData = suggestPai;
    //     var ting = cc.find("Canvas/game/myself/chatingsss"); //听牌可以胡的牌的父级
    //     var chatins = cc.find('Canvas/game/myself/holds'); //手牌各节点
    //     var myholdsId = [];
    //         for(var i =0;i<chatins.children.length-1;i++){
    //             myholdsId.push(chatins.children[i].mjId)
    //         }
    //         myholdsId.push(shouPaiId);
    //         HoldsId = myholdsId;


    //             for(var key in suggestPai){
    //                  if(suggestPai[key].length > 0){
    //                     for(var x=0;x<myholdsId.length;x++){
    //                         if(key == myholdsId[x]){
    //                         chatins.children[x].children[0].active=true;
    //                         }
    //                     }
    //                  }
    //             }
    //    // this.dispatchEvent('game_chating',{seatIndex:seatIndex,suggestPai:suggestPai}); 
    // },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },
    
    onDestroy:function(){
        // console.log("onDestroy");
        if(cc.vv){
            cc.vv.gameNetMgr.clear();   
        }
    },

    // tingBtnShow:function() {
    //     var chaTingBtn = cc.find('Canvas/chaTingBtn');
    //     console.log('chaTingBtn==============chaTingBtn')
    //     console.log(chaTingBtn)
    //     chaTingBtn.active = true;
    // },

    test:function(){
        var a=cc.vv.gameNetMgr.seatIndex;
        console.log('mjgame======mjgame==========mjgame');
        console.log(a);
    }
});
