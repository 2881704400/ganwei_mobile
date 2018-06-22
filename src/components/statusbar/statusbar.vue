<template>
  <div class="gw-statusbar">
      <div class="leftTitle"></div>
      <div class="centerTitle" >
            <h3 v-text="projectName"></h3>
      </div>
      <div class="rightTitle">
         <a href="#" class="iconfont icon-caidan" @click="togglePanel"></a>
      </div>
  </div>
</template>

<script>
export default {
  props: ['projectName'],
  data () {
    return {
    }
  },
  methods: {
    logout() {
      // 退出登陆
      this.$Modal.confirm({
        title: '操作提示',
        content: '是否注销当前登陆？',
        onOk: () => {
          window.localStorage.removeItem("gw_token")
          window.localStorage.removeItem("login_msg")
          // this.navList.splice(0, this.navList.length)
          this.$router.replace("/login")
        }
      })
    },
    togglePanel(){
      this.$emit('onfoldAside');
    },    
  },

}
</script>

<style lang="scss" src="@assets/styles/sass/statusbar.scss"></style>
