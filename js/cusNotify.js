


function sendNotify(title,msg){
    console.log("发送通知:",title, msg)
    QLAPI.notify('test script', 'test desc')
}


module.exports = {
    sendNotify
}