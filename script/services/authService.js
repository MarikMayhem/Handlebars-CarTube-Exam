let auth = (() => {
    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function isAdmin() {
        return sessionStorage.getItem('isAdmin') === "true";
    }

    function saveSession(userData) {
        sessionStorage.setItem('authtoken', userData._kmd.authtoken);
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('userId', userData._id);
        sessionStorage.setItem('isAdmin', userData.isAdmin)
    }


    function register(username, password, isAdmin) {
        let obj = { username, password, isAdmin };

        return remote.post('user', '', 'basic', obj);
    }

    function login(username, password) {
        let obj = { username, password };

        return remote.post('user', 'login', 'basic', obj);

    }

    function logout() {
        return remote.post('user', '_logout', 'kinvey');
    }

    return {
        isAuth,
        isAdmin,
        login,
        logout,
        register,
        saveSession
    };

})();