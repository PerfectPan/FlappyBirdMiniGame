//初始化整个游戏的精灵,作为游戏开始的入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";
import {BackGround} from "./js/runtime/BackGround.js";
import {Land} from "./js/runtime/Land.js";
import {DataStore} from "./js/base/DataStore.js";
import {Birds} from "./js/player/Birds.js";
import {StartButton} from "./js/player/StartButton.js";
import {Score} from "./js/player/Score.js";

export class Main {
    constructor() {
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();
        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResourceFirstLoaded(map));
    }

    onResourceFirstLoaded(map) {
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;//需要长期保存
        this.dataStore.res = map;
        this.init();
    }

    init() {
        //首先重置游戏是没有结束的
        this.director.isGameOver = false;
        this.dataStore
            .put('pencils', [])
            .put('background', BackGround)
            .put('land', Land)
            .put('birds', Birds)
            .put('score', Score)
            .put('startbutton', StartButton);
        this.registerEvent();
        //创建铅笔要在游戏逻辑运行之前
        this.director.createPencil();
        this.director.run();
    }

    registerEvent() {
        wx.onTouchStart(() => {
            if (this.director.isGameOver) {
                this.init();
            } else {
                this.director.birdsEvent();
            }
        });
    }
}