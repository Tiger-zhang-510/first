<template>
<transition name="move">
    <!--要实现这个商品详情页的内容滚动,所以需要有一个显示标志和一个dom绑定-->
    <div v-show="showFlag" class="food" ref="food">
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image" alt="">
                <div class="back" @click="hide">
                    <span class="icon-arrow_lift"></span>
                </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" ></cartcontrol>
                </div>
                <transition name="fade"><!--使用.stop.prevent阻止冒泡和默认事件,避免穿透-->
                    <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">
                        加入购物车
                    </div>
                </transition>
            </div>
            <!--引入split组件负责隔离行-->
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
                <h1 class="title">商品信息</h1>
                <p class="text">{{food.info}}</p>
            </div>
            </split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect :desc="desc"
                              :ratings="food.ratings"
                              :selectType="selectType"
                              :onlyContent="onlyContent"
                              @selecttype="setType"
                              @content="setOnlycontent"
                ></ratingselect>
                <div class="rating-wrapper">
                    <!--根据ratings长度显示ratings-->
                    <ul v-show="food.ratings && food.ratings.length">
                        <!--根据不同类型的rateType来切换不同类型的rate-->
                        <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                           class="rating-item border-1px">
                            <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img class="avatar" width="12" height="12" :src="rating.avatar">
                            </div>
                            <!--使用vue过滤器filter来处理时间-->
                            <div class="time">{{rating.rateTime | formatDate}}</div>
                            <p class="text">
                                <!--根据不同类型的rateType来控制icon的显示-->
                                <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType===1}"></span>
                                {{rating.text}}
                            </p>
                        </li>
                    </ul>
                    <!--没有rate的时候显示-->
                    <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                </div>
            </div>
        </div>
    </div>
</transition>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol';
import Vue from 'vue';
import BScroll from 'better-scroll';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect'
import { formatDate } from '../../common/js/date';

const ALL = 2;

 export default {
   data () {
     return {//这些是传入ratingselect组件的数据,并且初始化值
         showFlag: false,
         selectType: ALL,//默认所有rate
         onlyContent: false,//默认只显示有内容的rate
         desc:{
             all:'全部',
             positive:'推荐',
             negative:'吐槽',
         }
     }
   },
   props:{
       food:{
           type:Object,
       }
   },
   methods:{
       needShow(type, text){
           if(this.onlyContent && !text){ //只显示有内容的 并且 没有内容就返回false
               return false;
           }
           if(this.selectType === ALL){//显示全部类型的rate
               return true;
           }else{//只显示对应的类型的rate
               return type === this.selectType;
           }
       },
       setType(type){
           this.selectType = type
           this.$nextTick(()=>{
               this.scroll.refresh();
           });
       },
       setOnlycontent(){
           this.onlyContent = !this.onlyContent;
           this.$nextTick(()=>{
               this.scroll.refresh();
           });
       },
       show(){
           this.showFlag = true;
           this.selectType = ALL;
           this.onlyContent = true;
           this.$nextTick(()=>{
               if(!this.scroll){
                   this.scroll = new BScroll(this.$refs.food,{
                       click:true
                   });
               }else{
                   this.scroll.refresh();
               }
           })
       },
       hide(){
           this.showFlag = false;
       },
       addFirst(event){//点击加入购物车按钮,传入事件
           if(!event._constructed) {//因为购物车按钮在bscroll里面,所以需要处理掉bscroll的事件类型
               return;
           }
           this.$emit('add',event.target); //触发当前实例food上的事件add(在goods组件上绑定在food组件的add方法
           Vue.set(this.food,'count',1);
       },
   },
   filters:{
       formatDate(time){
           let date = new Date(time);
           return formatDate(date,'yyyy-MM-dd hh:mm');
       }
   },
   components: {
       cartcontrol,
       split,
       ratingselect,
   }
 }
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin.styl'
.food
  position fixed //霸占屏幕,全屏显示,所以用fixed布局
  left 0
  top 0
  bottom 48px //保留底部购物车底部栏的位置
  z-index 30 //z-index的数值是有考究的,要控制好各个页面的z-index纵深
  width 100%
  background #fff 
  &.move-enter-active, &.move-leave-active //用vue的动画配置实现动画
  transition all 0.2s linear 
  &.move-enter, &.move-leave-active
    transform translate3d(100%, 0, 0) 
  .image-header
    position relative
    width 100% 
    height 0
    padding-top 100% 
    img
      position absolute 
      top 0
      left 0
      width 100% 
      height 100% //这是一个css-hack技巧
    .back
      position absolute 
      top 10px 
      left 0
      .icon-arrow_lift
        display block 
        padding 10px
        font-size 20px
        color #fff 
  .content
    position relative 
    padding 18px 
    .title
      line-height 14px 
      margin-bottom 8px 
      font-size 14px 
      color rgb(7, 17, 27)
    .detail 
      margin-bottom 18px 
      line-height 10px 
      height 10px
      font-size 0
      .sell-count, .rating
        font-size 10px 
        color rgb(147, 153, 159)
      .sell-count 
          margin-right 12px 
    .price 
      font-weight 700 
      line-height 24px 
      .now
        margin-right 8px 
        font-size 14px 
        color red 
      .old 
        text-decoration line-through 
        font-size 10px
        color rgb(147, 153, 159) 
    .cartcontrol-wrapper 
      position absolute 
      right 12px 
      bottom 12px
    .buy
      position absolute 
      right 18px 
      bottom 18px 
      z-index 10 
      height 24px 
      line-height 24px 
      padding 0 12px 
      box-sizing border-box 
      border-radius 12px 
      font-size 10px 
      color #fff 
      background rgb(0, 160, 220)
      &.fade-enter-active,&.fade-leave-active 
        transition all 0.2s
      &.fade-enter, &.fade-leave-active 
        opacity 0 
  .info
    padding 18px 
    .title
      line-height 14px 
      margin-bottom 6px 
      font-size 14px 
      color rgb(7, 17, 27) 
    .text 
      line-height 24px 
      padding 0 8px 
      font-size 12px 
      color rgb(77, 85, 93) 
  .rating
    padding-top 18px 
    .title 
      line-height 14px 
      margin-left 18px 
      font-size 14px 
      color rgb(7, 17, 27)
    .rating-wrapper 
        padding 0 18px 
        height auto 
        .rating-item 
            position relative 
            padding 16px 0
            border-1px(rgba(7, 17, 24, 0.1))
            .user
                position absolute 
                right 0 
                top 16px 
                line-height 12px 
                font-size 0
                .name
                    display inline-block
                    margin-right 6px 
                    vertical-align top 
                    font-size 10px 
                    color rgb(147, 153, 159)
                .avatar 
                    border-radius 50% 
            .time 
                margin-bottom 6px 
                line-height 12px 
                font-size 10px 
                color rgb(147, 153, 159) 
            .text 
                line-height 16px 
                font-size 12px 
                color rgb(7, 17, 27)
                .icon-thumb_up, .icon-thumb_down
                    margin-right 4px 
                    line-height 16px 
                    font-size 12px
                .icon-thumb_up
                    color: rgb(0, 160, 220) 
                .icon-thumb_down 
                    color: rgb(147, 153, 159)       
        .no-rating 
            padding 16px 0 
            font-size 12px 
            color rgb(147, 153, 159)
</style>
