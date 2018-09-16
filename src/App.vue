<template>
  <div id="app">
      <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods" active-class="active">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="active">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" active-class="active">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from './components/header/header'
import {urlParse} from 'common/js/util.js'
export default {
  name: 'App',
  data(){
    return{
      seller:{
        id:(()=>{
          let queryParam = urlParse();
          return queryParam.id;
        })()
      },
    }
  },
  created(){
    this.$axios.get('/api/seller')
    .then((res)=>{
      this.seller =Object.assign({},this.seller,res.data.data);
    })
  },
  components:{
    'v-header':Header
  }
}
</script>

<style lang="stylus">
@import "common/stylus/mixin.styl" 
#app 
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
          color:rgb(240,20,20)
</style>
