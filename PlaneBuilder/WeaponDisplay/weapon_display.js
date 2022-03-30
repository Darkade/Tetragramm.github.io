// MIT License
System.register("string/index", [], function (exports_1, context_1) {
    "use strict";
    var StringFmt, StringBuilder;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            // MIT License
            // Copyright(c) 2017 Sven Ulrich
            // https://github.com/iwt-svenulrich/typescript-string-operations
            // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            StringFmt = class StringFmt {
                static IsNullOrWhiteSpace(value) {
                    try {
                        if (value == null || value == 'undefined') {
                            return true;
                        }
                        return value.toString().replace(/\s/g, '').length < 1;
                    }
                    catch (e) {
                        console.log(e);
                        return false;
                    }
                }
                static Join(delimiter, ...args) {
                    try {
                        const firstArg = args[0];
                        if (Array.isArray(firstArg) || firstArg instanceof Array) {
                            let tempString = StringFmt.Empty;
                            const count = 0;
                            for (let i = 0; i < firstArg.length; i++) {
                                const current = firstArg[i];
                                if (i < firstArg.length - 1) {
                                    tempString += current + delimiter;
                                }
                                else {
                                    tempString += current;
                                }
                            }
                            return tempString;
                        }
                        else if (typeof firstArg === 'object') {
                            let tempString = StringFmt.Empty;
                            const objectArg = firstArg;
                            const keys = Object.keys(firstArg); //get all Properties of the Object as Array
                            keys.forEach(element => { tempString += objectArg[element] + delimiter; });
                            tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                            return tempString;
                        }
                        const stringArray = args;
                        return StringFmt.join(delimiter, ...stringArray);
                    }
                    catch (e) {
                        console.log(e);
                        return StringFmt.Empty;
                    }
                }
                static Format(format, ...args) {
                    try {
                        if (format.match(StringFmt.regexNumber)) {
                            return StringFmt.format(StringFmt.regexNumber, format, args);
                        }
                        if (format.match(StringFmt.regexObject)) {
                            return StringFmt.format(StringFmt.regexObject, format, args, true);
                        }
                        return format;
                    }
                    catch (e) {
                        console.log(e);
                        return StringFmt.Empty;
                    }
                }
                static format(regex, format, args, parseByObject = false) {
                    return format.replace(regex, function (match, x) {
                        const s = match.split(':');
                        if (s.length > 1) {
                            x = s[0].replace('{', '');
                            match = s[1].replace('}', ''); //U
                        }
                        let arg;
                        if (parseByObject) {
                            arg = args[0][x];
                        }
                        else {
                            arg = args[x];
                        }
                        if (arg == null || arg == undefined || match.match(/{\d+}/)) {
                            return arg;
                        }
                        arg = StringFmt.parsePattern(match, arg);
                        return typeof arg != 'undefined' && arg != null ? arg : StringFmt.Empty;
                    });
                }
                static parsePattern(match, arg) {
                    switch (match) {
                        case 'L': {
                            arg = arg.toLocaleLowerCase();
                            return arg;
                        }
                        case 'U': {
                            arg = arg.toLocaleUpperCase();
                            return arg;
                        }
                        case 'd': {
                            if (typeof (arg) === 'string') {
                                return StringFmt.getDisplayDateFromString(arg);
                            }
                            else if (arg instanceof Date) {
                                return StringFmt.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                            }
                            break;
                        }
                        case 's': {
                            if (typeof (arg) === 'string') {
                                return StringFmt.getSortableDateFromString(arg);
                            }
                            else if (arg instanceof Date) {
                                return StringFmt.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                            }
                            break;
                        }
                        case 'n': { //Tausender Trennzeichen
                            if (typeof (arg) !== "string")
                                arg = arg.toString();
                            const replacedString = arg.replace(/,/g, '.');
                            if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                                break;
                            }
                            const numberparts = replacedString.split(/[^0-9]+/g);
                            let parts = numberparts;
                            if (numberparts.length > 1) {
                                parts = [StringFmt.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                            }
                            const integer = parts[0];
                            const mod = integer.length % 3;
                            let output = (mod > 0 ? (integer.substring(0, mod)) : StringFmt.Empty);
                            const firstGroup = output;
                            const remainingGroups = integer.substring(mod).match(/.{3}/g);
                            output = output + '.' + StringFmt.Join('.', remainingGroups);
                            arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                            return arg;
                        }
                        case 'x': {
                            return this.decimalToHexString(arg);
                        }
                        case 'X': {
                            return this.decimalToHexString(arg, true);
                        }
                        default: {
                            break;
                        }
                    }
                    if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !StringFmt.IsNullOrWhiteSpace(arg)) {
                        return StringFmt.formatNumber(arg, match);
                    }
                    return arg;
                }
                static decimalToHexString(value, upperCase = false) {
                    const parsed = parseFloat(value);
                    const hexNumber = parsed.toString(16);
                    return upperCase ? hexNumber.toLocaleUpperCase() : hexNumber;
                }
                static getDisplayDateFromString(input) {
                    const splitted = input.split('-');
                    if (splitted.length <= 1) {
                        return input;
                    }
                    var day = splitted[splitted.length - 1];
                    const month = splitted[splitted.length - 2];
                    const year = splitted[splitted.length - 3];
                    day = day.split('T')[0];
                    day = day.split(' ')[0];
                    return `${day}.${month}.${year}`;
                }
                static getSortableDateFromString(input) {
                    const splitted = input.replace(',', '').split('.');
                    if (splitted.length <= 1) {
                        return input;
                    }
                    const times = splitted[splitted.length - 1].split(' ');
                    let time = StringFmt.Empty;
                    if (times.length > 1) {
                        time = times[times.length - 1];
                    }
                    const year = splitted[splitted.length - 1].split(' ')[0];
                    const month = splitted[splitted.length - 2];
                    const day = splitted[splitted.length - 3];
                    let result = `${year}-${month}-${day}`;
                    if (!StringFmt.IsNullOrWhiteSpace(time) && time.length > 1) {
                        result += `T${time}`;
                    }
                    else {
                        result += "T00:00:00";
                    }
                    return result;
                }
                static formatNumber(input, formatTemplate) {
                    const count = formatTemplate.length;
                    const stringValue = input.toString();
                    if (count <= stringValue.length) {
                        return stringValue;
                    }
                    let remainingCount = count - stringValue.length;
                    remainingCount += 1; //Array must have an extra entry
                    return new Array(remainingCount).join('0') + stringValue;
                }
                static join(delimiter, ...args) {
                    let temp = StringFmt.Empty;
                    for (let i = 0; i < args.length; i++) {
                        if ((typeof args[i] == 'string' && StringFmt.IsNullOrWhiteSpace(args[i]))
                            || (typeof args[i] != "number" && typeof args[i] != "string")) {
                            continue;
                        }
                        const arg = "" + args[i];
                        temp += arg;
                        for (let i2 = i + 1; i2 < args.length; i2++) {
                            if (StringFmt.IsNullOrWhiteSpace(args[i2])) {
                                continue;
                            }
                            temp += delimiter;
                            i = i2 - 1;
                            break;
                        }
                    }
                    return temp;
                }
            };
            exports_1("StringFmt", StringFmt);
            StringFmt.regexNumber = /{(\d+(:\w*)?)}/g;
            StringFmt.regexObject = /{(\w+(:\w*)?)}/g;
            StringFmt.Empty = '';
            StringBuilder = class StringBuilder {
                constructor(value) {
                    this.Values = [];
                    if (!StringFmt.IsNullOrWhiteSpace(value)) {
                        this.Values = new Array(value);
                    }
                }
                ToString() {
                    return this.Values.join('');
                }
                Append(value) {
                    this.Values.push(value);
                }
                AppendLine(value) {
                    this.Values.push('\r\n' + value);
                }
                AppendFormat(format, ...args) {
                    this.Values.push(StringFmt.Format(format, ...args));
                }
                AppendLineFormat(format, ...args) {
                    this.Values.push("\r\n" + StringFmt.Format(format, ...args));
                }
                Clear() {
                    this.Values = [];
                }
            };
        }
    };
});
System.register("impl/Localization", ["string/index"], function (exports_2, context_2) {
    "use strict";
    var index_1, Localization, localization;
    var __moduleName = context_2 && context_2.id;
    function lu(s, ...args) {
        return index_1.StringFmt.Format(localization.e(s), ...args);
    }
    exports_2("lu", lu);
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            Localization = class Localization {
                constructor() {
                    this.lang = "en";
                }
                LoadLanguages(lang) {
                    this.languages = lang;
                }
                GetLanguages() {
                    const lang = [];
                    for (const elem of this.languages["languages"]) {
                        lang.push(elem);
                    }
                    return lang;
                }
                SetCurrentLanguage(lang) {
                    if (this.languages[lang]) {
                        this.lang = lang;
                    }
                }
                e(key) {
                    if (this.languages[this.lang][key]) {
                        return this.languages[this.lang][key];
                    }
                    else if (this.languages["en"][key]) {
                        return this.languages["en"][key];
                    }
                    else {
                        console.error("Failed to find " + key);
                        return "!" + key + "!";
                    }
                }
            };
            exports_2("localization", localization = new Localization());
        }
    };
});
System.register("disp/Tools", [], function (exports_3, context_3) {
    "use strict";
    var internal_id, enable_anim, loadJSON;
    var __moduleName = context_3 && context_3.id;
    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], { type: type });
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    exports_3("download", download);
    function copyStringToClipboard(str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
    exports_3("copyStringToClipboard", copyStringToClipboard);
    function GenerateID() {
        internal_id++;
        return "internal_id_" + internal_id.toString();
    }
    exports_3("GenerateID", GenerateID);
    function CreateFlexSection(elem) {
        var fs = {
            div0: document.createElement("DIV"), div1: document.createElement("DIV"),
            div2: document.createElement("DIV")
        };
        fs.div0.classList.add("flex-container-o");
        fs.div1.classList.add("flex-container-i");
        fs.div2.classList.add("flex-container-i");
        fs.div0.appendChild(fs.div1);
        fs.div0.appendChild(fs.div2);
        elem.appendChild(fs.div0);
        return fs;
    }
    exports_3("CreateFlexSection", CreateFlexSection);
    function CreateTH(row, content) {
        var th = document.createElement("TH");
        th.innerHTML = content;
        row.appendChild(th);
        return th;
    }
    exports_3("CreateTH", CreateTH);
    function CreateTD(row, content) {
        var th = document.createElement("TD");
        th.innerHTML = content;
        row.appendChild(th);
        return th;
    }
    exports_3("CreateTD", CreateTD);
    function CreateInput(txt, elem, table, br = true) {
        var span = document.createElement("SPAN");
        var txtSpan = document.createElement("LABEL");
        elem.id = GenerateID();
        txtSpan.htmlFor = elem.id;
        txtSpan.style.marginLeft = "0.25em";
        txtSpan.style.marginRight = "0.5em";
        txtSpan.textContent = txt;
        elem.setAttribute("type", "number");
        elem.min = "0";
        elem.step = "1";
        elem.valueAsNumber = 0;
        span.appendChild(txtSpan);
        span.appendChild(elem);
        table.appendChild(span);
        if (br)
            table.appendChild(document.createElement("BR"));
    }
    exports_3("CreateInput", CreateInput);
    function FlexInput(txt, inp, fs) {
        var lbl = document.createElement("LABEL");
        inp.id = GenerateID();
        lbl.htmlFor = inp.id;
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        inp.setAttribute("type", "number");
        inp.min = "0";
        inp.step = "1";
        inp.valueAsNumber = 0;
        lbl.classList.add("flex-item");
        inp.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        fs.div2.appendChild(inp);
    }
    exports_3("FlexInput", FlexInput);
    function FlexText(txt, inp, fs) {
        var lbl = document.createElement("LABEL");
        inp.id = GenerateID();
        lbl.htmlFor = inp.id;
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        inp.setAttribute("type", "text");
        inp.value = "Default";
        lbl.classList.add("flex-item");
        inp.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        fs.div2.appendChild(inp);
    }
    exports_3("FlexText", FlexText);
    function FlexDisplay(txt, inp, fs) {
        var lbl = document.createElement("LABEL");
        inp.id = GenerateID();
        lbl.htmlFor = inp.id;
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        lbl.classList.add("flex-item");
        inp.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        fs.div2.appendChild(inp);
    }
    exports_3("FlexDisplay", FlexDisplay);
    function FlexSelect(txt, sel, fs) {
        var lbl = document.createElement("LABEL");
        sel.id = GenerateID();
        lbl.htmlFor = sel.id;
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        lbl.classList.add("flex-item");
        sel.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        fs.div2.appendChild(sel);
    }
    exports_3("FlexSelect", FlexSelect);
    function CreateCheckbox(txt, elem, table, br = true) {
        var span = document.createElement("SPAN");
        var txtSpan = document.createElement("LABEL");
        elem.id = GenerateID();
        txtSpan.htmlFor = elem.id;
        txtSpan.style.marginLeft = "0.25em";
        txtSpan.style.marginRight = "0.5em";
        txtSpan.textContent = txt;
        elem.setAttribute("type", "checkbox");
        span.appendChild(txtSpan);
        span.appendChild(elem);
        table.appendChild(span);
        if (br)
            table.appendChild(document.createElement("BR"));
    }
    exports_3("CreateCheckbox", CreateCheckbox);
    function CreateSelect(txt, elem, table, br = true) {
        var span = document.createElement("SPAN");
        var txtSpan = document.createElement("LABEL");
        elem.id = GenerateID();
        txtSpan.htmlFor = elem.id;
        txtSpan.style.marginLeft = "0.25em";
        txtSpan.style.marginRight = "0.5em";
        txtSpan.textContent = txt;
        span.appendChild(txtSpan);
        span.appendChild(elem);
        table.appendChild(span);
        if (br)
            table.appendChild(document.createElement("BR"));
    }
    exports_3("CreateSelect", CreateSelect);
    function CreateText(txt, elem, table, br = true) {
        var span = document.createElement("SPAN");
        var lbl = document.createElement("LABEL");
        elem.id = GenerateID();
        lbl.htmlFor = elem.id;
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        elem.setAttribute("type", "text");
        elem.value = "Default";
        span.appendChild(lbl);
        span.appendChild(elem);
        table.appendChild(span);
        if (br)
            table.appendChild(document.createElement("BR"));
    }
    exports_3("CreateText", CreateText);
    function CreateButton(txt, elem, table, br = true) {
        var span = document.createElement("SPAN");
        var txtSpan = document.createElement("LABEL");
        elem.hidden = true;
        elem.id = GenerateID();
        elem.textContent = txt;
        txtSpan.htmlFor = elem.id;
        txtSpan.style.marginLeft = "0.25em";
        txtSpan.style.marginRight = "0.5em";
        txtSpan.textContent = txt;
        txtSpan.classList.add("lbl_action");
        txtSpan.classList.add("btn_th");
        span.appendChild(txtSpan);
        span.appendChild(elem);
        table.appendChild(span);
        if (br) {
            table.appendChild(document.createElement("BR"));
            table.appendChild(document.createElement("BR"));
        }
    }
    exports_3("CreateButton", CreateButton);
    function FlexCheckbox(txt, inp, fs) {
        var lbl = document.createElement("LABEL");
        inp.id = GenerateID();
        lbl.htmlFor = inp.id;
        lbl.id = GenerateID();
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        inp.setAttribute("type", "checkbox");
        lbl.classList.add("flex-item");
        inp.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        var lbl2 = document.createElement("LABEL");
        var span = document.createElement("SPAN");
        span.appendChild(lbl2);
        span.appendChild(inp);
        fs.div2.appendChild(span);
        return lbl;
    }
    exports_3("FlexCheckbox", FlexCheckbox);
    function FlexLabel(txt, div1) {
        var lbl = document.createElement("LABEL");
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txt;
        lbl.classList.add("flex-item");
        div1.appendChild(lbl);
        return lbl;
    }
    exports_3("FlexLabel", FlexLabel);
    function FlexLabels(txtL, txtR, fs) {
        var lbl = document.createElement("LABEL");
        lbl.style.marginLeft = "0.25em";
        lbl.style.marginRight = "0.5em";
        lbl.textContent = txtL;
        lbl.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        var lbl2 = document.createElement("LABEL");
        lbl2.style.marginLeft = "0.25em";
        lbl2.style.marginRight = "0.5em";
        lbl2.textContent = txtR;
        lbl2.classList.add("flex-item");
        fs.div2.appendChild(lbl2);
        return [lbl, lbl2];
    }
    exports_3("FlexLabels", FlexLabels);
    function FlexSpace(fs) {
        var lbl = document.createElement("LABEL");
        lbl.textContent = " ";
        lbl.classList.add("flex-item");
        fs.div1.appendChild(lbl);
        var lbl2 = document.createElement("LABEL");
        lbl2.textContent = " ";
        lbl2.classList.add("flex-item");
        fs.div2.appendChild(lbl2);
    }
    exports_3("FlexSpace", FlexSpace);
    function insertRow(frag) {
        var row = document.createElement("TR");
        frag.append(row);
        return row;
    }
    exports_3("insertRow", insertRow);
    function insertCell(frag) {
        var cell = document.createElement("TD");
        frag.append(cell);
        return cell;
    }
    exports_3("insertCell", insertCell);
    function BlinkBad(elem) {
        elem.classList.toggle("changed_b", false);
        elem.classList.toggle("changed_g", false);
        elem.classList.toggle("changed_n", false);
        elem.offsetHeight;
        elem.classList.toggle("changed_b");
    }
    exports_3("BlinkBad", BlinkBad);
    function BlinkGood(elem) {
        elem.classList.toggle("changed_b", false);
        elem.classList.toggle("changed_g", false);
        elem.classList.toggle("changed_n", false);
        elem.offsetHeight;
        elem.classList.toggle("changed_g");
    }
    exports_3("BlinkGood", BlinkGood);
    function BlinkNeutral(elem) {
        elem.classList.toggle("changed_b", false);
        elem.classList.toggle("changed_g", false);
        elem.classList.toggle("changed_n", false);
        elem.offsetHeight;
        elem.classList.toggle("changed_n");
    }
    exports_3("BlinkNeutral", BlinkNeutral);
    function BlinkNone(elem) {
        elem.classList.toggle("changed_b", false);
        elem.classList.toggle("changed_g", false);
        elem.classList.toggle("changed_n", false);
    }
    exports_3("BlinkNone", BlinkNone);
    function SetAnimationEnabled(enable) {
        enable_anim = enable;
    }
    exports_3("SetAnimationEnabled", SetAnimationEnabled);
    function BlinkIfChanged(elem, str, positive_good = null) {
        if (enable_anim) {
            if (elem.textContent != str) {
                if (positive_good == null) {
                    BlinkNeutral(elem);
                }
                else {
                    var positive = parseInt(elem.textContent) < parseInt(str);
                    if (positive_good && positive || (!positive_good && !positive)) {
                        BlinkGood(elem);
                    }
                    else {
                        BlinkBad(elem);
                    }
                }
            }
            else {
                BlinkNone(elem);
            }
        }
        elem.textContent = str;
    }
    exports_3("BlinkIfChanged", BlinkIfChanged);
    function _arrayBufferToString(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
    }
    exports_3("_arrayBufferToString", _arrayBufferToString);
    function _stringToArrayBuffer(str) {
        var bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes.buffer;
    }
    exports_3("_stringToArrayBuffer", _stringToArrayBuffer);
    return {
        setters: [],
        execute: function () {
            internal_id = 0;
            enable_anim = false;
            exports_3("loadJSON", loadJSON = (path, callback) => {
                let xobj = new XMLHttpRequest();
                xobj.overrideMimeType("application/json");
                xobj.open('GET', path, true);
                // Replace 'my_data' with the path to your file
                xobj.onreadystatechange = () => {
                    if (xobj.readyState === 4 && xobj.status === 200) {
                        // Required use of an anonymous callback
                        // as .open() will NOT return a value but simply returns undefined in asynchronous mode
                        callback(xobj.responseText);
                    }
                };
                xobj.send(null);
            });
        }
    };
});
System.register("WeaponDisplay/weapon_display", ["impl/Localization", "disp/Tools"], function (exports_4, context_4) {
    "use strict";
    var Localization_1, Tools_1, init;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (Localization_1_1) {
                Localization_1 = Localization_1_1;
            },
            function (Tools_1_1) {
                Tools_1 = Tools_1_1;
            }
        ],
        execute: function () {
            init = () => {
                const sp = new URLSearchParams(location.search);
                var lang = sp.get("lang");
                var jsons = ['/PlaneBuilder/strings.json', '/PlaneBuilder/weapons.json'];
                var proms = jsons.map(d => fetch(d));
                Promise.all(proms)
                    .then(ps => Promise.all(ps.map(p => p.json())))
                    .then(resp => {
                    var string_JSON = resp[0];
                    var weapon_JSON = resp[1];
                    //Strings bit
                    Localization_1.localization.LoadLanguages(string_JSON);
                    if (lang) {
                        Localization_1.localization.SetCurrentLanguage(lang);
                    }
                    else if (window.localStorage.language) {
                        Localization_1.localization.SetCurrentLanguage(window.localStorage.language);
                    }
                    var tbl = document.getElementById("table_weap");
                    let weapon_list = [];
                    for (let elem of weapon_JSON["weapons"]) {
                        var weap = {
                            name: elem["name"],
                            abrv: elem["abrv"],
                            era: elem["era"],
                            size: elem["size"],
                            damage: elem["damage"],
                            hits: elem["hits"],
                            ammo: elem["ammo"],
                            ap: elem["ap"],
                            jam: elem["jam"],
                            reload: elem["reload"],
                            rapid: elem["rapid"],
                            synched: elem["synched"],
                            shells: elem["shells"],
                            can_action: elem["can_action"],
                            can_projectile: elem["can_projectile"],
                            deflection: elem["deflection"],
                            cost: elem["cost"],
                            mass: elem["mass"],
                            drag: elem["drag"],
                            warn: elem["warning"],
                        };
                        weapon_list.push(weap);
                    }
                    var era2numHh = (era) => {
                        switch (era) {
                            case "Pioneer":
                                return 0;
                            case "WWI":
                                return 1;
                            case "Roaring 20s":
                                return 2;
                            case "Coming Storm":
                                return 3;
                            case "WWII":
                                return 4;
                            case "Last Hurrah":
                                return 5;
                            case "Himmilgard":
                                return 6;
                        }
                    };
                    var pred = (a, b) => {
                        var cvt2num = (l, r) => {
                            if (l < r)
                                return -1;
                            if (r < l)
                                return 1;
                            return 0;
                        };
                        if (a.size != b.size)
                            return cvt2num(a.size, b.size);
                        else if (a.era != b.era)
                            return cvt2num(era2numHh(a.era), era2numHh(b.era));
                        else if (a.damage != b.damage)
                            return cvt2num(a.damage, b.damage);
                        else
                            return cvt2num(a.name, b.name);
                    };
                    weapon_list = weapon_list.sort(pred);
                    for (let weap of weapon_list) {
                        var row = tbl.insertRow();
                        Tools_1.CreateTD(row, weap.name);
                        Tools_1.CreateTD(row, weap.abrv);
                        Tools_1.CreateTD(row, weap.era);
                        Tools_1.CreateTD(row, weap.cost);
                        Tools_1.CreateTD(row, weap.mass);
                        Tools_1.CreateTD(row, weap.drag);
                        Tools_1.CreateTD(row, weap.hits);
                        Tools_1.CreateTD(row, weap.damage);
                        Tools_1.CreateTD(row, weap.ap);
                        Tools_1.CreateTD(row, weap.ammo);
                        Tools_1.CreateTD(row, weap.reload);
                        Tools_1.CreateTD(row, weap.jam);
                        switch (weap.size) {
                            case 1:
                                Tools_1.CreateTD(row, "Tiny");
                                break;
                            case 2:
                                Tools_1.CreateTD(row, "Light");
                                break;
                            case 4:
                                Tools_1.CreateTD(row, "Medium");
                                break;
                            case 8:
                                Tools_1.CreateTD(row, "Heavy");
                                break;
                            case 16:
                                Tools_1.CreateTD(row, "Artillery");
                                break;
                        }
                        var tags = "";
                        if (weap.rapid)
                            tags += "Rapid-Fire ";
                        if (weap.Manual)
                            tags += "Manual ";
                        if (weap.shells)
                            tags += "Shell-Firing ";
                        if (!(weap.synched))
                            tags += "Open-Bolt ";
                        Tools_1.CreateTD(row, tags);
                        var deflection = (weap.deflection);
                        if (deflection < 0)
                            Tools_1.CreateTD(row, "Yes, " + deflection);
                        else
                            Tools_1.CreateTD(row, "No");
                        if (weap.warn)
                            Tools_1.CreateTD(row, Localization_1.lu(weap.warn));
                        else
                            Tools_1.CreateTD(row, "");
                    }
                    var last_row = tbl.insertRow();
                    Tools_1.CreateTH(last_row, "Name");
                    Tools_1.CreateTH(last_row, "Abbreviation");
                    Tools_1.CreateTH(last_row, "Era");
                    Tools_1.CreateTH(last_row, "Cost");
                    Tools_1.CreateTH(last_row, "Mass");
                    Tools_1.CreateTH(last_row, "Drag");
                    Tools_1.CreateTH(last_row, "Hits");
                    Tools_1.CreateTH(last_row, "Damage");
                    Tools_1.CreateTH(last_row, "AP");
                    Tools_1.CreateTH(last_row, "Ammo");
                    Tools_1.CreateTH(last_row, "Reload");
                    Tools_1.CreateTH(last_row, "Jam");
                    Tools_1.CreateTH(last_row, "Size");
                    Tools_1.CreateTH(last_row, "Tags");
                    Tools_1.CreateTH(last_row, "Awkward");
                    Tools_1.CreateTH(last_row, "Notes");
                });
            };
            window.onload = init;
        }
    };
});
