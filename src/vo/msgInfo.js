/**
 * 경로 :src/vo/msgInfo.js
 * 분류 : VO
 * 용도 : webhook 메시지 가공에 필요한 사이즈별 상세 상품 정보 VO
 * @date        : 2022-09
 * @author      : yuha
 * @version	: 3.0
 */
module.exports =  class msgInfo {
    constructor(){
        this.kream_prc_highest_bid = null;  // no1 : kream_prc_highest_bid
        this.kream_prc_lowest_ask = null;  // no2 : kream_prc_lowest_ask
        this.kream_latest_prc = null; // no3 : kream_latest_prc

        this.stockX_prc_highest_bid = null; // no4 : stockX_prc_highest_bid
        this.stockX_prc_lowest_ask = null; // no5 : stockX_prc_lowest_ask
        this.stockX_latest_prc = null;   // no6 : stockX_latest_prc

        this.deliveryFeeToUs = null;    // no7 : deliveryFeeToUs
        this.deliveryFeeToKr = null;    // no8 : deliveryFeeToKr
        this.exchange = null;    // no9 : exchange

        this.krToUs_msg = null;  // no10 : krToUs_msg 
        this.usToKr_msg = null;  // no11 : usToKr_msg

        this.title = null;  // no28 : title
        this.kr_size = null;  // no29 : krsize

        // 아래부터는 자동 계산 영역
        this.kr_final_buy_prc = null;   // no12 : kr_final_buy_prc
        this.kr_final_buy_latest_prc = null;  // no13 : kr_final_buy_latest_prc
        this.kr_final_sell_prc = null;  // no14 : kr_final_sell_prc
        this.kr_final_sell_latest_prc = null;  // no15 : kr_final_sell_latest_prc
        
        this.us_final_buy_prc = null;  // no16 : us_final_buy_prc
        this.us_final_sell_prc = null;  // no17 : us_final_sell_prc
        this.us_final_buy_latest_prc = null;  // no18 : us_final_buy_latest_prc
        this.us_final_sell_latest_prc = null;  // no19 : us_final_sell_latest_prc

        this.krToUs_prc_diff = null;  // no20 : krToUs_prc_diff
        this.krToUs_latest_prc_diff = null;  // no21 : krToUs_latest_prc_diff
        this.krToUs_prc_roi = null;  // no22 : krToUs_prc_roi
        this.krToUs_latest_prc_roi = null;  // no23 : krToUs_latest_prc_roi

        this.usToKr_prc_diff = null;  // no24 : usToKr_prc_diff
        this.usToKr_latest_prc_roi = null;  // no25 : usToKr_latest_prc_roi
        this.usToKr_prc_roi = null;  // no26 : usToKr_prc_roi
        this.usToKr_latest_prc_diff = null;  // no27 : usToKr_latest_prc_diff

    }

    // 기본값 설정
    setMsgInfoDefault(kream_prc_highest_bid,kream_prc_lowest_ask,kream_latest_prc ,stockX_prc_highest_bid,stockX_prc_lowest_ask,stockX_latest_prc
                        ,deliveryFeeToUs,deliveryFeeKr,exchange){
            
        this.kream_prc_highest_bid = kream_prc_highest_bid;
        this.kream_prc_lowest_ask =  kream_prc_lowest_ask ;
        this.kream_latest_prc = kream_latest_prc;
 
        this.stockX_prc_highest_bid = stockX_prc_highest_bid;       
        this.stockX_prc_lowest_ask = stockX_prc_lowest_ask;
        this.stockX_latest_prc = stockX_latest_prc;

        this.deliveryFeeToUs = deliveryFeeToUs;  
        this.deliveryFeeToKr = deliveryFeeKr; 
        this.exchange = (exchange> 0) ? Number(exchange) : 1350 ;

    }
    // 자동계산
    setMsgInfoElement(){
        // (미국에서 한국가는 운송비 달러로 받음)
        this.deliveryFeeToKr = parseInt(this.deliveryFeeToKr*(this.exchange));

        this.kr_final_buy_prc = (this.kream_prc_lowest_ask > 0) ? parseInt(this.kream_prc_lowest_ask*(1.02) + 3000 + this.deliveryFeeToUs) : null;
        this.kr_final_buy_latest_prc = (this.kream_latest_prc > 0) ? parseInt(this.kream_latest_prc*(1.02) + 3000 + this.deliveryFeeToUs) : null;
        this.kr_final_sell_prc = (this.kream_prc_highest_bid > 0) ? parseInt(this.kream_prc_highest_bid*(0.98)) : null;
        this.kr_final_sell_latest_prc = (this.kream_latest_prc > 0) ? parseInt(this.kream_latest_prc*(0.98)) : null;
        
        // us_final_buy_prc = stockX_prc_lowest_ask(즉시구매가)*(1.045) + 15$ + deliveryFeeToKr(미국에서 한국가는 운송비 달러로 받음)
        this.us_final_buy_prc = (this.stockX_prc_lowest_ask > 0 ) ? parseInt(this.stockX_prc_lowest_ask*(1.045) + (15*this.exchange) + this.deliveryFeeToKr) : null;
        
        // stockX_prc_highest_bid(즉시판매가)*(0.88)
        this.us_final_sell_prc = (this.stockX_prc_highest_bid > 0) ? parseInt(this.stockX_prc_highest_bid*(0.88)) : null ;

        // us_final_buy_latest_prc = stockX_latest_prc(최근판매가)*(1.045) + 15$ + deliveryFeeToKr(미국에서 한국가는 운송비 달러로 받음)
        this.us_final_buy_latest_prc = (this.stockX_latest_prc > 0 ) ? parseInt(this.stockX_latest_prc*(1.045) + (15*this.exchange) + this.deliveryFeeToKr) : null;
        
        // us_final_sell_latest_prc = stockX_latest_prc(최근판매가)*(0.88)
        this.us_final_sell_latest_prc = (this.stockX_latest_prc > 0 ) ? parseInt(this.stockX_latest_prc*(0.88)) : null;  

        // krToUs_prc_diff =  us_final_sell_prc - kr_final_buy_prc
        this.krToUs_prc_diff = (this.us_final_sell_prc > 0 && this.kr_final_buy_prc > 0) ? parseInt(this.us_final_sell_prc - this.kr_final_buy_prc) : null ;

        // krToUs_latest_prc_diff = us_final_sell_latest_prc - kr_final_latest_buy_prc
        this.krToUs_latest_prc_diff = (this.us_final_sell_latest_prc > 0 && this.kr_final_buy_latest_prc > 0) ? parseInt(this.us_final_sell_latest_prc - this.kr_final_buy_latest_prc) : null;
 
        // krToUs_prc_roi = krToUs_prc_diff / kr_final_buy_prc = (us_final_sell_prc - kr_final_buy_prc) / kr_final_buy_prc
        this.krToUs_prc_roi = (this.kr_final_buy_prc > 0 && this.krToUs_prc_diff != null) ? parseInt((this.krToUs_prc_diff / this.kr_final_buy_prc)*100) : null;

        // krToUs_latest_prc_roi = krToUs_latest_prc_diff / kr_final_buy_latest_prc = ( us_final_sell_latest_prc - kr_final_buy_latest_prc ) / kr_final_buy_latest_prc
        this.krToUs_latest_prc_roi = (this.kr_final_buy_latest_prc > 0 && this.krToUs_latest_prc_diff != null) ? parseInt((this.krToUs_latest_prc_diff / this.kr_final_buy_latest_prc)*100) : null;

        // usToKr_prc_diff = kr_final_sell_prc - us_final_buy_prc
        this.usToKr_prc_diff =  (this.kr_final_sell_prc > 0 && this.us_final_buy_prc > 0) ? parseInt(this.kr_final_sell_prc - this.us_final_buy_prc) : null ;

        //  usToKr_latest_prc_diff = kr_final_sell_latest_prc - us_final_buy_latest_prc
        this.usToKr_latest_prc_diff =(this.kr_final_sell_latest_prc > 0 && this.us_final_buy_latest_prc > 0) ? parseInt(this.kr_final_sell_latest_prc - this.us_final_buy_latest_prc) :null;
        
        // usToKr_latest_prc_roi = usToKr_latest_prc_diff / us_final_buy_latest_prc = kr_final_sell_latest_prc - us_final_buy_latest_prc / us_final_buy_latest_prc
        this.usToKr_latest_prc_roi = (this.us_final_buy_latest_prc > 0 && this.usToKr_latest_prc_diff != null) ? parseInt((this.usToKr_latest_prc_diff / this.us_final_buy_latest_prc)*100) : null ;
        
        // usToKr_prc_roi = usToKr_prc_diff / us_final_buy_prc
        this.usToKr_prc_roi = (this.us_final_buy_prc > 0 && this.usToKr_prc_diff != null) ? parseInt((this.usToKr_prc_diff / this.us_final_buy_prc)*100) : null ;
        
    }

    // ------------------ getter setter

    // no1 : kream_prc_highest_bid 
    get kream_prc_highest_bid(){
        return this._kream_prc_highest_bid;
    }

    set kream_prc_highest_bid(value){ 
        if(!value){
            this._kream_prc_highest_bid = null ; 
        }
        else{
            this._kream_prc_highest_bid = parseInt(value); 
        }
    } 
    
    // no2 : kream_prc_lowest_ask
    get kream_prc_lowest_ask(){
        return this._kream_prc_lowest_ask;
    }

    set kream_prc_lowest_ask(value){ 
        if(!value){
            this._kream_prc_lowest_ask =  null ; 
        }
        else{
            this._kream_prc_lowest_ask = parseInt(value); 
        }
    } 
    
    // no3 : kream_latest_prc
    get kream_latest_prc(){
        return this._kream_latest_prc;
    }

    set kream_latest_prc(value){ 
        if(!value){
            this._kream_latest_prc =  null ; 
        }
        else{
            this._kream_latest_prc = parseInt(value); 
        }  
    }

    // no4 : stockX_prc_highest_bid
    get stockX_prc_highest_bid(){
        return this._stockX_prc_highest_bid;
    }

    set stockX_prc_highest_bid(value){ 
        if(!value){
            this._stockX_prc_highest_bid =  null ; 
        }
        else{
            this._stockX_prc_highest_bid = parseInt(value); 
        } 
    } 

    // no5 : stockX_prc_lowest_ask
    get stockX_prc_lowest_ask(){
        return this._stockX_prc_lowest_ask;
    }

    set stockX_prc_lowest_ask(value){ 
        if(!value){
            this._stockX_prc_lowest_ask =  null ; 
        }
        else{
            this._stockX_prc_lowest_ask = parseInt(value); 
        }  
    } 

    // no6 : stockX_latest_prc
    get stockX_latest_prc(){
        return this._stockX_latest_prc;
    }

    set stockX_latest_prc(value){ 
        if(!value){
            this._stockX_latest_prc =  null ; 
        }
        else{
            this._stockX_latest_prc = parseInt(value); 
        }  
    }  
            
    // no7 : deliveryFeeToUs
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
    
    // no8 : deliveryFeeToUs
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

    // no9 : exchange
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

    // no10 : krToUs_msg
    get usToKr_msg(){
        return this._usToKr_msg;
    }

    set usToKr_msg(value){ 
        if(!value){
            this._usToKr_msg= null;
        }
        this._usToKr_msg= value;  
    }  

    // no11 : krToUs_msg
    get krToUs_msg(){
        return this._krToUs_msg;
    }

    set krToUs_msg(value){ 
        if(!value){
            this._krToUs_msg= null; 
        }
        this._krToUs_msg= value;  
    }  

    // no28 : title
    get title(){
        return this._title;
    }

    set title(value){ 
        if(!value){
            this._title= null; 
        }
        this._title= value;  
    } 

    // no12 : kr_final_buy_prc
    get kr_final_buy_prc(){
        return this._kr_final_buy_prc;
    }

    set kr_final_buy_prc(value){ 
        if(!value){
            this._kr_final_buy_prc= null; 
        }
        this._kr_final_buy_prc= value;  
    }  

    // no13 : kr_final_buy_latest_prc
    get kr_final_buy_latest_prc(){
        return this._kr_final_buy_latest_prc;
    }

    set kr_final_buy_latest_prc(value){ 
        if(!value){
            this._kr_final_buy_latest_prc= null; 
        }
        this._kr_final_buy_latest_prc= value;  
    }  
 
    // no14 : kr_final_sell_prc
    get kr_final_sell_prc(){
        return this._kr_final_sell_prc;
    }

    set kr_final_sell_prc(value){ 
        if(!value){
            this._kr_final_sell_prc= null; 
        }
        this._kr_final_sell_prc= value;  
    }  

    // no15 : kr_final_sell_latest_prc

    get kr_final_sell_latest_prc(){
        return this._kr_final_sell_latest_prc;
    }

    set kr_final_sell_latest_prc(value){ 
        if(!value){
            this._kr_final_sell_latest_prc= null; 
        }
        this._kr_final_sell_latest_prc= value;  
    }  
    
    // no16 : us_final_buy_prc
    get us_final_buy_prc(){
        return this._us_final_buy_prc;
    }

    set us_final_buy_prc(value){ 
        if(!value){
            this._us_final_buy_prc= null; 
        }
        this._us_final_buy_prc= value;  
    }  

    // no17 : us_final_sell_prc
    get us_final_sell_prc(){
        return this._us_final_sell_prc;
    }

    set us_final_sell_prc(value){ 
        if(!value){
            this._us_final_sell_prc = null; 
        }
        this._us_final_sell_prc = value;  
    }  

        // no18 : us_final_buy_latest_prc
        get us_final_buy_latest_prc(){
            return this._us_final_buy_latest_prc;
        }
    
        set us_final_buy_latest_prc(value){ 
            if(!value){
                this._us_final_buy_latest_prc= null; 
            }
            this._us_final_buy_latest_prc= value;  
        }  

    // no19 : us_final_sell_latest_prc
        get us_final_sell_latest_prc(){
            return this._us_final_sell_latest_prc;
        }
    
        set us_final_sell_latest_prc(value){ 
            if(!value){
                this._us_final_sell_latest_prc= null; 
            }
            this._us_final_sell_latest_prc= value;  
        }  

    // no20 : krToUs_prc_diff
    get krToUs_prc_diff(){
        return this._krToUs_prc_diff;
    }

    set krToUs_prc_diff(value){ 
        if(!value){
            this._krToUs_prc_diff= null; 
        }
        this._krToUs_prc_diff= value;  
    }  

    // no21 : krToUs_latest_prc_diff
    get krToUs_latest_prc_diff(){
        return this._krToUs_latest_prc_diff;
    }

    set krToUs_latest_prc_diff(value){ 
        if(!value){
            this._krToUs_latest_prc_diff= null; 
        }
        this._krToUs_latest_prc_diff= value;  
    }  

    // no22 : krToUs_prc_roi
    get krToUs_prc_roi(){
        return this._krToUs_prc_roi;
    }

    set krToUs_prc_roi(value){ 
        if(!value){
            this._krToUs_prc_roi= null; 
        }
        this._krToUs_prc_roi= value;  
    }  
    
    // no23 : krToUs_latest_prc_roi
    get krToUs_latest_prc_roi(){
        return this._krToUs_latest_prc_roi;
    }

    set krToUs_latest_prc_roi(value){ 
        if(!value){
            this._krToUs_latest_prc_roi= null; 
        }
        this._krToUs_latest_prc_roi= value;  
    }  

    // no24 : usToKr_prc_diff
    get usToKr_prc_diff(){
        return this._usToKr_prc_diff;
    }
    
    set usToKr_prc_diff(value){ 
        if(!value){
            this._usToKr_prc_diff= null; 
        }
        this._usToKr_prc_diff= value;  
    }  

    // no25 : usToKr_latest_prc_roi
    get usToKr_latest_prc_roi(){
        return this._usToKr_latest_prc_roi;
    }

    set usToKr_latest_prc_roi(value){ 
        if(!value){
            this._usToKr_latest_prc_roi= null; 
        }
        this._usToKr_latest_prc_roi= value;  
    }  
    
    // no26 : usToKr_prc_roi
    get usToKr_prc_roi(){
        return this._usToKr_prc_roi;
    }
    
    set usToKr_prc_roi(value){ 
        if(!value){
            this._usToKr_prc_roi= null; 
        }
        this._usToKr_prc_roi= value;  
    }  

    // no27 : usToKr_latest_prc_diff
    get usToKr_latest_prc_diff(){
        return this._usToKr_latest_prc_diff;
    }

    set usToKr_latest_prc_diff(value){ 
        if(!value){
            this._usToKr_latest_prc_diff= null; 
        }
        this._usToKr_latest_prc_diff= value;  
    }  

    // no29 : krSize
    get kr_size(){
        return this._kr_size;
    }

    set kr_size(value){ 
        if(!value){
            this._kr_size= null; 
        }
        this._kr_size= value;  
    } 
}