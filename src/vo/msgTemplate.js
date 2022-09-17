module.exports =  class prodObj {
    constructor(){
        this.msgInfoMap = null;
        this.finalMsg = null;
        this.exchange = null;
        this.deliveryFeeToUs = null;
        this.deliveryFeeToKr = null;
    }
    set msgInfoMap(value){
        if(!value){
            // console.log("msgInfoMap을 입력하세요.");
            //return;
        }
        this._msgInfoMap = value;
    }

    get msgInfoMap(){
        return this._msgInfoMap;
    }

    set finalMsg(value){
        if(!value){
            // console.log("finalMsg 입력하세요.");
            //return;
        }
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