import { getUploadSign } from "@/api/shopSetting";
import $ from 'jquery'
export default {
    methods: {
        uploadFn(type, file, callback) {
            let _this = this;
            getUploadSign({
                type: type,
                uniacid: ''
            }).then((res) => {
                this.aliyunOssToken = res.data
                var _self = this;
                let imginfo = file;
                var filename = new Date().getTime();
                var formData = new FormData();
                //注意formData里append添加的键的大小写
                formData.append('key', _self.aliyunOssToken.dir + filename + '.' + imginfo.name.match(/[^\.]\w*$/g)[0]); //存储在oss的文件路径
                formData.append('OSSAccessKeyId', _self.aliyunOssToken.accessid); //accessKeyId
                formData.append('policy', _self.aliyunOssToken.policy); //policy
                formData.append('Signature', _self.aliyunOssToken.signature); //签名
                formData.append('success_action_status', 200); //签名
                formData.append('callback', _self.aliyunOssToken.callback); //签名
                formData.append("file", imginfo);
                var url = _self.aliyunOssToken.host;
                var fileUrl = _self.aliyunOssToken.host + '/' + _self.aliyunOssToken.dir + filename;
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    cache: true,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.status == 200) {
                            callback(res.data.url)
                        } else {
                            _this.$message({
                                message: '图片上传失败',
                                type: 'error'
                            });
                        }
                    },
                    error: function (data) {
                        console.log(data, '!!!=====.....');
                    }
                });
            });
        },
    },
}
