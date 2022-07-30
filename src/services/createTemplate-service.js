const sizeMap1 = {"4" : "220" , "4.5" :"225" , "5" : "230" , "5.5":"235" ,"6" : "240" , "6.5" : "245",
"7" :"250" , "7.5" : "255","8":"260","8.5":"265","9":"270",
"9.5":"275","10":"280","10.5":"285","11":"290","11.5":"295",
"12":"300","12.5":"305","13":"310","13.5":"315","14":"320",
"14.5":"325","15":"330","15.5":"335","16":"340","16.5":"345",
"17":"350","17.5":"355","18":"360"};  
   
const sizeMap2 = {"5W": "215","5.5W": "220","6W":"225","6.5W": "230","7W": "235","7.5W": "240",
"8W": "245","8.5W": "250","9W":"255","9.5W": "260","10W": "265","10.5W": "270","11W":"275","11.5W":"280","12W":"285"};

const sizeMap3 = {"3.5Y": "225","4Y": "230","4.5Y": "235","5Y": "240","5.5Y": "245",
            "6Y": "250","6.5Y": "255","7Y": "260"}

const sizeMap4 = {"XXS":"XXS", "XS":"XS", "S":"S", "M":"M", "L":"L", "XL":"XL", "XXL":"XXL"}   

/*
[template detail 1]
1 버전 :: 한국 => 미국
- StockX 미국 홈페이지 달러가격*1.045+$15+변수(미국에서 한국가는 택배비 $값 넣을수 있게)한거를 크림 즉시판매가*0.98한 가격이랑 비교
- 웹훅에는 원화로 뜨게
stockX Prc(stockX latest Prc) | kream Prc(kream latest Prc) | kream Prc - stockX Prc | roi(latest roi)
*/

/* 
[template detail 2]
2 버전 :: 미국 => 한국
- 크림 즉시구매가+3000원(원화 고정값)+ 변수(한국에서 미국가는 택배비 원화값 넣을수 있게)한거를 미국 StockX 즉시판매가*0.9한 가격이랑 비교
- 웹훅에는 달러값으로 뜨게
kream Prc(kream latest Prc) | stockX Prc(stockX latest Prc) | stockX Prc - kream Prc | roi(latest roi)
*/

/*
[template 공통]
1. 한 => 미 : kream Prc 1 | stockX Prc 1 | 차액 1| roi 1
2. 미 => 한 : kream Prc 2| stockX Prc 2| 차액 2| roi 2
3. 최근 거래 : kream latest Prc  | stockX latest Prc | 차액 | 최근판매가 roi
Input(type)
 - type 종류 : 한국 => 미국 / 미국 => 한국
return
1. kream Prc 1 : 크림 즉시판매가*0.98
3. stockX Prc 1 : StockX 미국 홈페이지 달러가격*1.045+$15+변수(미국에서 한국가는 택배비 $값 넣을수 있게)한거
1. kream Prc 2 : 크림 즉시구매가+3000원(원화 고정값)+ 변수(한국에서 미국가는 택배비 원화값 넣을수 있게)한거
3. stockX Prc 2 : 미국 StockX 즉시판매가*0.9
2. kream latest Prc : kream 최근 거래가
4. stockX latest Prc : stockX 최근 거래가
5. 차액 1
5. 차액 2
6. roi
7. latest roi

templateInfo => exchange , templateType (fromUsToKr , fromKrToUs) , sizeMap , 배송비(deliveryFeeToUs:,deliveryFeeToKr:)
*/

const createTemplateService = {

    dataTest: async(stockXData,kreamData,templateInfo) => {
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
            let exchange = (templateInfo.exchange != null) ? Number(templateInfo.exchange) : 1304 ;
            let deliveryFeeToUs = templateInfo.deliveryFeeToUs;
            let deliveryFeeToKr = templateInfo.deliveryFeeToKr;
            let kream_prc_1 , kream_prc_2 , stockX_prc_1 , stockX_prc_2 , kream_latest_prc , stockX_latest_prc;
            var originVals={};
            for(const [ key, value ] of Object.entries(stockXData.prdMap)){
                if(kreamData.prdMap[sizeMap[key]]!=null){ // 1. 동일 사이즈 맵핑
                    // 2. kream Prc 1 , 2
                    if(kreamData.prdMap[sizeMap[key]].highest_bid > 0){
                        kream_prc_1 = Number(kreamData.prdMap[sizeMap[key]].highest_bid)*0.98;
                    }else{
                        kream_prc_1 = 0;
                    }
                    if(kreamData.prdMap[sizeMap[key]].lowest_ask > 0){
                        kream_prc_2 = parseInt(Number(kreamData.prdMap[sizeMap[key]].lowest_ask) + 3000 + Number(deliveryFeeToUs))
                    }else{
                        kream_prc_2 = 0;
                    }
                    // 3. stockX Prc 1 2
                    if(value.lowestAsk > 0){
                        stockX_prc_1 = parseInt(Number(value.lowestAsk)*1.045 + (15)*exchange + Number(deliveryFeeToKr)*exchange) ;
                    }else{
                        stockX_prc_1 = 0;
                    }
                    if(value.highestBid > 0){
                        stockX_prc_2 = parseInt(Number(value.highestBid)*0.9) ;
                    }else{
                        stockX_prc_2 = 0;
                    }
                    // 4. kream_latest_prc , stockX_latest_prc
                    if(kreamData.prdMap[sizeMap[key]].lastSale != null ){
                        kream_latest_prc = parseInt(Number(kreamData.prdMap[sizeMap[key]].lastSale));
                    } else{
                        kream_latest_prc = 0;
                    }

                    if(value.lastSale != null){
                        stockX_latest_prc = parseInt(Number(value.lastSale)*0.9);
                    }
                    else {
                        stockX_latest_prc = 0;
                    }
                    /*
                        if(Number(kreamData.prdMap[sizeMap[key]].highest_bid) - Number(value.lowestAsk) > 0){
                            let kream_prc = 1;
                        }*/
                        let data = {
                            "환율 " : exchange,
                            "kream Prc 1 : 크림 즉시판매가*0.98" : kream_prc_1 ,
                            "stockX Prc 1 : StockX 미국 홈페이지 달러가격*1.045+$15+변수(미국에서 한국가는 택배비 $값 넣을수 있게)한거" : stockX_prc_1,
                            "kream Prc 2 : 크림 즉시구매가+3000원(원화 고정값)+ 변수(한국에서 미국가는 택배비 원화값 넣을수 있게)한거 " : kream_prc_2 ,
                            "stockX Prc 2 : 미국 StockX 즉시판매가*0.9 " : stockX_prc_2,
                            "kream latest Prc : kream 최근 거래가 " : kream_latest_prc,
                            "stockX latest Prc : stockX 최근 거래가*0.9 " : stockX_latest_prc
                        }
                        let test = 
                        "환율 : " + exchange
                        + "kream Prc 1 : 크림 즉시판매가*0.98 => " + kream_prc_1
                        + "stockX Prc 1 : StockX 미국 홈페이지 달러가격*1.045+$15+변수(미국에서 한국가는 택배비 $값 넣을수 있게)한거 => " + stockX_prc_1
                        + "kream Prc 2 : 크림 즉시구매가+3000원(원화 고정값)+ 변수(한국에서 미국가는 택배비 원화값 넣을수 있게)한거 => " + kream_prc_2
                        + "stockX Prc 2 : 미국 StockX 즉시판매가*0.9 => " + stockX_prc_2
                        + "kream latest Prc : kream 최근 거래가 => " + kream_latest_prc
                        + "stockX latest Prc : stockX 최근 거래가*0.9 => " + stockX_latest_prc;
                        originVals[kreamData.prdMap[sizeMap[key]].size]={title:'US '+value.size+' , '+kreamData.prdMap[sizeMap[key]].size,data:data};
                    }
                }
                console.log("result");
                console.log(JSON.stringify(originVals));
            },
            procOriginVals : async(stockXData,kreamData,templateInfo) => {

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
                    let exchange = (templateInfo.exchange != null) ? Number(templateInfo.exchange) : 1304 ;
                    let deliveryFeeToUs = templateInfo.deliveryFeeToUs;
                    let deliveryFeeToKr = templateInfo.deliveryFeeToKr;
                    let kream_prc_1 , kream_prc_2 , stockX_prc_1 , stockX_prc_2 , kream_latest_prc , stockX_latest_prc;
                    var originVals={};
                    for(const [ key, value ] of Object.entries(stockXData.prdMap)){
                        if(kreamData.prdMap[sizeMap[key]]!=null){ // 1. 동일 사이즈 맵핑
                            // 2. kream Prc 1 , 2
                            if(kreamData.prdMap[sizeMap[key]].highest_bid > 0){
                                kream_prc_1 = Number(kreamData.prdMap[sizeMap[key]].highest_bid)*0.98;
                            }else{
                                kream_prc_1 = 0;
                            }
                            if(kreamData.prdMap[sizeMap[key]].lowest_ask > 0){
                                kream_prc_2 = parseInt(Number(kreamData.prdMap[sizeMap[key]].lowest_ask) + 3000 + Number(deliveryFeeToUs))
                            }else{
                                kream_prc_2 = 0;
                            }
                            // 3. stockX Prc 1 2
                            if(value.lowestAsk > 0){
                                stockX_prc_1 = parseInt(Number(value.lowestAsk)*1.045 + (15)*exchange + Number(deliveryFeeToKr)*exchange) ;
                            }else{
                                stockX_prc_1 = 0;
                            }
                            if(value.highestBid > 0){
                                stockX_prc_2 = parseInt(Number(value.highestBid)*0.9) ;
                            }else{
                                stockX_prc_2 = 0;
                            }
                            // 4. kream_latest_prc , stockX_latest_prc
                            if(kreamData.prdMap[sizeMap[key]].lastSale != null ){
                                kream_latest_prc = parseInt(Number(kreamData.prdMap[sizeMap[key]].lastSale));
                            } else{
                                kream_latest_prc = 0;
                            }
        
                            if(value.lastSale != null){
                                stockX_latest_prc = parseInt(Number(value.lastSale)*0.9);
                            }
                            else {
                                stockX_latest_prc = 0;
                            }
                            let data = {
                                "exchange" : exchange,
                                "kream_prc_1" : kream_prc_1 ,
                                "stockX_prc_1" : stockX_prc_1,
                                "kream_prc_2" : kream_prc_2 ,
                                "stockX_prc_2" : stockX_prc_2,
                                "kream_latest_prc" : kream_latest_prc,
                                "stockX_latest_prc" : stockX_latest_prc
                            }
                            originVals[kreamData.prdMap[sizeMap[key]].size]={title:'US '+value.size+' , '+kreamData.prdMap[sizeMap[key]].size,data:data};
                        }
                        }
                        console.log("result");
                        console.log(JSON.stringify(originVals));
                    },
                    templateToUs_ver1: async(infoMap) => {
                        let res = "₩"+createTemplateService.moneyComma(infoMap.stockX_prc_1)
                        + "("
                        + ((infoMap.stockX_latest_prc > 0 ) ? "₩"+createTemplateService.moneyComma(infoMap.stockX_latest_prc) : "NULL")+ ")"
                        + " | " + "₩"+createTemplateService.moneyComma(infoMap.kream_prc_1)
                        + "(" +((infoMap.kream_latest_prc > 0 )? "₩"+createTemplateService.moneyComma(infoMap.kream_latest_prc) : "NULL")+ ")"
                        + " | " + "₩"+createTemplateService.moneyComma(Number(infoMap.kream_prc_1) - Number(infoMap.stockX_prc_1))
                        + " | " + parseInt(((Number(infoMap.kream_prc_1) - Number(infoMap.stockX_prc_1))/Number(infoMap.kream_prc_1))*100)+"%"
                        + "(" +((infoMap.kream_latest_prc > 0)? (parseInt(((Number(infoMap.kream_latest_prc) - Number(infoMap.stockX_latest_prc))/infoMap.kream_latest_prc)*100)+"%") : "NULL") +")";
                        ////여기
                    },
    moneyComma : (money) => {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    moneyDollar : (money,exchange) => {
        return parseInt(money/exchange).toString();
    }

};

module.exports = createTemplateService;

