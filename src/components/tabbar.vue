<template>
     <van-tabbar v-model="active" active-color="#EFA52D">
         <van-tabbar-item v-for="(item, index) in tabArr" :key="index"
            replace :to="item.path" >
            <span>{{ item.title }}</span>
            <template #icon="props">
                <img :src="props.active ? item.active : item.inactive" />
            </template>
      </van-tabbar-item>
    </van-tabbar>
</template>
<script>
import { ref } from 'vue';
export default {
    props: {
        index: Number,
        aid: String
    },
    setup(props) {
        const active = ref(props.index);
        const aid = ref(props.aid);
        const iconArr = ['index', 'desc', 'rank']
        const nameArr = ['答题', '活动说明', '排行']
        let tabArr = []
        iconArr.forEach((el, index) =>  {
            tabArr.push({
                'title':nameArr[index],
                'active': require('../assets/icons/' + el + '-sel.png'),
                'inactive': require('../assets/icons/' + el + '.png'),
                'path':'/ask/'+el+'?id='+aid.value
            })
        })
        return { active, tabArr };
    },
};
</script>