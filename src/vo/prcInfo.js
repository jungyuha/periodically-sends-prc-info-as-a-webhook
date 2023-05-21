/**
 * 경로 :src/vo/prcInfo.js
 * 분류 : VO
 * 용도 : api 호출을 통해 반환받은 사이즈별 상세 상품 정보 VO
 * @date        : 2022-09
 * @author      : yuha
 * @version	: 3.0
 */
module.exports =  class prcInfo {
    constructor(){
        this.size = null;
        this.lowestAsk = null;
        this.highestBid = null;
        this.lastSale = null;
    }
    set size(value){
        this._size = value;
    }

    set lowestAsk(value){
        this._lowestAsk = value;
    }

    set highestBid(value){
        this._highestBid = value;
    }

    set lastSale(value){
        this._lastSale = value;
    }

    get size(){
        return this._size;
    }

    get lowestAsk(){
        return this._lowestAsk;
    }

    get highestBid(){
        return this._highestBid;
    }

    get lastSale(){
        return this._lastSale;
    }
}