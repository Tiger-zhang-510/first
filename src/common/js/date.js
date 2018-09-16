export function formatDate(date,fmt){
    if(/(y+)/.test(fmt)){
        //RegExp.$1相当于匹配yyyy（年）替换成当前年份，substr（4-length）就是匹配当前的年份，因为是四个y
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4 - RegExp.$1.length));
    }
    let o ={
        'M+':date.getMonth() + 1,
        'd+':date.getDate(),
        'h+':date.getHours(),
        'm+':date.getMinutes(),
        's+':date.getSeconds()
    };
    for(let k in o){
        if(new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str:PadLeftZero(str));//如果传入的格式是1位，则返回原始值，否则补零（通过函数padLeftZero）
        }
    }
    return fmt;
};
function PadLeftZero(str){
    return ('00' + str).substr(str.length);
}