
var sizeMap1 = require('../vo/sizeMap1');  
var sizeMap2 = require('../vo/sizeMap2'); 
var sizeMap3 = require('../vo/sizeMap3'); 
var sizeMap4 = require('../vo/sizeMap4'); 
const msgInfo_ = require('../vo/msgInfo');
const msgTemplate_ = require('../vo/msgTemplate');
/**
 * 경로 :src/services/createTemplate-service.js
 * 분류 : SERVICE
 * 용도
 * 1. 받아온 상품 정보를 정리하고 가공한다.
 * 2. webhook으로 보낼 메시지 템플릿을 만든다.
 * 3. 최종적으로 전송될 webhook 메시지를 생성한다. : (1)번의 가공된 상품 정보와 (2)번의 템플릿을 결합한다.
 * @date        : 2022-10
 * @author      : yuha
 * @version	: 3.0
 */
const createTemplateService = {

	/**
	 * 1. MethodName        : procOriginVals
	 * 2. ClassName         : createTemplateService
	 * 3. Comment           : 
     *      1) 받아온 상품 정보를 정리하고 가공한다.
     *      2) webhook으로 보낼 메시지 템플릿을 만든다.
     *      3) 최종적으로 전송될 webhook 메시지를 생성한다. : (1)번의 가공된 상품 정보와 (2)번의 템플릿을 결합한다.
	 * 4. user              : yuha
	 * 5. CreateDate        : 2022. 10. 03.
	 * @param stockXData : prodObj , kreamData : prodObj , templateInfo : object
	 * @return msgTemplate
	 */
    procOriginVals: async(stockXData,kreamData,templateInfo) => {
        var msgTemplate = new msgTemplate_();
        msgTemplate.msgInfoMap = {};

        // 사이즈 정보 맵핑 : 기본 / W(여자신발) / Y(아동신발) / XXSMXXL(의류) 
        var sizeMap=sizeMap1;
            if(Object.keys(stockXData.prdMap)[0]!=null){
                if((Object.keys(stockXData.prdMap)[0].toString()).includes('W')){
                    sizeMap=sizeMap2;
                }
                else if((Object.keys(stockXData.prdMap)[0].toString()).includes('Y')){
                    sizeMap=sizeMap3;
                }
                else if('XXSMXXL'.includes((Object.keys(stockXData.prdMap)[0].toString()))){
                    sizeMap=sizeMap4;
                }
            }
        templateInfo.sizeMap = sizeMap;

        // 계산값 설정 : 환율 , 배송비
        let exchange = templateInfo.exchange > 0 ? Number(templateInfo.exchange) : 1350 ;
        let deliveryFeeToUs = (templateInfo.deliveryFeeToUs > 0) ? Number(templateInfo.deliveryFeeToUs) : 0 ;
        let deliveryFeeToKr = (templateInfo.deliveryFeeToKr > 0) ? Number(templateInfo.deliveryFeeToKr) : 0;
        msgTemplate.exchange = exchange;
        msgTemplate.deliveryFeeToUs = deliveryFeeToUs;
        msgTemplate.deliveryFeeToKr =  parseInt(deliveryFeeToKr*exchange);

        // "사이즈별" 판매 상품 정보를 가공(최종 판매값 계산)하고 최종적으로 전송될 webhook 메시지를 생성한다.
        for(const [ key, value ] of Object.entries(stockXData.prdMap)){
            if(kreamData.prdMap[sizeMap[key]]!=null){ // 미국 사이즈 - 한국 동일 사이즈 맵핑
                const msgInfo = new msgInfo_(); // "사이즈별" 가공된 상품 정보를 담을 객체
                // "사이즈별" 가공된 상품 정보 셋팅 시작
                msgInfo.setMsgInfoDefault( 
                    kreamData.prdMap[sizeMap[key]].highestBid,
                    kreamData.prdMap[sizeMap[key]].lowestAsk,
                    parseInt(Number(kreamData.prdMap[sizeMap[key]].lastSale)),
                    value.highestBid,
                    value.lowestAsk,
                    parseInt(Number(value.lastSale)),
                    deliveryFeeToUs,
                    deliveryFeeToKr,
                    exchange);
                msgInfo.setMsgInfoElement();    
                // "사이즈별" 가공된 상품 정보 셋팅 끝

                // 최종적으로 전송될 webhook 메시지를 사이즈별로 생성한다.
                msgInfo.msg = 
                    "환율 : " + exchange + " | "
                    + "사이즈 : " + key +"("+sizeMap[key]+")" + " | "
                    + "stockX 최종 구매가(최근 최종 구매가) : " + msgInfo.us_final_buy_prc + "("+ msgInfo.us_final_buy_latest_prc+")" + " | "
                    + "kream 최종 판매가(최근 최종 판매가) : " + msgInfo.kr_final_sell_prc + "("+msgInfo._kr_final_sell_latest_prc+")" + " | "
                    + "미국 => 한국 차액 : " + msgInfo.usToKr_prc_diff + " | "
                    + "kream 최종 구매가(최근 최종 구매가) : " + msgInfo.kr_final_buy_prc + "("+msgInfo.kr_final_buy_latest_prc+")" + " | "
                    + "stockX 최종 판매가(최근 최종 판매가) : " + msgInfo.us_final_sell_prc + "("+msgInfo._kr_final_buy_latest_prc+")" + " | "
                ;
                msgInfo.title = "US " + key +" ("+sizeMap[key]+")"
                msgInfo.kr_size = sizeMap[key];
                msgInfo.krToUs_msg =
                    "kream 구매가(직전가) :" +createTemplateService.moneyComma(msgInfo.kr_final_buy_prc) + "("+ createTemplateService.moneyComma(msgInfo.kr_final_buy_latest_prc)+")"+ "\n"
                    +"stockX 판매가(직전가) : "+ createTemplateService.moneyComma(msgInfo.us_final_sell_prc) + "("+ createTemplateService.moneyComma(msgInfo.us_final_sell_latest_prc)+")" +"\n" 
                    + "차액(직전가 차액) : " +createTemplateService.moneyComma(msgInfo.krToUs_prc_diff) + "("+ createTemplateService.moneyComma(msgInfo.krToUs_latest_prc_diff)+")"+ "\n"
                    + "roi(직전가 roi) : " +createTemplateService.roiToString(msgInfo.krToUs_prc_roi)+ "("+ createTemplateService.roiToString(msgInfo.krToUs_latest_prc_roi)+")"+ "\n";
                msgInfo.usToKr_msg = 
                "stockX 구매가(직전가) :" +createTemplateService.moneyComma(msgInfo.us_final_buy_prc) + "("+ createTemplateService.moneyComma(msgInfo.us_final_buy_latest_prc)+")"+ "\n"
                + "kream 판매가(직전가) : "+ createTemplateService.moneyComma(msgInfo.kr_final_sell_prc) + "("+ createTemplateService.moneyComma(msgInfo.kr_final_sell_latest_prc)+")" +"\n"
                + "차액(직전가 차액) : " +createTemplateService.moneyComma(msgInfo.usToKr_prc_diff) + "("+ createTemplateService.moneyComma(msgInfo.usToKr_latest_prc_diff)+")"+ "\n"
                + "roi(직전가 roi) : " +createTemplateService.roiToString(msgInfo.usToKr_prc_roi)+ "("+ createTemplateService.roiToString(msgInfo.usToKr_latest_prc_roi)+")"+ "\n";

                msgTemplate.msgInfoMap[key]=msgInfo;
                }                     
            }
            console.log("????? :"+JSON.stringify(msgTemplate));
        return msgTemplate;
    },

    /**
	 * 1. MethodName        : moneyComma
	 * 2. ClassName         : createTemplateService
	 * 3. Comment           : 숫자만 있는 형태의 가격에 세자리수 단위로 ',' 를 붙여 string 형태로 반환한다.
	 * 4. user              : yuha
	 * 5. CreateDate        : 2022. 10. 03.
	 * @param money : int
	 * @return res : string
	 */
    moneyComma : (money) => {
        var res;
        if (money == null){
            res = null ;
        }
        else {
            res = "₩"+money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } 
        return res;
    },

    /**
	 * 1. MethodName        : roiToString
	 * 2. ClassName         : createTemplateService
	 * 3. Comment           : 숫자만 있는 형태의 percentage값에 '%' 를 붙여 string 형태로 반환한다.
	 * 4. user              : yuha
	 * 5. CreateDate        : 2022. 10. 03.
	 * @param roi : int
	 * @return res : string
	 */
    roiToString : (roi) => {
        var res;
        if (roi == null){
            res = null ;
        }
        else {
            res = roi.toString()+"%";
        } 
        return res;
    }
};

module.exports = createTemplateService;

