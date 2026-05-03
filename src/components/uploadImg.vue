<template>
  <!-- 原生input 图片压缩 图片上传 -->
  <!-- 图片压缩 image-conversion -->
  <div>
    <input type="file" id="clueImgInput" class="add-image-input" @change="uploadImg" accept="image/*" ref="referenceUpload">
  </div>
</template>

<script>
import * as imageConversion from 'image-conversion';
export default {
  data() {
    return {
    };
  },
  props: {
    // 是否压缩 默认压缩
    compress: {
      type: Boolean,
      default: true
    },
    // 默认压缩大小200k
    reSize: {
      type: Number,
      default: 200
    },
  },
  created() {
  },
  methods: {
    // 发送图片
    uploadImg(e){
      let that = this;
      let file = e.target.files[0];
      let isLt2kb = file.size / 1024 > this.reSize // 判定图片大小是否小于200k
      if (this.compress && isLt2kb) {
        imageConversion.compressAccurately(file, this.reSize).then(res => {
          let reader = new FileReader()
          reader.onload = (e) => {
            let objUrl = null
            if (typeof res === 'object') {
              objUrl = window.URL.createObjectURL(new Blob([res]))
            } else {
              objUrl = res
            }
            // 拿到压缩过后的图片
            // data-用于本地回显  res-用于上传接口使用
            let fileInfo = {
              file: res,
              fileName: file.name,
              objUrl: objUrl
            }
            console.log(fileInfo,3333)
            this.$emit('func', fileInfo)
          }
          reader.readAsArrayBuffer(file)
        })
      } else {
        let reader = new FileReader()
        reader.onload = (e) => {
          let objUrl = null
          if (typeof e.target.result === 'object') {
            objUrl = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            objUrl = e.target.result
          }
          let fileInfo = {
            file: file,
            fileName: file.name,
            objUrl: objUrl
          }
          this.$emit('func', fileInfo)
        }
        reader.readAsArrayBuffer(file)
        //  this.$emit('func', file)
      }
      this.$refs.referenceUpload.value = null;
    },
  }
};
</script>

<style scoped>
.add-image-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>

