<template>
<div>
   <div class="shopcart">
     <div class="content">
         <div class="content-left" @click="toggleList">
             <div class="logo-wrapper">
                 <div class="logo" :class="{'highlight':totalCount>0}">
                     <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                 </div>
                 <div class="num" v-show="totalCount>0">{{totalCount}}</div>
             </div>
             <div class="price" :class="{'heighlight':totalPrice>0}">￥{{totalPrice}}</div>
             <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
         </div>
         <div class="content-right" @click.stop.prevent="pay">
             <div class="pay" :class="payClass">
               {{payDesc}}
             </div>
         </div>
     </div>
     <div class="ball-container">
       <transition-group name="drop" tag="div"
                         v-on:before-enter="beforeEnter"
                         v-on:enter="enter"
                         v-on:after-enter="afterEnter">
          <div class="ball" v-for="(ball,index) in balls" v-show="ball.show" :key="index">
            <div class="inner inner-hook"></div>
          </div>               
       </transition-group>
     </div>
     <transition name="fold">
       <div class="shopcart-list" v-show="listShow">
         <div class="list-header">
           <h1 class="title">购物车</h1>
           <span class="empty" @click="empty">清空</span>
         </div>
         <div class="list-content" ref="listContent">
           <ul>
             <li class="food" v-for="(food,index) of selectFoods" :key="index">
               <span class="name">{{food.name}}</span>
               <div class="price">
                 <span>￥{{food.price*food.count}}</span>
               </div>
               <div class="cartcontrol-wrapper">
                 <cartcontrol :food="food"></cartcontrol>
               </div>
             </li>
           </ul>
         </div>
       </div>
     </transition>
   </div>
   <transition name="fold">
     <div class="list-mask" @click="hideList" v-show="listShow"></div>
   </transition>
</div>

</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
 export default {
   data () {
     return {
       balls:[
         {
           show:false,
           el:null,
          },
         {
           show:false,
           el:null,
          },
         {
           show:false,
           el:null,
          },
         {
           show:false,
           el:null,
          },
         {
           show:false,
           el:null,
          }
       ],
       droppedBalls:[],
       fold:true,
     }
   },
   props:{
     selectFoods:{
       type: Array,
       default() {
         return [];
       }
     },
     deliveryPrice:{
       type: Number,
       default: 0
     },
     minPrice:{
       type: Number,
       default: 0
     }
   },
   computed:{
     totalPrice() {
       let total = 0;
       this.selectFoods.forEach((food)=>{
         total += food.price*food.count
       });
       return total;
     },
     totalCount() {
       let count = 0;
       this.selectFoods.forEach((food)=>{
         count +=food.count
       });
       return count;
     },
     payDesc(){
       if(this.totalPrice === 0) {
         return `￥${this.minPrice}元起送`;
       }
       else if(this.totalPrice < this.minPrice) {
         let diff = this.minPrice - this.totalPrice;
         return `还差￥${diff}元起送`
       }else{
         return `去结算`;
       }
     },
     payClass(){
       if(this.totalPrice < this.minPrice){
         return 'not-enough'
       }else{
         return 'enough'
       }
     },
     listShow(){
       if(!this.totalCount) {
         this.fold = true;
         return false;
       }
       let show = !this.fold;
       if(show){
         this.$nextTick(()=>{
           if(!this.scroll){//如果没有better-scroll的实例则添加
             this.scroll = new BScroll(this.$refs.listContent,{
               click:true
             });
           }else{
             this.scroll.refresh();//refresh计算是否需要滚动
           }
         });
       }
       return show;
     }
   },
   methods:{
      pay(){
        if(this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      },
      toggleList(){
        if(!this.totalCount){
          return;
        }
        this.fold =!this.fold;
      },
      empty(){
        this.selectFoods.forEach((food)=>{
          food.count = 0;
        })
      },
      hideList(){
        this.fold = true;
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.droppedBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el,done) {
        //el元素表示小球的div，ball.el表示加按钮
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el,done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend',done)
        });
      },
      afterEnter(el) {
        el.style.display = 'none'
        let ball = this.droppedBalls.shift();
        ball.show = false;
        ball.el = null;
      }
   },
   components: {
     cartcontrol
   }
 }
</script>

<style scoped lang="stylus">
@import "shopcart.styl"
</style>
