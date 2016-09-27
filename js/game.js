var block = 8; //the block's size
var map = [];
var cool_mode = false; //in cool mode,cell will be  die, just die, alive, they are in different colors
var auto = 0; //control auto

function cell(x, y, s) { //get a cell div
    var cell_div = document.createElement("div");
    document.getElementById("map").appendChild(cell_div);
    cell_div.style.width = block + "px";
    cell_div.style.height = block + "px";
    cell_div.style.left = x * block + "px";
    cell_div.style.top = y * block + "px";
    cell_div.setAttribute('class', IntToStr(s));
    this.state = s;
    this.new_state = s;
    this.dom = cell_div;
}

function UpdateAll() {
    if (map.length == 0) {
        return null;
    }
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[0].length; j++) {
            map[i][j].state = map[i][j].new_state;
            map[i][j].dom.setAttribute('class', IntToStr(map[i][j].state));
        }
    }
}

function IntToStr(s) {
    if (s == 1) return "alive";
    if (s == -1 && cool_mode) return "just_die";
    if (s <= -1) return "die";
}

function init() {//initialize the blank map ;zero step count;set block size;

    if(CheckInput() == 0)
        return 0;
    ClearMap();
    document.getElementById("map").style.border = "5px solid #000000";
    document.getElementById("step").textContent = 0;
    block = document.getElementById("block").value;
    return 1;
}

function CheckInput() { //check whether the input is legal;1 is legal;
    var width = parseInt(document.getElementById("width").value);
    var height = parseInt(document.getElementById("height").value);
    block = parseInt(document.getElementById("block").value);
    if (width < parseInt(document.getElementById("width").min) || width > parseInt(document.getElementById("width").max) || height < parseInt(document.getElementById("height").min) || height > parseInt(document.getElementById("height").max)) {
        alert("宽度或高度超出1~200的范围！");
        return 0;
    }
    if (block < parseInt(document.getElementById("block").min) || block > parseInt(document.getElementById("block").max) ) {
        alert("网格大小超出3~30的范围！");
        return 0;
    }
    return 1;
}

function MyRandom(Min, Max) { //get a random int from Min to Max without 0 -1;
    var Range = Max - Min;
    var Rand = Math.random();
    var result = Min + Math.round(Rand * Range);
    while (result == 0 || result == -1) {
        Rand = Math.random();
        result = Min + Math.round(Rand * Range);
    }
    return result;
}

function FillMap(){
    var width = parseInt(document.getElementById("width").value);
    var height = parseInt(document.getElementById("height").value);
    document.getElementById("map").style.width = width * block + "px";
    document.getElementById("map").style.height = height * block + "px";
    for (var i = 0; i < width; i++) {
        var line = [];
        for (var j = 0; j < height; j++) {
            line.push(new cell(i, j, MyRandom(-2, 1)));
        }
        map.push(line);
    }
}

function ClearMap() { //clear all div in map, and the array map = []
    for (var i = 0; i < map.length; ++i) {
        for (var j = 0; j < map[i].length; ++j) {
            map[i][j].dom.remove();
        }
    }
    while (map.length > 0) {
        map.pop();
    }
}

function Start() {
    if(init() == 0){
        return 0;
    }
    FillMap();
    UpdateAll();
}

var Dx = [1, 1, 1, 0, -1, -1, -1, 0]; //从右上 顺时针旋转
var Dy = [-1, 0, 1, 1, 1, 0, -1, -1];

function InfinityMap(x, y) { //give x,y(maybe out of range),get a right block
    if (x >= map.length || y >= map[0].length || x < 0 || y < 0) {
        return map[(x + map.length) % (map.length)][(y + map[0].length) % map[0].length];
    }
    else return map[x][y];
}

function GameRule(i, j) {
    var around = 0;
    for (var l = 0; l < 8; l++) {
        if (InfinityMap(i + Dx[l], j + Dy[l]).state > 0) {
            around = around + 1;
        }
    }
    if (around == 3) {
        map[i][j].new_state = 1;
    } else if (around == 2) {
        if (map[i][j].state == -1) {
            map[i][j].new_state--;
        } else map[i][j].new_state = map[i][j].state;
    } else {
        if (map[i][j].state > 0) {
            map[i][j].new_state = -1;
        } else if (map[i][j].state == -1) {
            map[i][j].new_state--;
        };
    }
}

function Next() { // decide waht to do next
    if (map.length == 0) {
        return null;
    }
    var height = map[0].length;
    var width = map.length;
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            GameRule(i, j);
        }
    }
    document.getElementById("step").textContent++;
    UpdateAll();
}


function Cool(){
    if (document.getElementById("cool").checked) {
        cool_mode = true;
    } else {
        cool_mode = false;
    }
}

function Auto() {
    if (document.getElementById("auto").checked) {
        auto = setInterval(Next, 150);
    } else {
        clearInterval(auto);
        auto = 0;
    }
}