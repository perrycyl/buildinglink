class Credentials {
    constructor ({username='', password=''}){
        this.__password = password;
        this.__username = username;
        this.__cookie;
    }

    get password(){
        return this.__password;
    }
    get username(){
        return this.__username
    }
    get cookie(){
        return this.__cookie;
    }
    set setCookie(cookie){
        this.__cookie = cookie
    }

}

module.exports = {
    Credentials,
}