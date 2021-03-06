import "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"

var VERSION = "v1.1.0";

export function
beautify
(
    code = "", 
    target = "", 
    lan = "",
    show_lan = false,
    show_copy = false
)
{
    if(!is_setup) {
        add_css();
        add_font();
        add_clip(escape(code));
        is_setup = true;
    }
    code = process_code(code);
    $.getJSON(`https://cdn.jsdelivr.net/npm/code-beautifier@${VERSION}/hls_data.json`, function(hls_data) {
        document.getElementById(target).classList.add("code_box");
        var find_hls = () => {
            var ret = 0;
            while(lan_data[ret] != lan && ret < lan.length) ++ret;
            if(ret == lan_data.length) return __empty_hls;
            else return hls_data[ret];
        }
        var make_info = (str, click) => {
            return `<button class="code_info" onclick=${click}>${str}</button>`;
        }
        var make_info_block = () => {
            var opt = [show_lan, show_copy];
            var info = [[lan, ""], ["copy", "__write_clipboard();"]]
            var ret = "";
            for(var i = 0; i < info.length; ++i)
                if(opt[i])
                    ret += make_info(info[i][0], info[i][1]);
            return `<div class="code_info_block">${ret}</div>`
        }
        var hls = find_hls();
        if(hls == __empty_hls) {
            code = "/* Language Error (please check if you type the right language argument) */";
            lan = "c++";
            hls = find_hls();
        }
        var sp = split(code, hls.sl);
        var rec = {
            sl: false, 
            wd: false,
            nr: false,
            bsl: false,
            lwe: false,
            lwn: false,
            ct: false,
        };
        var set_rec = (val=[-1, -1, -1, -1, -1, -1, -1]) => {
            if(val[0]!=-1) rec.sl = val[0];
            if(val[1]!=-1) rec.wd = val[1];
            if(val[2]!=-1) rec.nr = val[2];
            if(val[3]!=-1) rec.bsl = val[3];
            if(val[4]!=-1) rec.lwe = val[4];
            if(val[5]!=-1) rec.lwn = val[5];
            if(val[6]!=-1) rec.ct = val[6];
        };
        var reset_rec = () => {set_rec([false, false, false, false, -1, false, false]);};
        var is_in = (str="", ls=[""]) => {
            for(var i = 0; i < ls.length; ++i) {
                if(str == ls[i])
                    return true;
            }
            return false;
        };
        var fix_comment = (sy="") => {
            var idl = []
            for(var i = 0; i < hls.sl.length; ++i) {
                for(var j = 0; j < sy.length; ++j) {
                    if(j+hls.sl[i].length <= sy.length) {
                        if(sy.substring(j, j+hls.sl[i].length) == hls.sl[i])
                            idl.push(hls.sl[i]);
                    }
                }
            }
            if(idl.length != 0) {
                var tmp = "", len = 0;
                for(var i = 0; i < sp.length; ++i) {
                    ++len;
                    if(sp[i] == "") continue;
                    if(is_in(sp[i], idl))  {
                        tmp += sp[i];
                        if(tmp == sy) {
                            for(var j = 0; j < len; ++j)
                                sp[i-j] = "";
                            sp[i] = tmp;
                            tmp = "";
                        }
                    } else tmp = "", len = 0;
                }
            }
        };
        var fix_end = () => {
            for(var i = sp.length-1; i >= 0; --i) {
                if(sp[i] == "\n") break;
                if(sp[i] != "\r" && sp[i] != sp[i] == " ") {
                    sp.push("\n");
                    break;
                }
            }
        };
        var is_normal = (str="") => {
            if(is_in(str, hls.wd)) return false;
            if(is_in(str, hls.nr)) return false;
            if(is_in(str, hls.bsl)) return false;
            if(is_in(str, hls.lwn)) return false;
            if(is_in(str, hls.ct)) return false;
            return true;
        };
        var str_syid = -1, pass_str = false;
        var is_str = (str="") => {
            if(pass_str) {
                pass_str = false;
                return false;
            }
            for(var i = 0; i < hls.lwe.length; ++i) {
                if(str_syid != -1) break;
                if(hls.lwe[i][0].length > str.length) break;
                if(hls.lwe[i][0] == str.substring(0, hls.lwe[i][0].length)) {
                    if(str.length == 1) pass_str = true;
                    str_syid = i;
                    return true;
                }
            }
            return false;
        };
        var is_str_end = (str="") => {
            if(str_syid == -1) return false;
            if(str.length >= hls.lwe[str_syid][1].length) if(
                hls.lwe[str_syid][1] 
                == 
                str.substring(str.length-hls.lwe[str_syid][1].length, str.length)
            ) {
                if(str.length-hls.lwe[str_syid][1].length-1 >= 0)
                    if(str[str.length-hls.lwe[str_syid][1].length-1] == "\\") {
                        if(str.length-hls.lwe[str_syid][1].length-2 >= 0) {
                            if(str[str.length-hls.lwe[str_syid][1].length-2] != "\\")
                                return false;
                        } else {
                            return false;
                        }
                    }
                str_syid = -1;
                return true;
            }
            return false;
        };
        var is_num = (str="") => {
            if (typeof str != "string") return false
            return !isNaN(str) &&
                    !isNaN(parseFloat(str))
        };
        var is_str_empty = (str="") => {
            if(str.length == 0) return true;
            for(var i = 0; i < str.length; ++i) {
                if(str[i] == " " || str[i] == "\r" || str[i] == "" || str[i] == "\n")
                    return true;
            }
            return false;
        };
        var rcode = "", tmp = "";
        for(var i = 0; i < hls.ct.length; ++i) fix_comment(hls.ct[i]);
        for(var i = 0; i < hls.lwe.length; ++i)
            fix_comment(hls.lwe[i][0]), fix_comment(hls.lwe[i][1]);
        fix_end();
        for(var i = 0; i < sp.length; ++i) {
            if(sp[i] == "\n") {
                reset_rec();
                rcode += `<li class="code">${tmp}</li>`;
                tmp = "";
                continue;
            }
            if(is_in(sp[i], hls.sl)) rec.sl = true;
            if(is_in(sp[i], hls.wd)) rec.wd = true;
            if(is_num(sp[i], hls.nr)) rec.nr = true;
            if(!rec.ct) if(is_str(sp[i])) rec.lwe = true;
            if(is_in(sp[i], hls.lwn)) rec.lwn = true;
            if(is_in(sp[i], hls.ct) && !rec.lwe) rec.ct = true;

            if(rec.ct) tmp += highlight_comment(sp[i]);
            else if(rec.lwn) tmp += highlight_line(sp[i]);
            else if(rec.lwe) tmp += highlight_str(sp[i]);
            else if(rec.wd) tmp += highlight_word(sp[i]);
            else if(rec.sl) tmp += highlight_symbol(sp[i]);
            else if(rec.nr) tmp += highlight_number(sp[i]);
            else {
                var id = i+1;
                while(id < sp.length) {
                    if(!is_str_empty(sp[id])) break;
                    ++id;
                }
                if(is_in(sp[id], hls.bsl)) tmp += highlight_before(sp[i]);
                else tmp += highlight_none(sp[i]);
            }

            set_rec([false, false, false, false, -1, -1, -1]);
            if(rec.lwe && !pass_str && is_str_end(sp[i]))
                rec.lwe = false;
        }
        document.getElementById(target).innerHTML = `${make_info_block()}<ol class="code_line">${rcode}</ol>`;
    });
}

export function
get_lan_data () 
{ return ["c++", "python3", "javascript", "css"]; }

var is_setup = false;

var __empty_hls = {
    sl:[""], 
    wd:[""],
    nr:[""],
    bsl:[""],
    lwe:[["", ""]],
    lwn:[""],
    ct:[""],
};

var lan_data = get_lan_data();

function add_css() {
    $.getJSON(`https://cdn.jsdelivr.net/npm/code-beautifier@${VERSION}/theme_data.json`, function(json) {
        var __css = json[0];
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement("style");
        head.appendChild(style);
        style.type = "text/css";
        if (style.styleSheet){
            style.styleSheet.cssText = __css;
        } else {
            style.appendChild(document.createTextNode(__css));
        }
    });
}

function add_font() {
    var _href = "https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css";
    var head = document.head || document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    head.appendChild(link);
    link.rel="stylesheet";
    link.href = _href;
}

function add_clip(str) {
    var code = `function __write_clipboard() { navigator.clipboard.writeText(unescape(\`${str}\`)).then(function() {}, function() {console.log("write_clipboard failed.")})};`;
    var head = document.head || document.getElementsByTagName('head')[0];
    var script = document.createElement("script");
    head.appendChild(script);
    script.type = "text/javascript";
    script.appendChild(document.createTextNode(code));
}

function split(str="", key=[""]) {
    var ret = [];
    var back = 0;
    for(var i = 0; i < str.length; ++i) {
        for(var j = 0; j < key.length; ++j) {
            if(str[i] == " " || str[i] == "\n" || str[i] == "\t") {
                ret.push(str.slice(back, i));
                ret.push(str[i]);
                back = i+1;
                break;
            }
            if(i+key[j].length <= str.length) {
                if(str.substr(i, key[j].length) == key[j]) {
                    ret.push(str.slice(back, i));
                    ret.push(key[j]);
                    back = i+key[j].length;
                    break;
                }
            }
        }
    }
    ret.push(str.slice(back, str.length));
    return ret;
}

function process_code(code) {
    var replace = (txt="", pat="", to="") => {
        for(var i = 0; i < txt.length; ++i) {
            if(i+pat.length <= txt.length) {
                if(txt.substring(i, i+pat.length) == pat) {
                    txt = txt.substring(0, i) + to + txt.substring(i+pat.length, txt.length);
                    i += pat.length-1;
                }
            }
        }
        return txt;
    }
    for(var i = 0; i < code.length; ++i) {
        if(code[i] == "<")
            code = replace(code, "<", "&lt");
        else if(code[i] == ">")
            code = replace(code, ">", "&gt");
    }
    return code;
}

function highlight_word(str) { return `<span class="highlight_word">${str}</span>`; }
function highlight_symbol(str) { return `<span class="highlight_symbol">${str}</span>`;}
function highlight_number(str) { return `<span class="highlight_number">${str}</span>`; }
function highlight_comment(str) { return `<span class="highlight_comment">${str}</span>`; }
function highlight_str(str) { return `<span class="highlight_str">${str}</span>`; }
function highlight_none(str) { return `<span class="highlight_none">${str}</span>`; }
function highlight_before(str) { return `<span class="highlight_before">${str}</span>`; }
function highlight_line(str) { return `<span class="highlight_line">${str}</span>`; }

/*

code, target,
hls -> {
    symbol, -> sl [2]
    word, -> wd [4]
    number, -> nr [2]
    word before symbol, -> bsl [3]
    line with end, -> lwe [5]
    line with no end, -> lwn [6]
    comment, -> ct [7]
}

*/