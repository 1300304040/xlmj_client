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
        menuAlert: cc.Node,
        flag: true,
    },

    // use this for initialization
    onLoad: function () {

    },
    onMenuClick: function(){
        if(this.flag){
            this.menuAlert.active = true;
            var animCtrl = this.menuAlert.getComponent(cc.Animation);
                animCtrl.play("slideDown");
            this.flag = !this.flag;
        }else{
            // this.menuAlert.active = false;
            var animCtrl = this.menuAlert.getComponent(cc.Animation);
                animCtrl.play("slideUp");
            this.flag = !this.flag
        }       
    },
    // console.log(this.node);
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
