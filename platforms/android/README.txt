【2013-9-6】
1.修复了【2013-8-27:bug①】：将“openDatabase()”的数据库名从全局变量变为常量。
 * bug:
 	①编码，当前仅支持文本格式。

【2013-8-27】
1.成功实现聊天记录本地存储，使用cordova的storage API
 * bug:
    [+]①PC浏览器用的非常正常，但是在AVD中只有一个用户莫名
      其妙的能够使用storage plugin，而其它的用户则报错：
      “exec() call to unknown plugin: Storage”
 * 迁移：
    该状态维持到“dontsettle2013-8-27”为止，后面的将由cordova CLI
    所创建的项目承接。（看是否能修改这个bug）

【2013-8-26】
1.成功移植了golang web 版过来，已有的功能为一对一、一对多、广播
 * bug:
    ①重复登录问题
    ②组员判断


specification:
[+]: which before bug, means ko.