/**
 * 경로 :src/vo/prodObj.js
 * 분류 : VO
 * 용도 : api 호출을 통해 반환받은 사이즈별 상품 전체 정보 VO
 * @date        : 2022-09
 * @author      : yuha
 * @version	: 3.0
 */
module.exports =  class prodObj {
    constructor(){
        this.url = null;
        this.name = null;
        this.image = null;
        this.prdMap = null;
        this.options = null;
        this.apiResult = null;
    }
    set url(value){
        this._url = value;
    }

    set name(value){
        this._name = value;
    }
 
    set image(value){
        this._image = value;
    }

    set prdMap(value){
        this._prdMap = value;
    }

    set options(value){
        this._options = value;
    }

    set apiResult(value){
        this._apiResult = value;
    }

    get url(){
        return this._url;
    }

    get name(){
        return this._name;
    }

    get image(){
        return this._image;
    }

    get prdMap(){
        return this._prdMap;
    }

    get options(){
        return this._options;
    }

    get apiResult(){
        return this._apiResult;
    }
}