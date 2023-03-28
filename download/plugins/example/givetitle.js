import plugin from '../../lib/plugins/plugin.js'
//改写自小雪插件https://gitee.com/XueWerY/xiaoxue-plugin
//说是改写。。其实就是单纯删到只有头衔功能，加了些完全没技术含量的东西
//2022年10月21日16:05:15
export class Givetitle extends plugin {
    constructor() {
        super({
            name: '给头衔',
            dsc: '给群成员一个头衔',
            event: 'message',
            priority: 25,
            rule: [
                {
                    reg: '^#(我要|(给|赐|赠|赏|送)(我|咱|朕|俺|愚|私|吾|鄙|敝|卑|爹|娘|爸|妈|爷|奶|哥|姐|弟|妹))头衔(.)*$',
                    fnc: 'giveTitle'
                },
                {
                    reg: '^(我要|(给|赐|赠|赏|送)(我|咱|朕|俺|愚|私|吾|鄙|敝|卑|爹|娘|爸|妈|爷|奶|哥|姐|弟|妹))头衔(.)*$',
                    fnc: 'giveTitle2'
                },
                {
                    reg: '^#头衔(.)*$',
                    fnc: 'giveTitle3'
                },
                {
                    reg: '^头衔(.)*$',
                    fnc: 'giveTitle4'
                },
                {
                    reg: '^#?(我不要|取消|撤销|删除)头衔了?$',
                    fnc: 'delTitle'
                },
            ]
        })
    }

    /** 
     * 获取头衔关键词 
     */
    async getTitleKeyMain(e) {
        /** 判断消息内容是否非法 */
        let message = e.message
        for (let i in message) {
            /** 判断消息中是否有除了文字以外的东西 */
            /** 如果有就返回假 */
            if (message[i].type !== 'text') {
                await this.reply('请不要发除文字以外的东西啦~', true)
                return false
            }
        }
        /** 没有再截取头衔关键词 */
        return true
    }
    /** 
     * 给头衔 
     */
    async giveTitleMain(e, title) {
        if (title == "") return
        if (e.group.is_owner) {
            let tooLong = false
            if (title.length > 18) {
                title = title.slice(0, 20) + "…"
                tooLong = true
            }
            e.group.setTitle(e.sender.user_id, title)
            title = " 头衔设置 " + title + " 成功啦~"
            if (tooLong == true) title += "\n你要的头衔太长了~专属头衔最多六个汉字或者18个字母哦"
            await this.reply(`${title}`, true, { at: true })
            return true
        }
        else {
            await this.reply(`\n抱歉啦~群主才可以设置专属头衔哦~`, true, { at: true })
            return true
        }
    }
    async giveTitle(e) {
        if (this.getTitleKeyMain(e) == false) return
        let title = e.message[0].text.slice(5)
        return this.giveTitleMain(e, title)
    }
    async giveTitle2(e) {
        if (this.getTitleKeyMain(e) == false) return
        let title = e.message[0].text.slice(4)
        return this.giveTitleMain(e, title)
    }
    async giveTitle3(e) {
        if (this.getTitleKeyMain(e) == false) return
        let title = e.message[0].text.slice(3)
        return this.giveTitleMain(e, title)
    } async giveTitle4(e) {
        if (this.getTitleKeyMain(e) == false) return
        let title = e.message[0].text.slice(2)
        return this.giveTitleMain(e, title)
    }

    /** 
     * 撤销头衔 
     */
    async delTitle(e) {
        if (e.group.is_owner) {
            await e.group.setTitle(e.sender.user_id, '')
            await this.reply('\n头衔撤销成功啦~', true, { at: true })
            return true
        }
        else {
            await this.reply(`\n抱歉啦~群主才可以撤销专属头衔哦~`, true, { at: true })
            return true
        }
    }
}