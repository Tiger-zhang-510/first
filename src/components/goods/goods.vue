<template>
<div>
   <div class="goods">
   <div class="menu-wrapper" ref="menuWrapper">
     <ul>
       <li 
         v-for="(item,index) in goods" 
         :key="item.id" 
         class="menu-item"
         :class="{'current':currentIndex === index}"
         @click="selectMenu(index,$event)"         
        >
         <span class="text border-1px">
           <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
         </span>
       </li>
     </ul>
   </div>
   <div class="foods-wrapper" ref="foodsWrapper">
     <ul>
       <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
         <h1 class="title">{{item.name}}</h1>
         <ul>
           <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
             <div class="icon">
               <img :src="food.icon" width="57" height="57">
             </div>
             <div class="content">
               <h2 class="name">{{food.name}}</h2>
               <p class="desc">{{food.description}}</p>
               <div class="extra">
                 <span class="count">月售{{food.sellCount}}份</span><span>好评率:{{food.rating}}%</span>
               </div>
               <div class="price">
                 <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
               </div>
               <div class="cartcontrol-wrapper">
                 <cartcontrol @event="getEvent" :food="food"></cartcontrol>
               </div>               
             </div>
           </li>
         </ul>
       </li>
     </ul>
   </div>
   <shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice="seller.deliveryPrice"
   :minPrice="seller.minPrice"></shopcart>
 </div>
 <food :food="selectedFood" ref="food" @add="getFood"></food>
</div>
</template>

<script>
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';
import BScroll from 'better-scroll';
  export default {
   data () {
     return {
       goods:[],
       listHeight:[],//存储区块的高度
       scrollY:0,
       selectedFood:{},//一开始是空对象，点击food的时候再存入，在li(food)中添加点击事件
     }
   },
   props:{
     seller:{
       type:Object
     }
   },
   created(){
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
     this.$axios.get('api/goods')
     .then((res)=>{
       this.goods = res.data.data

       this.$nextTick(()=> {
         this._initScroll();
         this._calculateHeight();
       })
     })
   },
   methods:{ //父组件goods.vue中进行监听
     getFood(el){
       //拿到traget(DOM对象)之后，将其传入shopcart组件中drop(target){}方法，
       //此处用this.$refs调用子组件,访问DOM时用的是ref="menuWrapper"
       this.$nextTick(()=>{
         this.$refs.shopcart.drop(el);
       });
     },
     getEvent(el){
       this.$nextTick(()=>{
         this.$refs.shopcart.drop(el);
       });
     },
     //左右联动映射
     selectMenu(index, event){
       //自己开发的event._constructed是为true，pc浏览器没有此事件
       if(!event._constructed){
         return;
       }
       let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
       let el = foodList[index];//表示第几个节点
       this.foodsScroll.scrollToElement(el,100)
     },
     selectFood(food,event){
       if(!event._constructed){
         return;
       }
       this.selectedFood = food;
       this.$refs.food.show();//调用子组件的show()方法展开food组件
     },
     _initScroll(){
       //this.$refs：取得dom对象
       this.menuScroll = new BScroll(this.$refs.menuWrapper,{
         click:true  //取消默认阻止事件
       });
       this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
         click:true ,//取消默认阻止事件
         probeType: 3
       });
       this.foodsScroll.on('scroll',(pos)=>{
         this.scrollY = Math.abs(Math.round(pos.y));
       })
     },
     _calculateHeight(){
       let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
       let height = 0;
       this.listHeight.push(height);
       for(let i=0; i<foodList.length; i++){
         //获取每个Li的高度，放入一个数组中 
         let item = foodList[i];
         height +=item.clientHeight;
         this.listHeight.push(height);
       }
     }
   },
   computed:{
     currentIndex(){
       for(let i=0;i < this.listHeight.length; i++) {
         let height1 = this.listHeight[i];
         let height2 = this.listHeight[i+1];
         if(!height2||(this.scrollY >=height1 && this.scrollY < height2)){
           return i;
         }
       }
       return 0;
     },
     selectFoods(){
       //foods会传入购物车组建中，作为购物车的数据来源
       let foods=[];
       this.goods.forEach((good)=>{
         good.foods.forEach((food)=>{
           if(food.count){
             foods.push(food);
           }
         });
       });
       return foods
     },
   },
   components: {
     shopcart,
     cartcontrol,
     food
   }
 }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "./goods.styl"                
</style>
// 1.实现左右两个better-scroll
// (1)dom结构(better-scroll要求,会把最外层dom的第一个子元素作为要滚动的区域)

// 2.实现联动效果
// (1)具体的联动实现思路
// 在渲染完成后($nextTick内),初始化better-scroll,并在初始化函数内添加右侧列表的scroll监听事件,并记录scrollY值到,存入vue的data中
// 在渲染完成后($nextTick内),计算右侧列表的每一个大区块的高度,并累加,存入数组listHeight
// 因为scrollY值在滚动中总是不断变化的,所以在computed中计算出currentIndex,当前滚动区域是哪一个大区块,也就是listHeight数组的下标
// 在dom中根据currentIndex应用左侧列表被点中的样式
// 在左侧列表某一项被点中的时候,右侧列表滑动到某一个大块区域,

//通过加减号组件修改了food的count属性，要将count的变化通知其父组件goods，然后goods通过计算得出selectFoods的变化，通知到购物车组件
//首先在goods.vue中编写selectFoods，selectFoods组件要遍历所有的goods（计算属性），selectFood是一个计算属性，它观测的就是就是goods对象，goods发生变化他会重新计算进行更新