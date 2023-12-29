const TOKEN_KEY = 'jwt-token';

export default {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    saveToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    destroyToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    isAuthenticated() {
        const token = this.getToken();
        return token !== null && token !== "";
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