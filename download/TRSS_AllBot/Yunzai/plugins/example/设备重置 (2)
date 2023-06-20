//背景:最近sbqq老给风控，但重置一下设备就可以了。
//功能:删除所有设备信息并重启(匹配data下的_token和device.json)
//编辑:2023年6月20日@硫酸钡Barite

import fs from 'node:fs'


export class resetDevice extends plugin {
    constructor() {
        super({
            name: '设备重置',
            event: 'message',
            priority: -233,
            rule: [
                {
                    reg: '^#?设备重置$',
                    fnc: 'reset',
                    permission: 'master'
                }
            ],
        })
    }
    async reset() {
        let list = fs.readdirSync("data/")
        console.log(list)
        for (let i in list) {
            let name = list[i]
            if (name.includes("_token") || name.includes("device.json")) {
                fs.rmSync("data/" + name)
                console.log("删除文件：" + name)
            }
        }
        logger.error("即将在3秒后主动重启，请注意前往通过登录验证。")
        await setTimeout(() => {
            restart()
        }, 3000)
    }
}

async function restart() {
    let cm = 'npm run restart'
    let ret = await new Promise((resolve, reject) => {
        exec('pnpm -v', { windowsHide: true }, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr })
        })
    })
    if (ret.stdout) cm = 'pnpm run restart'
    exec(cm, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
            logger.error(`重启失败${error.stack}`)
        } else if (stdout) {
            logger.mark('重启成功，运行已由前台转为后台')
            process.exit()
        }
    })
}