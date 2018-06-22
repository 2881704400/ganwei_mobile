<template>

   <ul class="gw-toolbar">
     <li v-for="item in menuSaveChild"><a :href='"#/index/"+item.href' :class="item.selected?'selected':''" @click="setSelectMenu(item)"><i :class="item.iconClass"></i>{{item.title}}</a></li>
   </ul>

</template>

<script>
export default {
   props: ['menuSave'],
  data () {
    return {
      menuSaveChild: [],
    }
  },
  mounted(){
    this.menuSaveChild = this.menuSave;
    this.setInitMenu();
  },
  methods: {
      setInitMenu () {
        var dt = this;
        const pathF = this.$route.path.split('/')[1],
        pathS = this.$route.path.split('/')[2]
        if (pathF === 'index') {
            dt.menuSaveChild.forEach((el,index) => {
                el.selected = el.href === pathS ? true : false
            });
           
        }
    },
    setSelectMenu(el){
       this.menuSaveChild.forEach((el,index)=>{
          el.selected = false;
       }); el.selected = true;
    },
  },
}
</script>

<style lang="scss" src="@assets/styles/sass/toolbar.scss"></style>
