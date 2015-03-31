<?php
return array(
    'ROOT' => './files/',
    'write' => true,
    'read' => true,
    'upload' => array(
        "savePath" => "upload/" ,             //存储文件夹
        "maxSize" => 2000000000 ,                   //允许的文件最大尺寸，单位KB
        "allowFiles" => array( ".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp" )  //允许的文件格式
    )
);
?>