# 查询组件
绑定的model为form
输入数组可生成查询栏,数组模板如下：
[{
    type: 'Select',         类型：Input(输入框), Select(选择框), BrandSel(品牌选择), DatePicker(时间选择),Button(按钮)
    value: 'group_id',      绑定字段
    label: '产品分组：',     说明字段，如是Button类型，可传空字符串或者不传
    isPrimary: false,       Button类型是否是primary,不是可不写该字段
    options: [{             选择条件,Select时需要传此字段
        value: id,          绑定字段，必须是value
        label: name         描述字段,必须是label
    }],            
    class: '',              样式，没有可传空字符串或者不传
    btn: '',                Button类型必传，按钮文字
    click: ''               点击事件
}]
