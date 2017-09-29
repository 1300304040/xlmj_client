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
        winner_node:cc.Node,
        winner_switch_node:cc.Node,
        richer_node:cc.Node,
        richer_switch_node:cc.Node,
        richerParent_node:cc.Node,
        winnerParent_node:cc.Node,
        content_node:cc.Node,
        content_richer_node:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
     
    },
    onWinnerClick:function(){
        if(this.richerParent_node){
        this.richer_node.active = true;
        this.richer_switch_node.active = false;
        this.winner_node.active = true;
        this.winner_switch_node.active = false;
        this.content_node.active = true;
        this.content_richer_node.active = false;
        }
    },
    onRicherClick:function(){
        if(this.winnerParent_node){
        this.richer_node.active = false;
        this.richer_switch_node.active = true;
        this.winner_node.active = false;
        this.winner_switch_node.active = true;
        this.content_node.active = false;
        this.content_richer_node.active = true;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
