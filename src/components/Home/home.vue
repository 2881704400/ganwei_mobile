<template>
  <div class="home">
    <div v-for="item in rootSave" v-show="!item.parent">
      <router-link tag="a" :to="{path: item.href}" v-show="item.title != '首页'"><i :class="item.iconClass"></i>{{item.title}}</router-link>
    </div>
  </div>

</template>

<script>
import { formatDate } from "../../assets/js/date.js";
export default {
  props: ['rootSave'],
  data () {
    return {
      projectName:'',
    }
  },
  mounted() {
		},
  methods:{
    homeMenuClick(root,item){
      var data = item.node;
      let obj = data.title === '首页' ? {
        isHome: true
      } : {
        isHome: false,
        name: data.title
      }
     
      if (data.selected) return false
      root.forEach(ele => {
        if (ele.node.expand) ele.node.expand = false
        ele.node.selected = false
      })
      var dt = this;
      if(data.hasChild)
      {  
        this.$parent.isFold = false
        this.$parent.navItemClick(root, data)           
      }
      else
      {
        this.$store.commit('setCurpage', obj)
        data.selected = true
        data.expand = true
        this.$router.push(data.href);
      }
    },
    callback: function(){
      console.log("success");
    },
  },


}
</script>
<style lang="scss" src="../../assets/styles/sass/home.scss"></style>
