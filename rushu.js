/*
#TL库:https://github.com/3288588344/toulu.git
#tg频道:https://t.me/TLtoulu
#QQ频道:https://pd.qq.com/s/672fku8ge
#微信机器人：kckl6688
#公众号:哆啦A梦的藏宝箱
*/

delete __filename
delete __dirname
ActiveXObject = undefined

window = global;


content="content_code"


navigator = {"platform": "Linux aarch64"}
navigator = {"userAgent": "CtClient;11.0.0;Android;13;22081212C;NTIyMTcw!#!MTUzNzY"}

location={
    "href": "https://",
    "origin": "",
    "protocol": "",
    "host": "",
    "hostname": "",
    "port": "",
    "pathname": "",
    "search": "",
    "hash": ""
}

i = {length: 0}
base = {length: 0}
div = {
    getElementsByTagName: function (res) {
        console.log('div中的getElementsByTagName：', res)
        if (res === 'i') {
            return i
        }
    return '<div></div>'

    }
}

script = {

}
meta = [
    {charset:"UTF-8"},
    {
        content: content,
        getAttribute: function (res) {
            console.log('meta中的getAttribute：', res)
            if (res === 'r') {
                return 'm'
            }
        },
        parentNode: {
            removeChild: function (res) {
                console.log('meta中的removeChild：', res)
                
              return content
            }
        },
        
    }
]
form = '<form></form>'


window.addEventListener= function (res) {
        console.log('window中的addEventListener:', res)
        
    }
    

document = {

   
    createElement: function (res) {
        console.log('document中的createElement：', res)
        
        
       if (res === 'div') {
            return div
        } else if (res === 'form') {
            return form
        }
        else{return res}
            
        


    },
    addEventListener: function (res) {
        console.log('document中的addEventListener:', res)
        
    },
    appendChild: function (res) {
        console.log('document中的appendChild：', res)
        return res
    },
    removeChild: function (res) {
        console.log('document中的removeChild：', res)
    },
    getElementsByTagName: function (res) {
        console.log('document中的getElementsByTagName：', res)
        if (res === 'script') {
            return script
        }
        if (res === 'meta') {
            return meta
        }
        if (res === 'base') {
            return base
        }
    },
    getElementById: function (res) {
        console.log('document中的getElementById：', res)
        if (res === 'root-hammerhead-shadow-ui') {
            return null
        }
    }

}

setInterval = function () {}
setTimeout = function () {}
window.top = window


'ts_code'



function main() {
    cookie = document.cookie.split(';')[0]
    return cookie
}

