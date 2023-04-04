import plugin from '../../lib/plugins/plugin.js'
import fs from "node:fs"
/*
数据库实现：https://gitee.com/ThreeYi/sanyi-plugin/raw/master/apps/data_recover.js
文件实现：https://gitee.com/TimeRainStarSky/TRSS-Plugin/raw/main/Apps/File.js
功能：redis数据备份到./resources/redis_data.json（qq-uid、喵喵插件的老婆设置），恢复备份，上传备份到群文件，从群文件下载备份。
具体功能发送#数据库帮助 即可查看
此js最后一次编辑于2023年3月22日18:33:32
*/
let Running
let es

export class data_recover extends plugin {
    constructor() {
        super({
            name: "数据库备份",
            dsc: "数据库里面的数据备份",
            event: "message",
            priority: 1000,
            rule: [{
                reg: '^#?((数据库|redis|data)(备份|backup)|(备份|backup)(数据库|redis|data))$',
                fnc: "data_backup",
                permission: 'master',
            },
            {
                reg: '^#?((数据库|redis|data)(恢复|recover)|(恢复|recover)(数据库|redis|data))$',
                fnc: "data_recover",
                permission: 'master',
            },
            {
                reg: '^#?((数据库|redis|data)(上传|upload)|(上传|upload)(数据库|redis|data))$',
                fnc: "data_upload",
                permission: 'master',
            },
            {
                reg: '^#?((数据库|redis|data)(下载|download)|(下载|download)(数据库|redis|data))$',
                fnc: "data_download",
                permission: 'master',
            },
            {
                reg: '^#?((数据库|redis|data)(清空|删除|erase)|(清空|删除|erase)(数据库|redis|data))$',
                fnc: "data_erase",
                permission: 'master',
            },
            {
                reg: '^#?((数据库|备份|backup|redis|data)(帮助|help)|(帮助|help)(数据库|备份|backup|redis|data))$',
                fnc: "data_help",
            }
            ],
        });
    }

    async data_backup(e) {
        if (!fs.existsSync(`./resources/redis_data.json`)) {
            fs.writeFileSync(`./resources/redis_data.json`, "空空如也，不会是报错了吧。", 'utf8')
            await e.reply("第一次备份，新建文件/resources/redis_data.json啦~删库跑路前记得带走哦")
        }
        let all_key = await redis.keys('*')
        let bei = {}
        let fail_num = 0
        let ok_num = 0
        let failkey = ''
        for (let key of all_key) {
            /*
            let key_type = await redis.type(key)
            if (key_type != 'string') {
            //改成只备份qq-uid、喵喵插件的老婆设置了，如需全部备份注释下面这行if，然后把上面的注释代码放出即可。*/
            if (!key.match(`qq-uid|user-cfg`)) {
                continue
            }
            try {
                let value = await redis.get(key)
                bei[key] = value
                ok_num++
            } catch (err) {
                fail_num++
                failkey = failkey.concat(key + '\n')
            }
        }
        bei = JSON.stringify(bei)
        fs.writeFileSync('./resources/redis_data.json', bei, 'utf8', function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            logger.mark('数据库备份结果:', `备份成功${ok_num}个，备份失败${fail_num}个\n`, '备份失败的条目：\n' + failkey)

        })
        await e.reply('数据库备份结果:\n' + `备份成功${ok_num}个，备份失败${fail_num}个`)
    }
    async data_recover(e) {
        if (!fs.existsSync(`./resources/redis_data.json`)) {
            await e.reply("你还没备份过呢，是想干翻redis吗？")
            return false
        }
        let re_fail_num = 0
        let re_ok_num = 0
        let re_failkey = ''
        let data = fs.readFileSync('./resources/redis_data.json', 'utf-8')
        let redis_data = JSON.parse(data.toString())
        for (let key in redis_data) {
            try {
                re_ok_num = re_ok_num + 1
                redis.set(key, redis_data[key])

            } catch (err) {
                re_fail_num++
                console.log('恢复该条数据失败', `总共失败${re_fail_num}条`)
                return false;
            }
        }
        logger.mark('数据库恢复结果:', `恢复成功${re_ok_num}个，恢复失败${re_fail_num}个\n`, '恢复失败的条目：\n' + re_failkey)
        e.reply('数据库恢复结果:\n' + `恢复成功${re_ok_num}个，恢复失败${re_fail_num}个`)
    }
    async data_upload(e) {
        if (!(this.e.isMaster)) return false
        if (Running) {
            await this.reply("有正在执行的文件任务，请稍等……", true)
            return false
        }

        let filePath = './resources/redis_data.json'

        if (!fs.existsSync(filePath)) {
            await this.reply("还没有备份过数据库哦", true)
            return true
        }

        Running = true
        await this.reply("开始上传文件，请稍等……", true)

        let res
        if (this.e.isGroup) {
            res = await this.e.group.fs.upload(filePath).catch((err) => {
                this.reply(`文件上传错误：${JSON.stringify(err)}`)
                logger.error(`文件上传错误：${logger.red(JSON.stringify(err))}`)
            })
        } else {
            res = await this.e.friend.sendFile(filePath).catch((err) => {
                this.reply(`文件上传错误：${JSON.stringify(err)}`)
                logger.error(`文件上传错误：${logger.red(JSON.stringify(err))}`)
            })
        }

        if (res) {
            let fileUrl
            if (this.e.isGroup) {
                fileUrl = await this.e.group.getFileUrl(res.fid)
            } else {
                fileUrl = await this.e.friend.getFileUrl(res)
            }
            await this.reply(`文件上传完成：${fileUrl}`, true)
        }

        Running = false
    }
    async data_download(e) {
        es = this.e
        this.setContext("Download")
        await this.reply("请发送文件", true)
    }

    async Download(e) {
        if (!(this.e.isMaster)) return false
        if (!this.e.file) return false

        this.finish("Download")
        let filePath = './resources/redis_data.json'
        let fileUrl
        if (this.e.isGroup) {
            fileUrl = await this.e.group.getFileUrl(this.e.file.fid)
        } else {
            fileUrl = await this.e.friend.getFileUrl(this.e.file.fid)
        }
        this.e = es

        if (Running) {
            await this.reply("有正在执行的文件任务，请稍等……", true)
            return false
        }
        Running = true

        let ret = await common.downFile(fileUrl, filePath)
        if (ret) {
            await this.reply("文件下载完成！为避免误操作，需要恢复备份请再发送#数据库恢复。", true)
        } else {
            await this.reply("文件下载错误", true)
        }
        Running = false
    }
    async data_erase(e) {
        if (!fs.existsSync(`./resources/redis_data.json`)) {
            await e.reply("似乎还没有数据库备份")
            return false
        }
        fs.rmSync('./resources/redis_data.json')
        await e.reply('数据库备份已清除')
    }
    async data_help(e) {
        let forwardMsg = [
            {
                message: `#数据库备份`,
                user_id: Bot.uin,
                nickname: "备份"
            },
            {
                message: `#数据库恢复`,
                user_id: Bot.uin,
                nickname: "恢复备份"
            },
            {
                message: `#数据库上传`,
                user_id: Bot.uin,
                nickname: "本地备份上传到群文件"
            },
            {
                message: `#数据库下载\n为避免误操作，需要恢复备份请再发送#数据库恢复。`,
                user_id: Bot.uin,
                nickname: "群文件备份下载到本地"
            },
            {
                message: `#数据库清空`,
                user_id: Bot.uin,
                nickname: "删除数据库备份"
            },
            {
                message: `项目源文件地址：\n数据库实现：https://gitee.com/ThreeYi/sanyi-plugin/raw/master/apps/data_recover.js\n文件实现：https://gitee.com/TimeRainStarSky/TRSS-Plugin/raw/main/Apps/File.js\n功能：\nredis数据备份到./resources/redis_data.json（qq-uid、喵喵插件的老婆设置）\n从对应路径恢复备份数据\n需要彻底卸载，先发送#数据库清空，再手动删除本js插件即可。`,
                user_id: Bot.uin,
                nickname: "其他"
            },
            {
                message: `^#?((数据库|redis|data)(备份|backup)|(备份|backup)(数据库|redis|data))$\n\n^#?((数据库|redis|data)(恢复|recover)|(恢复|recover)(数据库|redis|data))$\n\n^#?((数据库|redis|data)(上传|upload)|(上传|upload)(数据库|redis|data))$\n^#?((数据库|redis|data)(下载|download)|(下载|download)(数据库|redis|data))$\n\n^#?((数据库|redis|data)(清空|删除|erase)|(清空|删除|erase)(数据库|redis|data))$\n\n^#?((数据库|备份|backup|redis|data)(帮助|help)|(帮助|help)(数据库|备份|backup|redis|data))$`,
                user_id: Bot.uin,
                nickname: "具体正则"
            },
        ]
        if (!this.e.isMaster) {
            forwardMsg.push({ message: `温馨提示：你不是主人，你只能调用帮助哦~`, user_id: Bot.uin, nickname: "主人判定" })
        }
        if (e.isGroup) {
            forwardMsg = await e.group.makeForwardMsg(forwardMsg)
        } else {
            forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
        }
        forwardMsg.data = forwardMsg.data
            .replace(/\n/g, '')
            .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
            .replace(/___+/, `<title size=\"34\" maxLines=\"2\" lineSpace=\"12\">#数据库帮助</title><title color="#777777" size="26">redis数据库备份工具</title>`)
        await e.reply(forwardMsg)
    }
}