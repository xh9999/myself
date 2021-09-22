window.addEventListener('load', function () {
    //通过自调用函数产生一个随机数对象,在自调用函数外面,调用该随机数对象方法产生随机数
    (function (window) {
        //产生随机数的构造函数
        function Random() {}
        //在原型对象中添加方法
        Random.getRandom = function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };
        //把Random对象暴露给顶级对象window--->外部可以直接使用这个对象
        window.Random = Random;
    })(window);
    // 食物的随机颜色
    (function (w) {
        function getRandomColor() {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        };
        w.getRandomColor = getRandomColor;
    })(window);
    // 创建食物对象
    (function (w) {
        function Foot(x, y, color) {
            this.x = x || 0; //表示食物在画布上的位置
            this.y = y || 0;
            this.color = color || 'red';
            this.width = 20; //食物的长和宽
            this.height = 20;
            this.context = document.querySelector('#canvas').getContext('2d');
            // 画布的长和宽
            this.canvasWidth = this.context.canvas.width;
            this.canvasHeight = this.context.canvas.height;
            this.score = 0;
        };

        var myCanvas = document.querySelector('#canvas');
        /*获取绘图工具*/
        var context = myCanvas.getContext('2d');
        var gridSize = 20;
        // 获取画布的长度和宽度
        var height = myCanvas.height;
        var width = myCanvas.width;
        // 在x轴上可以画多少条线
        var xLineTotal = Math.floor(width / gridSize);
        for (var i = 1; i < xLineTotal; i++) {
            context.beginPath();
            context.moveTo(gridSize * i - 0.5, 0);
            context.lineTo(gridSize * i - 0.5, height);
            // context.strokeStyle = '#ccc';
            context.stroke();
        }
        // 在y轴上可以画多少条线
        var yLineTotal = Math.floor(height / gridSize);
        for (var i = 1; i < yLineTotal; i++) {
            context.beginPath();
            context.moveTo(0, i * gridSize - 0.5);
            context.lineTo(width, i * gridSize - 0.5);
            // context.strokeStyle = '#ccc';
            context.stroke();
        }
        // 声明一个数组用来用来记录食物生成的位置,也就是为在小蛇吃掉一个食物之后，删除这个食物
        var ele = [];
        // 在画布上初始化食物对象
        Foot.prototype.init = function () {
            // 每次生成食物的时候清除上一次食物
            this.remove();
            // 在画布上随机生成食物的位置
            //在画布上最大的x值
            var maxX = Math.floor(this.canvasWidth / this.width);
            //在画布上最大的y值
            var maxY = Math.floor(this.canvasHeight / this.height);
            // 食物在画布上x的位置
            this.x = Random.getRandom(0, maxX);
            // 食物在画布上y的位置
            this.y = Random.getRandom(0, maxY);
            // 将食物渲染到画布上
            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
            // 将画布上这个食物的位置添加到这个数组中
            var arr = {
                x: this.x * this.width,
                y: this.y * this.height
            };
            ele.push(arr);
        };
        Foot.prototype.remove = function () {
            ele.forEach((item) => {
                this.context.clearRect(item.x, item.y, this.width, this.height);
            });
            ele = [];
        }
        w.Foot = Foot;
    })(window);
    // 创建蛇对象
    (function (w) {
        function Snake(width, height, dirction) {
            this.width = width || 20;
            this.height = height || 20;
            this.context = document.querySelector('#canvas').getContext('2d');
            this.body = [{ //这是蛇头的位置
                    x: 3,
                    y: 2,
                    color: '#ccc'
                },
                {
                    x: 2,
                    y: 2,
                    color: 'green'
                },
                {
                    x: 1,
                    y: 2,
                    color: 'green'
                },
            ];
            this.dirction = dirction || 'right';
        };
        // 生成一个数组用来保存蛇的身体在画布上的所有的位置
        var ele = [];
        Snake.prototype.init = function () {
            var obj = {};
            this.body.forEach((item) => {
                // 先将小蛇渲染到画布上
                this.context.fillRect(item.x * this.width, item.y * this.height, this.width, this.height);
                obj = {
                    x: item.x * this.width,
                    y: item.y * this.height
                };
                ele.push(obj);
            });
        };
        // 蛇移动的方法
        Snake.prototype.move = function (foot) {
            // 小蛇移动之前清除之前的小蛇
            this.remove();
            // 先将小蛇的身体移动起来,也就是从后往前移动数组中的元素
            for (var i = this.body.length - 1; i > 0; i--) {
                this.body[i].x = this.body[i - 1].x;
                this.body[i].y = this.body[i - 1].y;
            }
            if (this.dirction == 'right') {
                this.body[0].x++;
            }
            if (this.dirction == 'top') {
                this.body[0].y--;
            }
            if (this.dirction == 'left') {
                this.body[0].x--;
            }
            if (this.dirction == 'bottom') {
                this.body[0].y++;
            }
            // 当蛇头吃到食物的时候
            if (this.body[0].x == foot.x && this.body[0].y == foot.y) {
                // 当蛇吃到食物之后重新在生成一个食物
                foot.remove();
                foot.init();
                // 在吃到食物之后，蛇的身体会变长
                var obj = {};
                // 将最后一个蛇的身体赋值给obj的
                var obj1 = this.body[this.body.length - 1];
                for (var k in obj1) {
                    obj[k] = obj1[k];
                }
                this.body.push(obj);
                // 当蛇吃到食物的时候统计蛇吃的食物数量
                var span = document.querySelector('#score');
                foot.score++;
                if (foot.score >= 10) {
                    score.innerHTML = '0' + foot.score;
                } else if (foot.score >= 100) {
                    score.innerHTML = foot.score;
                } else {
                    score.innerHTML = '00' + foot.score;
                }
            }
            // 在此初始化小蛇
            this.init();
            var myCanvas = document.querySelector('#canvas');
            /*获取绘图工具*/
            var context = myCanvas.getContext('2d');
            var gridSize = 20;
            // 获取画布的长度和宽度
            var height = myCanvas.height;
            var width = myCanvas.width;
            // 在x轴上可以画多少条线
            var xLineTotal = Math.floor(width / gridSize);
            for (var i = 1; i < xLineTotal; i++) {
                context.beginPath();
                context.moveTo(gridSize * i - 0.5, 0);
                context.lineTo(gridSize * i - 0.5, height);
                // context.strokeStyle = '#ccc';
                context.stroke();
            }
            // 在y轴上可以画多少条线
            var yLineTotal = Math.floor(height / gridSize);
            for (var i = 1; i < yLineTotal; i++) {
                context.beginPath();
                context.moveTo(0, i * gridSize - 0.5);
                context.lineTo(width, i * gridSize - 0.5);
                // context.strokeStyle = '#ccc';
                context.stroke();
            }
        };
        // 蛇移除的方法
        Snake.prototype.remove = function () {
            ele.forEach(item => {
                this.context.clearRect(item.x - 0.5, item.y - 0.5, this.width + 1, this.height + 1);
            });
            ele = [];
        };
        // 蛇吃到食物的方法
        w.Snake = Snake;
    })(window);
    // 创建游戏对象
    (function (w) {
        function Game() {
            this.foot = new Foot();
            this.snack = new Snake();
        };
        // 开始游戏
        // var timer = null;
        Game.prototype.starGame = function () {
            this.restarGame();
            clearInterval(timer);
            this.snack.remove();
            this.foot.init();
            this.snack.init();
            var span = document.querySelector('#score');
            score.innerHTML = '000';
            this.key();
            timer = setInterval(function () {
                this.snack.move(this.foot);
                this.overGame();
            }.bind(this), 200);
        }
        // 游戏的按键方法
        Game.prototype.key = function () {
            document.onkeydown = function (e) {
                // 左 37 上38 右39 下40
                // 当蛇头向左移动的时候，按下键右将无效
                if (e.keyCode == 37) {
                    if (this.dirction == 'right') {
                        return;
                    }
                    this.dirction = 'left';
                } else if (e.keyCode == 38) {
                    if (this.dirction == 'bottom') {
                        return;
                    }
                    this.dirction = 'top';
                } else if (e.keyCode == 39) {
                    if (this.dirction == 'left') {
                        return;
                    }
                    this.dirction = 'right';
                } else {
                    if (this.dirction == 'top') {
                        return;
                    }
                    this.dirction = 'bottom'
                }
            }.bind(this.snack);
        }
        // 游戏结束的方法
        Game.prototype.overGame = function () {
            // 蛇头的x坐标
            var x = this.snack.body[0].x;
            var y = this.snack.body[0].y;
            //在画布上最大的x值
            var maxX = Math.floor(this.foot.canvasWidth / this.foot.width);
            //在画布上最大的y值
            var maxY = Math.floor(this.foot.canvasHeight / this.foot.height);
            // 当蛇头撞墙游戏结束
            if (x >= maxX || x < 0 || y < 0 || y >= maxY) {
                clearInterval(timer);
                btn2.disabled = true;
                var over = document.querySelector('.over');
                over.style.display = 'block';
                var totalScore = over.querySelector('#totalScore');
                var span = document.querySelector('#score');
                totalScore.innerHTML = span.innerHTML;
            }
            // 当蛇头触碰到蛇的身体游戏结束
            for (var i = 1; i < this.snack.body.length; i++) {
                if (x == this.snack.body[i].x && y == this.snack.body[i].y) {
                    clearInterval(timer);
                    btn2.disabled = true;
                    var over = document.querySelector('.over');
                    over.style.display = 'block';
                    var totalScore = over.querySelector('#totalScore');
                    var span = document.querySelector('#score');
                    totalScore.innerHTML = span.innerHTML;
                }
            }
        };
        // 重新开始游戏的方法
        Game.prototype.restarGame = function () {
            this.foot = new Foot();
            this.snack = new Snake();
        }
        w.Game = Game;
    })(window);
    var btn1 = document.querySelector('.btn1');
    var btn2 = document.querySelector('.btn2');
    var timer = null;
    var flag = true;
    var game = new Game();
    // var game;
    btn1.onclick = function () {
        flag = true;
        this.innerHTML = '重新开始';
        btn2.innerHTML = '暂停游戏';
        game.starGame();
        btn2.disabled = false;
        var over = document.querySelector('.over');
        over.style.display = 'none';
    };
    btn2.onclick = function () {
        this.innerHTML = this.innerHTML == '暂停游戏' ? '继续游戏' : '暂停游戏';
        if (flag) {
            clearInterval(timer);
            flag = false;
        } else {
            timer = setInterval(function () {
                game.snack.move(game.foot);
                game.overGame();
            }, 200);
            flag = true;
        }
    }
})