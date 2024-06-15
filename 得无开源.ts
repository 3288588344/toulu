/**
 * cron 10 11 * * *
 * 依赖 crypto-js & jsencrypt 
 * 得物APP 探索中的玩一玩 所有游戏的入口都在那里  请跑任务之前手动玩一次
 * --------------------------------------------------
 * 变量名:dewuCK
 * 变量值:抓app.dewu.com   请求头Headers中的x-auth-token  去掉Bearer # 连接cookie中dutoken得值 可以直接搜dutoken  # 连接SK
 * 三个值 x-auth-token的值去掉Bearer#dutoken的值#SK的值
 * UA的变量名UAdefult_dewu
 * export UAdefult_dewu="Mozilla/5.0 (.....UA"
 * 例如ejxxxxx...#d41d8cd9|16...2233|17...|4sasasasa...#9xxxxxxxx
 * 多账号& 或换行 或新建同名变量
 * -------------------------------------------------
 * --------------------------------------------------
 * new Env("得物")
 */

let ckName = "dewuCK";//CK变量名字


const version = "testV1"
const isPromiseAll = process.env["isPromiseAll"] ? process.env["isPromiseAll"] : "true";//是否开启并发
let UAdefult = "Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.99 Mobile Safari/537.36/duapp/5.39.1(android;10)"
let UA = process.env["UAdefult_dewu"] ? process.env["UAdefult_dewu"] : UAdefult
let SK = process.env["SKdefult_dewu"] ? process.env["SKdefult_dewu"] : ""

const $ = new Env("得物农场");
const notify = $.isNode() ? require('./sendNotify') : '';
let envSplitor = ["&", "\n"]; //多账号分隔符
let strSplitor = "#"; //多变量分隔符
let userIdx = 0;
let userList = [];
let authShareCodeList = []
let stationShareCodesList = []
let zeroLotteryShareCodesModeGetList = []
let helpCode = ""
const CryptoJS = require("crypto-js");
async function main() {
    $.log(`并发状态:${isPromiseAll == "true" ? "[true]" : "[false]"}`)
    let { body: shareCode } = await $.httpRequest({ timeout: 10000, method: "get", url: "https://gitee.com/smallfawn/Note/raw/main/updateTeam/dwnc.json", headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/duapp/5.38.6" } })
    $.log(`当前版本:${version} 最新版本${shareCode.v}`)
    if (version != shareCode.v) {
        $.log(`当前版本和最新版本不一致`)
        return
    }
    $.log(`[${shareCode.notice}]`);
    authShareCodeList = shareCode.treeShareCodesList
    stationShareCodesList = shareCode.stationShareCodesList
    zeroLotteryShareCodesModeGetList = shareCode.zeroLotteryShareCodesModeGetList
    let taskall = [];
    $.log(`======= 🌳初始化邀请码 =======`)
    for (let user in userList) {
        if (userList[user].ckStatus) {
            //如果user处于数组第一 那么则await 否则则promiseAll
            if (user == 0) {
                await userList[0].UserInit();
            } else {
                if (isPromiseAll == "true") {
                    taskall.push(userList[user].UserInit());
                } else {
                    taskall.push(await userList[user].UserInit());
                }
            }
        }
    }
    await Promise.all(taskall);
    $.log(`======= 🌳果园 =======`)
    for (let user of userList) {
        if (user.ckStatus) {
            if (isPromiseAll == "true") {
                taskall.push(user.tree());
            } else { taskall.push(await user.tree()); }
        }
    }
    await Promise.all(taskall);
    taskall = [];
    $.log(`======= 🐟鱼厂 =======`)

    for (let user of userList) {
        if (user.ckStatus) {
            if (isPromiseAll == "true") {
                taskall.push(user.fish());
            } else {
                taskall.push(await user.fish());
            }
        }
    }
    await Promise.all(taskall);
    taskall = [];
    $.log(`======= 上上签💴 =======`)
    for (let user of userList) {
        if (user.ckStatus) {
            if (isPromiseAll == "true") {
                taskall.push(user.station());
            } else {
                taskall.push(await user.station());
            }

        }
    }
    await Promise.all(taskall);
    taskall = [];
    $.log(`======= 0元抽💴 =======`)
    for (let user of userList) {
        if (user.ckStatus) {
            if (isPromiseAll == "true") {
                taskall.push(user.zeroLottery());
            } else {
                taskall.push(await user.zeroLottery());
            }
        }
    }
    await Promise.all(taskall);
    taskall = [];
    $.log(`=======  抽盲盒  =======`)
    for (let user of userList) {
        if (user.ckStatus) {
            if (isPromiseAll == "true") {
                taskall.push(user.buZhou());
            } else {
                taskall.push(await user.buZhou());
            }
        }
    }
    await Promise.all(taskall);
    $.log(`======= 潮金币 =======`)
    taskall = [];
    for (let user of userList) {
        if (user.ckStatus) {
            if (isPromiseAll == "true") {
                taskall.push(user.point());
            } else {
                taskall.push(await user.point());

            }
        }
    }
    await Promise.all(taskall);

}
class Task {
    constructor(str) {
        this.index = ++userIdx;
        this.ck = str.split(strSplitor)[0]; //单账号多变量分隔符
        this.ckStatus = true;
        this.taskListTree = []
        this.doWaterStatus = true
        this.taskListFish = []
        this.fishFeedStatus = true
        this.fishId = ""
        this.fishType = ""
        this.stationList = [];
        this.duToken = str.split(strSplitor)[1];
        this.sk = str.split(strSplitor)[2];
        this.prizeLocations = []
        this.BuZhouRefreshStatus = false
        this.chanceCount = 0
        this.waitPrizeLocations = []
        this.ua = UA
        //this.sk = SK
    }
    async tree() {
        await this.Dowater()
        await $.wait(2500)
        await this.TreeInviteReward()
        await $.wait(1500)
        await this.Get_Tree_Info()
        await $.wait(1500)
        await this.TreeInfo()
        await $.wait(1500)
        await this.SignListTree()
        await $.wait(1500)
        await this.TaskListTree();
        await $.wait(1500)
        await this.Droplet_Get_Generate_Droplet()
        await $.wait(1500)
        await this.Droplet_ExtraInfo()
    }
    async fish() {
        await this.SignListFish()
        await $.wait(2500)
        await this.TaskListFish()
        await $.wait(2500)
        await this.UserFinshInfo()




    }
    async station() {
        for (let i of stationShareCodesList) {
            await $.wait(1500)
            let shareKey = await this.ShareCodesGet(i)
            if (shareKey != '') {
                let id = shareKey.split("id=")[1].split("&")[0]
                let userId = shareKey.split("shareUserId=")[1].split("&")[0]
                let status = await this.StationAssist(id, userId)
                if (status) {
                    break;
                }
            } else {
            }

        }
        await this.StationList()
        for (let j of this.stationList) {
            await $.wait(2000)
            await this.StationEgnageIn(j.id)
        }

    }
    async zeroLottery() {
        await this.zeroLotteryWinList()
        await this.zeroLotteryList()
        for (let j of zeroLotteryShareCodesModeGetList) {
            await $.wait(1500)
            let shareKey = await this.ShareCodesGet(j)
            if (shareKey != '') {
                shareKey = decodeURIComponent(shareKey.split("shareKey=")[1].split("&")[0])
                let status = await this.zeroLotteryShare(shareKey)
                if (status) {
                    break;
                }
            } else {
            }
        }

    }
    async buZhou() {
        await this.BuZhouTaskList()
        await $.wait(2000)
        await this.BuZhouInfo()
        await $.wait(2000)
        await this.BuZhouInfo()
    }
    async point() {
        await this.PonitSignIn()
        await this.PointTaskList()
    }
    async DoTask(body) {
        try {
            let taskStatusResult = {};
            let commitBody = {};
            let preStatus = false
            if (body.taskType == 50) {
                taskStatusResult = await this.taskRequest_task("get", `https://app.dewu.com/hacking-task/v1/task/status?taskId=${body.taskId}&taskType=50&sign=94fd23c93d62ae0f75108f94c093b198`)
                if (taskStatusResult.code == 200) {
                    if (taskStatusResult.data.status == 1) {
                        //$.log(`账号[${this.index}] 开始任务成功🎉`)
                        commitBody = { "taskId": body.taskId, "taskType": String(body.taskType), "btd": 0, spuId: 0 }
                        preStatus = true
                    }
                }
            }
            if (body.taskType == 1) {
                if ("classify" in body) {
                    if (body.classify == 2) {
                        taskStatusResult = await this.taskRequest_task("post", `https://app.dewu.com/hacking-task/v1/task/pre_commit?sign=b7382f4d908e04356f9646688afe096c`, { taskId: body.taskId, taskType: body.taskType, btn: 0 })
                        //console.log(taskStatusResult);
                        if (taskStatusResult.code == 200) {
                            if (taskStatusResult.data.isOk == true) {
                                //$.log(`账号[${this.index}] 开始任务成功🎉`)
                                $.log(`延迟${body.countdownTime + 1}秒浏览${body.taskName}`)
                                await $.wait((body.countdownTime + 1) * 1000)
                                commitBody = { "taskId": body.taskId, "taskType": String(body.taskType), "activityType": null, "activityId": null, "taskSetId": null, "venueCode": null, "venueUnitStyle": null, "taskScene": null, "btd": 0 }
                                preStatus = true
                            }
                        } else {
                            $.log(`❌账号[${this.index}] 开始任务失败[${taskStatusResult.msg}]`);
                        }
                    }
                } else {
                    /*taskStatusResult = await this.taskRequest_task("post", `https://app.dewu.com/hacking-task/v1/task/pre_commit?sign=b7382f4d908e04356f9646688afe096c`, { taskId: body.taskId, taskType: body.taskType, btn: 0 })
                    if (taskStatusResult.code == 200) {
                        if (taskStatusResult.data.isOk == true) {
                            //$.log(`账号[${this.index}] 开始任务成功🎉`)
                            await $.wait(16000)
                            commitBody = { "taskId": body.taskId, "taskType": body.taskType, "activityType": null, "activityId": null, "taskSetId": null, "venueCode": null, "venueUnitStyle": null, "taskScene": null, "btd": 0 }
                            preStatus = true
                        }
                    } else {
                        $.log(`❌账号[${this.index}] 开始任务失败[${taskStatusResult.msg}]`);
                    }*/
                }


            }
            if (body.taskType == 123 || body.taskType == 124) {
                commitBody = { "taskType": String(body.taskType) }
                preStatus = true
            }
            //console.log(taskStatusResult)
            if (preStatus == true) {
                let commitResult = await this.taskRequest_task("post", `https://app.dewu.com/hacking-task/v1/task/commit?sign=826988b593cd8cd75162b6d3b7dade15`, commitBody)
                //console.log(commitResult)
                if (commitResult.code == 200) {
                    if (commitResult.data.status == 2) {
                        $.log(`账号[${this.index}] [${body.taskName}]任务成功🎉`)
                        return true
                    } else {
                        $.log(`账号[${this.index}] [${body.taskName}]任务失败🎉`)
                    }
                } else {
                    $.log(`账号[${this.index}] [${body.taskName}]任务失败🎉`)
                }
            } else {
                return false
            }
        } catch (e) {
            console.log(e);
        }

    }
    async StationAssist(id, shareUserId) {
        let body = { "id": id, "shareUserId": shareUserId }
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/api/v1/h5/delicate-sell-interfaces/dsell/station/assist?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                //$.log(`账号[${this.index}] 助力参与作者组队上上签成功🎉`)
                return true
            } else {
                //$.log(`❌账号[${this.index}] 助力参与作者组队上上签失败[${result.msg}]`);
                return false
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async zeroLotteryEgnageIn(id) {
        let body = { "id": id, "source": "wotab" }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/hacking-zero-lottery/v1/activity/engage-in?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 0元抽签参与成功[${result.data.title}]🎉`)
            } else {
                $.log(`❌账号[${this.index}] 0元抽签0参与失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async ShareCodesGet(key) {
        try {
            let result = await this.taskRequest_task("get", `https://app.dewu.com/hacking-keyword/v1/common/keyword/share-info?keyword=${key}`)
            if (result.code == 200) {
                if (result.data !== null) {

                    return result.data.activityInfo.enterUrl



                } else {
                    return ''
                }
            } else {

                $.log(`❌账号[${this.index}] 助力参与0元购失败[${result.msg}]🎉`)
                return ''
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async zeroLotteryShare(key) {

        let body = { "shareKey": key }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/hacking-zero-lottery/v1/activity/report-keyword?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                //$.log(`账号[${this.index}] 助力参与0元购成功🎉`)
                return true
            } else {
                //$.log(`❌账号[${this.index}] 助力参与0元购失败[${result.msg}]🎉`)
                return false
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async zeroLotteryWinList() {
        let body = { "limit": 10, "lastId": 0 }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/hacking-zero-lottery/v1/activity/engage-in-list`, body)
            if (result.code == 200) {
                if (result.data?.list) {
                    for (let i of result.data.list) {
                        // ...
                        if (i.win == true) {
                            $.log(`账号[${this.index}] 恭喜中签[${i.name}]🎉🎉🎉🎉🎉🎉🎉🎉`)
                        }
                    }
                }


            } else {
                $.log(`❌账号[${this.index}] 获取0元购列表失败[${result.msg}]🎉`)
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async zeroLotteryList() {
        let body = { "source": "wotab" }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/api/v1/h5/zero-lottery-interfaces/zl/activity/query-today?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                for (let i of result.data.activityList) {
                    let taskStatus = false
                    if (i.status == 0) {
                        if ("taskVo" in i) {
                            await this.DoTask(i.taskVo)

                        } else {
                            await this.zeroLotteryEgnageIn(i.id)
                        }
                    }
                }
            } else {
                $.log(`❌账号[${this.index}] 获取0元购列表失败[${result.msg}]🎉`)
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async StationEgnageIn(id) {
        let body = { "id": id }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/api/v1/h5/delicate-sell-interfaces/dsell/station/egnage-in?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 参与上上签成功🎉`)
            } else {
                $.log(`❌账号[${this.index}] 参与上上签失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async StationList() {
        let body = { "student": false, "source": "" }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/api/v1/h5/delicate-sell-interfaces/dsell/query/ongoing-list?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                for (let i of result.data.records) {
                    if (i.userPartakeStatus == 10) {
                        this.stationList.push(i)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}] 获取上上签列表失败[${result.msg}]🎉`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async BuZhouInfo() {
        let body = { "benefitId": 1, "additionPresent": 0, "source": "gamecentertask" }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/api/v1/h5/mount-buzhou-interfaces/gk/index?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                //console.log(result.data);
                $.log(`账号[${this.index}] 盲盒赛季[${result.data.seasonName}] 当前抽奖机会[${result.data.chanceCount}] 🎉`)
                if ("prizeLocations" in result.data) {
                    $.log(`已开盲盒位置[${result.data.prizeLocations}]`)
                    this.prizeLocations = result.data.prizeLocations
                } else {
                    this.prizeLocations = []
                }
                this.chanceCount = result.data.chanceCount
                //console.log(result.data.hasDraw);
                if (this.chanceCount != 0) {
                    this.waitPrizeLocations = this.findMissingNumbers(this.prizeLocations)
                    //加一个条件 如果waitPriz...... 小于 chence 则 刷新
                    if (this.waitPrizeLocations.length == 0 && this.chanceCount > 0) {
                        await $.wait(2500)
                        await this.BuZhouRefresh(result.data.seasonId)
                    }
                    this.waitPrizeLocations = this.findMissingNumbers(this.prizeLocations)
                    //如果长度大于等于chence  则不刷新

                    let max = this.waitPrizeLocations.length >= this.chanceCount ? this.chanceCount : this.waitPrizeLocations.length
                    for (let i = 0; i < max; i++) {
                        let prizeLocation = this.waitPrizeLocations[i]
                        $.log("开始第" + (i + 1) + "次抽奖")
                        await $.wait(2500)
                        await this.BuZhouLottery(result.data.seasonId, prizeLocation)
                    }
                    await $.wait(2500)
                    await this.BuZhouRefresh(result.data.seasonId)
                }




            } else {
                $.log(`❌账号[${this.index}] 盲盒获取失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async BuZhouLottery(seasonId, prizeLocation) {
        let body = { "benefitId": 1, "seasonId": seasonId, "prizeLocation": prizeLocation, "source": "gamecentertask" }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/api/v1/h5/mount-buzhou-interfaces/gk/lottery?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 盲盒抽取[${result.data.gkLotteryVo.gkName}]碎片`);
            } else {
                $.log(`❌账号[${this.index}] 盲盒抽取失败[${result.msg}]`);
                //console.log(seasonId, prizeLocation);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async BuZhouRefresh(seasonId) {
        let body = { "seasonId": seasonId }
        try {
            let result = await this.taskRequest_task("post", `https://app.dewu.com/api/v1/h5/mount-buzhou-interfaces/gk/refresh?sign=${this.calculateSign(body)}`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 刷新盲盒成功`);
                this.BuZhouRefreshStatus = true;
                this.prizeLocations = []
            } else {
                $.log(`❌账号[${this.index}] 刷新盲盒失败[${result.msg}]`);
                //console.log(result);
                this.BuZhouRefreshStatus = false;
            }
        } catch (e) {
            console.log(e);
        }
    }
    async BuZhouTaskList() {
        let body = { "source": "gamecentertask" }
        try {
            let result = await this.taskRequest_task("get", `https://app.dewu.com/api/v1/h5/mount-buzhou-interfaces/gk/task-list?source=gamecentertask&sign=${this.calculateSign(body)}`)
            if (result.code == 200) {
                for (let i of result.data.taskVoList) {
                    let taskStatus = false
                    if (i.isComplete == false) {
                        if (i.taskType == 1) {
                            if (i.classify == 2) {
                                //浏览  

                                taskStatus = await this.DoTask(i)
                            }
                        }
                        if (i.taskType == 50) {
                            await $.wait(2500)

                            taskStatus = await this.DoTask(i)
                            //收藏
                        }
                    } else if (i.isComplete == true && i.isReceiveReward == false) {
                        await $.wait(2500)
                        await this.TaskReceiveBuZhou(i)
                    }
                    if (taskStatus == true) {
                        await $.wait(2500)
                        await this.TaskReceiveBuZhou(i)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}] 盲盒任务获取失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TaskReceivePoint(body) {
        try {
            let RequestBody = { taskId: body.taskId, taskType: body.taskType }

            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-game-center/v1/sign/task_receive?sign=${this.calculateSign(RequestBody)}`, RequestBody)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  领取任务奖励[${result.msg}] --- [${result.data.amount}]金币🎉`)
            } else {
                //console.log(body.taskId);
                $.log(`❌账号[${this.index}]  领取任务奖励失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TaskReceiveBuZhou(body) {
        try {
            let RequestBody = { taskId: body.taskId, classify: body.classify }
            let result = await this.taskRequest("post", `https://app.dewu.com/api/v1/h5/mount-buzhou-interfaces/gk/task-receive?sign=${this.calculateSign(RequestBody)}`, RequestBody)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  领取任务奖励[${result.msg}] --- [${result.data.count}]次数🎉`)
            } else {
                //console.log(body.taskId);
                $.log(`❌账号[${this.index}]  领取任务奖励失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async FishFeed() {
        let body = { "feedTimes": 1, "fishId": this.fishId, "fishType": this.fishType }
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-fish/v1/fish/feed?sign=63a26f09f6d985b73299f92506f6e986`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 喂食🐟成功🎉`)
                this.fishFeedStatus = true
            } else {
                this.fishFeedStatus = false
                $.log(`❌账号[${this.index}] 喂食🐟失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async Dowater() {
        if (this.droplet > 0) {
            $.log(`账号[${this.index}]  可浇水${parseInt(this.droplet / 100)}次,开始浇水`);
            if (this.treeMode == 0) {
                for (let i = 0; i < parseInt(this.droplet / 100); i++) {
                    if (this.doWaterStatus) {
                        await this.DoWaterApi()
                        //随机延迟random
                        await $.wait(this.randomNumber(1000, 2000))
                    }
                }
            } else if (this.treeMode == 1) {
                $.log(`账号[${this.index}] 组队浇水 =>`)
                for (let i = 0; i < parseInt(this.droplet / 100); i++) {
                    if (this.doWaterStatus) {
                        await this.DoWaterTeamApi(this.treeId)
                        //随机延迟random
                        await $.wait(this.randomNumber(1000, 2000))
                    }
                }
                await this.TeamInfo()
            }

        }
    }
    async DoWaterApi() {
        let body = {}
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/tree/watering?sign=fe26befc49444d362c8f17463630bdba`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 浇水成功🎉`)
                this.doWaterStatus = true
            } else {
                this.doWaterStatus = false
                $.log(`❌账号[${this.index}] 浇水失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async DoWaterTeamApi(teamTreeId) {
        let body = { "teamTreeId": teamTreeId }
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/team/tree/watering?sign=b5ee2c7e8d1aaf214886c438c4f25cd9`, body)
            if (result.code == 200) {
                $.log(`账号[${this.index}] 浇水成功🎉`)
                if (result.data.coupons !== null) {
                    $.log(`账号[${this.index}] 浇水成功获得${result.data.coupons[0].limitDesc}🎉`)

                }
                this.doWaterStatus = true
            } else {
                this.doWaterStatus = false
                $.log(`❌账号[${this.index}] 浇水失败[${result.msg}]`);

                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TreeInfo() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/user/target/info`)
            //console.log(result);
            if (result.code == 200) {
                $.log(`账号[${this.index}] [${result.data.name}] Lv[${result.data.level}]🎉`)

            } else {
                $.log(`❌账号[${this.index}]  获取🌳信息失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TaskListTree() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/task/list`)
            //console.log(result);
            if (result.code == 200) {
                $.log(`账号[${this.index}] 获取任务列表成功 采集/领取 集到[${result.data.taskList.length}]条任务🎉`)
                for (let i of result.data.taskList) {
                    this.taskListTree.push(i)
                }
                for (let i of this.taskListTree) {
                    let taskStatus = false
                    if (i.isComplete == false) {
                        await $.wait(2500)
                        if (i.taskType == 1) {
                            if (i.classify == 2) {
                                //浏览  

                                taskStatus = await this.DoTask(i)
                            }
                            if (i.classify == 1) {
                                //完成固定次数浇灌 默认5次
                            }
                        }
                        if (i.taskType == 10) {
                            //固定时间段领取 40g
                        }
                        if (i.taskType == 123) {
                            taskStatus = await this.DoTask(i)
                            //从桌面组件访问
                        }
                        if (i.taskType == 50) {
                            taskStatus = await this.DoTask(i)
                            //收藏
                        }
                        if (i.taskType == 201) {
                            //逛95分
                        }
                        if (i.taskType == 4) {
                            //收集一次水滴生产
                        }
                    } else if (i.isComplete == true && i.isReceiveReward == false) {
                        await $.wait(2500)
                        await this.TaskReceiveTree(i)
                    }
                    if (taskStatus) {
                        await $.wait(2500)
                        await this.TaskReceiveTree(i)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}]  获取任务列表成功🎉失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async SignListTree() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/sign/list`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  今日${result.data.status == 1 ? "未签到" : "已签到"}🎉`)
                if (result.data.status == 1) {
                    let SignInResult = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/sign/sign_in`, {})
                    if (SignInResult.code == 200) {
                        $.log(`账号[${this.index}]  签到领取水滴[${SignInResult.msg}] --- [${SignInResult.data.Num}]🎉`)
                    } else {
                        $.log(`账号[${this.index}]  签到领取水滴[${SignInResult.msg}]`)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}]  获取签到列表失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async SignListFish() {
        try {
            let result = await this.taskRequest_task("get", `https://app.dewu.com/hacking-fish/v1/daily_sign/list`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  今日${result.data.status == 1 ? "未签到" : "已签到"}🎉`)
                if (result.data.status == 1) {
                    let SignInResult = await this.taskRequest("post", `https://app.dewu.com/hacking-fish/v1/daily_sign/receive`, {})
                    if (SignInResult.code == 200) {
                        $.log(`账号[${this.index}]  签到领取鱼食[${SignInResult.msg}] --- [${SignInResult.data.Num}]🎉`)
                    } else {
                        $.log(`账号[${this.index}]  签到领取鱼食[${SignInResult.msg}]`)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}]  获取签到列表失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async PointInfo() {
        try {
            let result = await this.taskRequest_task("get", `https://app.dewu.com/hacking-game-center/v1/gold/balance`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}] 潮金币[${result.data.coinDetailList[0].value}]`);
            } else {
                $.log(`❌账号[${this.index}] 获取潮金币信息失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async PointTaskList() {
        try {
            let result = await this.taskRequest_task("get", `https://app.dewu.com/hacking-game-center/v1/sign/task_list`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                for (let i of result.data.list) {
                    let taskStatus = false
                    if (i.isComplete == false) {
                        if (i.taskType == 1) {
                            i.classify = 2
                            taskStatus = await this.DoTask(i)
                        }
                        if (i.taskType == 50) {
                            await $.wait(2500)
                            taskStatus = await this.DoTask(i)
                            //收藏
                        }
                    } else if (i.isComplete == true && i.isReceiveReward == false) {
                        await $.wait(2500)
                        await this.TaskReceivePoint(i)
                    }
                    if (taskStatus == true) {
                        await $.wait(2500)
                        await this.TaskReceivePoint(i)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}] 获取潮金币任务列表失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async PonitSignIn() {
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-game-center/v1/sign/sign`, {})
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  外部活动潮币签到成功 获得[${result.data.coins}g💧]🎉`)
            } else {
                $.log(`❌账号[${this.index}]  外部活动潮币签到失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async Droplet_ExtraInfo() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/droplet-extra/info`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  气泡水滴 可领取 ---  💧🎉`)
                let receiveResult = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/droplet-extra/receive`, {})
                //console.log(JSON.stringify(result));
                if (receiveResult.code == 200) {
                    $.log(`账号[${this.index}]  领取气泡水滴[${receiveResult.msg}] --- [${receiveResult.data.totalDroplet}g]💧🎉`)
                } else {
                    $.log(`❌账号[${this.index}]  领取气泡失败[${receiveResult.msg}]`);
                    //console.log(result);
                }
            } else {
                $.log(`❌账号[${this.index}]  气泡水滴获取失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async Droplet_Get_Generate_Droplet() {
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/droplet/get_generate_droplet`, {})
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  领取小木桶积攒水滴[${result.msg}] --- [${result.data.droplet}g]💧🎉`)
            } else {
                $.log(`❌账号[${this.index}]  领取小木桶积攒水滴失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TaskReceiveFish(body) {
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-fish/v1/task/receive?sign=ee632e4b8e24d2526737bca0b7c0c678`, { taskId: body.taskId, classify: body.classify })
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  领取任务奖励[${result.msg}] --- [${result.data.num}g]💧🎉`)

            } else {
                $.log(`❌账号[${this.index}]  领取任务奖励失败[${result.msg}]`);
                //console.log(body.taskId);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TaskReceiveTree(body) {
        try {
            let result = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/task/receive?sign=15c051cc7af50c30318c05b539e434e7`, { taskId: body.taskId, classify: body.classify })
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  领取任务奖励[${result.msg}] --- [${result.data.num}g]💧🎉`)
            } else {
                //console.log(body.taskId);
                $.log(`❌账号[${this.index}]  领取任务奖励失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async Get_Tree_Info() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/tree/get_tree_info`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}]  [${result.data.treeId}] 成熟进度 --- [${result.data.userWateringDroplet}/${result.data.currentLevelNeedWateringDroplet}g]💧🎉`)

            } else {
                $.log(`❌账号[${this.index}]  获取🌳成长信息失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async TaskListFish() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-fish/v1/task/list`)
            //console.log(JSON.stringify(result));
            if (result.code == 200) {
                $.log(`账号[${this.index}] 获取任务列表成功 采集/领取 [${result.data.taskList.length}]条任务🎉`)
                for (let i of result.data.taskList) {
                    this.taskListFish.push(i)
                }
                for (let i of this.taskListFish) {
                    let taskStatus = false
                    if (i.isComplete == false) {
                        await $.wait(2500)
                        if (i.taskType == 1) {
                            if (i.classify == 2) {
                                //浏览  

                                taskStatus = await this.DoTask(i)
                            }
                            if (i.classify == 1) {
                                //完成固定次数浇灌 默认5次
                            }
                        }
                        if (i.taskType == 100001) {
                            //喂养5次
                        }
                        if (i.taskType == 124) {
                            taskStatus = await this.DoTask(i)
                            //从桌面组件访问
                        }
                        if (i.taskType == 50) {
                            taskStatus = await this.DoTask(i)
                            //收藏
                        }
                        if (i.taskType == 201) {
                            //逛95分
                        }
                        if (i.taskType == 100002) {
                            //30g鱼食 每日9点/13点/17点/21点各领一次
                        }
                    } else if (i.isComplete == true && i.isReceiveReward == false) {
                        await $.wait(3000)
                        await this.TaskReceiveFish(i)
                    }
                    if (taskStatus) {
                        await $.wait(3000)
                        await this.TaskReceiveFish(i)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}]  获取任务🐟失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async UserInit() {
        let result = {
            code: 0,
            msg: "获取🌳信息失败",
        }
        try {
            let authHelpCode = "";
            if (this.index == 1) {
                for (let j of authShareCodeList) {
                    authHelpCode = j
                    result = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/user/init?sign=d25c30ebdf1adeb29ca10ccb825bbf66`, { "keyword": "", "source": "wotab04", "koc": 0, "ffOfflineFlag": "", "keywordType": 0 })
                    if (result.code == 200) {
                        if ("inviteRes" in result.data) {
                            if (result.data.inviteRes.indexOf("成功") != -1) {
                                $.log(`首账号助力作者成功`)
                                break
                            }
                        }
                    }
                }
                let helpCodeResult = await this.taskRequest("post", "https://app.dewu.com/hacking-tree/v1/keyword/gen?sign=fe26befc49444d362c8f17463630bdba", {})
                if (helpCodeResult.code == 200) {
                    let kw = helpCodeResult.data.keyword
                    helpCode = kw.split("œ")[1]
                    $.log(`首账号助力码[${helpCode}]`)
                }
            } else {
                result = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/user/init?sign=d25c30ebdf1adeb29ca10ccb825bbf66`, { "keyword": "", "source": "wotab04", "koc": 0, "ffOfflineFlag": "", "keywordType": 0 })
            }
            if (result.code == 200) {
                $.log(`账号[${this.index}]  [${result.msg}]  剩余水滴[${result.data.droplet}g] 助力[${this.index == 1 ? "作者:" + authHelpCode : helpCode}][${"inviteRes" in result.data ? result.data.inviteRes : "未成功"}]🎉`)
                this.treeId = result.data.treeId
                this.droplet = result.data.droplet
                this.treeMode = result.data.mode


            } else {
                $.log(`❌账号[${this.index}]  获取🌳信息失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async TreeInviteReward() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/invite/list`, `sign=fe26befc49444d362c8f17463630bdba`)

            if (result.code == 200) {
                if (result.data?.list) {
                    for (let i of result.data.list) {
                        if (i.status == 0) {
                            let body = { "inviteeUserId": i.inviteeUserId }
                            let rewardResult = await this.taskRequest("post", `https://app.dewu.com/hacking-tree/v1/invite/reward`, body)
                            if (rewardResult.code == 200) {
                                $.log(`账号[${this.index}] 领取邀请奖励成功 获取[${rewardResult.data.droplet}]g`);
                            }

                        }
                    }
                }


            }
        } catch (e) {
            console.log(e);
        }
    }
    async TeamInfo() {
        try {
            let result = await this.taskRequest("get", `https://app.dewu.com/hacking-tree/v1/team/info`)
            //console.log(result);
            if (result.code == 200) {
                for (let i of result.data.member) {
                    if (i.isCaptain == true) {
                        $.log(`账号[${this.index}] 组队队长[${i.name}] 今日是否上线[${i.status == 1 ? '是' : '否'}]`)
                    } else {
                        $.log(`账号[${this.index}] 组员[${i.name}] 今日是否上线[${i.status == 1 ? '是' : '否'}]`)
                    }
                }
            } else {
                $.log(`❌账号[${this.index}]  获取队伍🌳🎉失败[${result.msg}]`);
                //console.log(result);
            }



        } catch (e) {
            console.log(e);
        }
    }
    async UserFinshInfo() {
        try {
            let result = await this.taskRequest_task("get", `https://app.dewu.com/hacking-fish/v1/user/home?userSelectFishId=0&sign=5d75086e825f0fcea4b2cbdf5e6d940f`)
            //console.log(result);
            let fishName = ""
            let lv = ""
            let progress = ""
            if (result.code == 200) {
                this.fishId = result.data.selectFishId
                for (let j of result.data.fishList) {
                    if (this.fishId == j.fishId) {
                        this.fishType = j.type
                        fishName = j.typeData.name
                        lv = j.level
                        progress = j.progress
                        break;
                    }
                }
                $.log(`账号[${this.index}]  [${fishName}]等级[${lv}] [${progress}/1000000]  剩余※鱼食🐟[${result.data.balance}g]🎉`)
                if (result.data.balance > 0) {
                    $.log(`账号[${this.index}]  喂食🐟${parseInt(result.data.balance / 10)}次,开始喂食`);
                    for (let i = 0; i < parseInt(result.data.balance / 10); i++) {
                        if (this.fishFeedStatus) {
                            await this.FishFeed()
                            //随机延迟random
                            await $.wait(this.randomNumber(1000, 2000))
                        }
                    }
                }

            } else {
                $.log(`❌账号[${this.index}]  获取用户信息成功🎉失败[${result.msg}]`);
                //console.log(result);
            }
        } catch (e) {
            console.log(e);
        }
    }
    findMissingNumbers(arr) {
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const missing = [];

        for (const num of nums) {
            if (!arr.includes(num)) {
                missing.push(num);
            }
        }

        return missing;
    }
    //randominit
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    async taskRequest(method, url, body = {}) {
        //

        let headers = {
            "Host": "app.dewu.com",

            "SK": this.sk,

            "x-auth-token": "Bearer " + this.ck,

            "duToken": "" + this.duToken,

            "cookieToken": "" + this.duToken,
            "traceparent": this.generateIds(),
            "User-Agent": this.ua,

            "sks": "1,hdw3",


            "Cookie": "duToken=" + this.duToken
        }
        const reqeuestOptions = {
            url: url,
            method: method,
            headers: headers

        }
        //console.log(body);
        let { enData, n } = this.createEncryptedBody(JSON.stringify(body))
        reqeuestOptions.headers["a"] = n
        //console.log(enData);
        method == "get" ? (reqeuestOptions.url.split("?")[1] != undefined ? reqeuestOptions.url += "&data=" + encodeURIComponent(enData.data) : reqeuestOptions.url += "?data=" + encodeURIComponent(enData.data)) : Object.assign(reqeuestOptions, { body: JSON.stringify({ data: enData.data }) })
        //console.log(reqeuestOptions)
        try {
            let { body: result } = await $.httpRequest(reqeuestOptions)
            if (!$.isJson(result)) {
                result = JSON.parse(this.decryptResponseBody(result, n))
            }
            //console.log(result);
            return result

        } catch (error) {
            //console.log(error);
            // $.log(`接口请求失败 `)
            return { code: 0, msg: "接口请求失败" }
        }

    }
    generateIds() {
        var Uo = Array(32);
        var oe = "0000000000000000";

        function Ho(e) {
            for (var t = 0; t < 2 * e; t++)
                Uo[t] = Math.floor(16 * Math.random()) + 48,
                    Uo[t] >= 58 && (Uo[t] += 39);
            return String.fromCharCode.apply(null, Uo.slice(0, 2 * e));
        }

        var Mo = "00000000000000000000000000000000"; // Assuming Mo is defined somewhere else in your code

        var generateSpanId = function () {
            return function (e) {
                var t = e(8);
                if (t === oe)
                    return Mo;
                return t;
            }(Ho);
        };

        var generateTraceId = function () {
            return function (e) {
                var t = Math.floor(Date.now() / 1e3).toString(16),
                    n = e(8),
                    r = e(3);
                return "f5" + r + t + n;
            }(Ho);
        };

        return "00-" + generateTraceId() + "-" + generateSpanId() + "-01"
    };

    async taskRequest_task(method, url, body = "") {


        let headers = {
            "Host": "app.dewu.com",
            "Connection": "keep-alive",
            //"Content-Length": "62",
            //"ua": "duapp/5.37.0(android;10)",
            //"Origin": "https://cdn-m.dewu.com",
            //"appid": "h5",
            "SK": this.sk,
            /*"shumeiId": "20240229101108a9d7deaedd9e5e305209da327c58c8fc21a0fe159c45b78d",*/
            /*"deviceTrait": "MI+8+Lite",*/
            "x-auth-token": "Bearer " + this.ck,
            /*"Sec-Fetch-Dest": "empty",
            "channel": "xiaomi",
            "duToken": "d41d8cd9|1630362958|1711360875|4bf085e789d085b0",
            "appVersion": "5.37.0",
            "emu": "0",*/
            //"cookieToken": "d41d8cd9|1630362958|1711360875|4bf085e789d085b0",
            "traceparent": this.generateIds(),
            /*"dudeliveryid": "79F073E7555D2BD9490AF2270549ADBABDFE24914A4EEF24D4D5C25559243BDD",*/
            "User-Agent": this.ua,
            //"duproductid": "0BC86B71CB9BA08726EDD70256925177BDFE24914A4EEF24D4D5C25559243BDD",
            "Content-Type": "application/json",
            /*"isRoot": "0",
            "imei": "",
            "duid": "0BC86B71CB9BA08726EDD70256925177BDFE24914A4EEF24D4D5C25559243BDD",
            "platform": "h5",
            "isProxy": "0",
            */
            /*"X-Requested-With": "com.shizhuang.duapp",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Referer": "https://cdn-m.dewu.com/h5-growth/game-task?gameTaskFlag=true&taskId=Nr52k&taskType=50&countdownIcon=%7B%22countdownIcon%22%3A%22https%3A%2F%2Fcdn.poizon.com%2Fnode-common%2F28c7b3d4060e086551dcc84eca7bfbeb.png%22%2C%22hideCountdownIcon%22%3A%22https%3A%2F%2Fcdn.poizon.com%2Fnode-common%2Fa8b472c7622a53454d82745345cefa71.png%22%2C%22coordinate%22%3A%2212%2C600%22%7D&scrollbarColor=%2301C1C2&fontColor=%23FFFFFF&btd=83500&goodsCollect=goodsDetail&popId=0",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",*/
            "Cookie": `duToken=${this.duToken};`
        }
        const reqeuestOptions = {
            url: url,
            method: method,
            headers: headers

        }
        body == "" ? "" : Object.assign(reqeuestOptions, { body: JSON.stringify(body) })
        //console.log(reqeuestOptions)
        try {
            let { body: result } = await $.httpRequest(reqeuestOptions)
            return result
        } catch (error) {
            // $.log(`接口请求失败 `)
            return { code: 0, msg: "接口请求失败" }
        }
        //

    }
    createEncryptedBody(data) {
        const key2 = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANMGZPlLobHYWoZyMvHD0a6emIjEmtf5Z6Q++VIBRulxsUfYvcczjB0fMVvAnd1douKmOX4G690q9NZ6Q7z/TV8CAwEAAQ==";
        const publicKeyPem = '-----BEGIN PUBLIC KEY-----\n' +
            key2 +
            '-----END PUBLIC KEY-----';

        global["window"] = {}
        const jsencrypt = require("jsencrypt")
        const crypt = new jsencrypt()
        crypt.setKey(publicKeyPem)
        const n = this.randomStr(48, 16);
        const encrypted = crypt.encrypt(n)
        const enBody = CryptoJS.enc.Utf8.parse(data);
        const enResult = CryptoJS.AES.encrypt(enBody, CryptoJS.enc.Utf8.parse(n.substr(10, 16)), {
            iv: CryptoJS.enc.Utf8.parse(n.substr(20, 16)),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        //console.log(encrypted);
        //console.log(hexToBase64(encrypted));
        const newBody = {
            data: encrypted + "​" + enResult.ciphertext.toString().toUpperCase(),
        };
        newBody.sign = this.calculateSign(newBody);
        return { enData: newBody, n };
        function hexToBase64(hexString) {
            const buffer = Buffer.from(hexString, 'hex');
            const base64String = buffer.toString('base64');
            return base64String;
        }
    }
    randomStr(length, charset) { var tmp1, tmp2, data = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), result = []; if (((charset = charset || data["length"]), length)) for (tmp1 = 0; tmp1 < length; tmp1++)result[tmp1] = data[0 | (Math.random() * charset)]; else for (result[8] = result[13] = result[18] = result[23] = "-", result[14] = "4", tmp1 = 0; tmp1 < 36; tmp1++)result[tmp1] || ((tmp2 = 0 | (16 * Math["random"]())), (result[tmp1] = data[19 === tmp1 ? (3 & tmp2) | 8 : tmp2])); return result["join"]("") }
    decryptResponseBody(result, n) {
        try {
            const de1 = CryptoJS.enc.Hex.parse(result),
                de2 = CryptoJS.enc.Base64.stringify(de1);
            const decrypted = CryptoJS.AES.decrypt(de2, CryptoJS.enc.Utf8.parse(n.substr(10, 16)), {
                iv: CryptoJS.enc.Utf8.parse(n.substr(20, 16)),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            n = "987654321012345678901234567890123456789012345678"
            const de1 = CryptoJS.enc.Hex.parse(result),
                de2 = CryptoJS.enc.Base64.stringify(de1);
            const decrypted = CryptoJS.AES.decrypt(de2, CryptoJS.enc.Utf8.parse(n.substr(10, 16)), {
                iv: CryptoJS.enc.Utf8.parse(n.substr(20, 16)),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
            return decrypted;
        }

    }
    //修复自 修改处理后 空值删除得情况 改为不删除
    calculateSign(requestBody) { const sortedKeys = Object.keys(requestBody).sort(); let signContent = sortedKeys.reduce((acc, key) => { const value = requestBody[key]; if (value === null) { return acc } if (typeof value === 'object' && !Array.isArray(value)) { return acc.concat(key).concat(JSON.stringify(value)) } if (Array.isArray(value)) { if (value.length > 0) { let typeOfFirstItem = typeof value[0]; if (typeOfFirstItem === 'object') { let arrayStr = ''; value.forEach((item, index) => { arrayStr += JSON.stringify(item) + (index !== value.length - 1 ? ',' : '') }); return acc.concat(key).concat(arrayStr) } } return acc.concat(key).concat(value.toString()) } return acc.concat(key).concat(value.toString()) }, ''); const secretKey = "048a9c4943398714b356a696503d2d36"; const hashedContent = CryptoJS.MD5(signContent.concat(secretKey)).toString(); return hashedContent }

    getRandomUA() {
        // 生成 iOS 版本号
        const iOSVersion = (Math.floor(Math.random() * (161 - 120) + 120) / 10).toFixed(1);

        // 生成 AppleWebKit 版本号
        const AppleWebKitVersion = `${Math.floor(Math.random() * (605 - 500) + 500)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;

        // 生成 Mobile 版本号
        const mobileVersion = `${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`;

        // 生成 User-Agent 字符串
        const userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iOSVersion} like Mac OS X) AppleWebKit/${AppleWebKitVersion} (KHTML, like Gecko) Mobile/${mobileVersion}/duapp/5.38.6`;

        return userAgent;
    }

}




!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await main()

    }
    await $.sendMsg($.logs.join("\n"))
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());

//********************************************************
/**
 * @returns
 */
async function checkEnv() {
    let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
    if (userCookie) {
        let e = envSplitor[0];
        for (let o of envSplitor) {
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        }

        for (let n of userCookie.split(e)) {

            n && userList.push(new Task(n));
        }
    } else {
        console.log(`未找到CK变量名【${ckName}】`);
        return;
    }
    return console.log(`共找到${userList.length}个账号`), true; //true == !0
}
//Env Api =============================
/*
*   @modifyAuthor @smallfawn 
*   @modifyTime 2024-03-25
*   @modifyInfo 重写请求函数 在got环境或axios环境都可以请求 删除不必要的函数
*/
function Env(t, s) {
    return new (class {
        constructor(t, s) {
            this.name = t;
            this.data = null;
            this.dataFile = "box.dat";
            this.logs = [];
            this.logSeparator = "\n";
            this.startTime = new Date().getTime();
            Object.assign(this, s);
            this.log("", `\ud83d\udd14${this.name},\u5f00\u59cb!`);
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports;
        }
        isQuanX() {
            return "undefined" != typeof $task;
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
        }
        isLoon() {
            return "undefined" != typeof $loon;
        }
        async loaddata() {
            if (!this.isNode()) return {};
            this.fs = this.fs ? this.fs : require("fs");
            this.path = this.path ? this.path : require("path");
            const t = this.path.resolve(this.dataFile),
                s = this.path.resolve(process.cwd(), this.dataFile),
                e = this.fs.existsSync(t),
                i = !e && this.fs.existsSync(s);
            if (!e && !i) this.writeFile(this.dataFile, JSON.stringify([]));
            const pt = e ? t : s;
            let r = await this.readFile(pt);
            return r
        }
        async writedata() {
            if (!this.isNode()) return;
            this.fs = this.fs ? this.fs : require("fs");
            this.path = this.path ? this.path : require("path");
            const t = this.path.resolve(this.dataFile),
                s = this.path.resolve(process.cwd(), this.dataFile),
                e = this.fs.existsSync(t),
                i = !e && this.fs.existsSync(s);
            const o = JSON.stringify(this.data, null, 2);
            const pt = e ? t : i ? s : t;
            await writeFile(pt, o)
        }
        readFile(pt) {
            this.fs = this.fs ? this.fs : require("fs");
            return new Promise((resolve, reject) => {
                this.fs.readFile(pt, "utf8", (r, o) => {
                    if (r) reject({});
                    else o = this.isJSONString(o) ? JSON.parse(o) : o;
                    resolve(o);
                });
            });
        }
        writeFile(pt, o) {
            this.fs = this.fs ? this.fs : require("fs");
            return new Promise((resolve, reject) => {
                this.fs.writeFile(pt, o, (r) => {
                    if (r) reject(r);
                    else resolve();
                });
            });
        }
        async getval(t) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.read(t);
            } else if (this.isQuanX()) {
                return $prefs.valueForKey(t);
            } else if (this.isNode()) {
                this.data = await this.loaddata();
                return await this.data[t];
            } else {
                return (this.data && this.data[t]) || null;
            }
        }
        async setval(t, s) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.write(t, s);
            } else if (this.isQuanX()) {
                return $prefs.setValueForKey(t, s);
            } else if (this.isNode()) {
                this.data = await this.loaddata();
                this.data[s] = t;
                await this.writedata();
                return true;
            } else {
                return (this.data && this.data[s]) || null;
            }
        }
        initRequestEnv(t) {
            try {
                require.resolve("got") &&
                    ((this.requset = require("got")), (this.requestModule = "got"));
            } catch (e) { }
            try {
                require.resolve("axios") &&
                    ((this.requset = require("axios")), (this.requestModule = "axios"));
            } catch (e) { }
            this.cktough = this.cktough ? this.cktough : require("tough-cookie");
            this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
            if (t) {
                t.headers = t.headers ? t.headers : {};
                if (
                    typeof t.headers.Cookie === "undefined" &&
                    typeof t.cookieJar === "undefined"
                ) {
                    t.cookieJar = this.ckjar;
                }
            }
        }
        queryStr(options) {
            return Object.entries(options)
                .map(
                    ([key, value]) =>
                        `${key}=${typeof value === "object" ? JSON.stringify(value) : value
                        }`
                )
                .join("&");
        }
        getURLParams(url) {
            const params = {};
            const queryString = url.split("?")[1];
            if (queryString) {
                const paramPairs = queryString.split("&");
                paramPairs.forEach((pair) => {
                    const [key, value] = pair.split("=");
                    params[key] = value;
                });
            }
            return params;
        }
        isJSONString(str) {
            try {
                return JSON.parse(str) && typeof JSON.parse(str) === "object";
            } catch (e) {
                return false;
            }
        }
        isJson(obj) {
            var isjson =
                typeof obj == "object" &&
                Object.prototype.toString.call(obj).toLowerCase() ==
                "[object object]" &&
                !obj.length;
            return isjson;
        }
        async sendMsg(message) {
            if (!message) return;
            if ($.isNode()) {
                await notify.sendNotify($.name, message);
            } else {
                $.msg($.name, "", message);
            }
        }
        async httpRequest(options) {
            let t = { ...options };
            t.headers = t.headers || {};
            if (t.params) {
                t.url += "?" + this.queryStr(t.params);
            }
            t.method = t.method.toLowerCase();
            if (t.method === "get") {
                delete t.headers["Content-Type"];
                delete t.headers["Content-Length"];
                delete t.headers["content-type"];
                delete t.headers["content-length"];
                delete t.body;
            } else if (t.method === "post") {
                let ContentType;
                if (!t.body) {
                    t.body = "";
                } else if (typeof t.body === "string") {
                    ContentType = this.isJSONString(t.body)
                        ? "application/json"
                        : "application/x-www-form-urlencoded";
                } else if (this.isJson(t.body)) {
                    t.body = JSON.stringify(t.body);
                    ContentType = "application/json";
                }
                if (!t.headers["Content-Type"] && !t.headers["content-type"]) {
                    t.headers["Content-Type"] = ContentType;
                }
            }
            if (this.isNode()) {
                this.initRequestEnv(t);
                if (this.requestModule === "axios" && t.method === "post") {
                    t.data = t.body;
                    delete t.body;
                }
                let httpResult;
                if (this.requestModule === "got") {
                    httpResult = await this.requset(t);
                    if (this.isJSONString(httpResult.body)) {
                        httpResult.body = JSON.parse(httpResult.body);
                    }
                } else if (this.requestModule === "axios") {
                    httpResult = await this.requset(t);
                    httpResult.body = httpResult.data;
                }
                return httpResult;
            }
            if (this.isQuanX()) {
                t.method = t.method.toUpperCase();
                return new Promise((resolve, reject) => {
                    $task.fetch(t).then((response) => {
                        if (this.isJSONString(response.body)) {
                            response.body = JSON.parse(response.body);
                        }
                        resolve(response);
                    });
                });
            }
        }
        randomNumber(length) {
            const characters = "0123456789";
            return Array.from(
                { length },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("");
        }
        randomString(length) {
            const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
            return Array.from(
                { length },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("");
        }
        timeStamp() {
            return new Date().getTime();
        }
        uuid() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = (Math.random() * 16) | 0,
                        v = c == "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                }
            );
        }
        time(t) {
            let s = {
                "M+": new Date().getMonth() + 1,
                "d+": new Date().getDate(),
                "H+": new Date().getHours(),
                "m+": new Date().getMinutes(),
                "s+": new Date().getSeconds(),
                "q+": Math.floor((new Date().getMonth() + 3) / 3),
                S: new Date().getMilliseconds(),
            };
            /(y+)/.test(t) &&
                (t = t.replace(
                    RegExp.$1,
                    (new Date().getFullYear() + "").substr(4 - RegExp.$1.length)
                ));
            for (let e in s)
                new RegExp("(" + e + ")").test(t) &&
                    (t = t.replace(
                        RegExp.$1,
                        1 == RegExp.$1.length
                            ? s[e]
                            : ("00" + s[e]).substr(("" + s[e]).length)
                    ));
            return t;
        }
        msg(s = t, e = "", i = "", o) {
            const h = (t) =>
                !t || (!this.isLoon() && this.isSurge())
                    ? t
                    : "string" == typeof t
                        ? this.isLoon()
                            ? t
                            : this.isQuanX()
                                ? { "open-url": t }
                                : void 0
                        : "object" == typeof t && (t["open-url"] || t["media-url"])
                            ? this.isLoon()
                                ? t["open-url"]
                                : this.isQuanX()
                                    ? t
                                    : void 0
                            : void 0;
            this.isMute ||
                (this.isSurge() || this.isLoon()
                    ? $notification.post(s, e, i, h(o))
                    : this.isQuanX() && $notify(s, e, i, h(o)));
            let logs = ["", "==============📣系统通知📣=============="];
            logs.push(t);
            e ? logs.push(e) : "";
            i ? logs.push(i) : "";
            console.log(logs.join("\n"));
            this.logs = this.logs.concat(logs);
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]),
                console.log(t.join(this.logSeparator));
        }
        logErr(t, s) {
            const e = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            e
                ? this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t.stack)
                : this.log("", `\u2757\ufe0f${this.name},\u9519\u8bef!`, t);
        }
        wait(t) {
            return new Promise((s) => setTimeout(s, t));
        }
        done(t = {}) {
            const s = new Date().getTime(),
                e = (s - this.startTime) / 1e3;
            this.log(
                "",
                `\ud83d\udd14${this.name},\u7ed3\u675f!\ud83d\udd5b ${e}\u79d2`
            );
            this.log();
            if (this.isNode()) {
                process.exit(1);
            }
            if (this.isQuanX()) {
                $done(t);
            }
        }
    })(t, s);
}
