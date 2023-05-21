const stockxApi = require('../../lib/stockx');
const prodObj = require('../../vo/prodObj');
const prcInfo_ = require('../../vo/prcInfo');
const apiResult_ = require('../../vo/apiResult');

async function stockxApiTest(prodId) {
    console.log("1");
    var kreamData = new prodObj(); 
    var apiResult = new apiResult_();   
    let path = 'api/products/'+prodId+'?includes=market&currency=KRW&country=US';         
    let options = {
        method: 'GET',
        path : path,
        scheme : 'https',
        headers: {
        "authority": "stockx.com",
            "method" : "GET",
            "path": "/api/products/adidas-yeezy-boost-700-magnet?includes=market&currency=KRW&country=US",
            "Content-Type" : "application/x-www-form-urlencoded",
            "scheme": "https",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "if-none-match": "W/\"sgbv7fbl1l5taw\"",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
            "cookie":"_pxvid=508a8a65-f590-11ed-8726-766f73585977; __pxvid=50a82217-f590-11ed-980d-0242ac120004; "
        }
    };
    return stockxApi(path, options)
    .then(async result => {
        //var product = JSON.parse(result.body);
        apiResult._res = true;
        //console.log(result);
        return result;
    })
    .catch(e => {
        apiResult.res = false;
        apiResult.msg = "stockxApi Error =>"+e.toString();
        kreamData.apiResult = apiResult;

        return kreamData;
    });
}

describe("stockxApiTest",  () => {
    test("stockxApiTest", async () => {
      try {
        await stockxApiTest ('adidas-yeezy-boost-700-magnet')
        .then(result => {
            //var res = JSON.parse(result);
            console.log(result);
            return result;
        })
        .catch(e => {
            console.log(" stockxApiTest Error =>"+e.toString());
        });
    } catch (err) {
        console.log(" stockxApiTest Error =>"+err.toString());
    }
      });
  });