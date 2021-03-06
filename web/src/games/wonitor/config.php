<?php
    ini_set('error_reporting', E_ALL);
    ini_set('display_errors', '1');

    /* white-list
     * all requests that do not contain one of these serverIds will be rejected
     * case sensitive, comma separated
     * I.e. $serverIdWhiteList = ['MyServer','MyOtherServer','someRandomString'];
     */
    $serverIdWhiteList = ['Dedication Nation | 10v10 | Rookie Friendly'];

    /* logs all incoming requests to $logFile
     * WARNING logs are public and might reveal your pre-hashed serverId, use for debugging only
     * logfile will be deleted when $logging is set to false
     */
    $logging = false;

    /* shows white-listed serverIds and their corresponding hash
     * use for debugging only
     */
    $debug_showServerIds = false;
?>
