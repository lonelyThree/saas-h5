<template>
    <div class="main-content empty">
        <van-empty :description="tipMessage" v-if="tipMessage" />
    </div>
</template>

<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref, getCurrentInstance } from "vue"
import { useRouter } from 'vue-router'


const { currentRoute } = useRouter();
const route = currentRoute.value;

const tipMessage=ref("未找到页面")

onMounted(() => {
    let msg = route.query.msg
    if(msg && typeof msg == 'string') {
        tipMessage.value = msg
    }
})
</script>
<style scoped>
.main-content{
    background: #fff;
}
</style>