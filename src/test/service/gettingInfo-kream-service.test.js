const kreamApi = require('../../lib/kream');
const prodObj = require('../../vo/prodObj');
const prcInfo_ = require('../../vo/prcInfo');
const apiResult_ = require('../../vo/apiResult');

async function kreamApiTest(kreamProdId) {
    console.log("1");
    var kreamData = new prodObj(); 
    var apiResult = new apiResult_();   
    //  /api/app/pages/0401_notice.html   "path" : "/api/p/products/"+kreamProdId,     "path" : "/api/app/pages/0401_notice",
    let path = 'api/p/products/'+kreamProdId;  
    //let path = 'api/app/pages/0401_notice ';
    let options = {
        method: 'GET',
        path : path,
        scheme : 'https',
        headers: {
            "x-kream-api-version": "18",
            "x-kream-device-id": "web;f3aba727-d1de-4a98-b520-758069ef98b1",
            "x-kream-client-datetime": "20230521150611+0900",
            "authority" :"kream.co.kr",
            "scheme" : "https",
            "path" : "/api/p/products/"+kreamProdId,
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
        console.log("12222222222"+product);
        apiResult._res = true;
        kreamData.apiResult = apiResult;
        kreamData.url = "https://kream.co.kr/products/"+kreamProdId;
        kreamData.name = product.release.name;
        kreamData.image = product.release.image_urls[0];
        kreamData.options = product.options;
        kreamData.prdMap = {};
        for (let element of product.sales_options){
            var prcInfo = new prcInfo_();
            if(element.highest_bid != null || element.lowest_ask != null){
                //latestprc 서비스 호출
                element.lastSale = await kreamLastSaleApi(kreamProdId,element.option);
                prcInfo.size = element.option;
                prcInfo.highestBid = (element.highest_bid != null) ? Number(element.highest_bid) : null ; //   판매가
                prcInfo.lowestAsk = (element.lowest_ask != null) ? Number(element.lowest_ask) : null ; //   구매가
                prcInfo.lastSale = (element.lastSale != null) ? Number(element.lastSale) : null ;                        
                kreamData.prdMap[(element.option).split('(')[0]]= prcInfo;
            }
        }
        console.log(kreamData);
        return kreamData;
    })
    .catch(e => {
        apiResult.res = false;
        apiResult.msg = "kreamApi Error =>"+e;
        kreamData.apiResult = apiResult;

        return kreamData;
    });
}

async function kreamLastSaleApi (input_prod_id,size) {
    let path = 'api/p/products/'+input_prod_id+'/'+size;
    let options = {
        method: 'GET',
        path : '/api/p/products/'+input_prod_id+'/'+size,
        scheme : 'https',
        headers: {
            "x-kream-api-version": "18",
            "x-kream-device-id": "web;f3aba727-d1de-4a98-b520-758069ef98b1",
            "x-kream-client-datetime": "20230521150611+0900",
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
            console.log("kreamLastPrcApi Error =>"+e);
            return null;
        });
}

describe("kreamApiTest",  () => {
    test("kreamApiTest", async () => {
      try {
        await kreamApiTest ('21933')
        .then(result => {
            //var res = JSON.parse(result);
            var res="";
            console.log(result);
            return res;
        })
        .catch(e => {
            console.log(" kreamApiTest Error =>"+e.toString());
        });
    } catch (err) {
        console.log(" kreamApiTest Error =>"+err.toString());
    }
      });
  });