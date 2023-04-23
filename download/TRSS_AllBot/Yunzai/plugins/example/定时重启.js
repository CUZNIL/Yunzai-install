let RestartTime = "4:15"
let ThisFilePath = "plugins/example/定时重启.js"



let RestartQuest
import { Restart } from '../other/restart.js'
import fs from 'node:fs'
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
                }
            ]
        })
        let RestartMs = ((Number(RestartTime.substring(0, RestartTime.lastIndexOf(":"))) - 8) * 60 + Number(RestartTime.substring(RestartTime.lastIndexOf(":") + 1, RestartTime.length))) * 60 * 1000
        let time = (RestartMs - new Date().getTime()) % 86400000 + 86400000
        RestartQuest = setTimeout(() => this.restart(), time)
    }
    async set() {
        clearTimeout(RestartQuest)
        setTimeout(() => {
            //等待3秒确保上一个任务取消，然后再修改自身。
            let change = this.e.msg.replace(/#?定时重启/g, "").replace("：", ":")
            let file = fs.readFileSync(ThisFilePath, 'utf-8')
            fs.writeFileSync(ThisFilePath, file.replace(RestartTime, change), 'utf-8')
        }, 3000)
    }
    restart() {
        new Restart(this.e).restart()
    }
}
