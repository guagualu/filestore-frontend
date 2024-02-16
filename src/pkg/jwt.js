const TOKEN_KEY = 'jwt-token';
// 设置登录过期时间（七天） 86400000 * 7
let EXPIRESTIME = 86400000 * 7

export default {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    saveToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
        let date = new Date().getTime();
        localStorage.setItem('token-time', date);
    },


    destroyToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    isAuthenticated() {
        const token = this.getToken();
        //如果token不存在 
        if (token === null || token == '') {
            return false;
        }
        //如果过期
        let date = new Date().getTime();
        if (date - localStorage.getItem('token-time') > EXPIRESTIME) {
            console.log('test', date - localStorage.getItem('token-time'))
            return false;
        }
        return true;
    },

    login(credentials) {
        // 在此处向服务器发送身份验证请求
        // 如果验证成功，将令牌保存在本地存储中
        const token = jwt.sign(credentials, 'secret');
        this.saveToken(token);
    },

    logout() {
        // 在此处向服务器发送注销请求
        // 如果注销成功，销毁本地存储中的令牌
        this.destroyToken();
    }
}