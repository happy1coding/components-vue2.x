<style lang="scss" scoped>
    .fr {
        float: right;
    }
    .query {
        overflow: hidden;
    }
</style>

<template>
    <el-form :inline="true" :model="query" class="query">
        <el-form-item v-for="(item,i) in queryData" :key="i" :label="item.label" :class="item.class">
            <el-input v-if="item.type=='Input'" v-model="query[item.value]" placeholder="请输入"></el-input>
            <el-select v-else-if="item.type=='Select'" v-model="query[item.value]" clearable placeholder="请选择">
                <el-option v-for="(subItem,j) in item.options" :key="j" :label="subItem.label" :value="subItem.value"></el-option>
            </el-select>
            <el-date-picker
                v-else-if="item.type=='DatePicker'"
                v-model="query[item.value]"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button :type="item.isPrimary?'primary':''" v-else-if="item.type=='Button'" @click="btnMethods(item.click)">{{ item.btn }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        queryData: {
            type: Array,
            default: []
        },
        form: {
            type: Object,
            default: {}
        }
    },
    data: ()=>{
        return {
            query: {}
        }
    },
    watch: {
        form(newV){
            this.query = newV;
        }
    },
    mounted(){
        this.query = this.form;
    },
    methods: {
        btnMethods(func){
            this.$emit("update:form", this.query);
            this.$emit(func)
        }
    }
}
</script>