<?php
/**
 * Created by PhpStorm.
 * User: huangpu
 * Date: 2015/3/26 0026
 * Time: 下午 19:51
 * 后端命令集
 */

/**
 * @param $ROOT
 * @param $target
 * @return array
 * 初始化命令集
 */
function initCommands($ROOT, $target)
{
    // 权限Mask
    $C = 1;
    $R = 2;
    $U = 4;
    $D = 8;
    return array(
        'init' => array(
            'priv' => 0,
            'func' => function () {
                global $ROOT, $target;
                return getJson('0', 'success', array(
                    'root' => getFileInfo('/', $ROOT),
                    'config' => array()
                ));
            }
        ),
        'ls' => array(
            'priv' => $R,
            'func' => function () {
                global $ROOT, $target;
                if (isset($_GET['target'])) $target = $_GET['target'];
                else $target = '';
                $list = listFile($target, $ROOT);
                return getJson('0', 'success', array('files' => $list));
            }
        ),
        'rename' => array(
            'priv' => $R | $U,
            'func' => function () {
                global $ROOT, $target;
                $name = $_GET['name'];
                if (file_exists($ROOT . $name)) {
                    $res = false;
                    $msg = 'file exist';
                } else {
                    $res = rename($ROOT . $target, $ROOT . $name);
                }
                if ($res) {
                    return getJson('0', 'success', array('file' => getFileInfo($name, $ROOT)));
                } else {
                    return getJson('1', $msg ? $msg : 'rename error');
                }
            }
        ),
        'rm' => array(
            'priv' => $D,
            'func' => function () {
                global $ROOT, $target;
                foreach ($target as $key => $path) {
                    if (is_dir($ROOT . $path)) {
                        $res = removeDir($ROOT . $path);
                    } else {
                        $res = unlink($ROOT . $path);
                    }
                    if (!$res) break;
                }

                if ($res) {
                    return getJson('0', 'success');
                } else {
                    return getJson('1', 'romove error');
                }
            }
        ),
        'mv' => array(
            'priv' => $C | $R | $U | $D,
            'func' => function () {
                global $ROOT, $target;
                $distdir = $ROOT . $target[0];
                $target = array_slice($target, 1);
                foreach ($target as $key => $path) {
                    rename($ROOT . $path, $distdir . basename($path));
                }
                return getJson('0', 'success');
                if ($res) {
                    return getJson('0', 'success');
                } else {
                    return getJson('1', 'romove error');
                }
            }
        ),
        'copy' => array(
            'priv' => $C | $R | $U | $D,
            'func' => function () {
                global $ROOT, $target;
                $distdir = $ROOT . $target[0];
                $target = array_slice($target, 1);
                foreach ($target as $key => $path) {
                    if (is_dir($ROOT . $path))
                        recurse_copy($ROOT . $path, $distdir . basename($path));
                    else
                        copy($ROOT . $path, $distdir . basename($path));
                }
                return getJson('0', 'success');
                if ($res) {
                    return getJson('0', 'success');
                } else {
                    return getJson('1', 'romove error');
                }
            }
        ),
        'touch' => array(
            'priv' => $C,
            'func' => function () {
                global $ROOT, $target;
                if (!file_exists($ROOT . $target)) {
                    file_put_contents($ROOT . $target, '');
                    $res = file_exists($ROOT . $target);
                } else {
                    $res = false;
                    $msg = 'file exist';
                }
                if ($res) {
                    return getJson('0', 'success', array('file' => getFileInfo($target, $ROOT)));
                } else {
                    return getJson('1', $msg ? $msg : 'touch error');
                }
            }
        ),
        'mkdir' => array(
            'priv' => $C,
            'func' => function () {
                global $ROOT, $target;
                if (!file_exists($ROOT . $target)) {
                    $res = mkdir($ROOT . $target);
                } else {
                    $res = false;
                    $msg = 'file exist';
                }
                if ($res) {
                    return getJson('0', 'success', array('file' => getFileInfo($target, $ROOT)));
                } else {
                    return getJson('1', $msg ? $msg : 'mkdir error', array('file' => getFileInfo($target, $ROOT)));
                }
            }
        ),
        'upload' => array(
            'priv' => $C,
            'func' => function () {
                global $ROOT, $target;
                include "Uploader.class.php";
                $uploadConfig = array(
                    "savePath" => $ROOT . $target,          //存储文件夹
                    "maxSize" => 2000000,                   //允许的文件最大尺寸，单位KB
                    "allowFiles" => array(".mid", ".apk", ".xmind",
                        ".rar", ".zip", ".7z", "tar", "gz",
                        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
                        "", ".txt", ".md", ".pdf", ".js", ".html",
                        ".bmp", ".gif", ".jpg", ".jpeg", ".png", ".psd",
                        ".swf", ".mkv", ".avi", ".rm", ".rmvb", '.mp3',
                        ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4", ".webm")  //允许的文件格式
                );

                $up = new Uploader("file", $uploadConfig);
                $info = $up->getFileInfo();
//                var_dump($info);
                if ($info["state"] == 'SUCCESS') {
                    return getJson('0', 'success', array('file' => getFileInfo($target . $info["name"], $ROOT)));
                } else {
                    return getJson('1', $info["state"], array('file' => getFileInfo($target . $info["name"], $ROOT)));
                }
            }
        ),
        'download' => array(
            'priv' => $R,
            'func' => function () {
                global $ROOT, $target;
                $path = $ROOT . $target;
                $info = getFileInfo($target, $ROOT);
                downloadFile($path, $info['name']);
            }
        ),
        'preview' => array(
            'priv' => $R,
            'func' => function () {
                global $ROOT, $target;
                return getJson('0', 'success', array('content' => getPreview($target, $ROOT)));
            }
        ),
        'search' => array(
            'priv' => $R,
            'func' => function () {
                global $ROOT, $target;
                $res = array();
                searchFiles($ROOT, $target, $res);
                return getJson('0', 'success', array('results' => $res));
            }
        ),
        'info' => array(
            'priv' => $R,
            'func' => function () {
                global $ROOT, $target;
                return getJson('0', 'success', array('file' => getFileInfo($target, $ROOT)));
            }
        ));
}

function getFileExt($path)
{
    return strtolower(strrchr($path, '.'));
}

function recurse_copy($src, $dst)
{  // 原目录，复制到的目录
    $dir = opendir($src);
    @mkdir($dst);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                recurse_copy($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

function getRealpath($path)
{
    return 'http://' . $_SERVER['SERVER_ADDR'] . $_SERVER['SCRIPT_NAME'] . '/../' . $path;
}

function getPreview($path, $ROOT)
{
    global $config;
    $filepath = $ROOT . $path;
    $type = getFileExt($path);
    $cfg = $config['TEMPLATES'];
    $cls = null; $tmpl = null;
    foreach ($cfg as $k => $v) {
        if (in_array($type, explode("|", $v['key']))){
            $cls = $k;
            $tmpl = $v['tmpl'];
            break;
        }
    }

    // 获取头信息
    require_once('./lib/getID3/getid3/getid3.php');
    $getID3 = new getID3;
    $ThisFileInfo = $getID3->analyze($ROOT . $path);
//    return $ThisFileInfo;
//    if (true) {
        if (is_null($cls)) {
            $cls = "default";
            $template = "./templates/default.html";
        } else
            $template = $tmpl;              //模板文件路径


        $replaceAry = array(                    //要查找替换的内容 每行一个
            '{filename}' => strrchr($path, '/'),
            '{path}' => getRealpath($ROOT . $path),
            '{root}' => 'server/' . $template . "/../",
            '{type}' => $type
        );
        $content = file_get_contents($template);
        if ($cls == "default")
            $replaceAry = array_merge($replaceAry, $ThisFileInfo);
        if ($ThisFileInfo[$cls])
            $replaceAry = array_merge($replaceAry, $ThisFileInfo[$cls]);

        $content = str_replace(array_keys($replaceAry), $replaceAry, $content);
        return $content;
//    }
/* else if ($type == ".m4v") {
        $template = './templates/video-js/demo.html';              //模板文件路径
        $replaceAry = array(                    //要查找替换的内容 每行一个
            '{filename}' => strrchr($path, '/'),
            '{path}' => getRealpath($ROOT . $path),
            '{root}' => 'server/' . $template . "/../"
        );
        $content = file_get_contents($template);
        // 获取头信息
        require_once('./lib/getID3/getid3/getid3.php');
        $getID3 = new getID3;
        $ThisFileInfo = $getID3->analyze($ROOT . $path);
        if ($ThisFileInfo['audio'])
            $replaceAry = array_merge($replaceAry, $ThisFileInfo['audio']);
        $content = str_replace(array_keys($replaceAry), $replaceAry, $content);
        return $content;
    }  else if ($type == ".txt") {
        $template = './templates/ueditor/index.html';              //模板文件路径
        $replaceAry = array(                    //要查找替换的内容 每行一个
            '{filename}' => strrchr($path, '/'),
            '{path}' => getRealpath($ROOT . $path),
            '{root}' => 'server/' . $template . "/../"
        );
        $content = file_get_contents($template);
        // 获取头信息
        require_once('./lib/getID3/getid3/getid3.php');
        $getID3 = new getID3;
        $ThisFileInfo = $getID3->analyze($ROOT . $path);
        if ($ThisFileInfo['audio'])
            $replaceAry = array_merge($replaceAry, $ThisFileInfo['audio']);
        $content = str_replace(array_keys($replaceAry), $replaceAry, $content);
        return $content;
    }*/
//else {
//        return sprintf("<div style='margin-top: 180px;'><b >path: %s </br>type:$type </br>暂无预览</b></div>", $path, $type);
//    }
}


function listFile($dir, $ROOT)
{
    if ($handle = opendir($ROOT . $dir)) {
        $output = array();
        $dir = $dir[strlen($dir) - 1] == '/' ? $dir : $dir . '/';
        while (false !== ($item = readdir($handle))) {
            if ($item != "." && $item != "..") {
                $output[] = getFileInfo($dir . $item, $ROOT);
            }
        }
        closedir($handle);
        return $output;
    } else {
        return false;
    }
}

function getFileName($path)
{
    $index = strrpos($path, '/');
    if ($index || $index === 0) {
        return substr($path, $index + 1);
    } else {
        return $path;
    }
}

function getFileInfo($path, $ROOT)
{
    $filepath = $ROOT . $path;
    $stat = stat($filepath);
    $info = array(
//        'hash' => substr(md5($filepath),8,16),
        'path' => is_dir($filepath) && substr($path, strlen($path) - 1) != '/' ? $path . '/' : $path,
        'name' => getFileName($path),
        'isdir' => is_dir($filepath),
        'type' => filetype($filepath),
        'read' => is_readable($filepath),
        'write' => is_writable($filepath),
        'time' => filemtime($filepath),
//        'dev' => $stat['dev'],
//        'ino' => $stat['ino'],
        'mode' => decoct($stat['mode']),
//        'nlink' => $stat['nlink'],
//        'uid' => $stat['uid'],
//        'gid' => $stat['gid'],
//        'rdev' => $stat['rdev'],
        'size' => $stat['size'],
//        'atime' => $stat['atime'],
//        'mtime' => $stat['mtime'],
//        'ctime' => $stat['ctime'],
//        'blksize' => $stat['blksize'],
//        'blocks' => $stat['blocks']
    );
    return $info;
}

function getJson($state, $message, $data = null)
{
    $output = array();
    $output['state'] = $state;
    $output['message'] = $message;
    if ($data) $output['data'] = $data;
    return json_encode($output);
}

function array_sort($arr, $keys, $type = 'asc')
{
    $keysvalue = $new_array = array();
    foreach ($arr as $k => $v) {
        $keysvalue[$k] = $v[$keys];
    }
    if ($type == 'asc') {
        asort($keysvalue);
    } else {
        arsort($keysvalue);
    }
    reset($keysvalue);
    foreach ($keysvalue as $k => $v) {
        $new_array[$k] = $arr[$k];
    }
    return $new_array;
}

function removeDir($dirName)
{
    if (!is_dir($dirName)) return false;
    $handle = @opendir($dirName);
    while (($file = @readdir($handle)) !== false) {
        if ($file != '.' && $file != '..') {
            $dir = $dirName . '/' . $file;
            is_dir($dir) ? removeDir($dir) : @unlink($dir);
        }
    }
    closedir($handle);
    return rmdir($dirName);
}

/**
 * @param $dirName
 * @param $key
 * @param $res
 * 检索文件
 */
function searchFiles($dirName, $key, &$res)
{
    global $ROOT;
    if ($handle = @opendir("$dirName")) {
        while (false !== ($item = readdir($handle))) {
            if ($item != "." && $item != "..") {
                if (is_dir("$dirName/$item")) {
                    searchFiles("$dirName/$item", $key, $res);
                } else {
                    if (strstr($item, $key)) {
                        array_push($res, str_replace($ROOT, '', $dirName) . '/' . $item);
//                        echo " <span><b> $dirName/$item </b></span><br />\n";
                    }
                }
            }
        }
        closedir($handle);
//            if(strstr($dirName,$GLOBALS['findFile'])){
//                $loop = explode($GLOBALS['findFile'],$dirName);
//                $countArr = count($loop)-1;
//                if(empty($loop[$countArr])){
//                    echo " <span style='color:#297C79;'><b> $dirName </b></span><br />\n";
//                    $GLOBALS['r_dir_num']++;
//                }
//            }
    } else {
//        die("invili");
    }
}

function downloadFile($path, $name)
{
    ob_start();
    $filename = $path;
    $name = $name ? $name : date("Ymd-H:i:m");
    header("Content-type: application/octet-stream ");
    header("Accept-Ranges: bytes ");
    header("Content-Disposition: attachment; filename= $name");
    $size = readfile($filename);
    header("Accept-Length: " . $size);
}


?>