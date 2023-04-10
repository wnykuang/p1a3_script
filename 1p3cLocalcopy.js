// ==UserScript==
// @name         1p3aEnhancement
// @namespace    https://github.com/eagleoflqj/p1a3_script
// @version      0.9.2
// @description  方便使用一亩三分地
// @author       Liumeo
// @match        https://www.1point3acres.com/bbs/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_info
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/dream-ui.min.js
// @resource     dreamui https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/dream-ui.css
// @resource     setting https://raw.githubusercontent.com/eagleoflqj/p1a3_script/master/setting.html
// ==/UserScript==


(function () {
    'use strict';

    const jq = jQuery.noConflict();
    // 为本地存储添加命名空间
    const getValue = (namespace, name) => GM_getValue(namespace + '::' + name);
    const setValue = (namespace, name, value) => GM_setValue(namespace + '::' + name, value);
    const deleteValue = (namespace, name) => GM_deleteValue(namespace + '::' + name);
    // 可隐藏的模块
    const hideData = [
        { value: '#portal_block_76 > div', text: "水车排行" },
        { value: '#frame7tyJPz', text: "底部瀑布流推荐" },
        { value: '#portal_block_421_content', text: "指尖新闻" },
        { value: '#frame995RKT', text: "Topbanner" },
        { value: '#portal_block_30_content', text: "投资理财" },
        { value: '#portal_block_164_content', text: "人际关系" },
        { value: '#portal_block_152_content', text: "身份移民" },
        { value: '#portal_block_157_content', text: "留美生活" },
        { value: '#portal_block_442_content', text: "世界公民" }
    ];
    const hideList = hideData.map(e => e.value); // 可隐藏的模块选择器列表
    console.log("here")
    console.log(JSON.stringify(hideData));
    const hide = () => hideList.forEach(selector => jq(selector).css('display', getValue('hide', selector) ? 'none' : 'block')); // 按本地存储隐藏模块
    // 添加设置对话框
    GM_registerMenuCommand('设置', () => {
        UI.dialog({
            title: '设置',
            content: GM_getResourceText('setting'),
            maskClose: true,
            showButton: false
        });
        // 隐藏模块
        const settingHideData = JSON.parse(JSON.stringify(hideData)); // 深拷贝
        settingHideData.forEach(e => getValue('hide', e.value) && (e.checked = true)); // 按本地存储打勾
        UI.checkbox("#dui-hide", {
            change: arg => { // 立即应用勾选
                hideList.forEach(selector => arg.some(e => e === selector) ? setValue('hide', selector, true) : deleteValue('hide', selector));
                hide();
            },
            data: settingHideData
        });
    });
    GM_addStyle(GM_getResourceText('dreamui')); // 加载DreamUI样式
    GM_addStyle('.ui-checkbox {margin-right:20px; margin-top:20px}'); // CSS优先级问题
    hide();
})();