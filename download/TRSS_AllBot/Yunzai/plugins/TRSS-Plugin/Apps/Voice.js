
import { segment } from "oicq"
import config from "../Model/config.js"
import { exec } from "child_process"
import uploadRecord from "../Model/uploadRecord.js"
import common from "../../../lib/common/common.js"
import gsCfg from "../../genshin/model/gsCfg.js"
import { fstat } from "fs"

let GenshinVoicePath = `${process.cwd()}/plugins/TRSS-Plugin/GenshinVoice/`
let ChatWaifuPath = `${process.cwd()}/plugins/TRSS-Plugin/ChatWaifu/`
let Running
let errorTips = "请查看安装使用教程：\nhttps://Yunzai.TRSS.me\n并将报错通过联系方式反馈给开发者"

let GenshinVoiceSpeakers
const LocalGenshinVoiceSpeakers = ["派蒙", "凯亚", "安柏", "丽莎", "琴", "香菱", "枫原万叶", "迪卢克", "温迪", "可莉", "早柚", "托马", "芭芭拉", "优菈", "云堇", "钟离", "魈", "凝光", "雷电将军", "北斗", "甘雨", "七七", "刻晴", "神里绫华", "戴因斯雷布", "雷泽", "神里绫人", "罗莎莉亚", "阿贝多", "八重神子", "宵宫", "荒泷一斗", "九条裟罗", "夜兰", "珊瑚宫心海", "五郎", "散兵", "女士", "达达利亚", "莫娜", "班尼特", "申鹤", "行秋", "烟绯", "久岐忍", "辛焱", "砂糖", "胡桃", "重云", "菲谢尔", "诺艾尔", "迪奥娜", "鹿野院平藏"]
if (config.Voice.publicApi) {
  GenshinVoiceSpeakers = ["派蒙", "空", "荧", "阿贝多", "枫原万叶", "温迪", "八重神子", "纳西妲", "钟离", "诺艾尔", "凝光", "托马", "北斗", "莫娜", "荒泷一斗", "提纳里", "芭芭拉", "艾尔海森", "雷电将军", "赛诺", "琴", "班尼特", "五郎", "神里绫华", "迪希雅", "夜兰", "辛焱", "安柏", "宵宫", "云堇", "妮露", "烟绯", "鹿野院平藏", "凯亚", "达达利亚", "迪卢克", "可莉", "早柚", "香菱", "重云", "刻晴", "久岐忍", "珊瑚宫心海", "迪奥娜", "戴因斯雷布", "魈", "神里绫人", "丽莎", "优菈", "凯瑟琳", "雷泽", "菲谢尔", "九条裟罗", "甘雨", "行秋", "胡桃", "迪娜泽黛", "柯莱", "申鹤", "砂糖", "萍姥姥", "奥兹", "罗莎莉亚", "式大将", "哲平", "坎蒂丝", "托克", "留云借风真君", "昆钧", "塞琉斯", "多莉", "大肉丸", "莱依拉", "散兵", "拉赫曼", "杜拉夫", "阿守", "玛乔丽", "纳比尔", "海芭夏", "九条镰治", "阿娜耶", "阿晃", "阿扎尔", "七七", "博士", "白术", "埃洛伊", "大慈树王", "女士", "丽塔", "失落迷迭", "缭乱星棘", "伊甸", "伏特加女孩", "狂热蓝调", "莉莉娅", "萝莎莉娅", "八重樱", "八重霞", "卡莲", "第六夜想曲", "卡萝尔", "姬子", "极地战刃", "布洛妮娅", "次生银翼", "理之律者", "迷城骇兔", "希儿", "魇夜星渊", "黑希儿", "帕朵菲莉丝", "天元骑英", "幽兰黛尔", "德丽莎", "月下初拥", "朔夜观星", "暮光骑士", "明日香", "李素裳", "格蕾修", "梅比乌斯", "渡鸦", "人之律者", "爱莉希雅", "爱衣", "天穹游侠", "琪亚娜", "空之律者", "薪炎之律者", "云墨丹心", "符华", "识之律者", "维尔薇", "芽衣", "雷之律者", "阿波尼亚"]
} else {
  GenshinVoiceSpeakers = LocalGenshinVoiceSpeakers
}
const AllAbbr = gsCfg.getAllAbbr()

let ChatWaifuSpeakers = ["綾地寧々", "在原七海", "小茸", "唐乐吟", "綾地寧々J", "因幡めぐるJ", "朝武芳乃J", "常陸茉子J", "ムラサメJ", "鞍馬小春J", "在原七海J", "綾地寧々H", "因幡めぐるH", "朝武芳乃H", "常陸茉子H", "ムラサメH", "鞍馬小春H", "在原七海H"]

export class Voice extends plugin {
  constructor() {
    super({
      name: "语音合成",
      dsc: "语音合成",
      event: "message",
      priority: 10,
      rule: [
        {
          reg: `^#(${GenshinVoiceSpeakers.join("|")}|${ChatWaifuSpeakers.join("|")})(高清)?(本地)?(高清)?说.+`,
          fnc: "Voice"
        },
        {
          reg: "^#?音色列表$",
          fnc: "VoiceList"
        },
        {
          reg: "^#?停止语音合成$",
          fnc: "VoiceStop"
        }
      ]
    })
  }

  async execSync(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr })
      })
    })
  }

  async Voice(e) {
    let msg = this.e.msg.split("说")
    let speaker = msg.shift()
    let text = msg.join("说").replace("'", "").trim()
    speaker = speaker.replace("#", "")

    //标记是否使用高清语音
    let transcoding = false
    if (!speaker.match("高清"))
      transcoding = true
    else
      speaker = speaker.replace("高清", "")
    speaker = speaker.replace("高清", "")

    //标记是否使用本地合成
    let use_api = false
    if (!speaker.match("本地"))
      use_api = true
    else
      speaker = speaker.replace("本地", "")

    let url
    let path
    let speakerid
    if (ChatWaifuSpeakers.indexOf(speaker) != -1) {
      speakerid = ChatWaifuSpeakers.indexOf(speaker)
      if (config.Voice.ChatWaifuApi && use_api) {
        url = `${config.Voice.ChatWaifuApi}?user_id=${this.e.user_id}&bot_id=${Bot.uin}&id=${speakerid}&text=${encodeURIComponent(text)}`
      } else {
        path = ChatWaifuPath
      }
    } else {
      if (GenshinVoiceSpeakers.indexOf(speaker) == -1) {
        for (let rolename of Object.values(AllAbbr)) {
          if (rolename.includes(speaker)) {
            speaker = rolename[0]
            break
          }
        }

        if (GenshinVoiceSpeakers.indexOf(speaker) == -1) {
          logger.warn(`[语音合成] 不存在该角色：${logger.yellow(speaker)}`)
          return false
        }
      }

      speakerid = GenshinVoiceSpeakers.indexOf(speaker)
      if (config.Voice.publicApi && use_api) {
        url = `https://yuanshenai.azurewebsites.net/api?speaker=${encodeURIComponent(speaker)}&text=${encodeURIComponent(text)}`
      } else {
        if (config.Voice.GenshinVoiceApi && use_api) {
          url = `${config.Voice.GenshinVoiceApi}?user_id=${this.e.user_id}&bot_id=${Bot.uin}&id=${speakerid}&text=${encodeURIComponent(text)}`
        } else {
          speakerid = LocalGenshinVoiceSpeakers.indexOf(speaker)
          path = GenshinVoicePath
        }
      }
    }

    logger.mark(`[语音合成] ${logger.blue(`${speaker}(${speakerid})`)} 说 ${logger.cyan(text)}`)

    if (Running) {
      await this.reply("有正在生成的语音任务，请稍后重试……", true)
      return false
    }
    Running = true

    if (path) {
      let cmd = `bash '${path}main.sh' output.wav ${speakerid} '${text}'`

      logger.mark(`[语音合成] 执行：${logger.blue(cmd)}`)
      let ret = await this.execSync(cmd)
      logger.mark(`[语音合成]\n${ret.stdout.trim()}\n${logger.red(ret.stderr.trim())}`)

      if (ret.error) {
        logger.error(`语音合成错误：${logger.red(ret.error)}`)
        await this.reply(`语音合成错误：${ret.error}`, true)
        await this.reply(errorTips)
        Running = false
        return false
      }
      url = `file://${path}output.wav`
    }

    logger.mark(`[语音合成] 发送语音：${logger.blue(url)}`)

    let result = await this.reply(
      await uploadRecord(url, 68714, transcoding)
    )
    if (!transcoding) {
      let message = await Bot.getMsg(result.message_id);
      if (Array.isArray(message.message)) message.message.push({ type: 'text', text: '[语音]' });
      (e.group || e.friend)?.sendMsg('Win系统勿点！点击后bug解决方案见#音色列表', message);
    }
    Running = false
  }

  async VoiceStop(e) {
    if (Running) {
      Running = false
    } else {
      await this.reply("分明就没在运行啊。不过我还是把上次生成的语音发你吧。")
    }
    if (fs.existsSync(`${process.cwd()}/plugins/TRSS-Plugin/GenshinVoice/output.wav`)) {
      await this.reply(
        await uploadRecord(`${process.cwd()}/plugins/TRSS-Plugin/GenshinVoice/output.wav`, 68714, true)
      )
    } else {
      await this.reply("报告！没有找到上次生成的语音！")
    }
  }



  async VoiceList(e) {
    let forwardMsg = [
      {
        message: `发送“#角色名说中文”即可执行语音合成。`,
        user_id: Bot.uin,
        nickname: "使用帮助"
      },
      {
        message: `默认用接口合成且转码，需要高清语音请在角色名后面加“高清”(Win系统听不了)，接口失效请在角色名后面加“本地”。本地合成支持的角色较少。`,
        user_id: Bot.uin,
        nickname: "附加说明"
      },
      {
        message: `米哈游支持角色：\n${GenshinVoiceSpeakers.join("，")}`,
        user_id: Bot.uin,
        nickname: "支持角色名"
      },
      {
        message: `柚子社支持角色：\n${ChatWaifuSpeakers.join("，")}`,
        user_id: Bot.uin,
        nickname: "支持角色名"
      },
      {
        message: `使用例：\n#可莉说硫酸钡哥哥早上好！\n#神里绫华本地说萝莉控真的是，没救了。\n#戴因斯雷布高清说好久没谜语人了。\n#珊瑚宫心海高清本地说为什么要给我带千岩套！\n#散兵本地高清说不抽我的小心我让我妈给你做饭吃！`,
        user_id: Bot.uin,
        nickname: "具体用例"
      },
      {
        message: `#停止语音合成 可以发送可能已完成但未发送的语音，并标记运行状态为已完成。如果实际上还未完成，完成后依旧会发送完成的语音。`,
        user_id: Bot.uin,
        nickname: "中止语音合成"
      },
      {
        message: `如果Win系统点击了高清语音导致bug，解决方案是：\n禁用全部音频设备→重启电脑→启用之前禁用的音频设备`,
        user_id: Bot.uin,
        nickname: "BUG修复"
      },
    ]
    if (e.isGroup) {
      forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    }
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title size=\"34\" maxLines=\"2\" lineSpace=\"12\">#音色列表</title><title color="#777777" size="26">原神语音合成帮助</title>`)
    await e.reply(forwardMsg)
  }
}