# 云崽BOT手机搭建教程(施工中80%)

#### 0.介绍
针对安卓手机搭建[云崽BOT](https://gitee.com/Le-niao/Yunzai-Bot)的一篇详细教程，也包含手机搭建前后会遇到的各种问题和解决方案。
| 搭建必备    | 有的话最好           |
|---------|-----------------|
| 安卓手机 网络 | vbn 遇到问题先搜索的好习惯 |


个人建议在空闲存储空间大于32G的手机上进行搭建。以下教程演示用的是红米K50(8+256)，使用时雨的[TRSS 脚本](https://trss.me/)搭建。

警告！！如果你的手机是MIUI14，请务必刷回MIUI13或更低版本！！否则会导致一堆我根本懒得处理的报错，MIUI14出现问题请自行处理不要问我。

#### 1.[Termux](https://f-droid.org/en/packages/com.termux/)




<details><summary>下载安装</summary>


[点此下载TERMUX最新版本](https://f-droid.org/repo/com.termux_118.apk)。如果点击后无法正常下载可以加一下这篇文章结尾的[QQ群](http://jq.qq.com/?_wv=1027&k=tqiOtCVc)，我会上传到群文件。


![输入图片说明](doc-use/1.png)


下载后安装并打开此应用

![输入图片说明](doc-use/2.png)

打开以后应该长这样，后面就叫他Termux终端了。

![输入图片说明](doc-use/image.png)



</details>


<details><summary>基本使用说明</summary>


如果没有跳出键盘，点击屏幕空白区域即可，还是没有的话就从左侧滑出侧边栏再点击KEYBOARD

![输入图片说明](doc-use/123124.png)

假设后续因为某些原因发生了无法解决的问题，你只需要清除Termux的全部数据即可。手机不支持清除数据的话可以卸载重装。


</details>
<details><summary>安装openssh</summary>

如果你不知道openssh是什么的话，可以试着搜索。还是不明白的话这部分你应该用不上，可以收起该部分，跳到下一步：2.容器。

进入Termux终端，输入`termux-change-repo`。如果手机打指令太慢或者怕打错的话多用截图左下角用红框框柱的那个的按钮，他能帮你补全大部分代码。


![输入图片说明](doc-use/qwd.png)

发送后你会来到这样一个可以点击交互的界面。先点击OK，再点击最下面的镜像，再点击OK，最后的输出如图。如果看文字不清楚的话可以看图，跟着图片的步骤点击就行。

![输入图片说明](doc-use/wqdqw.png)

确认上一步完成后，输入`pkg update -y`。中间他会停下来几次问你要选择哪种操作，你每次都输入一个大写的Y就行。

![输入图片说明](doc-use/qwfqfg654.png)


确认上一步完成后，输入`pkg install openssh -y`。最后输出以下内容就是安装openssh成功了。

![输入图片说明](doc-use/awfq.jpg)

输入`passwd`配置密码，输入`sshd`启动openssh。

如果你完全不了解openssh，只是因为我写了就跟着操作的话，我建议阅读[这篇文章](https://blog.csdn.net/qq_45740348/article/details/115602001)



</details>

#### 2.容器


<details><summary>脚本安装Arch</summary>

进入Termux终端。输入

`curl -LO gitee.com/TimeRainStarSky/TRSS-MTArch/raw/main/Install.sh && bash Install.sh`

，稍作等待会显示如下页面，说明容器安装完毕。

![输入图片说明](doc-use/wqfg.jpg)

</details>

#### 3.云崽本体


<details><summary>安装管理脚本</summary>

进入Termux终端。输入

`bash <(curl -L gitee.com/TimeRainStarSky/TRSS_Yunzai/raw/main/Install.sh)`

，稍作等待会显示如下页面，说明时雨脚本安装完毕。

![输入图片说明](doc-use/qwfqw65gf4.jpg)


</details>


<details><summary>安装云崽</summary>

如果有vbn建议这一步开启。根据提示输入`tsyz`，首次启动脚本等待时间会稍久，背景变蓝说明成功进入脚本了。国内可能会导致部分报错信息遮住确认键，按我下面的截图点击对应位置即可。依次点击Yunzai、确认、确认、回车。

![输入图片说明](doc-use/qwd65.png)

极少数情况会发生依赖安装失败，这时根据脚本提示再次安装即可。至此，云崽本体被成功安装。

接下来退出脚本。如果你懒得点直接杀termux后台也可以，再启动即可。

![输入图片说明](doc-use/dwqdq.png)

</details>


<details><summary>云崽换源</summary>

由于乐神云崽似乎暂时停更了，我们手动换喵喵的云崽已获取大佬的维护。进入Termux终端。输入`Arch/start`进入容器。

![输入图片说明](doc-use/asdff.png)


进入容器后输入`cd TRSS_Yunzai/Yunzai/`进入到云崽根目录，再输入

`git remote set-url origin https://gitee.com/yoimiya-kokomi/Yunzai-Bot.git`

即可完成换源。可以输入

`git remote -v`

做最后确认，输出和我完全一致就是成功了。

![输入图片说明](doc-use/qwdwqf.png)

按下 ctrl + d 即可退出容器

![输入图片说明](doc-use/qwgrg234234edsdc.png)

</details>


<details><summary>启动云崽</summary>

进入Termux终端。输入`tsyz y f`即可启动云崽。首次启动请根据提示配置你的bot账密，登录方式建议iPad。


![输入图片说明](doc-use/image4984.png)

【通过滑动验证】这个根据提示操作就行，暂时不详细写了。

在你通过滑动验证后大概率会迎来你的搭建过程中第一个需要处理的报错，他有可能是图中的禁止登录，也有可能是版本过低。如果你很幸运没有遇到报错，则可以进入第四步挑选插件了。

![输入图片说明](doc-use/wqf65.png)

因为可能有俩种报错，你根据你实际显示的报错选择下面的处理方案即可，报错以上面图片中红框内内容为准。

按下 ctrl + c ，再根据提示操作退出脚本。

![输入图片说明](doc-use/imagewqf1.png)


<details><summary>报错：版本过低</summary>

首先贴一张别人做的图，接下来的操作大概就是这个原理。不用跟这个图，管理脚本会处理好。

![输入图片说明](doc-use/qfqef.bmp)

进入Termux终端。输入`tsyz y`进入脚本的云崽管理界面。依次选择修复版本过低→iPad→BOT的账号。

![输入图片说明](doc-use/123rf.png)

如果脚本工作正常，你现在可以按下 ctrl + c ，再根据提示操作退出脚本。输入`tsyz y f`即可启动云崽，通过滑动验证即可顺利登录！

如果还是报错版本过低或者报错禁止登录，则继续看 报错：禁止登录

</details>

<details><summary>报错：禁止登录</summary>

要解决这个报错，如果你会使用openssh在电脑使用xftp编辑文件会方便很多。这里为了方便讲述还是使用手机操作。

进入Termux终端。输入`tsyz y file`进入脚本的文件管理页面。使用Termux底部的上下左右进入文件夹/node_modules/oicq/lib/core/，编辑文件device.js。

![输入图片说明](doc-use/1r13419.png)

向下滑动直到你能看到最后一行。这时你能看到有一行的等号前面是[Platform.iPad].subid（注意是iPad！），等号后面会跟一串数字（可能和我截图的不一样）。

无论等号后的数字是多少，把他手动改成537128930，如图左边是改动前右边是改动后。按下ctrl+s保存该文件，按下ctrl+q退出文本编辑，按下q退出脚本的文件管理。

![输入图片说明](doc-use/im984.png)

输入`tsyz y f`即可启动云崽，通过滑动验证即可顺利登录！

</details>

如果以上俩种报错的解决方案你都尝试了，首先请再次仔细阅读本教程以保证你没有出现错误操作，然后通过这篇文章结尾的[QQ群](http://jq.qq.com/?_wv=1027&k=tqiOtCVc)联系我，请尽量清晰地表述你遇到的问题。

</details>

#### 4.强烈建议所有人都安装的插件

脚本还是挺好懂的，所以这边默认你们都能使用管理脚本完成插件的安装。如果担心操作失误或者真的不会可以展开下面。

<details><summary>使用脚本安装或卸载插件</summary>

本教程提到的所有插件该脚本都能在不碰键盘的情况下完成安装，所以不用担心。

进入Termux终端。输入`tsyz`，依次选择插件管理、Git 插件管理、安装插件

![输入图片说明](doc-use/image21312r5f.png)

在这个页面选择你想安装的插件即可。以windoge风歌插件为例，直接点击35号插件，部分插件比如风歌没有gitee所以会让你选择github镜像源，有vbn或者能直连github的话建议选GitHub否则选GHProxy，一路确认即可，脚本会处理好几乎所有依赖。

![输入图片说明](doc-use/image9658489.png)

如果你想要安装.js插件，在Git 插件管理的安装插件处选择安装30号插件xitian-plugin戏天插件即可。

<details><summary>安装脚本没有的插件</summary>

举个例子，我想要安装[vits_yunzai_plugin](https://gitee.com/sumght/vits_yunzai_plugin)，但是云崽管理脚本没有这个插件。

进入脚本→插件管理→Git 插件管理→安装插件，然后选择自定义，输入插件名(这个随便写，最好是和项目名一致)，输入插件URL(项目地址，直接从网页复制)，确认，稍等片刻即可安装成功。

![输入图片说明](doc-use/41894qwr.png)

但是安装自定义插件时可能会出现安装不完全的情况，需要自行阅读插件的README确认。比如我们可以看到[vits_yunzai_plugin](https://gitee.com/sumght/vits_yunzai_plugin#%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B)的安装并没有止步于此，还需要配置权重文件等，下面这张图里红框的部分我们都没有完成。脚本未适配的插件需要你手动折腾，碰到问题先自己搜索尝试解决，不行再有礼貌地带着清晰的问题找人问。

![输入图片说明](doc-use/image21.png)

</details>


<details><summary>使用脚本卸载插件</summary>

在Termux终端输入`tsyz`，进入云崽管理脚本。依次选择插件管理→Git 插件管理→管理插件→你要卸载的插件(图中我们卸载vits插件)→删除插件→最后确认，然后稍等一俩秒就卸载干净了。

![输入图片说明](doc-use/image98qe.png)

</details>


</details>



看到这一行应该都会安装插件了吧，脚本还是挺省事的。下面我推荐三个建议所有人安装的插件：







| 序号 | 项目名                                                               | 中文名         | 简述                                       |
|----|-------------------------------------------------------------------|-------------|------------------------------------------|
| 13 | [miao-plugin](https://gitee.com/yoimiya-kokomi/miao-plugin)       | 喵喵插件        | 角色面板查询(enka、米游社)、国内数据库查询(胡桃数据库)          |
| 18 | [Guoba-Plugin](http://gitee.com/guoba-yunzai/guoba-plugin)        | 锅巴插件        | 大量图鉴信息查询、stoken绑定、更新抽卡记录、米游社全部签到         |
| 43 | [xiaoyao-cvs-plugin](http://gitee.com/Ctrlcvs/xiaoyao-cvs-plugin) | 图鉴插件(注意有重名) | 提供后台管理界面、配置机器人的基础设置以及原神相关设置、可视化自定义编辑喵喵帮助 |







![输入图片说明](doc-use/image984.png)

这些插件的后续配置脚本是完全处理好了的，所以你们按照脚本操作安装即可，我不做过多说明。

#### 5.其他个人倾向安装的插件


| 序号 | 项目名                                                            | 中文名   | 简述                             |
|----|----------------------------------------------------------------|-------|--------------------------------|
| 单独 | [TRSS-Plugin](http://gitee.com/TimeRainStarSky/TRSS-Plugin)    | 时雨插件  | 本地语音合成，远程命令，文件操作等              |
| 6  | [ap-plugin](https://gitee.com/yhArcadia/ap-plugin)             | 绘图插件  | AI绘图、抠图、二次元的我等                 |
| 11 | [auto-plugin](https://gitee.com/Nwflower/auto-plugin)          | 自动化插件 | 提供各式各样的定时任务功能和自动监听功能           |
| 32 | [earth-k-plugin](http://gitee.com/SmallK111407/earth-k-plugin) | 土块插件  | 大量娱乐功能如emoji合成、全角色语音、chatgpt等  |
| 24 | [flower-plugin](http://gitee.com/Nwflower/flower-plugin)       | 抽卡插件  | 提供百连、三十连等操作以免用户抽卡刷屏            |
| 单独 | [py-plugin](http://gitee.com/realhuhu/py-plugin)               | Py插件  | 内置NoneBot，可装队伍伤害计算、表情包制作、幻影坦克等 |
| 2  | [suiyue](http://gitee.com/Acceleratorsky/suiyue)               | 碎月插件  | 查各地疫情，今日关键词，加减乘除计算器            |
| 35 | [windoge-plugin](http://github.com/gxy12345/windoge-plugin)    | 风歌插件  | xx参考面板，未复刻角色/武器，素材汇总图          |
| 37 | [xiaofei-plugin](http://gitee.com/xfdown/xiaofei-plugin)       | 小飞插件  | 消息风控处理，高清语音点歌，查各地天气，原神注册时间     |
| 30 | [xitian-plugin](http://gitee.com/XiTianGame/xitian-plugin)     | 戏天插件  | 便捷管理js插件                       |
| 21 | [yenai-plugin](http://gitee.com/yeyang52/yenai-plugin)         | 椰奶插件  | 角色收益曲线，群管理，消息监听等。提供对马甲的一些便捷操作  |




上面表格中带数字序号的插件你们按需安装即可，步骤参考“使用脚本安装或卸载插件”，部分插件会出现一些脚本暂时没有解决的问题我会放在本文末尾单独介绍。下面稍微提一下时雨插件和Py插件的安装使用，你们按需点开即可。


<details><summary>时雨插件</summary>

</details>


<details><summary>Py插件</summary>


</details>

以下俩个上面提到的插件使用脚本安装大概率会出现一些问题，故单独说明，也是你需要安装再点开即可。

<details><summary>附加说明：绘图插件 ap-plugin</summary>


canvas


pacman -S pkg-config



</details>

<details><summary>附加说明：碎月插件 suiyue</summary>



</details>





#### 6.安装Termux
#### 1.安装Termux
#### 
1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

#### 测试环境
如果你的手机环境跟我完全一致，则基本不可能出现本教程未涵盖的情况。

小米8(8+128) 系统版本：[MIUI12.5.2](https://xiaomirom.com/download/mi-8-dipper-stable-V12.5.2.0.QEACNXM/)

红米k40(12+256) 系统版本：[MIUI13.0.7](https://xiaomirom.com/download/redmi-k40-mi-11x-poco-f3-alioth-stable-V13.0.7.0.SKHCNXM/) 乌堆MIUI开发版14.0.23 [MIUI14.0.5](https://xiaomirom.com/download/redmi-k40-mi-11x-poco-f3-alioth-stable-V14.0.5.0.TKHCNXM/)

红米k50(8+256) 系统版本：[MIUI13.0.13](https://xiaomirom.com/download/redmi-k50-rubens-stable-V13.0.13.0.SLNCNXM/) 乌堆MIUI13.0.13

#### 参考信息
大量内容我只是搬运，以下是实际来源网页。
当然我不保证我发的这些信息本身就是原创信息，没兴趣甄别。
为啥这么杂？问就是百度。


[git换源1](https://blog.csdn.net/qq_45723638/article/details/123494464)
[git换源2](https://blog.csdn.net/as8996606/article/details/124879105)
[部分依赖](https://blog.csdn.net/qq_39099905/article/details/125228920)
[pacman](https://zhuanlan.zhihu.com/p/383694450)
[README润色](https://gitee.com/TimeRainStarSky/TRSS-Plugin/edit/main/README.md)




### 遇到问题/需要联系我/需要使用Bot

群号 **638077675** 

答案  **火花骑士** 

[![群](doc-use/QQ%E7%BE%A4.png)](http://jq.qq.com/?_wv=1027&k=tqiOtCVc)