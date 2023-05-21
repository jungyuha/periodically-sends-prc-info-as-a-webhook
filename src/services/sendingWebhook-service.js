const { Webhook, MessageBuilder } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/1001514709167636580/L9uI_asanUsEnuPrqMYnQ8DqsUmmfAqQOQEeznHKGlDcWWSAxmKD3C5xv9aY9HirGRjo");
hook.setUsername('Yuha');  
const gettingInfoService = require('../services/gettingInfo-service');
const createTemplateService = require('../services/createTemplate-service');
const logger =  require('../modules/logger');    

const sendingWebhookService = {

	processingMessage : async(stockXData,kreamData,msgTemplate) => {
            var embed = new MessageBuilder()
            .setTitle(stockXData.name)
            .setAuthor('Yuha', 'https://velog.velcdn.com/images/yooha9621/post/d1c8443f-1ed3-46c8-9c88-d0565b43cb83/image.png')
            .addField('[Kr => US]', '--------------------------------------------------------------')
            .setColor('#f40092')
            .setThumbnail(stockXData.image)
            .setDescription('stockX url : [stockX]('+stockXData.url+')\n'+'kream url : [kream]('+kreamData.url+')\n'
            +'환율 : '+msgTemplate.exchange+'원\n'+'us->kr 배송비 : '+msgTemplate.deliveryFeeToKr+'원\n'
            +'kr->us 배송비 : '+msgTemplate.deliveryFeeToUs+'원\n')
            .setFooter('Compare prc', 'https://velog.velcdn.com/images/yooha9621/post/d1c8443f-1ed3-46c8-9c88-d0565b43cb83/image.png')
            .setTimestamp();

            let sorted =Object.values(msgTemplate.msgInfoMap).sort((a,b)=>{
                if(a.kr_size>b.kr_size) {
                    return 1;
                }
                if(a.kr_size<b.kr_size) {
                    return -1;
                }
                return 0;
            });
            
            for(let key in sorted){
                if(sorted[key].krToUs_prc_diff > 0){
                    embed.addField(sorted[key].title,sorted[key].krToUs_msg);
                }
            }
            
            embed.addField('[US => KR]', '--------------------------------------------------------------');
            for(let key in sorted){
                if(sorted[key].usToKr_prc_diff > 0){
                    embed.addField(sorted[key].title,sorted[key].usToKr_msg);
                }
            }

            return embed;
	},
    sendWebhookMessage : async(processInfo) => {
        let today = new Date();
        var info = {
            exchange : processInfo.exchange ,
            deliveryFeeToUs: processInfo.deliveryFeeToUs,
            deliveryFeeToKr: processInfo.deliveryFeeToKr};

        var apiResult = {
            res : false,
            msg : ''
        };

        try{
            // stockX api 호출
            var stockXData = await gettingInfoService.stockXApi(processInfo);
            // kream api 호출
            var kreamData = await gettingInfoService.kreamApi(processInfo);
            // 웹훅 resource 생성 (이율 계산 및 결과값 객체화)
            var msgTemplate = await createTemplateService.procOriginVals(stockXData,kreamData,info); 
            console.log("3 :: "+msgTemplate);
            // 웹훅 message 생성
            var finalMsg = await sendingWebhookService.processingMessage(stockXData,kreamData,msgTemplate);
            console.log("4 :: "+finalMsg);
            
            processInfo.lastSent = today.toLocaleString();
        }
        catch(e){
            processInfo.status="error";
            processInfo.errLog=e.toString();
            logger.info(processInfo+": batch Job Error =>"+e);
        }

        await hook.send(finalMsg)
        .then(res =>{
            apiResult.res=true;
        })
        .catch(err=>{
            console.log(stockXData.name+" :webhook Sending Error =>"+err);
            apiResult.res=false;
            apiResult.msg="webhook send fail";
        });
        return apiResult;
    }

};

module.exports = sendingWebhookService;

