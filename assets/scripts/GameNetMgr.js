// window.chaTingData = null;
window.huPaiData = null;
window.chuPaiId = null;
window.HoldsId = null;
window.subScoreArr = [];
window.tingPaiData = null;

// window.shouPaiId = null;
cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        roomId:null,
        maxNumOfGames:0,
        numOfGames:0,
        numOfMJ:0,
        seatIndex:-1,
        seats:null,
        turn:-1,
        button:-1,
        dingque:-1,
        chupai:-1,
        isDingQueing:false,
        isHuanSanZhang:false,
        gamestate:"",
        isOver:false,
        dissoveData:null,
        _seats:[],
        _chaTingData:null,
        _huedPai:null,
        // _chaTingBtn:null,
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

    // onLoad:function(){
    //      // this._chaTingBtn = this.node.getChildByName('chaTingBtn')
    //      console.log('this.node============================')
    //      console.log(this.node)
    // },
    
    reset:function(){
        this.turn = -1;
        this.chupai = -1,
        this.dingque = -1;
        this.button = -1;
        this.gamestate = "";
        this.dingque = -1;
        this.isDingQueing = false;
        this.isHuanSanZhang = false;
        this.curaction = null;
        for(var i = 0; i < this.seats.length; ++i){
            this.seats[i].holds = [];
            this.seats[i].folds = [];
            this.seats[i].pengs = [];
            this.seats[i].angangs = [];
            this.seats[i].diangangs = [];
            this.seats[i].wangangs = [];
            this.seats[i].dingque = -1;
            this.seats[i].ready = false;
            this.seats[i].hued = false;
            this.seats[i].huanpais = null;
            this.huanpaimethod = -1;
        }
    },
    
    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this.seats = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;        
        }
    },
    
    dispatchEvent(event,data){
        console.log(event+"..............dispatchEvent");
        console.log(this.dataEventHandler);
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        } else {
            var aaa = this;
            setTimeout(function () {
                aaa.dispatchEvent(event, data);
            }, 1000);
        }    
    },
    
    getSeatIndexByID:function(userId){
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    },
    
    isOwner:function(){
        return this.seatIndex == 0;   
    },
    
    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
    },
    
    getSelfData:function(){
        return this.seats[this.seatIndex];
    },
    
    getLocalIndex:function(index){
        var ret = (index - this.seatIndex + 4) % 4;
        return ret;
    },
    
    prepareReplay:function(roomInfo,detailOfGame){
        this.roomId = roomInfo.id;
        this.seats = roomInfo.seats;
        this.turn = detailOfGame.base_info.button;
        var baseInfo = detailOfGame.base_info;
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            s.seatindex = i;
            s.score = null;
            s.holds = baseInfo.game_seats[i];
            s.pengs = [];
            s.angangs = [];
            s.diangangs = [];
            s.wangangs = [];
            s.folds = [];
            console.log(s);
            if(cc.vv.userMgr.userId == s.userid){
                this.seatIndex = i;
            }
        }
        this.conf = {
            type:baseInfo.type,
        }
        if(this.conf.type == null){
            this.conf.type == "xzdd";
        }
    },
    
     getWanfa:function(){
        var conf = this.conf;
        if(conf && conf.maxGames!=null && conf.maxFan!=null){
            var strArr = [];
            strArr.push(conf.maxGames+ "局");
            strArr.push(conf.fangfei+"房费");
            // strArr.push(conf.maxFan + "番封顶");
            
            strArr.push( "底分"+conf.baseScore );
             if(conf.dingpiao == 1){
                strArr.push("不漂");
            }
            else{
                strArr.push("漂");
            }
            if(conf.hsz){
                strArr.push("换三张");   
            }
            // if(conf.zimo == 1){
            //     strArr.push("自摸加番");
            // }
            // else{
            //     strArr.push("自摸加底");
            // }
            
            if(conf.jiangdui){
                strArr.push("将对");   
            }
            // if(conf.dianganghua == 1){
            //     strArr.push("点杠花(自摸)");   
            // }
            // else{
            //     strArr.push("点杠花(放炮)");
            // }
            // if(conf.menqing){
            //     strArr.push("门清、中张");   
            // }
            if(conf.tiandihu){
                strArr.push("天地胡");   
            }
            return strArr.join(" ");
        }
        return "";
    },
    
    initHandlers:function(){
        var self = this;
        cc.vv.net.addHandler("login_result",function(data){
            console.log(data);
            if(data.errcode === 0){
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;
                self.maxNumOfGames = data.conf.maxGames;
                self.numOfGames = data.numofgames;
                self.seats = data.seats;
                self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
                self.isOver = false;
            }
            else{
                console.log(data.errmsg);   
            }
        });
                
        cc.vv.net.addHandler("login_finished",function(data){
            console.log("login_finished");
            cc.director.loadScene("mjgame");
        });

        cc.vv.net.addHandler("exit_result",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
        
        cc.vv.net.addHandler("exit_notify_push",function(data){
           var userId = data;
           var s = self.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               self.dispatchEvent("user_state_changed",s);
           }
        });
        
        cc.vv.net.addHandler("dispress_push",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
                
        cc.vv.net.addHandler("disconnect",function(data){
            if(self.roomId == null){
                cc.director.loadScene("hall");
            }
            else{
                if(self.isOver == false){
                    cc.vv.userMgr.oldRoomId = self.roomId;
                    self.dispatchEvent("disconnect");                    
                }
                else{
                    self.roomId = null;
                }
            }
        });
        
        cc.vv.net.addHandler("new_user_comes_push",function(data){
            //console.log(data);
            var seatIndex = data.seatindex;
            if(self.seats[seatIndex].userid > 0){
                self.seats[seatIndex].online = true;
            }
            else{
                data.online = true;
                self.seats[seatIndex] = data;
            }
            self.dispatchEvent('new_user',self.seats[seatIndex]);
        });

        cc.vv.net.addHandler("game_sameIP_push",function(data){
            self.dispatchEvent('game_sameIP_push',data);
        });

        //胡牌张数
        cc.vv.net.addHandler("game_HuPaiNum_push",function(data){
            // self.dispatchEvent('game_HuPaiNum_push',data);
            self.tingBtn(data);
        });

       // // 听牌按钮
       //  cc.vv.net.addHandler("game_tingBtnShow_push",function(data){
       //      console.log('game_tingBtnShow_push=================================')
       //      self.tingBtnShow();
       //  });

        cc.vv.net.addHandler("user_state_push",function(data){
        
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.online = data.online;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.net.addHandler("user_ready_push",function(data){
            //console.log(data);
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.ready = data.ready;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.net.addHandler("game_holds_push",function(data){
            var seat = self.seats[self.seatIndex]; 
            console.log('data==============game_holds_push=========');
            console.log(data);
            seat.holds = data;
            
            for(var i = 0; i < self.seats.length; ++i){
                var s = self.seats[i]; 
                if(s.folds == null){
                    s.folds = [];
                }
                if(s.pengs == null){
                    s.pengs = [];
                }
                if(s.angangs == null){
                    s.angangs = [];
                }
                if(s.diangangs == null){
                    s.diangangs = [];
                }
                if(s.wangangs == null){
                    s.wangangs = [];
                }
                s.ready = false;
            }
            self.dispatchEvent('game_holds');
        });
         
        cc.vv.net.addHandler("game_begin_push",function(data){
            console.log('game_action_push');
            console.log(data);
            huPaiData = data;
            self.button = data;
            self.turn = self.button;
            self.gamestate = "begin";
            self.dispatchEvent('game_begin');
        });
        
        cc.vv.net.addHandler("game_playing_push",function(data){
            console.log('game_playing_push'); 
            self.gamestate = "playing"; 
            self.dispatchEvent('game_playing');
        });
        
        cc.vv.net.addHandler("game_sync_push",function(data){
            // cc.vv.net.send('ting');
            tingPaiData = data
            self.numOfMJ = data.numofmj;
            self.gamestate = data.state;
            if(self.gamestate == "dingque"){
                self.isDingQueing = true;
            }
            else if(self.gamestate == "huanpai"){
                self.isHuanSanZhang = true;
            }
            self.turn = data.turn;
            self.button = data.button;
            self.chupai = data.chuPai;
            self.huanpaimethod = data.huanpaimethod;
            for(var i = 0; i < 4; ++i){

                var seat = self.seats[i];
                var sd = data.seats[i];
                seat.holds = sd.holds;
                seat.folds = sd.folds;
                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                seat.pengs = sd.pengs;
                seat.dingque = sd.que;
                seat.hued = sd.hued; 
                seat.iszimo = sd.iszimo;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;
                seat.score = sd.totalScore;
                // totalScoreArr.push(sd.totalScore);
                subScoreArr.push(sd.subtotalScore);

                if(i == self.seatIndex){
                    self.dingque = sd.que;
                }
           }
           self.dispatchEvent('game_sync');
        });
        
        cc.vv.net.addHandler("game_dingque_push",function(data){
            self.isDingQueing = true;
            self.isHuanSanZhang = false;
            self.dispatchEvent('game_dingque');
        });
        
        cc.vv.net.addHandler("game_huanpai_push",function(data){
            self.isHuanSanZhang = true;
            self.dispatchEvent('game_huanpai');
        });
        
        cc.vv.net.addHandler("hangang_notify_push",function(data){
            self.dispatchEvent('hangang_notify',data);
        });
        
        cc.vv.net.addHandler("game_action_push",function(data){
            self.curaction = data;
            // console.log("game_action_push+++++++++++++++++++")
            // console.log(data);
            self.dispatchEvent('game_action',data);
            if(data == null){
                return;
            }else{
                if(data.peng || data.gang){
                    // console.log("---------------");
                    // var seatIndex = chuPaiId;
                    var arrowTip = cc.find("Canvas/arrowTip");
                    var turn = cc.vv.gameNetMgr.turn;
                    var localIndex = cc.vv.gameNetMgr.getLocalIndex(turn);
                    //  console.log(localIndex);
                    // console.log(data.pai);
                    for(var ii = 0; ii < arrowTip.children.length; ++ii){
                        arrowTip.children[ii].active = ii == localIndex;
                    }
                    
                }
            }
        });
        
        cc.vv.net.addHandler("game_chupai_push",function(data){

            // console.log('game_chupai_push');
            //console.log(data);
            var turnUserID = data;
            chuPaiId = data;
            var si = self.getSeatIndexByID(turnUserID);
            self.doTurnChange(si);
        });
        
        cc.vv.net.addHandler("game_num_push",function(data){
            self.numOfGames = data;
            self.dispatchEvent('game_num',data);
        });

        cc.vv.net.addHandler("game_over_push",function(data){
            console.log('game_over_push');
            var results = data.results;
            for(var i = 0; i <  self.seats.length; ++i){
                self.seats[i].score = results.length == 0? 0:results[i].totalscore;
            }
            self.dispatchEvent('game_over',results);
            if(data.endinfo){
                self.isOver = true;
                self.dispatchEvent('game_end',data.endinfo);    
            }
            self.reset();
            for(var i = 0; i <  self.seats.length; ++i){
                self.dispatchEvent('user_state_changed',self.seats[i]);    
            }
        });
        
        cc.vv.net.addHandler("mj_count_push",function(data){
            console.log('mj_count_push');
            self.numOfMJ = data;
            //console.log(data);
            self.dispatchEvent('mj_count',data);
        });
        
        cc.vv.net.addHandler("hu_push",function(data){
            console.log('hu_push');
            console.log(data);
            self.doHu(data);
        });
        
        cc.vv.net.addHandler("game_chupai_notify_push",function(data){
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doChupai(si,pai);
        });
        
        cc.vv.net.addHandler("game_mopai_push",function(data){
            console.log('game_mopai_push');
            self.doMopai(self.seatIndex,data);
        });

        cc.vv.net.addHandler("guo_notify_push",function(data){
            console.log('guo_notify_push');
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGuo(si,pai);
        });
        
        cc.vv.net.addHandler("guo_result",function(data){
            console.log('guo_result');
            self.dispatchEvent('guo_result');
        });

        cc.vv.net.addHandler("game_chating_push",function(data){
            console.log('game_chating_push');
            self.chating(self.seatIndex,data);
            // self.dispatchEvent('chating',data);
        });

        //获取分数
        cc.vv.net.addHandler("game_getScore_push",function(data){
            // console.log('game_getScore_push');
            self.getScore(self.seatIndex,data);
        });
      
         //  查花猪
        cc.vv.net.addHandler("game_checkHuaZhu_push",function(data){
            console.log('game_checkHuaZhu_push-----------------data');
            console.log(data)
            self.checkHuaZhu(self.seatIndex,data);
        });

     
        
        cc.vv.net.addHandler("guohu_push",function(data){
            console.log('guohu_push');
            self.dispatchEvent("push_notice",{info:"过胡",time:1.5});
        });
        
        cc.vv.net.addHandler("huanpai_notify",function(data){
            var seat = self.getSeatByID(data.si);
            seat.huanpais = data.huanpais;
            self.dispatchEvent('huanpai_notify',seat);
        });
        
        cc.vv.net.addHandler("game_huanpai_over_push",function(data){
            console.log('game_huanpai_over_push');
            var info = "";
            var method = data.method;
            if(method == 0){
                info = "换对家牌";
                
            }
            else if(method == 1){
                // info = "换下家牌";
                info = "顺时针换";
            }
            else{
                // info = "换上家牌";
                info = "逆时针换";
            }
            self.huanpaimethod = method;
            cc.vv.gameNetMgr.isHuanSanZhang = false;
            self.dispatchEvent("game_huanpai_over");
            self.dispatchEvent("push_notice",{info:info,time:2});
        });
        
        cc.vv.net.addHandler("peng_notify_push",function(data){
            console.log('peng_notify_push');
            console.log(data);
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doPeng(si,data.pai);
        });
        
        cc.vv.net.addHandler("gang_notify_push",function(data){
            console.log('gang_notify_push');
            console.log(data);
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGang(si,pai,data.gangtype);
        });
        
        cc.vv.net.addHandler("game_dingque_notify_push",function(data){
            self.dispatchEvent('game_dingque_notify',data);
        });
        
        cc.vv.net.addHandler("game_dingque_finish_push",function(data){
            for(var i = 0; i < data.length; ++i){
                self.seats[i].dingque = data[i];
            }
            self.dispatchEvent('game_dingque_finish',data);
        });
        
        
        cc.vv.net.addHandler("chat_push",function(data){
            self.dispatchEvent("chat_push",data);    
        });
        
        cc.vv.net.addHandler("quick_chat_push",function(data){
            self.dispatchEvent("quick_chat_push",data);
        });
        
        cc.vv.net.addHandler("emoji_push",function(data){
            self.dispatchEvent("emoji_push",data);
        });
        
        cc.vv.net.addHandler("dissolve_notice_push",function(data){
            console.log("dissolve_notice_push"); 
            console.log(data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice",data);
        });
        
        cc.vv.net.addHandler("dissolve_cancel_push",function(data){
            self.dissoveData = null;
            self.dispatchEvent("dissolve_cancel",data);
        });
        
        cc.vv.net.addHandler("voice_msg_push",function(data){
            self.dispatchEvent("voice_msg",data);
        });
                // 清空上局玩家字
        cc.vv.net.addHandler('mj_huedpai_push',function(data){
            console.log('mj_huedpai_push=================mj_huedpai_push')
            console.log(data);
            self._huedPai = data;
            // var test = cc.vv.MJGame.test
            // self.test();
            // initHupai()
        });
   
    },
    
    doGuo:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        var folds = seatData.folds;
        folds.push(pai);
        this.dispatchEvent('guo_notify',seatData);    
    },
    
    doMopai:function(seatIndex,pai){
        // console.log("================id")
        // console.log(pai)
        //moPaiId = pai;
        // console.log(moPaiId);
        var seatData = this.seats[seatIndex];
        if(seatData.holds){
            seatData.holds.push(pai);
            this.dispatchEvent('game_mopai',{seatIndex:seatIndex,pai:pai});            
        }
    },

    getScore:function(seatIndex,scoreData){
        // console.log("后台传过来的分数信息");
        // console.log(scoreData)
        // console.log(seatIndex)
            // var seatData = this.seats[seatIndex];
            // var userId = cc.vv.userMgr.userId;
            // var seat = this.getSeatByID(userId);
            // var seatsArr = 
            
            var seatsArr = this.seats;
            // var tempSeats = seatsArr.splice(seatIndex)
            // var seatConcat = tempSeats.concat(seatsArr)
            for(var m=0;m<seatsArr.length;m++){
                seatsArr[m].score += scoreData[m][0]; 
            }
      
            // console.log(seat) 


            console.log('scoreData==========================')
            console.log(scoreData)
            var rScore = cc.find("Canvas/game/right/seat/score");
            var tScore = cc.find("Canvas/game/up/seat/score");
            var lScore = cc.find("Canvas/game/left/seat/score");
            var bScore = cc.find("Canvas/game/myself/seat/score");

            var RsubScore = cc.find("Canvas/game/right/seat/subScore");
            var LsubScore = cc.find("Canvas/game/left/seat/subScore");
            var UsubScore = cc.find("Canvas/game/up/seat/subScore");
            var MsubScore = cc.find("Canvas/game/myself/seat/subScore");
            var scoreNode = [bScore,rScore,tScore,lScore];
            var subScore  = [MsubScore,RsubScore,UsubScore,LsubScore];

            // console.log(scoreNode)
            // console.log("胡牌后各玩家信息=======")
            var scoreArr = [];
            for(var i=0;i<scoreData.length;i++){
                scoreArr.push(scoreData[i][0]);
                
                // scoreNode[i].children[1].active = true;
                // scoreNode[i].children[0].active = true;
                // var FIAction = cc.fadeIn(0.1);
                // scoreNode[i].children[1].runAction(FIAction);
                // scoreNode[i].children[0].runAction(FIAction);
            }

            var b = scoreArr.splice(seatIndex);

            var concat = b.concat(scoreArr);
            // console.log(concat)
            // var count = 0;
            for(var j=0;j<concat.length;j++){
                // scoreNode[i].children[1].active = true;
                // scoreNode[i].children[0].active = true;
                // var FIAction = cc.fadeIn(0.1);
                // scoreNode[i].children[1].runAction(FIAction);
                // scoreNode[i].children[0].runAction(FIAction);
                scoreNode[j].getComponent(cc.Label).string += concat[j];
                // seatConcat[j].score += concat[j];
                subScore[j].getComponent(cc.Label).string = parseInt(subScore[j].getComponent(cc.Label).string)+concat[j];
                if(concat[j]>0){
                    scoreNode[j].children[1].active = true;
                    var fOAction = cc.fadeOut(3.5);
                    var fIAction = cc.fadeIn(1);
                    var seq = cc.sequence([fIAction,fOAction]);
                    scoreNode[j].children[1].runAction(seq);
                    scoreNode[j].children[1].getComponent(cc.Label).string = '+'+concat[j];
                }else{

                    if(concat[j] == 0){
                        scoreNode[j].children[0].active = false;
                    }else{
                        scoreNode[j].children[0].active = true;
                    }

                    var fOAction = cc.fadeOut(3.5);
                    var fIAction = cc.fadeIn(1);
                    var seq = cc.sequence([fIAction,fOAction]);
                    scoreNode[j].children[0].runAction(seq);
                    scoreNode[j].children[0].getComponent(cc.Label).string = concat[j];
                }
            }
            // console.log('seat============seat')
            // console.log(seatsArr)

            // // console.log(scoreData[seatIndex][0])
            // // seat.score += scoreData[seatIndex][0];
            // // console.log(seat.score)

            // console.log('seat=====================seat')   

    },


    checkHuaZhu:function(seatIndex,huZhuFlag){
            console.log('花猪被调用了？？？？')
            var huaZhuTip = cc.find("Canvas/huaZhuTip");
            huaZhuTip.active = true;   
            var fOAction = cc.fadeOut(1.5);
            var fIAction = cc.fadeIn(1);
            if(huZhuFlag){
                huaZhuTip.runAction(fIAction);
            }else{
                huaZhuTip.runAction(fOAction);
            }
            // var seq = cc.sequence([fIAction,fOAction]);
            // huaZhuTip.runAction(seq);
        },

    chating:function(seatIndex,suggestPai){//seatIndex：自己的手牌    suggestPai：后台传过来的牌
        console.log("后台传来的数据")
        console.log(suggestPai)
        var shouPaiId = suggestPai[1];
        var seatData = this.seats[seatIndex];//自己手里的牌
        var suggestPai = suggestPai[0];//后台传过来的
        this._chaTingData = suggestPai;
        var ting = cc.find("Canvas/game/myself/chatingsss"); //听牌可以胡的牌的父级
        var chatins = cc.find('Canvas/game/myself/holds'); //手牌各节点
        var myholdsId = [];
            for(var i =0;i<chatins.children.length-1;i++){
                myholdsId.push(chatins.children[i].mjId)
            }
            myholdsId.push(shouPaiId);
            HoldsId = myholdsId;


                for(var key in suggestPai){
                     if(suggestPai[key].length > 0){
                        for(var x=0;x<myholdsId.length;x++){
                            if(key == myholdsId[x]){
                            chatins.children[x].children[0].active=true;
                            }
                        }
                     }
                }
       this.dispatchEvent('game_chating',{seatIndex:seatIndex,suggestPai:suggestPai}); 
    },

    tingBtn:function(data){
        console.log("点击tingBtn传来的数据");
        console.log(data);
        // this._tingBtnData = data
        // console.log(this._tingBtnData)
        // var chatins = cc.find('Canvas/game/myself/holds');
        var tips = cc.find("Canvas/game/myself/chatingsss");
        console.log(tips);
        for(var i=0;i<data.length;i++){
            tips.children[i].children[2].getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",data[i][0]);
            tips.children[i].children[0].getComponent(cc.Label).string = data[i][1]+'番';
            tips.children[i].children[1].getComponent(cc.Label).string = data[i][2]+'张';
                    for(var m=0; m<tips.children.length-1;m++){
                        if(m<data.length){
                            tips.children[m].active = true;
                            tips.width = 380 + m*260;
                            tips.height = 210;
                            tips.y = 10;
                            if(m>3){
                                 tips.width = 380 + 3*260;
                                 tips.height = 360;
                                 tips.y = 140;
                             }
                        }else{
                            tips.children[m].active = false;
                        }
                    }
        }

                if(tips.active == true){
                    tips.active = false;
                    return;
                } else{
                    tips.active = true;
                }
    },

    // tingBtnShow:function() {
    //     //var chaTingBtn = cc.find('Canvas/game');
    //     console.log('chaTingBtn==============chaTingBtn')
    //     console.log(cc.vv.chaTingBtn)
    //     //chaTingBtn.active = true;
    // },

    doChupai:function(seatIndex,pai){
        this.chupai = pai;
        var seatData = this.seats[seatIndex];
        if(seatData.holds){             
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx,1);
        }
        this.dispatchEvent('game_chupai_notify',{seatData:seatData,pai:pai});    
    },
    
    doPeng:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        //移除手牌
        if(seatData.holds){
            for(var i = 0; i < 2; ++i){
                var idx = seatData.holds.indexOf(pai);
                seatData.holds.splice(idx,1);
            }                
        }
            
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push(pai);
            
        this.dispatchEvent('peng_notify',seatData);
    },
    
    getGangType:function(seatData,pai){
        if(seatData.pengs.indexOf(pai) != -1){
            return "wangang";
        }
        else{
            var cnt = 0;
            for(var i = 0; i < seatData.holds.length; ++i){
                if(seatData.holds[i] == pai){
                    cnt++;
                }
            }
            if(cnt == 3){
                return "diangang";
            }
            else{
                return "angang";
            }
        }
    },
    
    doGang:function(seatIndex,pai,gangtype){
        var seatData = this.seats[seatIndex];
        
        if(!gangtype){
            gangtype = this.getGangType(seatData,pai);
        }
        
        if(gangtype == "wangang"){
            if(seatData.pengs.indexOf(pai) != -1){
                var idx = seatData.pengs.indexOf(pai);
                if(idx != -1){
                    seatData.pengs.splice(idx,1);
                }
            }
            seatData.wangangs.push(pai);      
        }
        if(seatData.holds){
            for(var i = 0; i <= 4; ++i){
                var idx = seatData.holds.indexOf(pai);
                if(idx == -1){
                    //如果没有找到，表示移完了，直接跳出循环
                    break;
                }
                seatData.holds.splice(idx,1);
            }
        }
        if(gangtype == "angang"){
            seatData.angangs.push(pai);
        }
        else if(gangtype == "diangang"){
            seatData.diangangs.push(pai);
        }
        this.dispatchEvent('gang_notify',{seatData:seatData,gangtype:gangtype});
    },
    
    doHu:function(data){
        console.log("data=====");
        console.log(data);
        this.dispatchEvent('hupai',data);
    },
    
    doTurnChange:function(si){
        var data = {
            last:this.turn,
            turn:si,
        }
        this.turn = si;
        this.dispatchEvent('game_chupai',data);
    },
    
    connectGameServer:function(data){
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            var sd = {
                token:data.token,
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
            cc.vv.net.send("login",sd);
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
