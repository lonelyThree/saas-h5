<template>
  <router-view />
  <!-- <keep-alive>
      <router-view v-if="!$route.meta.noKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.noKeepAlive"></router-view> -->
</template>

<style lang="scss">
@import "./css/base.scss";
#app {
  font-family: Microsoft YaHei, Helvetica, Arial, sans-serif;
}

html,
body {
  width: 100%;
  height: 100%;
  margin-bottom: -1px;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background: #F3F4F6;
  margin: 0;
}

.main-content {
  width:10rem;
  height: 100vh;
}

input {
  -webkit-appearance: none;
  border-radius: 0;
}
img {
  width: 100%;
  height: auto;
  vertical-align: bottom;
}
</style>
