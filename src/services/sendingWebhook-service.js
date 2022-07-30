const { Webhook, MessageBuilder } = require('discord-webhook-node');
const logger =  require('../modules/logger');
//https://discordapp.com/api/webhooks/797639847309213706/nTgGce1csWdzq4kH912JMD5T99KJVNfqKik8zJ48qPPd924ThOOPGj65ZH1FWbE_V4RT
//https://discordapp.com/api/webhooks/797639331011231744/GN1RSE99hoWUw4ga9PdJi2XuQp9ZvNyi-jajXfQtKdA5e7G1lxIvDFfIyEZQQV85E3kD
const hook = new Webhook("https://discord.com/api/webhooks/1001514709167636580/L9uI_asanUsEnuPrqMYnQ8DqsUmmfAqQOQEeznHKGlDcWWSAxmKD3C5xv9aY9HirGRjo");
hook.setUsername('Yuha');

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

const sendingWebhookService = {

	processingMessage : async(stockXData,kreamData,exchange) => {
        try {
            console.log(exchange);
            var embed = new MessageBuilder()
            .setTitle(stockXData.name)
            .setAuthor('Yuha', 'https://cdn.discordapp.com/embed/avatars/0.png')
            .addField('Desc.', 'stockX Prc(stockX latest Prc) | kream Prc(kream latest Prc) | kream Prc - stockX Prc | roi(latest roi)')
            .setColor('#f40092')
            .setThumbnail(stockXData.image)
            .setDescription('stockX url : [stockX]('+stockXData.stockXUrl+')\nkream url : [kream]('+kreamData.kreamUrl+')')
            .setFooter('Compare prc', 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setTimestamp();
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
            var tempEmbeds={};
            for(const [ key, value ] of Object.entries(stockXData.prdMap)){
                if(kreamData.prdMap[sizeMap[key]]!=null){
                    if(kreamData.prdMap[sizeMap[key]].highest_bid > 0 && value.lowestAsk > 0 && Number(kreamData.prdMap[sizeMap[key]].highest_bid) - Number(value.lowestAsk) > 0 ){
                        let data = "₩"+sendingWebhookService.moneyComma(value.lowestAsk)+ "\n("
                        + ((value.lastSale != null ) ? "₩"+sendingWebhookService.moneyComma(value.lastSale) : "NULL")+ ")"
                        + " | " + "₩"+sendingWebhookService.moneyComma(kreamData.prdMap[sizeMap[key]].highest_bid)
                        + "(" +((kreamData.prdMap[sizeMap[key]].lastSale != null )? "₩"+sendingWebhookService.moneyComma(kreamData.prdMap[sizeMap[key]].lastSale) : "NULL")+ ")"
                        + " | " + "₩"+sendingWebhookService.moneyComma(Number(kreamData.prdMap[sizeMap[key]].highest_bid) - Number(value.lowestAsk))
                        + " | " + parseInt(((Number(kreamData.prdMap[sizeMap[key]].highest_bid) - Number(value.lowestAsk))/kreamData.prdMap[sizeMap[key]].highest_bid)*100)+"%"
                        + "(" +((kreamData.prdMap[sizeMap[key]].lastSale != null )? (parseInt(((Number(kreamData.prdMap[sizeMap[key]].lastSale) - Number(value.lastSale))/kreamData.prdMap[sizeMap[key]].lastSale)*100)+"%") : "NULL") +")";
                        tempEmbeds[kreamData.prdMap[sizeMap[key]].size]={title:'US '+value.size+' , '+kreamData.prdMap[sizeMap[key]].size,data:data};
                        //embed.addField('US '+value.size+' , '+kreamData.prdMap[sizeMap[key]].size,data);
                    }
                }
            }
            for(const [ key, value ]  of Object.entries(Object.keys(tempEmbeds).sort().reduce((r, k) => (r[k] = tempEmbeds[k], r), {}))){
                    embed.addField(value.title,value.data);
            }
            hook.send(embed);
            return true;
        } catch (err) {
            logger.info(stockXData.name+" :webhook Sending Error =>"+err);
            throw Error(err);
        }
	},
    moneyComma : (money) => {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    moneyDollar : (money,exchange) => {
        return parseInt(money/exchange).toString();
    }

};

module.exports = sendingWebhookService;

