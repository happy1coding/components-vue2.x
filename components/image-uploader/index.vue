<style lang="scss">
// @import "~@/assets/color.scss";
.my__picture__uploader {
    display: inline-block;
    overflow: hidden;
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    vertical-align: top;
    min-height: 80px;
    min-width: 80px;
    background: #fff;

    // &:hover:not(.disabled) {
    //     border-color: $--color-primary;

    //     .el-upload .picture-uploader-icon {
    //         color: $--color-primary;
    //     }
    // }

    &.disabled .el-upload {
        cursor: not-allowed;

        .thumbnail:before {
            content: none;
        }
    }

    .el-upload {
        height: 100%;
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-image {
            height: 100%;
        }
        .thumbnail {
            height: 100%;
            width: 100%;
            position: absolute;
            .el-icon-delete {
                position: absolute;
                font-size: 20px;
                color: #fff;
                top: 45%;
                left: 45%;
                opacity: 0;
            }
            &:before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                font-weight: bold;
                color: #fff;
                background: rgba(0, 0, 0, 0.6);
                height: 0;
                line-height: 10em;
            }


            &:hover:before {
                height: 10em;
                transition: all 0.1s ease-out;
            }
            &:hover .el-icon-delete {
                opacity: 1;
            }
        }

        .picture-uploader-icon {
            font-size: 28px;
            color: #8c939d;
        }

    }
}
.my__picture__uploader__tip {
    vertical-align: bottom;
    line-height: 24px;
    margin-left: 15px;
    color: #aaa;
    font-size: 12px;
}
</style>

<template>
    <div class="wrapper">
        <el-upload
            class="my__picture__uploader"
            name="file"
            :style="{width: [&quot;148px&quot;, width], height: [&quot;148px&quot;, height]}"
            :action="uploadAction"
            :disabled="disabled"
            :class="{ disabled: disabled}"
            :before-upload="beforeUpload"
            :on-success="handleUploaded"
            :auto-upload="true"
            :show-file-list="false"
            :accept="accept"
            v-loading="loading"
        >   
            <video class="thumbnail" :src="url" controls @load="handleImageLoaded" v-if="url && formatName=='mp4'"></video>
            <el-image class="thumbnail" :src="url" fit="cover" @load="handleImageLoaded" v-if="url && formatName=='img'"></el-image>
            <i class="el-icon-plus picture-uploader-icon" v-else></i>
            <div class="thumbnail" v-if="url && !disabled">
                <i class="el-icon-delete" @click.stop="handleDel"></i>
            </div>
        </el-upload>
        <span class="my__picture__uploader__tip" v-if="tips">{{tips}}</span>
    </div>
</template>

<script>
    import util from '@/libs/util';
    export default {
        props: {
            url: {
                String,
                default: ""
            },
            tips: String,
            width: {
                type: String,
                default: "148px"
            },
            height: {
                type: String,
                default: "148px"
            },
            disabled: {
                type: Boolean,
                default: false
            },
            accept: {
                type: String,
                default: "image/jpg,image/jpeg,image/png"
            },
            size: {
                type: Number,
                default: 2
            },
            maxWidth: {
                type: Number
            },
            maxHeight: {
                type: Number
            },
            imgWidth: {
                type: String,
                default: ''
            },
            imgHeight: {
                type: String,
                default: ''
            },
            action: {
                type: String,
                default: '/admin/upload'
            },
        },
        data() {
            return {
                loading: false,
                formatName: 'img',
            };
        },
        computed: {
            uploadAction(){
            // return `/api${this.action}`
                return `${this.action}`
            },
        },
        watch: {
            url(newV){
                if(this.getFileSuffix(this.url)=='mp4'){
                    this.formatName = 'mp4';
                }else{
                    this.formatName = 'img';
                }
            }
        },
        methods: {
            getFileSuffix(filename){
                return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            },
            beforeUpload(file) {
                this.$emit("update:url", "");
                this.loading = true;
                this.$emit("upload");
                const {name, size} = file, suffix = name.trim().split('.').pop();
                if(/^(mp4)$/i.test(suffix)){
                    this.formatName = 'mp4';
                    if(this.accept=='.mp4'){
                        this.loading = false;
                        return true;
                    }else{
                        this.$message.warning('请上传图片');
                        this.loading = false;
                        return false
                    }
                }else{
                    this.formatName = 'img';
                }
                if (this.size && file.size / 1024 / 1024 > this.size) {
                    this.loading = false;
                    this.$message.error(
                        `请上传大小不超过 ${this.size}MB的图片`
                    );
                    return false;
                }
                return new Promise((resolve, reject) => {
                    const width = this.maxWidth,
                        height = this.maxHeight,
                        _URL = window.URL || window.webkitURL,
                        img = new Image();

                    img.onload = () => {
                        if (img.width > width || img.height > height) {
                            this.loading = false;
                            this.$message.error(
                                `图片尺寸不能超过${width} x ${height}像素，请确认后重试`
                            );
                            reject();
                        } else {
                            this.$emit("update:imgWidth", img.width+'');
                            this.$emit("update:imgHeight", img.height+'');
                            resolve();
                        }
                    };
                    img.src = _URL.createObjectURL(file);
                });
            },
            handleUploaded(response, file, fileList) {
                if (response.errcode == 0) {
                    this.$emit("update:url", response.data && response.data.file_path);
                    this.$emit("uploaded");
                }else if(response.errcode == 1002){
                    this.$alert('登录已过期', '重新登录', {
                        confirmButtonText: '确定',
                        showClose: false,
                        showCancelButton: false,
                        type: 'warning',
                        closeOnClickModal: false,
                        callback: action => {
                            // 删除cookie
                            util.cookies.remove('token')
                            util.cookies.remove('ikea_userId')
                            util.cookies.remove('ikea_brand_id')
                            sessionStorage.removeItem('ikeaSocialIsLogin')
                            // 跳转路由
                            if(window.location.hostname!='social.woaap.com'){
                                window.location.href = 'https://ikeashop-test.woaap.com'
                            }else{
                                //跳转正式地址
                            }
                        }
                    });
                } else {
                    this.loading = false;
                    this.$message({
                        type: "warning",
                        message: "上传失败，请重试！"
                    });
                }
            },
            handleDel(){
                this.$emit("update:url", '');
                this.$emit("uploaded");
            },
            handleImageLoaded() {
                this.loading = false;
            }
        }
    };
</script>

