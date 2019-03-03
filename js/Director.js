//导演类,控制游戏的逻辑
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";

export class Director {

    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {
        this.dataStore = DataStore.getInstance();
        this.moveSpeed = 2;
    }

    createPencil() {
        const minTop = DataStore.getInstance().canvas.height / 8;
        const maxTop = DataStore.getInstance().canvas.height / 2;
        const top = minTop + Math.random() * (maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top));
        this.dataStore.get('pencils').push(new DownPencil(top));
    }

    birdsEvent() {
        for (let i = 0; i < 3; ++i) {
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i];
        }
        this.dataStore.get('birds').time = 0;
    }

    //判断小鸟是否撞击地板或铅笔
    check() {
        const birds = this.dataStore.get('birds');
        const land = this.dataStore.get('land');
        const pencil = this.dataStore.get('pencils');
        //地板撞击判断
        if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
            this.isGameOver = true;
            return;
        }
        //铅笔撞击判断
        for (let i = 0; i < pencil.length; ++i) {
            if ((birds.birdsX[0] < pencil[i].x && birds.birdsX[0] + birds.birdsWidth[0] > pencil[i].x)
                || (birds.birdsX[0] > pencil[i].x && birds.birdsX[0] < pencil[i].x + pencil[i].width)) {
                if (i & 1) {
                    if (birds.birdsY[i] >= pencil[i].y) {
                        this.isGameOver = true;
                        return;
                    }
                } else {
                    if (birds.birdsY[i] <= pencil[i].y + pencil[i].height) {
                        this.isGameOver = true;
                        return;
                    }
                }
            }
        }
    }

    run() {
        this.check();
        if (!this.isGameOver) {
            this.dataStore.get('background').draw();

            const pencils = this.dataStore.get('pencils');//const 不能重新赋值,但是可以调用方法等来改变对象的属性
            const birds = this.dataStore.get('birds');
            const score = this.dataStore.get('score');

            if (pencils[0].x + pencils[0].width <= 0 && pencils.length === 4) {
                pencils.shift();
                pencils.shift();
                score.isScore = true;
            }

            if (pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2 && pencils.length === 2) {
                this.createPencil();
            }
            //加分
            if (score.isScore && birds.birdsX[0] > pencils[0].x + pencils[0].width) {
                score.scoreNumber += 1;
                score.isScore = false;
            }
            this.dataStore.get('pencils').forEach(value => value.draw());
            this.dataStore.get('land').draw();
            this.dataStore.get('score').draw();
            this.dataStore.get('birds').draw();

            let timer = requestAnimationFrame(() => this.run());
            this.dataStore.put('timer', timer);
        } else {
            this.dataStore.get('startbutton').draw();
            cancelAnimationFrame(this.dataStore.get('timer'));
            this.dataStore.destory();
        }
    }
}