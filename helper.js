//helper functions

export function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

export function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

export function display_logo() {
    console.log(' _   _               _              _        \n'+
                '| | (_)             | |            | |       \n'+
                '| |_ _ _ __  _   _  | |_ __ _ _ __ | | _____ \n'+
                '| __| |  _  | | | | | __/ _` |  _  | |/ / __|\n'+
                '| |_| | | | | |_| | | || (_| | | | |   <//__ \n'+
                ' \\__|_|_| |_| \\__, | \\__\\__,_|_| |_|_|\\_\\___/ \n'+
                '            __/ |                            \n'+
                '            |___/                            '
                );
}