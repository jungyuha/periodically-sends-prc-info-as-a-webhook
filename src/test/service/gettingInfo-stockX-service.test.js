const StockXAPI = require('stockx-api');
const stockX = new StockXAPI({currency: 'KRW'});
const prodObj = require('../../vo/prodObj');
const prcInfo_ = require('../../vo/prcInfo');
const apiResult_ = require('../../vo/apiResult');

async function stockXApiTest(stockXProdId) {
    var path = 'https://stockx.com/'+stockXProdId;
    var stockXData = new prodObj(); 
    var apiResult = new apiResult_();           
    try {           
        await stockX.fetchProductDetails(path)
        .then(product =>{
            apiResult.res = true;
            stockXData.apiResult = apiResult;
            stockXData.url=path;
            stockXData.name = product.name;
            stockXData.image = product.image;
            stockXData.prdMap = {};
            for (let element of product.variants){
                if(element.market.lowestAsk != null && element.market.lowestAsk > 0 ){
                    var prcInfo = new prcInfo_();
                    prcInfo.size = element.size;
                    prcInfo.lowestAsk =(element.market.lowestAsk != null) ? Number(element.market.lowestAsk) : null ;
                    prcInfo.highestBid = (element.market.highestBid != null) ? Number(element.market.highestBid) : null ;
                    prcInfo.lastSale = (element.market.lastSale != null) ? Number(element.market.lastSale) : null ;
                    stockXData.prdMap[element.size]= prcInfo;
                }
            }
        })
    } catch (err) {
        apiResult.res = false;
        apiResult.msg = "stockXApi Error =>"+err;
        stockXData.apiResult = apiResult;                       
    }
    console.log(stockXData);
    return stockXData;
}

describe("stockXApiTest",  () => {
    test("stockXApiTest", async () => {
      try {
        await stockXApiTest ('adidas-yeezy-boost-700-magnet')
        .then(result => {
            var res = JSON.parse(result);
            console.log(result);
            return res;
        })
        .catch(e => {
            console.log(" stockXApiTest Error =>"+toString(e));
        });
    } catch (err) {
        console.log(" stockXApiTest Error =>"+toString(err));
    }
      });
  });