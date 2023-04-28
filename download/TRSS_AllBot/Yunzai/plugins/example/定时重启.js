let RestartTime = "16:14"
let ThisFilePath = "plugins/example/定时重启.js"
let RestartQuestPath = "resources/定时重启缓存文件.txt"


import fs from 'node:fs'
try {
    clearTimeout(await fs.readFileSync(RestartQuestPath, 'utf-8'))
    fs.rmSync(RestartQuestPath)
} catch (e) { console.log("定时重启插件：暂无定时重启任务，无需取消上一个任务。") }
//重启?标记
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { exec } = require('child_process')
let RestartMs = ((Number(RestartTime.substring(0, RestartTime.lastIndexOf(":"))) - 8) * 60 + Number(RestartTime.substring(RestartTime.lastIndexOf(":") + 1, RestartTime.length))) * 60 * 1000
let time = (RestartMs - new Date().getTime()) % 86400000 + 86400000
let RestartQuest = await Number(setTimeout(() => {
    restart()
}, time))

fs.writeFileSync(RestartQuestPath, RestartQuest.toString())

async function restart() {
    logger.mark(`定时重启插件：当前时间已经到达${RestartTime}，即将重启。`)
    let cm = 'npm run restart'
    let ret = await new Promise((resolve, reject) => {
        exec('pnpm -v', { windowsHide: true }, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr })
        })
    })
    if (ret.stdout) cm = 'pnpm run restart'
    exec(cm, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
            logger.error(`定时重启插件：重启失败${error.stack}`)
        } else if (stdout) {
            logger.mark('定时重启插件：重启成功，运行已由前台转为后台')
            process.exit()
        }
    })
}
//*/
let RestartLevel = true
try {
    RestartQuest
} catch (e) {
    RestartLevel = false
}
export class RestartAtTime extends plugin {
    constructor() {
        super({
            name: '定时重启',
            event: 'message',
            priority: -233,
            rule: [
                {
                    reg: '^#?定时重启\\d{1,2}(:|：)\\d{1,2}$',
                    fnc: 'set',
                    permission: 'master'
                },
                {
                    reg: '^#?(定时重启(开启|打开|启动)|(开启|打开|启动)定时重启)$',
                    fnc: 'open',
                    permission: 'master'
                },
                {
                    reg: '^#?(定时重启(取消|关闭|停止|禁用)|(取消|关闭|停止|禁用)定时重启)$',
                    fnc: 'close',
                    permission: 'master'
                },
                {
                    reg: '^#?定时重启(帮助)?$',
                    fnc: 'help',
                    permission: 'master'
                }
            ],
        })
    }
    async set() {
        let change = this.e.msg.replace(/#?定时重启/g, "").replace("：", ":")
        this.reply(`成功修改时间为${change}${RestartLevel ? "！" : "，但是未启用定时重启。如需启用请发送\n#启动定时重启"}`)
        let file = fs.readFileSync(ThisFilePath, 'utf-8')
        fs.writeFileSync(ThisFilePath, file.replace(RestartTime, change))
    }
    async open() {
        if (!RestartLevel) {
            this.reply(`定时重启已开启，将在下一个${RestartTime}自动重启！`)
            let file = fs.readFileSync(ThisFilePath, 'utf-8')
            fs.writeFileSync(ThisFilePath, file.replace("/*重启\?标记", "//重启\?标记"))
        } else {
            this.reply(`本来就是开启状态了呢，将在下一个${RestartTime}自动重启。`)
        }
    }
    async close() {
        if (RestartLevel) {
            this.reply("定时重启已关闭。")
            let file = fs.readFileSync(ThisFilePath, 'utf-8')
            fs.writeFileSync(ThisFilePath, file.replace("//重启\?标记", "/*重启\?标记"))
        } else {
            this.reply("本来就是关闭状态了呢。")
        }
    }
    async help() {
        this.reply("#定时重启12:34 在下一个12:34自动重启\n\n#开启定时重启 #关闭定时重启")
    }
}