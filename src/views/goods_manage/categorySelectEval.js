/**
 * @Author: jianglei
 * @Date:   2017-10-12 12:06:49
 */
'use strict'
import Vue from 'vue'

export default function treeToArray(data, parent, level) {
    let tmp = [];
    Array.from(data).forEach(function (record) {
        let _level = 1;
        if (level !== undefined && level !== null) {
            _level = level + 1
        }
        Vue.set(record, '_level', _level);
        // 如果有父元素
        if (parent) {
            Vue.set(record, 'parent', parent);
        }
        Vue.set(record, 'label', record.name);
        if (record.childList && record.childList.length > 0) {
            const children = treeToArray(record.childList, record, _level);
            Vue.set(record, 'children', children);
        }
        tmp.push(record);
    });
    return tmp
}
