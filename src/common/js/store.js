/*
* 存储数据
* id为url参数，key是需要存储数据的键名，val为存储的值
* */
export function saveToLocal(id,key,value){
    //定义商家数据为_seller_
    let seller = window.localStorage._seller_;//存储数据存储到_seller_中
    if(!seller) {
        seller={};
        seller[id] = {};
    }else{
        seller = JSON.parse(seller);//将json字符串转换成json对象
        if(!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage._seller_ = JSON.stringify(seller);//将json对象转换成字符串
}
/*
* 读取localStorage数据
* def为默认读取数据
* */
export function loadFromLocal(id,key,def){
    let seller = window.localStorage._seller_;
    if(!seller){
        return def
    }
    let ret = seller[key];
    return ret ||def
}