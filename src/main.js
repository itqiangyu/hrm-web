import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;

Vue.config.productionTip = false

Vue.use(ElementUI,{size:'small'});

router.beforeEach((to, from, next) => {
    if (to.path === '/' || to.path === '/index.html') {
        // 访问首页，如果是登陆状态，先注销
        if (window.localStorage.getItem('token') && window.sessionStorage.getItem('user')) {
            getRequest('/user/logout');
        }
        // 接着删除本地的token以及session的用户信息
        window.localStorage.removeItem('token');
        window.sessionStorage.removeItem('user');
        // 部门信息和职位信息在对应模块操作增删改时会删除session里的信息
        // 移除民族
        // window.sessionStorage.removeItem('nations');
        // 移除部门
        // window.sessionStorage.removeItem('department');
        // 移除职位
        // window.sessionStorage.removeItem('positions');
        // 移除政治面貌
        // window.sessionStorage.removeItem('politicsStatus');
        next();
    }else {
        if (window.localStorage.getItem('token') && window.sessionStorage.getItem('user')) {
            initMenu(router, store);
            next();
        }else{
            next('/?redirect='+to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
