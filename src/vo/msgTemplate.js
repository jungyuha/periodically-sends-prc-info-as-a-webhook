/**
 * 경로 :src/vo/msgTemplate.js
 * 분류 : VO
 * 용도 : webhook 메시지 가공에 필요한 상품 전체(최종) 정보 VO
 * @date        : 2022-09
 * @author      : yuha
 * @version	: 3.0
 */
module.exports =  class msgTemplate {
    constructor(){
        this.msgInfoMap = null;
        this.finalMsg = null;
        this.exchange = null;
        this.deliveryFeeToUs = null;
        this.deliveryFeeToKr = null;
    }
    set msgInfoMap(value){
        this._msgInfoMap = value;
    }

    get msgInfoMap(){
        return this._msgInfoMap;
    }

    set finalMsg(value){
        this._finalMsg = value;
    }

    get finalMsg(){
        return this._finalMsg;
    }

    get exchange(){
        return this._exchange;
    }

    set exchange(value){ 
        if(!value){
            this._exchange= 1350; 
        }
        else{
            this._exchange= parseInt(value); 
        }
    }

    get deliveryFeeToUs(){
        return this._deliveryFeeToUs;
    }

    set deliveryFeeToUs(value){ 
        if(!value){
            this._deliveryFeeToUs =  null ; 
        }
        else{
            this._deliveryFeeToUs = parseInt(value); 
        }  
    }
        
    get deliveryFeeToKr(){
        return this._deliveryFeeToKr;
    }

    set deliveryFeeToKr(value){
        if(!value){
            this._deliveryFeeToKr =  null ; 
        }
        else{
            this._deliveryFeeToKr = parseInt(value); 
        }  
    } 
}