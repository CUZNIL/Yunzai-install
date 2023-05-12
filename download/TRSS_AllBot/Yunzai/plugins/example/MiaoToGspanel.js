/*
功能：将miao-plugin产生的面板数据适配到gspanel，以便数据更新。推荐搭配https://gitee.com/CUZNIL/Yunzai-install。
项目地址：https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel
发送#面板通用化帮助 来获取详细帮助~
//*/

let 最近一次编辑时间 = "2023年5月12日17:16:19"

let resource = "resources/MiaoToGspanel/"
let MiaoPath = "data/UserData/"
let GspanelPath = "plugins/py-plugin/data/gspanel/cache/"
let MiaoResourecePath = "plugins/miao-plugin/resources/meta/"
let ThisFilePath = "plugins/example/MiaoToGspanel.js"

/*
resource:该插件产生的中间文件存放的文件夹位置。download函数会默认下载文件到该位置。
MiaoPath：miao-plugin产生的面板数据路径，一般不用手动修改。
GspanelPath：nonebot-plugin-gspanel产生的面板数据路径，需要手动配置到自己安装的路径。
MiaoResourecePath：miao-plugin安装位置下对应的资料数据存放路径，一般不用修改。
ThisFilePath：你安装该js插件的位置，一般不用修改。
如果你搭配我的云崽安装教程来安装gspanel，则不需要更改任何内容。云崽安装教程：https://gitee.com/CUZNIL/Yunzai-install
修改请注意保留结尾的“/”

以下内容一般不需要你手动修改，除非你需要高度个性化。需要请自行操刀。
//*/
import fs from 'node:fs'
import fetch from "node-fetch";

let redisStart = "Yz:genshin:mys:qq-uid:"
let errorTIP = "请仔细阅读README，你没有正确配置！可能是以下原因：\n1.你不是通过py-plugin安装的nonebot-plugin-gspanel\n2.你没有正确配置nonebot-plugin-gspanel\n3.你没有正确配置本js插件\n。。。\n为解决本问题请自行阅读https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel"
let pluginINFO = "【MiaoToGspanel插件】"
let thisRepoDownload = "https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel/raw/master/download/"
let GenshinDataRepoDownload = "https://gitlab.com/Dimbreath/AnimeGameData/-/raw/master/ExcelBinOutput/"
if (!fs.existsSync(resource)) {
  console.log(`${pluginINFO}检测到没有文件夹${resource}！即将创建该文件夹用于存放插件运行必要的数据！`)
  await mkdir(resource)
  console.log(`${pluginINFO}新建文件夹成功，接下来会在该文件夹下载必要文件！`)
  await download(thisRepoDownload, "WeaponID_To_IconName.json")
  await download(thisRepoDownload, "PlayerElem_To_ConsIconName.json")
  await download(thisRepoDownload, "attr_map.json")
  await download(thisRepoDownload, "dataRelicSet.json")
  await download(thisRepoDownload, "dataRelicMain.json")
  console.log(`${pluginINFO}下载成功！如有疑问请发送#面板适配帮助！`)
}
//char_data_Gspanel:Gspanel面板的所有角色的资料
let char_data_Gspanel = JSON.parse(fs.readFileSync(GspanelPath + "../char-data.json"))
//WeaponID_To_IconName:武器ID到图标名称的映射
let WeaponID_To_IconName
//PlayerElem_To_ConsIconName:旅行者元素到命座图标的映射
let PlayerElem_To_ConsIconName
//attr_map:属性id到属性英文的映射+属性英文到属性中文的映射
let attr_map
//dataRelicSet:圣遗物名称→套装名称 套装名称→套装id 套装id→套装效果
let dataRelicSet
//dataRelicMain:圣遗物主词条→[星级→[等级→数值]]
let dataRelicMain
try {
  WeaponID_To_IconName = JSON.parse(fs.readFileSync(resource + "WeaponID_To_IconName.json"))
  PlayerElem_To_ConsIconName = JSON.parse(fs.readFileSync(resource + "PlayerElem_To_ConsIconName.json"))
  attr_map = JSON.parse(fs.readFileSync(resource + "attr_map.json"))
  dataRelicSet = JSON.parse(fs.readFileSync(resource + "dataRelicSet.json"))
  dataRelicMain = JSON.parse(fs.readFileSync(resource + "dataRelicMain.json"))
} catch (e) {
  console.log(`${pluginINFO}${logger.red(e)}\n${pluginINFO}推测报错原因为没有插件运行必要的文件，即将尝试下载所有文件以便调用！`)

  await download(thisRepoDownload, "WeaponID_To_IconName.json")
  console.log(`${pluginINFO}下载完毕！该文件可能过时！\n${pluginINFO}如出现武器图标错误请发送#武器数据更新 。\n下载位置：${resource}WeaponID_To_IconName.json`)

  await download(thisRepoDownload, "PlayerElem_To_ConsIconName.json")
  console.log(`${pluginINFO}下载完毕！该文件可能过时！\n${pluginINFO}如出现旅行者命座图标错误请发送#主角命座更新 。\n下载位置：${resource}PlayerElem_To_ConsIconName.json`)

  await download(thisRepoDownload, "attr_map.json")
  console.log(`${pluginINFO}下载完毕！该文件可能过时！\n${pluginINFO}如出现属性昵称错误请发送#属性映射更新 。\n下载位置：${resource}attr_map.json`)

  await download(thisRepoDownload, "dataRelicSet.json")
  console.log(`${pluginINFO}下载完毕！该文件可能过时！\n${pluginINFO}如出现圣遗物套装错误请发送#圣遗物套装更新 。\n下载位置：${resource}dataRelicSet.json`)

  await download(thisRepoDownload, "dataRelicMain.json")
  console.log(`${pluginINFO}下载完毕！该文件可能过时！\n${pluginINFO}如出现圣遗物主词条大小错误请发送#圣遗物主词条更新 。\n下载位置：${resource}dataRelicMain.json`)

  try {
    WeaponID_To_IconName = JSON.parse(fs.readFileSync(resource + "WeaponID_To_IconName.json"))
    PlayerElem_To_ConsIconName = JSON.parse(fs.readFileSync(resource + "PlayerElem_To_ConsIconName.json"))
    attr_map = JSON.parse(fs.readFileSync(resource + "attr_map.json"))
    dataRelicSet = JSON.parse(fs.readFileSync(resource + "dataRelicSet.json"))
    dataRelicMain = JSON.parse(fs.readFileSync(resource + "dataRelicMain.json"))
  } catch (e2) {
    console.log(`${logger.red(`${pluginINFO}${e2}\n${pluginINFO}没有解决报错！请将日志反馈到下面的项目地址处！\nhttps://gitee.com/CUZNIL/Yunzai-MiaoToGspanel/issues\n反馈issue可以帮助改善插件！`)}`)
  }
}
//部分没必要更新的数据，直接写在这里拿来用了。transElement和trans。
let transElement = {
  "pyro": "火", "hydro": "水", "cryo": "冰", "electro": "雷", "anemo": "风", "geo": "岩", "dendro": "草",
}
let trans = {
  //突破等级
  "Promote": [1, 20, 40, 50, 60, 70, 80, 90],
  //属性翻译，用于武器副词条、突破属性等。
  "hpPct": "生命值百分比", "atkPct": "攻击力百分比", "defPct": "防御力百分比", "dmg": "伤加成",
  //属性翻译，用于圣遗物词条。
  "hpPlus": "生命值", "hp": "生命值百分比", "atkPlus": "攻击力", "atk": "攻击力百分比", "defPlus": "防御力", "def": "防御力百分比", "recharge": "充能效率", "mastery": "元素精通", "cpct": "暴击率", "cdmg": "暴击伤害", "heal": "治疗加成", "pyro": "火伤加成", "electro": "雷伤加成", "cryo": "冰伤加成", "hydro": "水伤加成", "anemo": "风伤加成", "geo": "岩伤加成", "dendro": "草伤加成", "phy": "物伤加成",
  //圣遗物位置→圣遗物id结尾
  "1": 4, "2": 2, "3": 5, "4": 1, "5": 3,
}
export class MiaoToGspanel extends plugin {
  constructor() {
    super({
      name: '面板适配',
      event: 'message',
      priority: -233,
      rule: [
        {
          reg: '^#?转换(全部|所有)(喵喵|PY)?面(板|包)$',
          fnc: 'M2G_all',
          permission: 'master'
        },
        {
          reg: '^#?转换(喵喵|PY)?面(板|包)(\\d{9})?$',
          fnc: 'M2G_query'
        },
        {
          reg: '^#?(面(板|包))?(转换|适配|(通用化?))(面(板|包))?(帮助|菜单|help)$',
          fnc: 'help'
        },
        //以下命令都是尝试主动更新数据，如果你没有遇到BUG请不要尝试发送以下命令(以免bug)
        {
          reg: '^#?武器数据更新$',
          fnc: 'weaponUpdate',
          permission: 'master'
        },
        {
          reg: '^#?主角命座更新$',
          fnc: 'playerUpdate',
          permission: 'master'
        },
        {
          reg: '^#?属性映射更新$',
          fnc: 'attrUpdate',
          permission: 'master'
        },
        {
          reg: '^#?圣遗物套装更新$',
          fnc: 'relicUpdate',
          permission: 'master'
        },
        {
          reg: '^#?圣遗物主词条更新$',
          fnc: 'relicMainUpdate',
          permission: 'master'
        },
        {
          reg: '^#转换面板插件更新$',
          fnc: 'selfUpdate',
          permission: 'master'
        },
        {
          reg: '^#转换面板插件强制更新$',
          fnc: 'forceSelfUpdate',
          permission: 'master'
        }
      ]
    })
  }
  async M2G_all() {
    if (!fs.existsSync(GspanelPath)) {
      this.reply(errorTIP)
      return false
    }
    let TimeStart = new Date().getTime()
    let KEYtoUID = await redis.keys(redisStart + "*")
    let qq2uid = JSON.parse(fs.readFileSync(GspanelPath + "../qq-uid.json"))
    let ErrorList = []
    let succeed = 0
    let fail = 0
    let empty = 0
    console.log(pluginINFO + `开始转换${KEYtoUID.length}个uid，下面是转换失败的数据对应的uid和报错信息。`)
    if (KEYtoUID.length > 200) this.reply(`redis里存了${KEYtoUID.length}个uid呢，可能要转换半分钟左右哦。`)
    let TimeLastLog = new Date().getTime()
    for (let key of KEYtoUID) {
      let uid = await redis.get(key)
      if (!fs.existsSync(MiaoPath + `${uid}.json`)) {
        empty++
      } else {
        let qq = await key.match(/\d+/g)
        let result = await this.M2G(uid)
        let TimeNow = await new Date().getTime()
        if (TimeNow - TimeLastLog > 300) {
          //想自己调整日志输出间隔就改上面的if里面的数字，单位ms。
          console.log(pluginINFO + "成功" + succeed + `${fail ? `个,失败${fail}` : ""}个,进度${succeed + fail + empty}/` + KEYtoUID.length)
          TimeLastLog = TimeNow
        }
        qq2uid[qq] = uid
        if (result == true) succeed++
        else {
          fail++
          ErrorList.push(result)
        }
      }
    }
    await fs.writeFileSync(await GspanelPath.concat("../qq-uid.json"), JSON.stringify(qq2uid))
    let TimeEnd = await new Date().getTime()
    this.reply(`报告主人！本次转换总计统计到${KEYtoUID.length}个uid，其中：\n${succeed ? `成功转换${succeed}个面板数据！` : "我超，所有转换都失败了，牛逼！"}\n${empty ? `没有面板数据的有${empty}个` : "没发现没有面板数据的用户"}！\n${fail ? `转换失败的有${fail}个` : "没有出现转换失败(好耶)"}！\n本次转换总计用时${((TimeEnd - TimeStart) / 1000).toFixed(1)}s~${fail ? "\n为了避免过量信息导致风控，请自行查看后台日志喵~" : ""}`)
    console.log("以下是本次转换的报错信息（如果有的话）\n" + ErrorList)
  }
  async M2G_query() {
    if (!fs.existsSync(GspanelPath)) {
      this.reply(errorTIP)
      return false
    }
    let uid = await this.e.msg.match(/\d+/g)
    let qq = await this.e.user_id
    if (!uid) {
      //如果uid为空，即未输入uid。根据发言人QQ判断其uid，查找失败提示。
      uid = await this.findUID(qq)
      if (!uid) {
        //如果uid为空，即redis没有绑定数据
        this.reply("哎呀！你好像没有绑定原神uid呢！发送“#绑定123456789”来绑定你的原神uid！")
        return false
      }
    } else {
      uid = uid[0]
    }
    if (!fs.existsSync(MiaoPath.concat(`${uid}.json`))) {
      this.reply("没有面板数据是不可以转换的！发送“#更新面板”来更新面板数据~")
      return false
    }
    let result = await this.M2G(uid)
    let qq2uid = JSON.parse(fs.readFileSync(GspanelPath.concat("../qq-uid.json")))
    qq2uid[qq] = uid
    fs.writeFileSync(await GspanelPath.concat("../qq-uid.json"), JSON.stringify(qq2uid))
    if (result == true) this.reply(`成功转换UID${uid}的面板数据~`)
    else this.reply(`转换UID${uid}的面板数据失败了orz，报错信息：\n${result}`)
  }
  async M2G(uid) {
    try {
      //调用前已经判断过该uid一定有面板数据，并且所有路径无误，所以接下来就是修改面板数据以适配Gspanel
      //修正面板数据，在对应目录生成文件。返回值表示处理结果(true：转换成功，其他返回值：转换失败。失败时返回报错内容以便查看日志。)
      let Miao = JSON.parse(fs.readFileSync(MiaoPath.concat(`${uid}.json`)))
      let Gspanel = { "avatars": [], "next": Math.floor(Miao._profile / 1000) }
      for (let i in Miao.avatars) {
        //MiaoChar：喵喵面板的具体一个角色的数据
        let MiaoChar = Miao.avatars[i]
        //如果没有武器数据，则跳过该面板。（这个理论上应该都有啊。。不知道为啥会出现没有武器的我靠）
        if (MiaoChar.weapon.name == undefined) {
          console.log(pluginINFO.concat(`UID${uid}${MiaoChar.name}没有武器信息故跳过，以下是他${MiaoChar.name}的武器信息：`))
          console.log(MiaoChar.weapon)
          continue
        }
        //如果数据来源是米游社，那根本就不会有带圣遗物的面板数据，取消执行。Miao的数据似乎有点问题，米游社来源可能误标enka，需要后期检查。
        if (MiaoChar._source == "mys") continue;
        //用参数NoData标记本面板是否有足量数据（具体来讲，是否有圣遗物详情）
        let NoData = null
        //char_Miao：喵喵的具体一个角色的资料
        let char_Miao = JSON.parse(fs.readFileSync(MiaoResourecePath.concat(`character/${MiaoChar.name}/data.json`)))
        //result：Gspanel面板的具体一个角色的数据
        let result = {
          "id": char_Miao.id,
          "rarity": char_Miao.star,
          "name": MiaoChar.name,
          "slogan": char_Miao.title,
          "element": transElement[MiaoChar.elem],
          "cons": MiaoChar.cons,
          "fetter": MiaoChar.fetter,
          "level": MiaoChar.level,
          "icon": "UI_AvatarIcon_PlayerBoy",
          "gachaAvatarImg": "UI_Gacha_AvatarImg_PlayerBoy",
          "baseProp": {
            "生命值": 0,
            "攻击力": 0,
            "防御力": 0
          },
          "fightProp": {
            "生命值": 0,
            "攻击力": 0,
            "防御力": 0,
            "暴击率": 5,
            "暴击伤害": 50,
            "治疗加成": 0,
            "元素精通": 0,
            "元素充能效率": 100,
            "物理伤害加成": 0,
            "火元素伤害加成": 0,
            "水元素伤害加成": 0,
            "风元素伤害加成": 0,
            "雷元素伤害加成": 0,
            "草元素伤害加成": 0,
            "冰元素伤害加成": 0,
            "岩元素伤害加成": 0
          },
          "skills": { "a": { "style": "", "icon": "Skill_A_01", "level": MiaoChar.talent.a, "originLvl": MiaoChar.talent.a }, "e": { "style": "", "icon": "Skill_S_Player_01", "level": MiaoChar.talent.e, "originLvl": MiaoChar.talent.e }, "q": { "style": "", "icon": "Skill_E_Player", "level": MiaoChar.talent.q, "originLvl": MiaoChar.talent.q } }, "consts": [],
          "weapon": {
            "id": 114514,
            "rarity": 1919810,
            "name": MiaoChar.weapon.name,
            "affix": MiaoChar.weapon.affix,
            "level": MiaoChar.weapon.level,
            "icon": "牛逼啊",
            "main": 32767,
            "sub": {
              "prop":
                "涩涩之力",
              "value": "99.9%"
            }
          },
          "relics": [],
          "relicSet": {},
          "relicCalc": {
            "rank": "ACE",
            "total": 233.3
          },
          "damage": {
            "level": "玩得好就是挂？",
            "data": [
              [
                "普攻第一段伤害",
                "2147483647",
                "2147483647"
              ]
            ],
            "buff": [
              [
                "大伟哥的注视",
                "所有伤害都能对怪物造成即死效果，且跳过死亡动画。"
              ]
            ]
          },
          "time": Math.floor(MiaoChar._time / 1000)
        }

        /**处理技能与命座 */
        if (result.cons >= char_Miao.talentCons.e) {
          result.skills.e.style = "extra"
          result.skills.e.level += 3
        }
        if (result.cons >= char_Miao.talentCons.q) {
          result.skills.q.style = "extra"
          result.skills.q.level += 3
        }
        if (MiaoChar.id == "10000007" || MiaoChar.id == "10000005") {
          //主角在Gspanel的char-data.json没有数据！只能单独设置了orz
          if (MiaoChar.id == "10000007") {
            //如果是妹妹
            result.icon = "UI_AvatarIcon_PlayerGirl"
            result.gachaAvatarImg = "UI_Gacha_AvatarImg_PlayerGirl"
          }
          result.consts = [{ "style": "", "icon": PlayerElem_To_ConsIconName[`${result.element}`][0] }, { "style": "", "icon": PlayerElem_To_ConsIconName[`${result.element}`][1] }, { "style": "", "icon": PlayerElem_To_ConsIconName[`${result.element}`][2] }, { "style": "", "icon": PlayerElem_To_ConsIconName[`${result.element}`][3] }, { "style": "", "icon": PlayerElem_To_ConsIconName[`${result.element}`][4] }, { "style": "", "icon": PlayerElem_To_ConsIconName[`${result.element}`][5] }]
        } else {
          //char_Gspanel：Gspanel的具体一个角色的资料
          let char_Gspanel = char_data_Gspanel[MiaoChar.id]
          try {
            //有皮肤，用对应图标
            result.icon = char_Gspanel.Costumes[MiaoChar.costume].icon
            result.gachaAvatarImg = char_Gspanel.Costumes[MiaoChar.costume].art
            //用try是因为Miao面板数据早期数据和新数据格式差距过大。。原来用的if一堆毛病
          } catch (JiuMingA) {
            //没皮肤，用默认图标
            result.icon = char_Gspanel.iconName
            result.gachaAvatarImg = `UI_Gacha_AvatarImg_${char_Gspanel.Name}`
          }
          //技能图标
          result.skills.a.icon = char_Gspanel.Skills[char_Gspanel.SkillOrder[0]]
          result.skills.e.icon = char_Gspanel.Skills[char_Gspanel.SkillOrder[1]]
          result.skills.q.icon = char_Gspanel.Skills[char_Gspanel.SkillOrder[2]]
          result.consts = [{ "style": "", "icon": char_Gspanel.Consts[0] }, { "style": "", "icon": char_Gspanel.Consts[1] }, { "style": "", "icon": char_Gspanel.Consts[2] }, { "style": "", "icon": char_Gspanel.Consts[3] }, { "style": "", "icon": char_Gspanel.Consts[4] }, { "style": "", "icon": char_Gspanel.Consts[5] }]
        }
        switch (result.cons) {
          //根据命座决定图标是否亮起
          case 0:
            result.consts[0].style = "off"
          case 1:
            result.consts[1].style = "off"
          case 2:
            result.consts[2].style = "off"
          case 3:
            result.consts[3].style = "off"
          case 4:
            result.consts[4].style = "off"
          case 5:
            result.consts[5].style = "off"
          case 6:
          //六命富哥，命座全亮捏。
        }

        /**处理武器数据 */
        //weapon_miao：Miao具体一个武器的资料
        let weapon_miao
        try {
          weapon_miao = JSON.parse(fs.readFileSync(MiaoResourecePath.concat(`weapon/${char_Miao.weapon}/${result.weapon.name}/data.json`)))
        } catch (errorWeaponData) {
          console.log(logger.red(`${pluginINFO}UID${uid}的${result.name}使用了${result.weapon.name}，还请自行判断该角色是否可以使用该武器。如果该角色在原版游戏中可以携带该武器，请更新miao-plugin来尝试修复该问题。以下是命令执行报错：\n`) + errorWeaponData)
          return false
        }
        result.weapon.id = weapon_miao.id
        try {
          result.weapon.icon = WeaponID_To_IconName[result.weapon.id]
        } catch (errorWeaponIcon) {
          console.log(logger.red(`${pluginINFO}疑似找不到武器id${result.weapon.id}对应的图标数据。请发送`) + "#武器数据更新" + logger.red(`来获取最新武器图标数据尝试修复该问题。以下是命令执行报错：\n`) + errorWeaponIcon)
          return false
        }
        result.weapon.rarity = weapon_miao.star
        result.weapon.sub.prop = trans[weapon_miao.attr.bonusKey]
        let levelUP = trans.Promote[MiaoChar.weapon.promote + 1]
        let levelDN = trans.Promote[MiaoChar.weapon.promote]
        if (!MiaoChar.weapon.promote) {
          //如果调用1级数据，为简化代码生成1+级数据。
          weapon_miao.attr.atk["1+"] = weapon_miao.attr.atk["1"]
          weapon_miao.attr.bonusData["1+"] = weapon_miao.attr.bonusData["1"]
        }
        //根据我的测试结果和enka的数据，中间等级都是线性关系，如果出现错误请反馈。

        result.weapon.main = await this.calcBetween(weapon_miao.attr.atk, result.weapon.level, levelUP, levelDN)

        result.weapon.sub.value = String(await this.calcBetween(weapon_miao.attr.bonusData, result.weapon.level, levelUP, levelDN))

        /**处理白值 */

        let charPromote
        if (MiaoChar.id == "10000007" || MiaoChar.id == "10000005") {
          //如果是主角需要单独处理，直接假设是满级。
          result.baseProp.生命值 = char_Miao.baseAttr.hp
          result.baseProp.攻击力 = char_Miao.baseAttr.atk + result.weapon.main
          result.baseProp.防御力 = char_Miao.baseAttr.def
          let map = [0, 0, 1, 2, 2, 3, 4]
          charPromote = { "prop": "攻击力百分比", "value": 6 * map[MiaoChar.promote] }
        } else {
          //char_Miao_detail：Miao具体一个角色的资料的生命、攻击、防御、突破属性。请注意，主角没有这类数据！
          let char_Miao_detail = JSON.parse(fs.readFileSync(MiaoResourecePath.concat(`character/${MiaoChar.name}/detail.json`))).attr

          levelUP = trans.Promote[MiaoChar.promote + 1]
          levelDN = trans.Promote[MiaoChar.promote]
          if (!MiaoChar.promote) {
            //如果调用1级数据，为简化代码生成1+级数据。
            char_Miao_detail.details["1+"] = char_Miao_detail.details["1"]
          }
          //根据我的测试结果和enka的数据，中间等级都是线性关系，如果出现错误请反馈。
          result.baseProp.生命值 = await this.calcBetween2(char_Miao_detail.details, result.level, 0, levelUP, levelDN)
          result.baseProp.攻击力 = await this.calcBetween2(char_Miao_detail.details, result.level, 1, levelUP, levelDN) + result.weapon.main
          result.baseProp.防御力 = await this.calcBetween2(char_Miao_detail.details, result.level, 2, levelUP, levelDN)
          result.fightProp.生命值 = result.baseProp.生命值
          result.fightProp.攻击力 = result.baseProp.攻击力
          result.fightProp.防御力 = result.baseProp.防御力
          /**处理角色突破属性和武器属性 */
          charPromote = { "prop": trans[char_Miao_detail.keys[3]], "value": char_Miao_detail.details[`${levelDN}+`][3] }
          if (charPromote.prop == "伤加成") {
            charPromote.prop = await result.element + charPromote.prop
          }
        }
        let calc = await this.calcAttr(result.baseProp, charPromote)
        result.fightProp[calc.prop] += calc.value
        if (result.weapon.rarity > 2) {
          //仅当稀有度至少三星时，武器才有副属性。
          calc = await this.calcAttr(result.baseProp, result.weapon.sub)
          if (calc.change) {
            result.weapon.sub.prop = result.weapon.sub.prop.replace("百分比", "")
            result.weapon.sub.value = `${result.weapon.sub.value}%`
          } else {
            result.weapon.sub.value = result.weapon.sub.value.toString()
          }
          result.fightProp[calc.prop] += calc.value
        }
        /**处理圣遗物数据 */
        for (let j in MiaoChar.artis) {
          //MiaoArtis：Miao的具体圣遗物
          let MiaoArtis = MiaoChar.artis[j]
          if (MiaoArtis.mainId == undefined && MiaoArtis.main == undefined) {
            //没有圣遗物数据
            NoData = MiaoChar.artis
            break
          }
          if (MiaoArtis.main == undefined) {
            //如果没有主词条数据，则表示是新版喵喵数据，采用属性ID。那么预先处理一下属性ID转为旧版喵喵数据的{key,value}的格式，以便后续处理。
            MiaoArtis.main = {
              "key": attr_map[MiaoArtis.mainId],
              //主词条根据星级、等级和key给value
              "value": dataRelicMain[attr_map[MiaoArtis.mainId]][MiaoArtis.star][MiaoArtis.level]
            }
            MiaoArtis.attrs = [{}, {}, {}, {}]
            for (let k in MiaoArtis.attrIds) {
              let Effect = attr_map[MiaoArtis.attrIds[k]]
              for (let j in MiaoArtis.attrs) {
                if (MiaoArtis.attrs[j].key == undefined) {
                  //如果这个位置还没有属性
                  MiaoArtis.attrs[j].key = Effect.key
                  MiaoArtis.attrs[j].value = Effect.value
                  break
                }
                if (MiaoArtis.attrs[j].key == Effect.key) {
                  //如果这个位置的属性正是Effect对应的
                  MiaoArtis.attrs[j].value += Effect.value
                  break
                }
              }
            }
            for (let k in MiaoArtis.attrs) {
              if (MiaoArtis.attrs[k].value == undefined) continue
              MiaoArtis.attrs[k].value = Number(MiaoArtis.attrs[k].value.toFixed(5))
            }
          }
          //artis：Gspanel的具体圣遗物
          let artis = {
            "pos": Number(j),
            "rarity": MiaoArtis.star,
            "name": MiaoArtis.name,
            "setName": dataRelicSet[MiaoArtis.name],
            "level": MiaoArtis.level,
            "main": {
              "prop": trans[MiaoArtis.main.key],
              "value": MiaoArtis.main.value
            },
            "sub": [
              {
                "prop": trans[MiaoArtis.attrs[0].key],
                "value": MiaoArtis.attrs[0].value
              },
              {
                "prop": trans[MiaoArtis.attrs[1].key],
                "value": MiaoArtis.attrs[1].value
              },
              {
                "prop": trans[MiaoArtis.attrs[2].key],
                "value": MiaoArtis.attrs[2].value
              },
              {
                "prop": trans[MiaoArtis.attrs[3].key],
                "value": MiaoArtis.attrs[3].value
              }
            ],
            "calc": {
              //你好！评分部分我先暂时搁置了！因为我个人只需要队伍伤害，该功能不需要评分。
              "rank": "ACE",
              "total": 66.6,
              "nohit": 45,
              "main": 77.7,
              "sub": [
                {
                  "style": "great",
                  "goal": 6.6
                },
                {
                  "style": "use",
                  "goal": 5.5
                },
                {
                  "style": "unuse",
                  "goal": 4.4
                },
                {
                  "style": "great",
                  "goal": 3.3
                }
              ],
              "main_pct": 100.0,
              "total_pct": 98.7
            },
            "icon": `UI_RelicIcon_${dataRelicSet[dataRelicSet[MiaoArtis.name]]}_${trans[j]}`
          }
          if (result.relicSet[artis.setName])
            result.relicSet[artis.setName]++
          else
            result.relicSet[artis.setName] = 1
          //处理artis.main→fightProp
          calc = await this.calcAttr(result.baseProp, artis.main)
          if (calc.change) {
            artis.main.prop = artis.main.prop.replace("百分比", "")
            artis.main.value = `${artis.main.value}%`
          } else {
            artis.main.value = artis.main.value.toString()
          }
          result.fightProp[calc.prop] += calc.value
          //artis.sub→fightProp
          for (let k in artis.sub) {
            if (artis.sub[k].prop == undefined) continue
            calc = await this.calcAttr(result.baseProp, artis.sub[k])
            if (calc.change) {
              artis.sub[k].prop = artis.sub[k].prop.replace("百分比", "")
              artis.sub[k].value = `${artis.sub[k].value}%`
            } else {
              artis.sub[k].value = artis.sub[k].value.toString()
            }
            result.fightProp[calc.prop] += calc.value
          }
          result.relics.push(artis)
        }
        if (NoData) {
          //如果没有圣遗物详细数据，则跳过该面板。
          console.log(pluginINFO.concat(`UID${uid}${result.name}的圣遗物没有详细数据故跳过，以下是他${result.name}的圣遗物：`))
          console.log(NoData)
          continue
        }
        for (let j in result.relicSet) {
          let Effect = dataRelicSet[dataRelicSet[j]]
          if (Effect != undefined && result.relicSet[j] >= 2) {
            //仅当二件套触发且效果为属性时尝试转换
            if (Effect[0].includes("百分比")) {
              Effect[0] = Effect[0].replace("百分比", "")
              Effect[1] = result.baseProp[Effect[0]] * Effect[1] / 100
            }
            result.fightProp[Effect[0]] += Effect[1]
          }
        }
        /**将baseProph和fightProp约分到合适位数 */
        for (let j in result.baseProp)
          result.baseProp[j] = Number(result.baseProp[j].toFixed(2))
        for (let j in result.fightProp)
          result.fightProp[j] = Number(result.fightProp[j].toFixed(2))


        //SKIP：relics[i].calc relicCalc damage

        Gspanel.avatars.push(result)
      }


      /**写入数据 */
      fs.writeFileSync(await GspanelPath.concat(`${uid}.json`), JSON.stringify(Gspanel))
      return true
    } catch (e) {
      console.log(logger.red(`${pluginINFO}UID${uid}报错：\n${e}`))
      return `\n${pluginINFO}在处理UID${uid}的数据时：\n${logger.red(e)}`
    }
  }

  async help(e) {
    let forwardMsg = [
      {
        message: `#转换面板 #转换面板123456789\n将指定的喵喵面板转换为Gspanel面板。`,
        user_id: Bot.uin,
        nickname: "转换单个面板"
      },
      {
        message: `#转换全部面板\n将所有喵喵面板转换为Gspanel面板。`,
        user_id: Bot.uin,
        nickname: "转换全部面板"
      },
      {
        message: `#转换面板插件更新\n从gitee获取最新版本，安装到${ThisFilePath}。没有做处理失败的逻辑，如果失败请手动前往插件页更新。`,
        user_id: Bot.uin,
        nickname: "原地更新"
      },
      {
        message: `本插件地址：https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel/，github同用户名项目名，可能会保持更新。如遇bug请先尝试更新插件（发送#转换面板插件更新），没有解决请反馈到issue。\n本地版本最后一次编辑时间：${最近一次编辑时间}`,
        user_id: Bot.uin,
        nickname: "插件地址"
      },
      {
        message: `如需更改配置，请手动更改插件本体。当前配置：\n插件数据：${resource}\n\n喵喵面板位置：${MiaoPath}\n\nGspanel面板位置：${GspanelPath}\n\n喵喵资料位置：${MiaoResourecePath}\n\n一般需要手动配置Gspanel面板位置，具体位置请参考自己的py插件的配置。具体来讲，使用自己的Yunzai/plugins/py-plugin/config.yaml里的resources_dir的路径，加上cache即可。`,
        user_id: Bot.uin,
        nickname: "如需更改请手动更改"
      },
      {
        message: `#武器数据更新`,
        user_id: Bot.uin,
        nickname: "如出现武器图标错误"
      },
      {
        message: `#主角命座更新`,
        user_id: Bot.uin,
        nickname: "如出现旅行者命座图标错误"
      },
      {
        message: `#属性映射更新`,
        user_id: Bot.uin,
        nickname: "如出现属性昵称错误"
      },
      {
        message: `#圣遗物套装更新`,
        user_id: Bot.uin,
        nickname: "如出现圣遗物套装错误"
      },
      {
        message: `#圣遗物主词条更新`,
        user_id: Bot.uin,
        nickname: "如出现圣遗物主词条大小错误"
      }
    ]
    if (!this.e.isMaster) {
      forwardMsg.push({ message: `温馨提示：你不是主人，你只能使用 #转换面板`, user_id: Bot.uin, nickname: "主人判定" })
    }
    if (e.isGroup) {
      forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    }
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title size=\"34\" maxLines=\"2\" lineSpace=\"12\">#面板通用化帮助</title><title color="#777777" size="26">原神面板转换帮助</title>`)
    await e.reply(forwardMsg)
  }
  async calcAttr(baseProp, prop_and_value) {
    //根据词条和白值返回新的一组{prop,value,change}表示应该在fightProp的哪个prop上增加value，change为true时表示百分数，需要在原属性结尾添加%。
    let prop = prop_and_value.prop
    let value = Number(prop_and_value.value)
    let change = (prop.search(/加成|百分比|充能效率|暴击/g) != -1)
    if (prop.includes("百分比")) {
      prop = prop.replace("百分比", "")
      value = baseProp[prop] * value / 100
    } else {
      if (prop == "物伤加成") {
        prop = "物理伤害加成"
      } else {
        if (prop.includes("伤加成")) {
          prop = prop.replace("伤加成", "元素伤害加成")
        } else {
          if (prop.includes("充能效率"))
            prop = "元素充能效率"
        }
      }
    }
    return { prop, value, change }
  }
  async calcBetween(f, x, x_up, x_dn) {
    //根据对应关系f[x]和自变量x1、x2，线性计算f在二者之间的x对应的值，并返回二位小数。如果有index则f需要加上。
    return Number((((f[x_up] - f[x_dn + "+"]) * x - f[x_up] * x_dn + f[x_dn + "+"] * x_up) / (x_up - x_dn)).toFixed(2))
  }
  async calcBetween2(f, x, index, x_up, x_dn) {
    //根据对应关系f[x][index]和自变量x1、x2，线性计算f在二者之间的x对应的值，并返回二位小数。如果有index则f需要加上。
    return Number((((f[x_up][index] - f[x_dn + "+"][index]) * x - f[x_up][index] * x_dn + f[x_dn + "+"][index] * x_up) / (x_up - x_dn)).toFixed(2))
  }
  async findUID(QQ) {
    //根据QQ号判断对应uid，返回null表示没有对应uid。
    let uid = await redis.get(redisStart.concat(`${QQ}`))
    return uid
  }
  async weaponUpdate() {
    //#武器数据更新
    //数据来源：https://gitlab.com/Dimbreath/AnimeGameData/-/blob/master/ExcelBinOutput/WeaponExcelConfigData.json
    let TimeStart = await new Date().getTime()
    try {
      await download(GenshinDataRepoDownload, "WeaponExcelConfigData.json")
      let TimeDownload = await new Date().getTime()
      console.log(pluginINFO.concat(`下载完成！用时${TimeDownload - TimeStart}ms`))
      let ori = JSON.parse(fs.readFileSync(resource.concat("WeaponExcelConfigData.json")))
      let Teamp_WeaponID_To_IconName = await {}
      for (let i in ori) {
        Teamp_WeaponID_To_IconName[ori[i].id] = ori[i].icon
      }
      fs.writeFileSync(resource.concat(`../WeaponID_To_IconName.json`), JSON.stringify(Teamp_WeaponID_To_IconName))
      WeaponID_To_IconName = Teamp_WeaponID_To_IconName
      let FileSize = fs.statSync(resource.concat("WeaponExcelConfigData.json")).size
      fs.rmSync(resource.concat("WeaponExcelConfigData.json"))
      let TimeEnd = await new Date().getTime()
      this.reply(`成功更新武器图标数据~\n本次更新总计用时${TimeEnd - TimeStart}ms~\n其中下载资源花费${TimeDownload - TimeStart}ms~\n为避免空间浪费删除了非必要文件：\nWeaponExcelConfigData.json\n文件大小${(FileSize / 1024).toFixed(2)}KB`)
    } catch (e) {
      console.log(pluginINFO.concat(e))
      let TimeEnd = await new Date().getTime()
      this.reply(`更新失败了呜呜呜，请检查后台日志确认原因。用时${TimeEnd - TimeStart}ms`)
    }
  }
  async playerUpdate() {
    //#主角命座更新
    //数据来源：https://gitlab.com/Dimbreath/AnimeGameData/-/blob/master/ExcelBinOutput/AvatarTalentExcelConfigData.json
    let TimeStart = await new Date().getTime()
    try {
      await download(GenshinDataRepoDownload, "AvatarTalentExcelConfigData.json")
      let TimeDownload = await new Date().getTime()
      console.log(pluginINFO.concat(`下载完成！用时${TimeDownload - TimeStart}ms`))
      let ori = JSON.parse(fs.readFileSync(resource.concat("AvatarTalentExcelConfigData.json")))
      //如果版本有更新，需要手动维护后续元素映射transElem。
      let Temp_PlayerElem_To_ConsIconName = { "风": [], "岩": [], "雷": [], "草": [], "水": [], "火": [], "冰": [] }
      let transElem = { "915": "风", "917": "岩", "914": "雷", "913": "草" }
      for (let i in ori) {
        if (ori[i].mainCostItemId > 1000) continue
        let element = transElem[ori[i].mainCostItemId]
        Temp_PlayerElem_To_ConsIconName[element].push(ori[i].icon)
      }
      fs.writeFileSync(resource.concat("PlayerElem_To_ConsIconName.json"), JSON.stringify(Temp_PlayerElem_To_ConsIconName))
      PlayerElem_To_ConsIconName = Temp_PlayerElem_To_ConsIconName
      let FileSize = fs.statSync(resource.concat("AvatarTalentExcelConfigData.json")).size
      fs.rmSync(resource.concat("AvatarTalentExcelConfigData.json"))
      let TimeEnd = await new Date().getTime()
      this.reply(`成功更新主角命座图标数据~\n本次更新总计用时${TimeEnd - TimeStart}ms~\n其中下载资源花费${TimeDownload - TimeStart}ms~\n为避免空间浪费删除了非必要文件：\nAvatarTalentExcelConfigData.json\n文件大小${(FileSize / 1024).toFixed(2)}KB`)
    } catch (e) {
      console.log(pluginINFO.concat(e))
      let TimeEnd = await new Date().getTime()
      this.reply(`更新失败了呜呜呜，请检查后台日志确认原因。用时${TimeEnd - TimeStart}ms`)
    }
  }
  async attrUpdate() {
    //#属性映射更新
    //数据来源：https://gitee.com/yoimiya-kokomi/miao-plugin/blob/master/resources/meta/artifact/meta.js
    let TimeStart = await new Date().getTime()
    try {
      let ori = fs.readFileSync(MiaoResourecePath.concat("artifact/meta.js")).toString()
      let startM = ori.indexOf("mainIdMap")
      startM = ori.indexOf('{', startM)
      let startA = ori.indexOf("attrIdMap")
      if (startM == -1 || startA == -1) {
        this.reply(`【更新失败】\n怎么辉石呢？没有在文件${MiaoResourecePath}artifact/meta.js里找到mainIdMap、attrIdMap呢orz`)
        return false
      }
      let endM = startA
      startA = ori.indexOf('{', startA)
      let endA = ori.length
      while (ori[endM] != '}') endM--
      ori = ori.substring(startM, endM) + ',' + ori.substring(startA + 1, endA - 1)
      ori = ori.replaceAll("'", "")
      ori = ori.replaceAll(/(\w|\.)+/g, `"$&"`)
      ori = JSON.parse(ori.concat("}"))
      for (let i in ori) try {
        if (ori[i].key.search(/Plus|mastery/g) == -1) {
          //如果value是百分数，为了格式统一将其扩大为100倍
          ori[i].value = Number((Number(ori[i].value) * 100).toFixed(5))
        } else {
          ori[i].value = Number((Number(ori[i].value)).toFixed(5))
        }
      } catch (e) { }
      fs.writeFileSync(resource.concat("attr_map.json"), JSON.stringify(ori))
      attr_map = ori
      let TimeEnd = await new Date().getTime()
      this.reply(`成功更新属性映射数据~\n本次更新总计用时${TimeEnd - TimeStart}ms~`)
    } catch (e) {
      console.log(pluginINFO.concat(e))
      let TimeEnd = await new Date().getTime()
      this.reply(`更新失败了呜呜呜，请检查后台日志确认原因。用时${TimeEnd - TimeStart}ms`)
    }
  }
  async relicUpdate() {
    //#圣遗物套装更新
    //中文数据来源：https://gitee.com/yoimiya-kokomi/miao-plugin/blob/master/resources/meta/artifact/data.json
    //圣遗物属性数据来源：https://gitee.com/yoimiya-kokomi/miao-plugin/blob/master/resources/meta/artifact/calc.js
    //圣遗物id数据来源：https://gitlab.com/Dimbreath/AnimeGameData/-/blob/master/ExcelBinOutput/ReliquaryCodexExcelConfigData.json
    let TimeStart = await new Date().getTime()
    try {
      let data_chs
      try {
        data_chs = JSON.parse(fs.readFileSync(MiaoResourecePath.concat("artifact/data.json")))
      } catch (emiao) {
        console.log(pluginINFO.concat(emiao))
        let TimeEnd = await new Date().getTime()
        this.reply(`更新失败，推测原因为未正确安装喵喵插件或未正确配置本js插件。请检查后台日志确认详细原因。\n用时${TimeEnd - TimeStart}ms`)
        return false
      }
      let TimeStartDownload = await new Date().getTime()
      await download(GenshinDataRepoDownload, "ReliquaryCodexExcelConfigData.json")
      let TimeDownload = await new Date().getTime()
      console.log(pluginINFO.concat(`下载完成！用时${TimeDownload - TimeStartDownload}ms`))
      let ori = JSON.parse(fs.readFileSync(resource.concat("ReliquaryCodexExcelConfigData.json")))
      let capId_to_suitId = await {}
      for (let i in ori) {
        capId_to_suitId["n" + ori[i].capId] = ori[i].suitId
      }
      ori = fs.readFileSync(MiaoResourecePath.concat("artifact/calc.js")).toString().replaceAll(`'`, `"`).replaceAll(`Pct`, ``)
      let relic = await {}
      for (let i in data_chs) {
        let set = await data_chs[i].sets
        for (let j in set) {
          //录入：圣遗物名称→套装名称
          relic[set[j].name] = data_chs[i].name
        }
        let SetID = capId_to_suitId[set[5].id]
        //录入：套装名称→套装id
        relic[data_chs[i].name] = SetID
        let start = ori.indexOf(data_chs[i].name)
        let end = ori.indexOf(")", start)
        let SetEffect = ori.substring(start, end)
        if (SetEffect.includes("attr(")) {
          //如果有需要考虑的套装效果再执行。由于所考虑的套装都是二件套，所以内容不再塞入生效套装数量，只存放属性名和数值
          start = SetEffect.indexOf("attr(") + 5
          SetEffect = JSON.parse(`[${SetEffect.substring(start)}]`)
          if (SetEffect[0] == "shield") continue
          if (SetEffect[0] == "dmg") {
            SetEffect[0] = SetEffect[2].concat("元素伤害加成")
          } else {
            if (SetEffect[0] == "phy") {
              SetEffect[0] = "物理伤害加成"
            } else {
              if (SetEffect[0] == "recharge") {
                SetEffect[0] = "元素充能效率"
              } else {
                let t = trans[SetEffect[0]]
                if (t) {
                  SetEffect[0] = t
                } else {
                  console.log(pluginINFO.concat(SetEffect[2]))
                }
              }
            }
          }
          SetEffect = await [SetEffect[0], SetEffect[1]]
          //录入：套装id→套装效果
          relic[SetID] = SetEffect
        }
      }
      let FileSize = fs.statSync(resource.concat("ReliquaryCodexExcelConfigData.json")).size
      fs.rmSync(resource.concat("ReliquaryCodexExcelConfigData.json"))
      fs.writeFileSync(resource.concat("dataRelicSet.json"), JSON.stringify(relic))
      dataRelicSet = relic
      let TimeEnd = await new Date().getTime()
      this.reply(`成功更新圣遗物套装数据~\n本次更新总计用时${TimeEnd - TimeStart}ms~\n其中下载资源花费${TimeDownload - TimeStartDownload}ms~\n为避免空间浪费删除了非必要文件：\nReliquaryCodexExcelConfigData.json\n文件大小${(FileSize / 1024).toFixed(2)}KB`)
    } catch (e) {
      console.log(pluginINFO.concat(e))
      let TimeEnd = await new Date().getTime()
      this.reply(`更新失败了呜呜呜，请检查后台日志确认原因。用时${TimeEnd - TimeStart}ms`)
    }
  }
  async relicMainUpdate() {
    //#圣遗物主词条更新
    //数据来源：https://gitlab.com/Dimbreath/AnimeGameData/-/blob/master/ExcelBinOutput/ReliquaryLevelExcelConfigData.json
    let TimeStart = await new Date().getTime()
    try {
      await download(GenshinDataRepoDownload, "ReliquaryLevelExcelConfigData.json")
      let TimeDownload = await new Date().getTime()
      console.log(pluginINFO.concat(`下载完成！用时${TimeDownload - TimeStart}ms`))
      let ori = JSON.parse(fs.readFileSync(resource.concat("ReliquaryLevelExcelConfigData.json")))
      let translate = {
        //如有新增主属性请手动添加
        "FIGHT_PROP_HP": "hpPlus",
        "FIGHT_PROP_HP_PERCENT": "hp",
        "FIGHT_PROP_ATTACK": "atkPlus",
        "FIGHT_PROP_ATTACK_PERCENT": "atk",
        "FIGHT_PROP_DEFENSE": "defPlus",
        "FIGHT_PROP_DEFENSE_PERCENT": "def",
        "FIGHT_PROP_CRITICAL": "cpct",
        "FIGHT_PROP_CRITICAL_HURT": "cdmg",
        "FIGHT_PROP_CHARGE_EFFICIENCY": "recharge",
        "FIGHT_PROP_HEAL_ADD": "heal",
        "FIGHT_PROP_ELEMENT_MASTERY": "mastery",
        "FIGHT_PROP_FIRE_ADD_HURT": "pyro",
        "FIGHT_PROP_ELEC_ADD_HURT": "electro",
        "FIGHT_PROP_WATER_ADD_HURT": "hydro",
        "FIGHT_PROP_WIND_ADD_HURT": "anemo",
        "FIGHT_PROP_ROCK_ADD_HURT": "geo",
        "FIGHT_PROP_GRASS_ADD_HURT": "dendro",
        "FIGHT_PROP_ICE_ADD_HURT": "cryo",
        "FIGHT_PROP_PHYSICAL_ADD_HURT": "phy",
        "FIGHT_PROP_FIRE_SUB_HURT": "SKIP"
      }
      let result = {
        //如有新增主属性请手动添加
        "hpPlus": [[], [], [], [], [], []], "hp": [[], [], [], [], [], []], "atkPlus": [[], [], [], [], [], []], "atk": [[], [], [], [], [], []], "defPlus": [[], [], [], [], [], []], "def": [[], [], [], [], [], []], "recharge": [[], [], [], [], [], []], "mastery": [[], [], [], [], [], []], "cpct": [[], [], [], [], [], []], "cdmg": [[], [], [], [], [], []], "heal": [[], [], [], [], [], []], "pyro": [[], [], [], [], [], []], "electro": [[], [], [], [], [], []], "cryo": [[], [], [], [], [], []], "hydro": [[], [], [], [], [], []], "anemo": [[], [], [], [], [], []], "geo": [[], [], [], [], [], []], "dendro": [[], [], [], [], [], []], "phy": [[], [], [], [], [], []],
      }
      for (let i = 1; i < ori.length; i++) {
        for (let j in ori[i].addProps) {
          let Effect = ori[i].addProps[j]
          Effect.propType = translate[Effect.propType]
          if (Effect.propType == "SKIP") continue
          if (Effect.value < 1) {
            //如果value是百分数，为了格式统一将其扩大为100倍
            Effect.value = Number((Effect.value * 100).toFixed(3))
          } else {
            Effect.value = Number(Effect.value.toFixed(3))
          }
          result[Effect.propType][ori[i].rank][ori[i].level - 1] = Effect.value
        }
      }
      let FileSize = fs.statSync(resource.concat("ReliquaryLevelExcelConfigData.json")).size
      fs.rmSync(resource.concat("ReliquaryLevelExcelConfigData.json"))
      fs.writeFileSync(resource.concat("dataRelicMain.json"), JSON.stringify(result))
      dataRelicMain = result
      let TimeEnd = await new Date().getTime()
      this.reply(`成功更新圣遗物主词条数据~\n本次更新总计用时${TimeEnd - TimeStart}ms~\n其中下载资源花费${TimeDownload - TimeStart}ms~\n为避免空间浪费删除了非必要文件：\nReliquaryLevelExcelConfigData.json\n文件大小${(FileSize / 1024).toFixed(2)}KB`)
    } catch (e) {
      console.log(pluginINFO.concat(e))
      let TimeEnd = await new Date().getTime()
      this.reply(`更新失败了呜呜呜，请检查后台日志确认原因。用时${TimeEnd - TimeStart}ms`)
    }
  }
  async selfUpdate() {
    //#转换面板插件更新
    //数据来源：https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel/raw/master/MiaoToGspanel.js
    let response = await fetch("https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel/raw/master/MiaoToGspanel.js")
    response = await response.text()
    let LastEditTime = response.indexOf("最近一次编辑时间")
    if (LastEditTime == -1) {
      this.reply("疑似作者跑路了，建议手动访问https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel以确认具体情况。")
    } else {
      LastEditTime = response.indexOf(`"`, LastEditTime) + 1
      let right = response.indexOf(`"`, LastEditTime)
      LastEditTime = await response.substring(LastEditTime, right)
      if (LastEditTime == 最近一次编辑时间) {
        this.reply("当前已经是最新版本了，如需强制更新请发送#转换面板插件强制更新。")
      } else {
        this.reply("有较新版本，即将更新到" + ThisFilePath)
        fs.writeFileSync(ThisFilePath, response)
      }
    }
  }
  async forceSelfUpdate() {
    let response = await fetch("https://gitee.com/CUZNIL/Yunzai-MiaoToGspanel/raw/master/MiaoToGspanel.js")
    response = await response.text()
    this.reply("即将强制更新到" + ThisFilePath)
    fs.writeFileSync(ThisFilePath, response)
  }
}
async function download(url, filename) {
  //下载必要资源到resource文件夹
  let response = `${url}${filename}`
  response = await fetch(response)
  response = await response.text()
  fs.writeFileSync(resource + filename, response)
}
async function mkdir(path) {
  //尝试新建文件夹path，如果没有path的上一个文件夹则尝试循环创建直到有。
  try {
    fs.mkdirSync(path)
  } catch (e) {
    //如果没有path，尝试新建path，再去新建folder_name。
    let next_path = path.substring(0, path.lastIndexOf("/"))
    await mkdir(next_path)
    fs.mkdirSync(path)
  }
}