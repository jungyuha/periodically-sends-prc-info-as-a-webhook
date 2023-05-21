const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const processInfo_ = require('../vo/processInfo');
const sendingWebhookService = require('../services/sendingWebhook-service');
const scheduler = new ToadScheduler();
var processId = 0;
var processInfoMap= {};

const processInfoService = {
	newProcess: (body) => {
        const processInfo = new processInfo_();

        processId=processId+1;
        let today = new Date();
        processInfo.processId = processId ;
        processInfo.stockXProdId = body.stockXProdId ;
        processInfo.kreamProdId = body.kreamProdId ; 
        processInfo.stockXUrl = "https://stockx.com/"+body.stockXProdId;
        processInfo.kreamUrl = "https://kream.co.kr/products/"+body.kreamProdId;
        processInfo.intervalUnit = body.intervalUnit;
        processInfo.interval = body.interval;
        processInfo.lastModified = today.toLocaleString();
        processInfo.exchange = body.exchange ;
        processInfo.deliveryFeeToUs = body.deliveryFeeToUs;
        processInfo.deliveryFeeToKr = body.deliveryFeeToKr;       
        if(body.intervalUnit == 'once'){
            processInfo.status = "once";
        }
        else{
            processInfo.status = "running";
        }
        
        processInfoMap[processId]= processInfo;
        console.log(processInfo);

        return processInfo;
	},
    updateProcess: async (body) => {
        let today = new Date();
        let newJobYn = false;
        let processId_ = body.processId;
        if (processId_ in processInfoMap){        
            //intervalUnit 변경 여부
            if(body.intervalUnit != 'once' && (body.intervalUnit != processInfoMap[processId_].intervalUnit)){
                newJobYn = true;
            }
            processInfoMap[processId_].stockXProdId = body.stockXProdId;
            processInfoMap[processId_].kreamProdId = body.kreamProdId;
            processInfoMap[processId_].stockXUrl = "https://stockx.com/"+body.stockXProdId;
            processInfoMap[processId_].kreamUrl = "https://kream.co.kr/products/"+body.kreamProdId;
            processInfoMap[processId_].intervalUnit = body.intervalUnit;
            processInfoMap[processId_].interval = body.interval;
            processInfoMap[processId_].lastModified = today.toLocaleString();
            processInfoMap[processId_].deliveryFeeToUs = body.deliveryFeeToUs,
            processInfoMap[processId_].deliveryFeeToKr = body.deliveryFeeToKr,
            processInfoMap[processId_].exchange = body.exchange
            if(body.intervalUnit == 'once'){
                processInfoMap[processId_].status = "once";
            }
            else{
                processInfoMap[processId_].status = "running";
            }

            if(newJobYn){
                scheduler.removeById(processId_);
                await processInfoService.newJob(processInfoMap[processId_]);
            }
        }
        
        return processInfoMap[processId_];
	},
    newJob: async (processInfo) => {
        var task = await processInfoService.newTask(processInfo.processId);
        const job = new SimpleIntervalJob(
            (processInfo.intervalUnit=='days') ? { days : processInfo.interval, runImmediately: false } : (processInfo.intervalUnit=='hours') ? { hours : processInfo.interval, runImmediately: false } : { minutes : processInfo.interval, runImmediately: false },
                task,
                processInfo.processId
            );
        scheduler.addSimpleIntervalJob(job);
    },
    deleteJob: async (processId) => {
        if(processInfoMap[processId].intervalUnit != 'once'){
            scheduler.removeById(processId);
        }
        delete processInfoMap[processId];
    },
    stopJob: async (processId) => {
        if(processInfoMap[processId].intervalUnit != 'once'){
            scheduler.stopById(processId);
            processInfoMap[processId].status="stop";
        }
    },
    stopAllJob: async () => {
        for (var key in processInfoMap) {
            if(processInfoMap[key].intervalUnit != 'once'){
                scheduler.stopById(key);
                processInfoMap[key].status="stop";
            }
       }
    },
    startJob: async (processId) => {
        if(processInfoMap[processId].intervalUnit != 'once'){
            scheduler.startById(processId);
            processInfoMap[processId].status="running";
        }
    },
    getProcessInfo : (processId) => {
        return processInfoMap[processId];
    },
    getProcessInfoMap : () => {
        return processInfoMap;
    },
    newTask: async(processId) => {
        const task = new Task('simple task', async () => {
            await sendingWebhookService.sendWebhookMessage(processInfoMap[processId]);
         });
            return task;
	}
};
module.exports = processInfoService;
