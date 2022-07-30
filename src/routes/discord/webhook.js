var express = require('express');
var router = express.Router();
const logger =  require('../../modules/logger');
const gettingInfoService = require('../../services/gettingInfo-service');
const sendingWebhookService = require('../../services/sendingWebhook-service');
const createTemplateService = require('../../services/createTemplate-service');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const scheduler = new ToadScheduler();
var processId = 0;
var processInfo = {};
/*
실행 : discord 메인화면
*/ 
router.get('/main', 
    async function(req, res, next) {
        res.render('discord/main',{"processInfo" : processInfo });
    }
);

/*
실행 : job 등록

 stockXProdId: 'adidas-yeezy-boost-700-magnet',
  kreamProdId: '21933',
  intervalUnit: 'once',
  interval: '0',
  deliveryFeeToUs: '0',
  deliveryFeeToKr: '0',
  exchange: '33'
*/
router.all('/registerJob',
    async function(req, res, next) {
        try{
            processId=processId+1;
            let today = new Date();
            let body=req.body;
            let info = {
                exchange : body.exchange ,
                deliveryFeeToUs: body.deliveryFeeToUs,
                deliveryFeeToKr: body.deliveryFeeToKr};
            console.log(req.body);
            var stockXData = await gettingInfoService.stockXApi(body);
            var kreamData = await gettingInfoService.kreamApi(body);
            await sendingWebhookService.processingMessage(stockXData,kreamData,body.exchange);
            await createTemplateService.procTemplate(stockXData,kreamData,info);
            //  성공하면...
            processInfo[processId]={
                processId : processId ,
                stockXProdId : body.stockXProdId ,
                kreamProdId : body.kreamProdId , 
                stockXUrl : "https://stockx.com/"+body.stockXProdId,
                kreamUrl : "https://kream.co.kr/products/"+body.kreamProdId,
                intervalUnit : body.intervalUnit,
                interval : body.interval,
                status : "running",
                lastSent: today.toLocaleString(),
                deliveryFeeToUs: body.deliveryFeeToUs,
                deliveryFeeToKr: body.deliveryFeeToKr,
                exchange:body.exchange
            }
            const task = new Task('simple task', async () => {
                try{
                var stockXData = await gettingInfoService.stockXApi(processInfo[processId]);
                var kreamData = await gettingInfoService.kreamApi(processInfo[processId]);
                var result = await sendingWebhookService.processingMessage(stockXData,kreamData,body.exchange);
                if(result){
                    processInfo[processId].status="running";
                    processInfo[processId].errLog="";
                    processInfo[processId].lastSent=new Date().toLocaleString();
                }
                else{
                    scheduler.stopById(processId);
                    processInfo[processId].status="stop";
                }
                console.log(processInfo[processId]);
                }
                catch(e){
                    processInfo[processId].status="error";
                    processInfo[processId].errLog=e.toString();
                    logger.info(processInfo[processId]+": batch Job Error =>"+e);
                }

            });
            if(body.intervalUnit == 'once'){
                processInfo[processId].status = "sent";
            }
            else{    
                const job1 = new SimpleIntervalJob(
                (body.intervalUnit=='days') ? { days : body.interval, runImmediately: false } : (body.intervalUnit=='hours') ? { hours : body.interval, runImmediately: false } : { minutes : body.interval, runImmediately: false },
                    task,
                    processId
                );
                scheduler.addSimpleIntervalJob(job1);
            }            
            res.send({"processInfo" : processInfo });
        }
        catch(err){
            logger.info("register Job Error =>"+err);
            next(err);
        }
    }
);

router.all('/updateProcess',
    async function(req, res, next) {
        try{
            let body=req.body;
            let processId=body.processId;
            if(body.updateType=='delete'){
                scheduler.removeById(processId);
                delete processInfo[processId];
            }
            else if(body.updateType=='stop'){
                scheduler.stopById(processId);
                processInfo[processId].status="stop";
            }
            else if(body.updateType=='start'){
                scheduler.startById(processId);
                processInfo[processId].status="running";
            }
            else if(body.updateType=='update'){
                let today = new Date();
                var stockXData = await gettingInfoService.stockXApi(body);
                var kreamData = await gettingInfoService.kreamApi(body);

                await sendingWebhookService.processingMessage(stockXData,kreamData,body.exchange);
                //  성공하면...
                scheduler.removeById(processId);
                processInfo[processId].stockXProdId = body.stockXProdId;
                processInfo[processId].kreamProdId = body.kreamProdId;
                processInfo[processId].stockXUrl = "https://stockx.com/"+body.stockXProdId;
                processInfo[processId].kreamUrl = "https://kream.co.kr/products/"+body.kreamProdId;
                processInfo[processId].intervalUnit = body.intervalUnit;
                processInfo[processId].interval = body.interval;
                processInfo[processId].status = "running";
                processInfo[processId].lastSent = today.toLocaleString();
                processInfo[processId].deliveryFeeToUs = body.deliveryFeeToUs,
                processInfo[processId].deliveryFeeToKr = body.deliveryFeeToKr,
                processInfo[processId].exchange = body.exchange

                const task = new Task('simple task', async () => {
                    try{
                        var stockXData = await gettingInfoService.stockXApi(processInfo[processId]);
                        var kreamData = await gettingInfoService.kreamApi(processInfo[processId]);
                        var result = await sendingWebhookService.processingMessage(stockXData,kreamData,body.exchange);
                        if(result){
                            processInfo[processId].status="running";
                            processInfo[processId].errLog="";
                            processInfo[processId].lastSent=new Date().toLocaleString();
                        }
                        else{
                            scheduler.stopById(processId);
                            processInfo[processId].status="stop";
                        }
                        }
                        catch(e){
                            processInfo[processId].status="error";
                            processInfo[processId].errLog=e.toString();
                            logger.info(processInfo[processId]+": batch Job Error =>"+e);
                        }
                });
                const job1 = new SimpleIntervalJob(
                    (body.intervalUnit=='days') ? { days : body.interval, runImmediately: false } : (body.intervalUnit=='hours') ? { hours : body.interval, runImmediately: false } : { minutes : body.interval, runImmediately: false },
                     task,
                     processId
                 );
                 scheduler.addSimpleIntervalJob(job1); 
                
            }            
            res.send({"processInfo" : processInfo });
        }
        catch(err){
            logger.info(req.body.processId+": update Job Error =>"+err);
            next(err);
        }
    }
);

router.get('/stopAllProcess',
    async function(req, res, next) {
        for (var key in processInfo) {
             scheduler.stopById(key);
             processInfo[key].status="stop";
        }
        res.send({"processInfo" : processInfo });
    }
);

router.get('/refreshTable',
    async function(req, res, next) {
        res.send({"processInfo" : processInfo });
    }
);

module.exports = router;

