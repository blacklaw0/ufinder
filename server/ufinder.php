<?php
header("Content-Type:text/html;charset=utf-8");
error_reporting(E_ERROR | E_WARNING);
date_default_timezone_set("Asia/chongqing");
include('./cmds.php');
$config = include('./config.php');
$ROOT = './files';
//$ROOT = 'f:/';
$cmd = $_GET['cmd'];
$target = $_GET['target'];
$cmdFuncs = initCommands($ROOT, $target);
//echo phpinfo();
if (array_key_exists($cmd, $cmdFuncs)) {
    // 模拟一缺少删除权限的用户
    $userPriv = 1 | 2 | 4 | 8;
    $priv = $cmdFuncs[$cmd]['priv'];

    if (($userPriv & $priv) != $priv) {
        // 权限不完整
        echo getJson('2', 'Uncomplete privilege for current user');
    } else {
        echo $cmdFuncs[$cmd]['func']();
    }
} else {
   echo getJson('1', 'unknow command');
}

?>