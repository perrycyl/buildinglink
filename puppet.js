const puppeteer = require('puppeteer');

var PuppetBrowser = {    
    browserWSEndpoint: undefined,
    ready: false,
    create: function() {
        return new Promise(async(res, rej) => {
            try{
                this.ready = false;
                let browser = await puppeteer.launch({
                    headless:false,
                    slowMo: 100,
                    args: ['--single-process','--no-zygote', '--no-sandbox']
                });
                this.browserWSEndpoint = await browser.wsEndpoint();
                this.ready = true;
                res('done!');
            }catch(e){
                rej(`Brower failed to launch: ${e}`);
            }
        })
    },
};

module.exports = {
    PuppetBrowser
}