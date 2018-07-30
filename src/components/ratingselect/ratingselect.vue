<template>
 <div class="ratingselect">
     <div class="rating-type border-1px">
         <!--绑定一个select方法控制切换,绑定class控制切换之后的按钮样式显示-->
         <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span 
           class="count">{{ratings.length}}</span></span>
         <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span 
           class="count">{{positives.lenght}}</span></span>
         <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
           class="count">{{negatives.length}}</span></span>
     </div>
     <!--绑定一个toggleContent方法来控制有内容和无内容的显示-->
     <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
         <span class="icon-check_circle"></span>
         <span class="text">只看有内容的评价</span>
     </div>
 </div>
</template>

<script>
 const POSITIVE = 0;
 const NEGATIVE = 1;
 const ALL = 2;
 export default {
   data () {
     return {        
     }
   },
   props:{
       ratings:{
           type:Array,
           default(){
               return [];
           }
       },
       selectType:{
           type:Number,
           default:ALL,
       },
       onlyContent:{
           type:Boolean,
           default:false
       },
       desc:{
           type:Object,
           default(){
               return {
                   all:'全部评价',
                   positive:'满意',
                   negative:'不满意',
               }
           }
       },
   },
   methods:{
       select(type, event){//选择rateType并且通知父组件
           if(!event._constructed){
               return;
           }
           this.$emit('selecttype', type)//调用父组件的方法
       },
       toggleContent(){//选择是否显示有内容的rate,并且通知父组件
           if(!event._constructed){
               return;
           }
           this.$emit('content')
       }
   },
   computed:{
       positives(){
           return this.ratings.filter((rating)=>{
               return rating.rateType === POSITIVE;
           });
       },
       negatives(){
           return this.ratings.filter((rating)=>{
               return rating.rateType === NEGATIVE;
           });
       }
   },
   components: {

   }
 }
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin.styl"

.ratingselect
  .rating-type
    padding: 18px 0
    margin: 0 18px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size: 0//去除行内元素间隙
    .block
      display: inline-block
      padding: 8px 12px
      margin-right: 8px
      line-height: 16px
      border-radius: 1px
      font-size: 12px
      color: rgb(77, 85, 93)
      &.active//被选中的按钮的class(由:class控制)
        color: #fff
      .count
        margin-left: 2px
        font-size: 8px
      &.positive//设置支持的按钮的样式
        background: rgba(0, 160, 220, 0.2)
        &.active
          background: rgb(0, 160, 220)
      &.negative
        background: rgba(77, 85, 93, 0.2)
        &.active
          background: rgb(77, 85, 93)
  .switch
    padding: 12px 18px
    line-height: 24px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    color: rgb(147, 153, 159)
    font-size: 0
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top
      margin-right: 4px
      font-size: 24px
    .text
      display: inline-block
      vertical-align: top
      font-size: 12px
                              
</style>
