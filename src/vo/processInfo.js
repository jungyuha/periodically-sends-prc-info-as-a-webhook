/**
 * 경로 :src/vo/processInfo.js
 * 분류 : VO
 * 용도 : 사용자가 등록한 (배치) 프로세스 정보 VO
 * 기타 설명 : 프론트에서 객체 내 요소에 직접 접근하므로 getter,setter가 없음 ( 예시: processInfo.processId ) 
 * @date        : 2022-09
 * @author      : yuha
 * @version	: 3.0
 */
module.exports =  class processInfo {
    constructor(){
        this.processId = null;
        this.stockXProdId = null;
        this.kreamProdId = null;
        this.stockXUrl = null;  
        this.kreamUrl = null; 
        this.intervalUnit = null;
        this.interval = null;
        this.status = null;
        this.lastSent = null;
        this.deliveryFeeToUs = null;
        this.deliveryFeeToKr = null;
        this.exchange = null;
        this.failMsg = null;
        this.lastModified = null;       
    }
/*
    set processId(value){
        this._processId = value;
    }

    set stockXProdId(value){
        this._stockXProdId = value;
    }

    set kreamProdId(value){
        this._kreamProdId = value;
    }

    set stockXUrl(value){
        this._stockXUrl = value;
    }

    set kreamUrl(value){
        this._kreamUrl = value;
    }

    set intervalUnit(value){
        this._intervalUnit = value;
    }

    set interval(value){
        this._interval = value;
    }

    set stat(value){
        this._stat = value;
    }

    set lastSent(value){
        this._lastSent = value;
    }

    set deliveryFeeToUs(value){
        this._deliveryFeeToUs = value;
    }

    set deliveryFeeToKr(value){
        this._deliveryFeeToKr = value;
    }
    
    set exchange(value){
        this._exchange = value;
    }

    set failMsg(value){
        this._failMsg = value;
    }

    get processId(){ 
        return this._processId;
    }

    get stockXProdId(){
        return this._stockXProdId;
    }

    get kreamProdId(){
        return this._kreamProdId;
    }

    get stockXUrl(){
        return this._stockXUrl;
    }

    get kreamUrl(){ 
        return this._kreamUrl;
    }

    get intervalUnit(){ 
        return this._intervalUnit;
    }

    get interval(){ 
        return this._interval;
    }

    get stat(){
        return this._stat;
    }

    get lastSent(){ 
        return this._lastSent;
    }

    get deliveryFeeToUs(){ 
        return this._deliveryFeeToUs;
    }

    get deliveryFeeToKr(){ 
        return this._deliveryFeeToKr;
    }

    get exchange(){ 
        return this._exchange;
    }

    get failMsg(){ 
        return this._failMsg;
    }
    */
}