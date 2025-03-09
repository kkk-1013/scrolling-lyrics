/**
 * 拿到歌词字符串，拆分为time和text
 * 返回一个数组
 * 数组中每个元素都是object结构{time : currenttime,text : currenttext}
 **/
function parseLcr(){
    const arrlcr = lcr.split('\n');
    const finallydata = [];
    for(let i = 0;i<arrlcr.length;i++){
        const line = arrlcr[i];
        const parts = line.split(']');
        var time_part = parts[0].substring(1);
        // console.log(time_part);
        var objet = {
            time : parseTime(time_part),
            text : parts[1],
        };
        finallydata.push(objet);
    }
    return finallydata;
}
/** 
辅助函数将分钟转化为秒，返回数字为每句歌词的时间
单位秒
*/
function parseTime(time_part){
    var time = time_part.split(':');
    var timeresult = +time[0] * 60 + +time[1];
    return timeresult;
}

/**
 * 一些需要的dom对象
 */
var doms = {
    dom_audio : document.querySelector('audio'),
    dom_ul : document.querySelector('.container ul'),
    dom_container : document.querySelector('.container'),
};
    


/**
 *计算位置函数，将时间转化为歌词的位置
是数组的下标
如果没有任何一句要显示，返回-1
 */
const finally_data_arr = parseLcr();
function FindIndex(){
    var current_time = doms.dom_audio.currentTime;
    for(let i = 0; i < finally_data_arr.length; i++){
        if(current_time < finally_data_arr[i].time){
            return i-1;
        }
        // if(current_time = finally_data[i].time){
        //     return i;
        // }
    }
    //都找遍了还没有找到，说明是最后一句
    return finally_data_arr.length - 1;
} 

//界面部分

//创建歌词列表
function createLrclist(){
    for(let i = 0; i < finally_data_arr.length; i++){
        var li = document.createElement('li');
        li.textContent = finally_data_arr[i].text;
        doms.dom_ul.appendChild(li); 
    }
}
createLrclist();
//div的高度
let containerHeigt = doms.dom_container.clientHeight;
let liHeight = doms.dom_ul.children[0].clientHeight;
let maxscorll = doms.dom_ul.clientHeight - doms.dom_container.clientHeight;
//计算页面滚动的位置
function scorll(){  
    let index = FindIndex();
    let scorll = liHeight * index + liHeight / 2 - containerHeigt / 2;
    if(scorll < 0){
        scorll = 0;
    }
    if(scorll > maxscorll){
        scorll = maxscorll;
    }
    doms.dom_ul.style.transform = `translateY(-${scorll}px)`;
    var li = doms.dom_ul.querySelector('.active');
    if(li){
        li.classList.remove('active');
    }
    li = doms.dom_ul.children[index];
    if(index > 0){
        li.classList.add('active');
    }
}

//监听事件
doms.dom_audio.addEventListener('timeupdate',
    function(){
        scorll();
    });