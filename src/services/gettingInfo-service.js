const kreamApi = require('../lib/kream');
const StockXAPI = require('stockx-api');
const logger =  require('../modules/logger');
const stockX = new StockXAPI({currency: 'KRW'});
/*
1 버전 :: 한국 => 미국
- StockX 미국 홈페이지 달러가격*1.045+$15+변수(미국에서 한국가는 택배비 $값 넣을수 있게)한거를 크림 즉시판매가*0.98한 가격이랑 비교
- 웹훅에는 원화로 뜨게

2 버전 :: 미국 => 한국
- 크림 즉시구매가+3000원(원화 고정값)+ 변수(한국에서 미국가는 택배비 원화값 넣을수 있게)한거를 미국 StockX 즉시판매가*0.9한 가격이랑 비교
- 웹훅에는 달러값으로 뜨게
*/
const gettingInfoService = {
	stockXApi: async(param) => {
        try {
            var stockXData = {};
            var path = 'https://stockx.com/'+param.stockXProdId;

            await stockX.fetchProductDetails(path)
            .then(product =>{
                console.log("stockXApi::"+JSON.stringify(product));
                stockXData.stockXUrl=path;
                stockXData.name = product.name;
                stockXData.image = product.image;
                stockXData.pid = product.pid;
                stockXData.prdMap = {};
                for (let element of product.variants){
                    if(element.market.lowestAsk != null && element.market.lowestAsk > 0 ){
                        stockXData.prdMap[element.size]={
                            size : element.size,
                            lowestAsk : parseInt(Number(element.market.lowestAsk)), //구매가
                            highestBid : parseInt(Number(element.market.highestBid)), //판매가
                            lastSale : parseInt(Number(element.market.lastSale))
                            //lowestAsk : parseInt((Number(element.market.lowestAsk)*1.045)+20000),
                            //lastSale : parseInt((Number(element.market.lastSale)*1.045)+20000)
                        };
                    }
                }
            })
            console.log(stockXData);
            return stockXData;
        } catch (err) {
            logger.info(stockXData.name+" :stockXApi Error =>"+err);
            throw Error(err)
        }
	},
	kreamApi: async(param) => {
        try {
            var kreamData = {};
            var input_prod_id = param.kreamProdId
            let path = 'api/p/products/'+input_prod_id;
            
            let options = {
                method: 'GET',
                path : path,
                scheme : 'https',
                headers: {
                    "x-kream-api-version": "6",
                    "x-kream-device-id": "web;49c40756-3bab-4ad2-8b69-130cac43456a",
                    "authority" :"kream.co.kr",
                    "scheme" : "https",
                    "path" : "/api/p/products/"+input_prod_id,
                    "accept": "application/json, text/plain, */*",
                    "accept-encoding" : "gzip, deflate, br",
                    "referer" : "https://kream.co.kr/",
                    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                }
            };
            return kreamApi(path, options)
            .then(async result => {
                var product = JSON.parse(result.body);
                kreamData.kreamUrl = "https://kream.co.kr/products/"+input_prod_id;
                kreamData.name = product.release.name;
                kreamData.image = product.release.image_urls[0];
                kreamData.options = product.options;
                kreamData.prdMap = {};
                for (let element of product.sales_options){
                    if(element.highest_bid != null || element.lowest_ask != null){
                        //latestprc 서비스 호출
                        element.lastSale = await gettingInfoService.kreamLastSaleApi(input_prod_id,element.option);
                        kreamData.prdMap[(element.option).split('(')[0]]={
                            size : element.option,
                            highest_bid : (element.highest_bid != null) ? Number(element.highest_bid) : null, //   판매가
                            lowest_ask : (element.lowest_ask != null) ? Number(element.lowest_ask) : null, //   구매가
                            lastSale : (element.lastSale != null) ? Number(element.lastSale) : null,
                        };
                    }
                }
                //console.log(kreamData);
                return kreamData;
            })
            .catch(e => {
                logger.info(kreamData.name+" :kreamApi Error =>"+e);
                throw Error(e);
            });
        } catch (err) {
            logger.info(kreamData.name+" :kreamApi Error =>"+err);
            throw Error(err)
        }
	},
    kreamLastSaleApi: async (input_prod_id,size) => {
        try {
            let path = 'api/p/products/'+input_prod_id+'/'+size;
            let options = {
                method: 'GET',
                path : '/api/p/products/'+input_prod_id+'/'+size,
                scheme : 'https',
                headers: {
                    "x-kream-api-version": "6",
                    "x-kream-device-id": "web;49c40756-3bab-4ad2-8b69-130cac43456a",
                    "authority" :"kream.co.kr",
                    "scheme" : "https",
                    "path" : "/api/p/products/"+input_prod_id,
                    "accept": "application/json, text/plain, */*",
                    "accept-encoding" : "gzip, deflate, br",
                    "referer" : "https://kream.co.kr/",
                    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                }
            };
            return kreamApi(path, options)
            .then(result => {
                var product = JSON.parse(result.body);
                var latestPrc = product.market.last_sale_price;
                return latestPrc;
            })
            .catch(e => {
                logger.info("kreamLastPrcApi Error =>"+e);
                throw Error(e)
            });
        } catch (err) {
            logger.info("kreamLastPrcApi Error =>"+err);
            throw Error(err)
        }
	}
};
module.exports = gettingInfoService;