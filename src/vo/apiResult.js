/**
 * 경로 :src/vo/apiResult.js
 * 분류 : VO
 * 용도 : api 호출 결과를 나타내는 VO
 * @date        : 2022-09
 * @author      : yuha
 * @version	: 3.0
 */
 module.exports =  class apiResult {
    constructor(){
        this.res = null;
        this.msg = null;
    }
    set res(value){
        this._res = value;
    }

    set msg(value){
        this._msg = value;
    }

    get res(){
        return this._res;
    }

    get msg(){
        return this._msg;
    }
}