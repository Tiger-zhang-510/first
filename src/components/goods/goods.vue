<template>
<div>
   <div class="goods">
   <div class="menu-wrapper" ref="menuWrapper">
     <ul>
       <li v-for="(item,index) in goods" class="menu-item"
       @click="selectMenu(index,$event)" :class="{'current':currentIndex === index}">
         <span class="text border-1px">
           <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
         </span>
       </li>
     </ul>
   </div>
   <div class="foods-wrapper" ref="foodsWrapper">
     <ul>
       <li v-for="item in goods" class="food-list food-list-hook">
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
       listHeight:[],
       scrollY:0,
       selectedFood:{},
     }
   },
   props:{
     seller:{
       type:Object
     }
   },
   created(){
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
     this.$axios.get('api/goods')
     .then((res)=>{
       this.goods = res.data.data

       this.$nextTick(()=> {
         this._initScroll();
         this._calculateHeight();
       })
     })
   },
   methods:{
     getFood(el){
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
       let el = foodList[index];
       this.foodsScroll.scrollToElement(el,300)
     },
     selectFood(food,event){
       if(!event._constructed){
         return;
       }
       this.selectedFood = food;
       this.$refs.food.show();
     },
     _initScroll(){
       //this.$refs：取得dom对象
       this.menuScroll = new BScroll(this.$refs.menuWrapper,{
         click:true  //取消默认阻止事件
       });
       this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
         click:true ,//取消默认阻止事件
         probeType:3
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
