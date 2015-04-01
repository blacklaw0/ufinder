<?php
return array(
    'ROOT' => './files/',
    'write' => true,
    'read' => true,
    'upload' => array(
        "savePath" => "upload/" ,             //存储文件夹
        "maxSize" => 2000000000 ,                   //允许的文件最大尺寸，单位KB
        "allowFiles" => array( ".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp" )  //允许的文件格式
    ),
    "TEMPLATES" =>  array(
        'text' => array(
            key => '.txt|.md|.js|.html|.php',
            tmpl => './templates/ueditor/index.html'
        ),
        'audio' => array(
            key => '.mp3|.mid',
            tmpl => './templates/muplayer/demo.html'
        ),
        'video' => array(
            key => '.mp4|.m4v|.avi|.mpeg',
            tmpl => './templates/video-js/demo.html'
        ),
        'image' => array(
            key => '.jpg|.png|.gif|.png',
            tmpl => './templates/image.html'
        ),
    )
);
?>