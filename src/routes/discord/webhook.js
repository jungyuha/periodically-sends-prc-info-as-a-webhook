var express = require('express');
var router = express.Router();
const logger =  require('../../modules/logger');
const processInfoService = require('../../services/processInfo-service');
const sendingWebhookService = require('../../services/sendingWebhook-service');
/*
실행 : discord 메인화면
*/ 
router.get('/main', 
    async function(req, res, next) {
        res.render('discord/main',{"processInfo" : processInfoService.getProcessInfoMap() });
    }
);
/*
실행 : message 보내기
*/
router.all('/sendWebhook',
    async function(req, res, next) {
        try{
            let body=req.body;
            let processId=body.processId;
            let processInfo = processInfoService.getProcessInfo(processId);
            await sendingWebhookService.sendWebhookMessage(processInfo);
            res.send({"processInfo" : processInfoService.getProcessInfoMap() });
        }
        catch(err){
            logger.info("send webhook Error =>"+err);
            next(err);
        }
    }
);
/*
실행 : job 등록
*/
router.all('/registerJob',
    async function(req, res, next) {
        try{
            let body=req.body;
            // 프로세스 생성
            var processInfo = processInfoService.newProcess(body);
            // 배치 생성
            if(body.intervalUnit != 'once'){
                await processInfoService.newJob(processInfo);
            }
            //else if(body.intervalUnit == 'once'){
            await sendingWebhookService.sendWebhookMessage(processInfo);;
            //}
            res.send({"processInfo" : processInfoService.getProcessInfoMap() });
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
                processInfoService.deleteJob(processId);
            }
            else if(body.updateType=='stop'){
                processInfoService.stopJob(processId);
            }
            else if(body.updateType=='start'){
                processInfoService.startJob(processId);
            }
            else if(body.updateType=='update'){
                await processInfoService.updateProcess(body);
            }            
            res.send({"processInfo" : processInfoService.getProcessInfoMap() });
        }
        catch(err){
            logger.info(req.body.processId+": update Job Error =>"+err);
            next(err);
        }
    }
);

router.get('/stopAllProcess',
    async function(req, res, next) {
        await processInfoService.stopAllJob();
        res.send({"processInfo" : processInfoService.getProcessInfoMap() });
    }
);

router.get('/refreshTable',
    async function(req, res, next) {
        res.send({"processInfo" : processInfoService.getProcessInfoMap() });
    }
);

module.exports = router;

