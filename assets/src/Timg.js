const timgList = [//[文字，概率]
    ['配偶一个', 100],
    ['100元', 80],
    ['奥迪一台', 93],
    ['洗衣机一台', 88],
    ['5毛', 60],
    ['别墅一栋', 97],
];

cc.Class({
    extends: cc.Component,

    properties: {
        rotPoint: cc.Node,   //转动圈
        light: cc.Animation,      //跑马灯
        rotBtn: cc.Button,
        rewardLb: cc.Label,   //奖励文字
    },

    // use this for initialization
    onLoad() {
        this.initData();
    },

    initData() {
        this.rewardLb.node.opacity = 0;

        this.totalCount = 6;    //盘点总数
        this.randCountMin = 8; //随机最少圈数
        this.randCountMax = 12; //随机最多圈数
        this.offsetAngle = 10;  //距离分隔线的角度>10
        this.singleAngle = 360 / this.totalCount;//单个盘点的角度
        this.angle = 0; //初始角度

        let orderList = [];
        let children = this.rotPoint.children;
        for (let i = 0; i < children.length; i++) {
            let lb = children[i].getComponent(cc.Label);
            lb.string = timgList[i][0];
            orderList.push(timgList[i][1]);
        }
        orderList.sort(function (a,b) {
            return a - b;
        });
        cc.log(orderList);
        this.orderList = orderList;
    },
    //转起来
    doPlay(event) {
        this.light.play();//跑马灯
        this.rotBtn.interactable = false;

        //根据概率随机出奖品
        let id = this.getRandomId();
        console.log('id',id);
        let playTime = this.getRandom(4, 6);//转动时间
        let rotCount = this.getRandomInt(this.randCountMin, this.randCountMax);//转动圈数
        let offset = this.getRandom(this.offsetAngle, this.singleAngle - this.offsetAngle);//指针落在盘点的角度
        let idAngle = id * this.singleAngle + offset; //指针落在那个盘上
        let angleCount = 360 * rotCount - idAngle + this.angle;//转动的总角度
        this.angle = 360 - (360 * rotCount - idAngle) % 360;   //转动结束后转盘转动的度数
        let rotAction = cc.rotateBy(playTime, angleCount);
        this.rotPoint.runAction(cc.sequence(rotAction.easing(cc.easeQuadraticActionOut()), cc.callFunc(function () {
            //显示奖励
            this.showReward(id);
            //按钮恢复
            this.rotBtn.interactable = true;
            this.light.stop();  //跑马灯结束
        }, this)));
    },

    showReward(id) {
        let str = timgList[id][0];
        this.rewardLb.string = `恭喜获得'${str}!`;
        this.rewardLb.node.opacity = 0;
        this.rewardLb.node.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(1.5), cc.fadeOut(0.5)));
    },

    //随机奖励
    getRandomId() {
        let random = this.getRandom(0, 100);//0-100随机数
        let chance;
        for (let i = 0; i < this.orderList.length; i++) {//根据随机数确认概率
            if (random<this.orderList[i]) {
                chance = this.orderList[i];
                break;
            }
        }

        let id = timgList.findIndex(function (value, idx, arr) {//筛选出概率 == chance的id
            return value[1] == chance;
        })
        return id;
    },

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    },
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    // called every frame, uncomment this function to activate update callback
    // update  (dt) {

    // },
});
