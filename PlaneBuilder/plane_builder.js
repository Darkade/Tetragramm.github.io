//TODO: Engine as Generator
//TODO: Weapons
//TODO: Radiator requries Parasol wing
//TODO: Radiator requires Metal wing
//TODO: MVP Warning
//TODO: Center Pusher needs tail or extended driveshafts.
const loadJSON = (path, callback) => {
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
};
const init = () => {
    loadJSON('/PlaneBuilder/parts.json', (response) => {
        // Parse JSON string into object
        let acft_data = window.localStorage.aircraft;
        let parts_JSON = JSON.parse(response);
        loadJSON('/PlaneBuilder/engines.json', (response2) => {
            engine_json = JSON.parse(response2);
            aircraft_model = new Aircraft(parts_JSON, true);
            aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);
            if (acft_data)
                aircraft_model.fromJSON(JSON.parse(acft_data));
        });
    });
};
window.onload = init;
var engine_json;
var aircraft_model;
var aircraft_display;
var internal_id = 0;
// When the user clicks on div, open the popup
const RulesPopup = (e) => {
    var children = e.children;
    for (let c of children) {
        if (c.className.includes("rulestext")) {
            c.classList.toggle("show");
            break;
        }
    }
};
//Works like Python string formatting.
function format(fmt, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        }
        else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            return args[index];
        }
    });
}
function GenerateID() {
    internal_id++;
    return "internal_id_" + internal_id.toString();
}
function CreateTH(row, content) {
    var th = document.createElement("TH");
    th.innerHTML = content;
    row.appendChild(th);
}
function CreateInput(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "number");
    elem.min = (0).toString();
    elem.valueAsNumber = 0;
    span.appendChild(elem);
    span.appendChild(txtSpan);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateSelect(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    span.appendChild(elem);
    span.appendChild(txtSpan);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateSpace(table) {
    var span = document.createElement("SPAN");
    span.innerHTML = "&nbsp;";
    table.appendChild(span);
}
function CreateCheckbox(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "checkbox");
    span.appendChild(elem);
    span.appendChild(txtSpan);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function Blink(elem) {
    elem.classList.toggle("changed", false);
    elem.offsetHeight;
    elem.classList.toggle("changed");
}
function BlinkIfChanged(elem, str) {
    if (elem.innerText != str) {
        Blink(elem);
    }
    elem.innerText = str;
}
//Handles Mass, Drag, Control, Escape, Flight Stress, Visibility
function Effects2String(input) {
    if (!(input instanceof Stats))
        var stats = new Stats(input);
    else
        var stats = input;
    function n2s(num) {
        let str = "";
        if (Math.sign(num) > 0) {
            str += "+";
        }
        str += num.toString();
        return str;
    }
    function print(num, txt) {
        let res = "";
        if (num != 0)
            res += n2s(num) + txt;
        return res;
    }
    var ret = "";
    ret += print(stats.liftbleed, " Lift Bleed ");
    ret += print(stats.mass, " Mass ");
    ret += print(stats.drag, " Drag ");
    ret += print(stats.control, " Control ");
    ret += print(stats.reqsections, " Required Sections ");
    ret += print(stats.visibility, " Visibility ");
    ret += print(stats.flightstress, " Flight Stress ");
    ret += print(stats.escape, " Escape ");
    ret += print(stats.pitchstab, " Pitch Stability ");
    ret += print(stats.latstab, " Lateral Stabiilty ");
    ret += print(stats.cooling, " Cooling ");
    ret += print(stats.reliability, " Reliability ");
    ret += print(stats.power, " Power ");
    ret += print(stats.fuelconsumption, " Fuel Consumption ");
    ret += print(stats.maxstrain, " Max Strain ");
    ret += print(stats.structure, " Structure ");
    ret += print(stats.wingarea, " Wing Area ");
    ret += print(stats.toughness, " Toughness ");
    if (ret.length > 0)
        ret += "<br/>";
    return ret;
}
class Stats {
    constructor(js) {
        this.liftbleed = 0;
        this.wetmass = 0;
        this.mass = 0;
        this.drag = 0;
        this.control = 0;
        this.cost = 0;
        this.reqsections = 0;
        this.visibility = 0;
        this.flightstress = 0;
        this.escape = 0;
        this.pitchstab = 0;
        this.latstab = 0;
        this.cooling = 0;
        this.reliability = 0;
        this.power = 0;
        this.fuelconsumption = 0;
        this.maxstrain = 0;
        this.structure = 0;
        this.pitchspeed = 0;
        this.pitchboost = 0;
        this.wingarea = 0;
        this.toughness = 0;
        this.upkeep = 0;
        this.crashsafety = 0;
        this.warnings = [];
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return {
            liftbleed: this.liftbleed,
            wetmass: this.wetmass,
            mass: this.mass,
            drag: this.drag,
            control: this.control,
            cost: this.cost,
            reqsections: this.reqsections,
            visibility: this.visibility,
            flightstress: this.flightstress,
            escape: this.escape,
            pitchstab: this.pitchstab,
            latstab: this.latstab,
            cooling: this.cooling,
            reliability: this.reliability,
            power: this.power,
            fuelconsumption: this.fuelconsumption,
            maxstrain: this.maxstrain,
            structure: this.structure,
            pitchboost: this.pitchboost,
            pitchspeed: this.pitchspeed,
            wingarea: this.wingarea,
            toughness: this.toughness,
            upkeep: this.upkeep,
            crashsafety: this.crashsafety,
        };
    }
    fromJSON(js) {
        if (js["liftbleed"])
            this.liftbleed = js["liftbleed"];
        if (js["wetmass"])
            this.wetmass = js["wetmass"];
        if (js["mass"])
            this.mass = js["mass"];
        if (js["drag"])
            this.drag = js["drag"];
        if (js["control"])
            this.control = js["control"];
        if (js["cost"])
            this.cost = js["cost"];
        if (js["reqsections"])
            this.reqsections = js["reqsections"];
        if (js["visibility"])
            this.visibility = js["visibility"];
        if (js["flightstress"])
            this.flightstress = js["flightstress"];
        if (js["escape"])
            this.escape = js["escape"];
        if (js["pitchstab"])
            this.pitchstab = js["pitchstab"];
        if (js["latstab"])
            this.latstab = js["latstab"];
        if (js["cooling"])
            this.cooling = js["cooling"];
        if (js["reliability"])
            this.reliability = js["reliability"];
        if (js["power"])
            this.power = js["power"];
        if (js["fuelconsumption"])
            this.fuelconsumption = js["fuelconsumption"];
        if (js["maxstrain"])
            this.maxstrain = js["maxstrain"];
        if (js["structure"])
            this.structure = js["structure"];
        if (js["pitchspeed"])
            this.pitchspeed = js["pitchspeed"];
        if (js["pitchboost"])
            this.pitchboost = js["pitchboost"];
        if (js["wingarea"])
            this.wingarea = js["wingarea"];
        if (js["toughness"])
            this.toughness = js["toughness"];
        if (js["upkeep"])
            this.upkeep = js["upkeep"];
        if (js["crashsafety"])
            this.crashsafety = js["crashsafety"];
        if (js["warning"])
            this.warnings.push({ source: js["name"], warning: js["warning"] });
    }
    Add(other) {
        var res = new Stats();
        res.liftbleed = this.liftbleed + other.liftbleed;
        res.wetmass = this.wetmass + other.wetmass;
        res.mass = this.mass + other.mass;
        res.drag = this.drag + other.drag;
        res.control = this.control + other.control;
        res.cost = this.cost + other.cost;
        res.reqsections = this.reqsections + other.reqsections;
        res.visibility = this.visibility + other.visibility;
        res.flightstress = this.flightstress + other.flightstress;
        res.escape = this.escape + other.escape;
        res.pitchstab = this.pitchstab + other.pitchstab;
        res.latstab = this.latstab + other.latstab;
        res.cooling = this.cooling + other.cooling;
        res.reliability = this.reliability + other.reliability;
        res.power = this.power + other.power;
        res.fuelconsumption = this.fuelconsumption + other.fuelconsumption;
        res.maxstrain = this.maxstrain + other.maxstrain;
        res.structure = this.structure + other.structure;
        res.pitchboost = this.pitchboost + other.pitchboost;
        res.pitchspeed = this.pitchspeed + other.pitchspeed;
        res.wingarea = this.wingarea + other.wingarea;
        res.toughness = this.toughness + other.toughness;
        res.upkeep = this.upkeep + other.upkeep;
        res.crashsafety = this.crashsafety + other.crashsafety;
        res.warnings = this.MergeWarnings(other.warnings);
        return res;
    }
    MergeWarnings(owarn) {
        var newList = [];
        for (let w2 of this.warnings) {
            newList.push(w2);
        }
        for (let w of owarn) {
            let dup = false;
            for (let w2 of this.warnings) {
                if (w.source == w2.source && w.warning == w2.warning)
                    dup = true;
            }
            if (!dup)
                newList.push(w);
        }
        return newList;
    }
    Multiply(other) {
        var res = new Stats();
        res.liftbleed = this.liftbleed * other;
        res.wetmass = this.wetmass * other;
        res.mass = this.mass * other;
        res.drag = this.drag * other;
        res.control = this.control * other;
        res.cost = this.cost * other;
        res.reqsections = this.reqsections * other;
        res.visibility = this.visibility * other;
        res.flightstress = this.flightstress * other;
        res.escape = this.escape * other;
        res.pitchstab = this.pitchstab * other;
        res.latstab = this.latstab * other;
        res.cooling = this.cooling * other;
        res.reliability = this.reliability * other;
        res.power = this.power * other;
        res.fuelconsumption = this.fuelconsumption * other;
        res.maxstrain = this.maxstrain * other;
        res.structure = this.structure * other;
        res.pitchboost = this.pitchboost * other;
        res.pitchspeed = this.pitchspeed * other;
        res.wingarea = this.wingarea * other;
        res.toughness = this.toughness * other;
        res.upkeep = this.upkeep * other;
        res.warnings = this.warnings;
        return res;
    }
    Equal(other) {
        return this.liftbleed == other.liftbleed
            && this.wetmass == other.wetmass
            && this.mass == other.mass
            && this.drag == other.drag
            && this.control == other.control
            && this.cost == other.cost
            && this.reqsections == other.reqsections
            && this.visibility == other.visibility
            && this.flightstress == other.flightstress
            && this.escape == other.escape
            && this.pitchstab == other.pitchstab
            && this.latstab == other.latstab
            && this.cooling == other.cooling
            && this.reliability == other.reliability
            && this.power == other.power
            && this.fuelconsumption == other.fuelconsumption
            && this.maxstrain == other.maxstrain
            && this.structure == other.structure
            && this.pitchspeed == other.pitchspeed
            && this.pitchboost == other.pitchboost
            && this.wingarea == other.wingarea
            && this.toughness == other.toughness
            && this.upkeep == other.upkeep;
    }
    Round() {
        this.liftbleed = Math.floor(this.liftbleed);
        this.wetmass = Math.floor(this.wetmass);
        this.mass = Math.floor(this.mass);
        this.drag = Math.floor(this.drag);
        this.control = Math.floor(this.control);
        this.cost = Math.floor(this.cost);
        this.reqsections = Math.floor(this.reqsections);
        this.visibility = Math.floor(this.visibility);
        this.flightstress = Math.floor(this.flightstress);
        this.escape = Math.floor(this.escape);
        this.pitchstab = Math.floor(this.pitchstab);
        this.latstab = Math.floor(this.latstab);
        this.cooling = Math.floor(this.cooling);
        this.reliability = Math.floor(this.reliability);
        this.power = Math.floor(this.power);
        this.fuelconsumption = Math.floor(this.fuelconsumption);
        this.maxstrain = Math.floor(this.maxstrain);
        this.structure = Math.floor(this.structure);
        this.pitchspeed = Math.floor(this.pitchspeed);
        this.pitchboost = Math.floor(this.pitchboost);
        this.wingarea = Math.floor(this.wingarea);
        this.toughness = Math.floor(this.toughness);
        this.upkeep = Math.floor(this.upkeep);
    }
}
class Part {
}
class Display {
}
class Aircraft_HTML extends Display {
    constructor(js, aircraft) {
        super();
        this.acft = aircraft;
        this.era = new Era_HTML(this.acft.GetEra());
        this.cockpits = new Cockpits_HTML(aircraft.GetCockpits());
        this.passengers = new Passengers_HTML(aircraft.GetPassengers());
        this.engines = new Engines_HTML(aircraft.GetEngines());
        this.propeller = new Propeller_HTML(aircraft.GetPropeller());
        this.frames = new Frames_HTML(aircraft.GetFrames());
        this.wings = new Wings_HTML(aircraft.GetWings());
        this.stabilizers = new Stabilizers_HTML(aircraft.GetStabilizers());
        this.controlsurfaces = new ControlSurfaces_HTML(aircraft.GetControlSurfaces());
        // this.engines.Initialize();
        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });
        this.UpdateDisplay();
    }
    UpdateDisplay() {
        this.era.UpdateDisplay();
        this.cockpits.UpdateDisplay();
        this.passengers.UpdateDisplay();
        this.engines.UpdateDisplay();
        this.propeller.UpdateDisplay();
        this.frames.UpdateDisplay();
        this.wings.UpdateDisplay();
        this.stabilizers.UpdateDisplay();
        this.controlsurfaces.UpdateDisplay();
    }
}
class Aircraft {
    constructor(js, storage) {
        this.use_storage = false;
        this.stats = new Stats();
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.wings.SetCalculateStats(() => { this.CalculateStats(); });
        this.stabilizers.SetCalculateStats(() => { this.CalculateStats(); });
        this.controlsurfaces.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
    }
    toJSON() {
        return {
            version: this.version,
            era: this.era.toJSON(),
            cockpits: this.cockpits.toJSON(),
            passengers: this.passengers.toJSON(),
            engines: this.engines.toJSON(),
            propeller: this.propeller.toJSON(),
            frames: this.frames.toJSON(),
            wings: this.wings.toJSON(),
            stabilizers: this.stabilizers.toJSON(),
            controlsurfaces: this.controlsurfaces.toJSON(),
        };
    }
    fromJSON(js) {
        console.log(js);
        console.log(js["version"]);
        if (this.version == js["version"]) {
            this.era.fromJSON(js["era"]);
            this.cockpits.fromJSON(js["cockpits"]);
            this.passengers.fromJSON(js["passengers"]);
            this.engines.fromJSON(js["engines"]);
            this.propeller.fromJSON(js["propeller"]);
            this.frames.fromJSON(js["frames"]);
            this.wings.fromJSON(js["wings"]);
            this.stabilizers.fromJSON(js["stabilizers"]);
            this.controlsurfaces.fromJSON(js["controlsurfaces"]);
            this.CalculateStats();
        }
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());
        stats = stats.Add(this.engines.PartStats());
        this.propeller.SetHavePropeller(this.engines.GetHavePropeller());
        stats = stats.Add(this.propeller.PartStats());
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        stats = stats.Add(this.frames.PartStats());
        this.wings.SetNumFrames(this.frames.GetNumFrames());
        stats = stats.Add(this.wings.PartStats());
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetWingArea(stats.wingarea);
        stats = stats.Add(this.stabilizers.PartStats());
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        stats = stats.Add(this.controlsurfaces.PartStats());
        //Update Part Local stuff
        this.cockpits.UpdateCrewStats(stats);
        this.engines.UpdateReliability(stats);
        if (!this.updated_stats)
            this.stats = stats;
        if (this.DisplayCallback)
            this.DisplayCallback();
        if (this.use_storage)
            window.localStorage.aircraft = JSON.stringify(this);
    }
    GetEra() {
        return this.era;
    }
    GetCockpits() {
        return this.cockpits;
    }
    GetPassengers() {
        return this.passengers;
    }
    GetEngines() {
        return this.engines;
    }
    GetPropeller() {
        return this.propeller;
    }
    GetFrames() {
        return this.frames;
    }
    GetWings() {
        return this.wings;
    }
    GetStabilizers() {
        return this.stabilizers;
    }
    GetControlSurfaces() {
        return this.controlsurfaces;
    }
}
class Era_HTML extends Display {
    constructor(m) {
        super();
        this.model = m;
        //Get used elements
        this.select = document.getElementById("select_era");
        this.bleed = document.getElementById("liftbleed_era");
        this.select.required = true;
        //When selection changes, change value and RecalculateTotals
        this.select.onchange = () => {
            this.model.SetSelected(this.select.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.select.add(opt);
        }
    }
    UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        BlinkIfChanged(this.bleed, this.model.GetLiftBleed().toString());
    }
}
class Era extends Part {
    constructor(js) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = { name: elem["name"], value: parseInt(elem["liftbleed"]) };
            this.vals.push(opt);
        }
    }
    toJSON() {
        return {
            selected: this.selected
        };
    }
    fromJSON(js) {
        this.selected = js["selected"];
    }
    GetSelected() {
        return this.selected;
    }
    SetSelected(index) {
        this.selected = index;
        this.CalculateStats();
    }
    GetEraOptions() {
        return this.vals;
    }
    GetLiftBleed() {
        return this.vals[this.selected].value;
    }
    PartStats() {
        var s = new Stats();
        s.liftbleed = this.GetLiftBleed();
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Cockpits_HTML extends Display {
    constructor(cockpits) {
        super();
        this.cockpits = cockpits;
        this.tbl = document.getElementById("table_cockpit");
        this.counter = document.getElementById("num_cockpits");
        this.positions = [];
        this.counter.oninput = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
    }
    CounterChange() {
        while (this.positions.length > this.counter.valueAsNumber) {
            this.RemoveCockpit();
        }
        while (this.positions.length < this.counter.valueAsNumber) {
            this.AddCockpit(this.positions.length);
        }
    }
    AddCockpit(num) {
        var row = this.tbl.insertRow();
        var cp = new Cockpit_HTML(row, this.cockpits.GetCockpit(num));
        this.positions.push(cp);
    }
    RemoveCockpit() {
        this.positions.pop();
        this.tbl.deleteRow(this.tbl.rows.length - 1);
    }
    UpdateDisplay() {
        this.counter.valueAsNumber = this.cockpits.GetNumberOfCockpits();
        this.CounterChange();
        for (let i = 0; i < this.positions.length; i++) {
            let pos = this.positions[i];
            pos.UpdateCockpit(this.cockpits.GetCockpit(i));
            pos.UpdateDisplay();
        }
    }
}
class Cockpits extends Part {
    constructor(js) {
        super();
        this.positions = [];
        this.types = [];
        //Add all the cockpit types
        for (let elem of js["options"]) {
            let opt = { name: elem["name"], stats: new Stats(elem) };
            this.types.push(opt);
        }
        this.upgrades = [];
        //Add all the upgrades
        for (let elem of js["upgrades"]) {
            let upg = { name: elem["name"], stats: new Stats(elem) };
            this.upgrades.push(upg);
        }
    }
    toJSON() {
        var lst = [];
        for (let cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }
    fromJSON(js) {
        this.positions = [];
        for (let elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades);
            cp.fromJSON(elem);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    SetNumberOfCockpits(num) {
        while (this.positions.length > num) {
            this.positions.pop();
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
        this.CalculateStats();
    }
    GetNumberOfCockpits() {
        return this.positions.length;
    }
    GetCockpit(index) {
        return this.positions[index];
    }
    PartStats() {
        var s = new Stats();
        for (let cp of this.positions) {
            s = s.Add(cp.PartStats());
        }
        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0;
        s.flightstress = 0;
        s.visibility = 0;
        return s;
    }
    UpdateCrewStats(stats) {
        for (let cp of this.positions) {
            cp.CrewUpdate(stats);
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Cockpit_HTML extends Display {
    constructor(r, cp) {
        super();
        this.row = r;
        this.cockpit = cp;
        this.upg_chbxs = [];
        var option = this.row.insertCell(0);
        var upgrades = this.row.insertCell(1);
        var stat_cell = this.row.insertCell(2);
        var tbl = document.createElement("TABLE");
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Control");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        this.d_cont = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, "Flight Stress");
        CreateTH(h2_row, "Escape");
        CreateTH(h2_row, "Visibility");
        CreateTH(h2_row, "Required Sections");
        var c2_row = tbl.insertRow();
        this.d_strs = c2_row.insertCell();
        this.d_escp = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        this.d_rseq = c2_row.insertCell();
        stat_cell.appendChild(tbl);
        stat_cell.className = "inner_table";
        tbl.className = "inner_table";
        this.sel_type = document.createElement("SELECT");
        // Visibility and Stress and Escape are cockpit local
        // Mark in table for CSS
        this.d_strs.className = "part_local";
        this.d_visi.className = "part_local";
        this.d_escp.className = "part_local";
        //Add all the cockpit types to the select box
        for (let elem of cp.GetTypeList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.sel_type.add(opt);
        }
        option.appendChild(this.sel_type);
        //Add all the upgrades as checkboxes
        var upg_index = 0;
        for (let elem of cp.GetUpgradeList()) {
            let span = document.createElement("SPAN");
            let txt = document.createElement("SPAN");
            txt.innerHTML = elem.name;
            let upg = document.createElement("INPUT");
            upg.setAttribute("type", "checkbox");
            upg.checked = false;
            let local_index = upg_index;
            upg_index += 1;
            upg.onchange = () => { this.cockpit.SetUpgrade(local_index, upg.checked); };
            span.appendChild(upg);
            span.appendChild(txt);
            upgrades.appendChild(span);
            upgrades.appendChild(document.createElement("BR"));
            this.upg_chbxs.push(upg);
        }
        //Set the change event, add the box, and execute it.
        this.sel_type.onchange = () => { this.cockpit.SetType(this.sel_type.selectedIndex); };
    }
    UpdateCockpit(cp) {
        this.cockpit = cp;
    }
    UpdateDisplay() {
        let stats = this.cockpit.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_strs, this.cockpit.GetFlightStress().toString());
        BlinkIfChanged(this.d_escp, this.cockpit.GetEscape().toString());
        BlinkIfChanged(this.d_visi, this.cockpit.GetVisibility().toString());
        BlinkIfChanged(this.d_rseq, stats.reqsections.toString());
        this.sel_type.selectedIndex = this.cockpit.GetType();
        var upgs = this.cockpit.GetSelectedUpgrades();
        for (let i = 0; i < this.upg_chbxs.length; i++) {
            this.upg_chbxs[i].checked = upgs[i];
        }
    }
}
class Cockpit extends Part {
    constructor(tl, ul) {
        super();
        this.stats = new Stats();
        this.types = tl;
        this.upgrades = ul;
        this.selected_upgrades = [...Array(this.upgrades.length).fill(false)];
        this.total_stress = 0;
        this.total_escape = 0;
        this.total_visibility = 0;
        this.selected_type = 0;
    }
    toJSON() {
        return {
            type: this.selected_type,
            upgrades: this.selected_upgrades
        };
    }
    fromJSON(js) {
        this.selected_type = js["type"];
        this.selected_upgrades = js["upgrades"];
    }
    GetTypeList() {
        return this.types;
    }
    GetUpgradeList() {
        return this.upgrades;
    }
    GetType() {
        return this.selected_type;
    }
    SetType(index) {
        if (index >= this.types.length)
            throw "Selected type is not in range of actual types.";
        this.selected_type = index;
        this.CalculateStats();
    }
    GetSelectedUpgrades() {
        return this.selected_upgrades;
    }
    SetUpgrade(index, state) {
        if (index >= this.upgrades.length)
            throw "Selected type is not in range of actual upgrades.";
        this.selected_upgrades[index] = state;
        this.CalculateStats();
    }
    GetVisibility() {
        return this.total_visibility;
    }
    GetFlightStress() {
        return this.total_stress;
    }
    GetEscape() {
        return this.total_escape;
    }
    PartStats() {
        this.stats = new Stats();
        this.stats.reqsections = 1;
        this.stats = this.stats.Add(this.types[this.selected_type].stats);
        for (let i = 0; i < this.selected_upgrades.length; i++) {
            if (this.selected_upgrades[i])
                this.stats = this.stats.Add(this.upgrades[i].stats);
        }
        var stats = new Stats();
        stats = stats.Add(this.stats);
        return stats;
    }
    CrewUpdate(stats) {
        this.total_escape = this.stats.escape + stats.escape;
        this.total_stress = this.stats.flightstress + stats.flightstress;
        this.total_visibility = this.stats.visibility + stats.visibility;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Passengers_HTML extends Display {
    constructor(pass) {
        super();
        this.pass = pass;
        this.nseats = document.getElementById("num_seats");
        this.nbeds = document.getElementById("num_beds");
        this.connect = document.getElementById("passenger_connectivity");
        this.mass = document.getElementById("passenger_mass");
        this.reqseq = document.getElementById("passenger_req_seq");
        this.connect.disabled = true;
        this.nseats.oninput = () => {
            this.pass.SetSeats(this.nseats.valueAsNumber);
        };
        this.nbeds.oninput = () => {
            this.pass.SetBeds(this.nbeds.valueAsNumber);
        };
        this.connect.oninput = () => {
            this.pass.SetConnected(this.connect.checked);
        };
    }
    UpdateDisplay() {
        var stats = this.pass.PartStats();
        this.nseats.valueAsNumber = this.pass.GetSeats();
        this.nbeds.valueAsNumber = this.pass.GetBeds();
        this.connect.checked = this.pass.GetConnected();
        this.connect.disabled = !this.pass.PossibleConnection();
        BlinkIfChanged(this.mass, stats.mass.toString());
        BlinkIfChanged(this.reqseq, stats.reqsections.toString());
    }
}
class Passengers extends Part {
    constructor(js) {
        super();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }
    toJSON() {
        return {
            seats: this.seats,
            beds: this.beds,
            connected: this.connected
        };
    }
    fromJSON(js) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }
    GetSeats() {
        return this.seats;
    }
    SetSeats(num) {
        this.seats = num;
        this.CalculateStats();
    }
    GetBeds() {
        return this.beds;
    }
    SetBeds(num) {
        this.beds = num;
        this.CalculateStats();
    }
    PossibleConnection() {
        return (this.seats + this.beds) > 0;
    }
    GetConnected() {
        return this.connected;
    }
    SetConnected(sel) {
        this.connected = sel;
        this.CalculateStats();
    }
    PartStats() {
        var s = new Stats();
        s.reqsections = 2 * Math.ceil((this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            s.mass = 1;
        }
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class EngineStats {
    constructor(js) {
        this.name = "";
        this.overspeed = 0;
        this.altitude = 0;
        this.torque = 0;
        this.rumble = 0;
        this.oiltank = false;
        this.pulsejet = false;
        this.stats = new Stats();
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return Object.assign({ name: this.name, overspeed: this.overspeed, altitude: this.altitude, torque: this.torque, rumble: this.rumble, oiltank: this.oiltank, pulsejet: this.pulsejet }, this.stats.toJSON());
    }
    fromJSON(js) {
        this.name = js["name"];
        this.overspeed = js["overspeed"];
        this.altitude = js["altitude"];
        this.torque = js["torque"];
        this.rumble = js["rumble"];
        this.oiltank = js["oiltank"];
        this.pulsejet = js["pulsejet"];
        this.stats = new Stats(js);
    }
    Add(other) {
        let res = new EngineStats();
        res.stats = this.stats.Add(other.stats);
        res.name = this.name;
        res.overspeed = this.overspeed + other.overspeed;
        res.altitude = this.altitude + other.altitude;
        res.torque = this.torque + other.torque;
        res.rumble = this.rumble + other.rumble;
        res.oiltank = this.oiltank || other.oiltank;
        res.pulsejet = this.pulsejet || other.pulsejet;
        return res;
    }
    Clone() {
        return this.Add(new EngineStats());
    }
    Equal(other) {
        return this.stats.Equal(other.stats)
            && this.overspeed == other.overspeed
            && this.altitude == other.altitude
            && this.torque == other.torque
            && this.rumble == other.rumble
            && this.oiltank == other.oiltank
            && this.pulsejet == other.pulsejet;
    }
}
class Engines_HTML extends Display {
    constructor(eng) {
        super();
        this.eng = eng;
        this.engines = [];
        this.radiators = [];
        this.tbl = document.getElementById("table_engine");
        this.tblR = document.getElementById("table_radiator");
        this.num_engines = document.getElementById("num_engines");
        this.num_engines.oninput = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfEngines();
        this.num_radiators = document.getElementById("num_radiators");
        this.num_radiators.oninput = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();
        this.is_asymmetric = document.getElementById("asymmetric");
        this.is_asymmetric.oninput = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }
    UpdateDisplay() {
        var num = this.eng.GetNumberOfEngines();
        if (num == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.num_engines.valueAsNumber = num;
        while (this.engines.length > num) {
            this.engines.pop();
            this.tbl.deleteRow(this.engines.length + 1);
        }
        while (this.engines.length < num) {
            let tst = this.eng.GetEngine(this.engines.length);
            let en = new Engine_HTML(tst, this.tbl.insertRow());
            this.engines.push(en);
        }
        for (let i = 0; i < num; i++) {
            this.engines[i].UpdateEngine(this.eng.GetEngine(i));
        }
        var rad = this.eng.GetNumberOfRadiators();
        this.num_radiators.valueAsNumber = rad;
        if (rad == 0) {
            this.tblR.style.display = "none";
            this.num_radiators.disabled = true;
        }
        else {
            this.tblR.style.display = "";
            this.num_radiators.disabled = false;
        }
        while (this.radiators.length > rad) {
            this.radiators.pop();
            this.tblR.deleteRow(this.radiators.length + 1);
        }
        while (this.radiators.length < rad) {
            let en = new Radiator_HTML(this.tblR.insertRow(), this.eng.GetRadiator(this.radiators.length));
            this.radiators.push(en);
        }
        for (let i = 0; i < rad; i++) {
            this.radiators[i].UpdateRadiator(this.eng.GetRadiator(i));
        }
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
        for (let elem of this.engines) {
            elem.UpdateDisplay();
        }
        for (let elem of this.radiators) {
            elem.UpdateDisplay();
        }
    }
}
class Engines extends Part {
    constructor(js) {
        super();
        this.engines = [];
        this.engine_stats = [];
        this.radiators = [];
        for (let elem of engine_json["engines"]) {
            this.engine_stats.push(new EngineStats(elem));
        }
        this.mount_list = [];
        for (let elem of js["mounts"]) {
            let mount = { name: elem["name"], stats: new Stats(elem), strainfactor: elem["strainfactor"], dragfactor: elem["dragfactor"], pp_type: elem["push-pull"], reqED: false, reqTail: false };
            if (elem["reqED"])
                mount.reqED = true;
            if (elem["reqTail"])
                mount.reqTail = true;
            this.mount_list.push(mount);
        }
        this.pp_list = [];
        for (let elem of js["push-pull"]) {
            this.pp_list[elem["type"]] = { name: elem["name"], powerfactor: elem["powerfactor"] };
        }
        this.is_asymmetric = false;
        this.r_type_list = [];
        for (let elem of js["radiator-type"]) {
            this.r_type_list.push({ name: elem["name"], stats: new Stats(elem), dragpercool: parseFloat(elem["dragpercool"]) });
        }
        this.r_mount_list = [];
        for (let elem of js["radiator-mount"]) {
            this.r_mount_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.r_coolant_list = [];
        for (let elem of js["radiator-coolant"]) {
            this.r_coolant_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        var eng = [];
        for (let en of this.engines) {
            eng.push(en.toJSON());
        }
        var rad = [];
        for (let rd of this.radiators) {
            rad.push(rd.toJSON());
        }
        return {
            engines: eng,
            radiators: rad,
            is_asymmetric: this.is_asymmetric
        };
    }
    fromJSON(js) {
        this.radiators = [];
        for (let elem of js["radiators"]) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.fromJSON(elem);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        this.engines = [];
        for (let elem of js["engines"]) {
            let eng = new Engine(this.engine_stats, this.mount_list, this.pp_list);
            eng.fromJSON(elem);
            eng.SetCalculateStats(this.CalculateStats);
            this.engines.push(eng);
            eng.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.is_asymmetric = js["is_asymmetric"];
    }
    SetNumberOfEngines(num) {
        while (this.engines.length > num) {
            this.engines.pop();
        }
        while (this.engines.length < num) {
            let en = new Engine(this.engine_stats, this.mount_list, this.pp_list);
            en.SetCalculateStats(this.CalculateStats);
            this.engines.push(en);
            en.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.CalculateStats();
    }
    GetNumberOfEngines() {
        return this.engines.length;
    }
    GetEngine(num) {
        return this.engines[num];
    }
    GetRadiator(num) {
        return this.radiators[num];
    }
    SetNumberOfRadiators(num) {
        while (this.radiators.length > num) {
            this.radiators.pop();
        }
        while (this.radiators.length < num) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        for (let en of this.engines) {
            en.SetNumRadiators(num);
        }
        this.CalculateStats();
    }
    GetNumberOfRadiators() {
        if (this.radiators.length == 0 && this.NeedCooling())
            this.SetNumberOfRadiators(1);
        else if (this.radiators.length > 0 && !this.NeedCooling())
            this.SetNumberOfRadiators(0);
        return this.radiators.length;
    }
    NeedCooling() {
        var need = false;
        for (let elem of this.engines) {
            need = need || elem.NeedCooling();
        }
        return need;
    }
    UpdateReliability(stats) {
        for (let elem of this.engines) {
            let rad_stats = new Stats();
            if (elem.GetRadiator() < this.radiators.length && elem.GetRadiator() >= 0) {
                rad_stats = this.radiators[elem.GetRadiator()].PartStats();
            }
            elem.UpdateReliability(stats.reliability + rad_stats.reliability);
        }
    }
    SetAsymmetry(use) {
        this.is_asymmetric = use;
        this.CalculateStats();
    }
    GetAsymmetry() {
        return this.is_asymmetric;
    }
    GetHavePropeller() {
        for (let e of this.engines) {
            if (e.GetHavePropeller())
                return true;
        }
        return false;
    }
    PartStats() {
        var stats = new Stats;
        var needCool = [...Array(this.radiators.length).fill(0)];
        //Engine stuff
        for (let en of this.engines) {
            stats = stats.Add(en.PartStats());
            if (en.NeedCooling())
                needCool[en.GetRadiator()] += en.GetCooling();
        }
        //Upkeep calc only uses engine costs
        stats.upkeep = Math.floor(Math.min(stats.power / 10, stats.cost));
        //Include radiaators
        for (let i = 0; i < this.radiators.length; i++) {
            let rad = this.radiators[i];
            rad.SetNeedCool(needCool[i]);
            stats = stats.Add(rad.PartStats());
        }
        //Asymmetric planes
        if (this.is_asymmetric)
            stats.latstab -= 3;
        //Part local, gets handled in UpdateReliability
        stats.reliability = 0;
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetHasTractorNacelles() {
        let has = 0;
        for (let en of this.engines) {
            if (en.GetIsTractorNacelle())
                has++;
        }
        return has > 1;
    }
}
class Engine extends Part {
    constructor(el, ml, ppl) {
        super();
        this.engine_list = el;
        this.selected_index = 0;
        this.etype_stats = this.engine_list[0].Clone();
        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;
        this.mount_list = ml;
        this.selected_mount = 0;
        this.mount_stats = this.mount_list[0].stats;
        this.pp_list = ppl;
        this.use_pp = false;
        this.torque_to_struct = false;
        this.gp_count = 0;
        this.gpr_count = 0;
        this.total_reliability = 0;
        if (el.length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.selected_mount,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count
        };
    }
    fromJSON(js) {
        this.etype_stats.fromJSON(js["selected_stats"]);
        this.cooling_count = js["cooling_count"];
        this.radiator_index = js["radiator_index"];
        this.selected_mount = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.selected_index = -1;
        for (let i = 0; i < this.engine_list.length; i++) {
            if (this.etype_stats.Equal(this.engine_list[i])) {
                this.selected_index = i;
                break;
            }
        }
    }
    SetSelectedIndex(num) {
        this.selected_index = num;
        this.etype_stats = this.engine_list[this.selected_index].Clone();
        if (num >= this.engine_list.length)
            throw "Index is out of range of engine_list.";
        this.PulseJetCheck();
        this.cooling_count = this.etype_stats.stats.cooling;
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return this.selected_index;
    }
    SetCustomStats(stats) {
        this.selected_index = -1;
        this.etype_stats = stats;
        this.PulseJetCheck();
        this.cooling_count = Math.min(this.cooling_count, this.etype_stats.stats.cooling);
        this.CalculateStats();
    }
    GetCurrentStats() {
        let stats = new EngineStats();
        stats = stats.Add(this.etype_stats);
        return stats;
    }
    NeedCooling() {
        return this.cooling_count > 0;
    }
    WarnCoolingReliability() {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }
    SetCooling(num) {
        this.cooling_count = num;
        this.CalculateStats();
    }
    GetCooling() {
        return this.cooling_count;
    }
    SetNumRadiators(num) {
        this.num_radiators = num;
        if (this.radiator_index >= num)
            this.radiator_index = num - 1;
        if (this.radiator_index < 0 && num > 0)
            this.radiator_index = 0;
    }
    GetNumRadiators() {
        return this.num_radiators;
    }
    SetRadiator(num) {
        this.radiator_index = num;
        this.CalculateStats();
    }
    GetRadiator() {
        return this.radiator_index;
    }
    GetListOfEngines() {
        return this.engine_list;
    }
    RequiresExtendedDriveshafts() {
        return this.mount_list[this.selected_mount].reqED;
    }
    RequiresTailMod() {
        if (this.use_ds)
            return false;
        return this.mount_list[this.selected_mount].reqTail;
    }
    SetMountIndex(num) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.selected_mount = num;
        this.mount_stats = this.mount_list[num].stats;
        if (this.mount_list[this.selected_mount].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }
    GetMountIndex() {
        if (this.GetIsPulsejet())
            return -1;
        return this.selected_mount;
    }
    SetUsePushPull(use) {
        this.use_pp = use;
        this.CalculateStats();
    }
    GetUsePushPull() {
        return this.use_pp;
    }
    GetMountList() {
        return this.mount_list;
    }
    SetUseExtendedDriveshaft(use) {
        this.use_ds = use || this.RequiresExtendedDriveshafts();
        this.CalculateStats();
    }
    GetUseExtendedDriveshaft() {
        return this.use_ds;
    }
    SetGearCount(num) {
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
        this.gpr_count = Math.min(num, this.gp_count);
        this.CalculateStats();
    }
    GetGearReliability() {
        return this.gpr_count;
    }
    SetTorqueToStruct(use) {
        this.torque_to_struct = use;
        if (!this.use_pp)
            this.torque_to_struct = false;
        this.CalculateStats();
    }
    GetTorqueToStruct() {
        return this.torque_to_struct;
    }
    CanTorqueToStruct() {
        return this.use_pp && this.etype_stats.torque > 0 && this.mount_list[this.selected_mount].pp_type == "wing";
    }
    PartStats() {
        let stats = new Stats;
        if (this.selected_index > 0)
            stats = stats.Add(this.etype_stats.stats);
        else
            stats = stats.Add(this.etype_stats.stats);
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        if (this.mount_list[this.selected_mount].pp_type == "fuselage")
            stats.latstab -= this.etype_stats.torque;
        else if (this.mount_list[this.selected_mount].pp_type == "wing") {
            if (this.torque_to_struct)
                stats.structure -= this.etype_stats.torque;
            else
                stats.maxstrain -= this.etype_stats.torque;
        }
        stats.structure -= this.etype_stats.rumble;
        stats.flightstress += this.etype_stats.rumble;
        //Push-pull
        if (this.use_pp) {
            var pp_type = this.mount_list[this.selected_mount].pp_type;
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.power = Math.floor(this.pp_list[pp_type].powerfactor * stats.power);
        }
        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!this.etype_stats.pulsejet) {
            stats = stats.Add(this.mount_stats);
            stats.maxstrain -= Math.floor(this.mount_list[this.selected_mount].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(this.mount_list[this.selected_mount].dragfactor * this.etype_stats.stats.mass);
        }
        //Upgrades
        if (this.use_ds) {
            stats.mass += Math.floor(stats.power / 10);
            stats.cost += 2 * Math.floor(stats.power / 10);
        }
        stats.cost += this.gp_count + this.gpr_count;
        //Reliability is a part local issue.
        stats.reliability = 0;
        return stats;
    }
    UpdateReliability(num) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.etype_stats.stats.cooling - this.cooling_count);
        this.total_reliability -= (this.gp_count - this.gpr_count);
        this.total_reliability += num;
    }
    GetReliability() {
        return this.total_reliability;
    }
    GetOverspeed() {
        return this.etype_stats.overspeed + Math.floor(this.gp_count * this.etype_stats.overspeed / 2);
    }
    GetIsPulsejet() {
        return this.etype_stats.pulsejet;
    }
    PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.etype_stats.stats.cooling = 0;
            this.etype_stats.overspeed = 100;
            this.etype_stats.altitude = 100;
            this.etype_stats.torque = 0;
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            if (this.mount_list[this.selected_mount].pp_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.selected_mount = i;
                    if (this.mount_list[this.selected_mount].pp_type != "fuselage")
                        break;
                }
            }
        }
        else {
            this.etype_stats.rumble = 0;
        }
    }
    GetHavePropeller() {
        return !this.GetIsPulsejet(); //TODO: Charge and Generators
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetIsTractorNacelle() {
        if (!this.GetIsPulsejet()
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].pp_type == "wing")
            return true;
        return false;
    }
}
class Engine_HTML extends Display {
    constructor(eng, r) {
        super();
        this.engine = eng;
        this.engine_list = eng.GetListOfEngines();
        this.row = r;
        this.InitTypeSelect();
        var option_cell = this.row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE");
        opt_table.className = "inner_table";
        CreateTH(opt_table.insertRow(), "Cooling");
        this.cool_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), "Mounting");
        var mount_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), "Upgrades");
        var upg_cell = opt_table.insertRow().insertCell();
        option_cell.appendChild(opt_table);
        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitStatDisplay();
    }
    InitTypeSelect() {
        this.e_pwr = document.createElement("INPUT");
        this.e_mass = document.createElement("INPUT");
        this.e_drag = document.createElement("INPUT");
        this.e_rely = document.createElement("INPUT");
        this.e_cool = document.createElement("INPUT");
        this.e_over = document.createElement("INPUT");
        this.e_fuel = document.createElement("INPUT");
        this.e_alti = document.createElement("INPUT");
        this.e_torq = document.createElement("INPUT");
        this.e_rumb = document.createElement("INPUT");
        this.e_cost = document.createElement("INPUT");
        this.e_oil = document.createElement("INPUT");
        this.e_pulsejet = document.createElement("INPUT");
        this.cool_count = document.createElement("INPUT");
        this.cool_count.setAttribute("type", "number");
        var tcell = this.row.insertCell(0);
        //Set up the engine select box.
        this.e_select = document.createElement("SELECT");
        this.e_select.required = true;
        tcell.appendChild(this.e_select);
        tcell.appendChild(document.createElement("BR"));
        for (let i = 0; i < this.engine_list.length; i++) {
            let eng = this.engine_list[i];
            let opt = document.createElement("OPTION");
            opt.text = eng.name;
            this.e_select.add(opt);
        }
        let opt = document.createElement("OPTION");
        opt.text = "Custom";
        opt.value = (-1).toString();
        this.e_select.add(opt);
        //Set up the individual stat input boxes
        CreateInput("  Power", this.e_pwr, tcell);
        CreateInput("  Mass", this.e_mass, tcell);
        CreateInput("  Drag", this.e_drag, tcell);
        CreateInput("  Reliability", this.e_rely, tcell);
        CreateInput("  Cooling", this.e_cool, tcell);
        CreateInput("  Overspeed", this.e_over, tcell);
        CreateInput("  Fuel Consumption", this.e_fuel, tcell);
        CreateInput("  Altitude", this.e_alti, tcell);
        CreateInput("  Torque", this.e_torq, tcell);
        CreateInput("  Rumble", this.e_rumb, tcell);
        CreateInput("  Cost", this.e_cost, tcell);
        CreateCheckbox(" Oil Tank", this.e_oil, tcell);
        CreateCheckbox(" Pulsejet", this.e_pulsejet, tcell);
        //Event Listeners for engine stats
        this.e_select.onchange = () => {
            if (this.e_select.selectedIndex == this.engine_list.length) {
                this.SetInputDisable(false);
                this.SendCustomStats();
            }
            else {
                this.SetInputDisable(true);
                this.engine.SetSelectedIndex(this.e_select.selectedIndex);
            }
        };
        var trigger = () => { this.SendCustomStats(); };
        this.e_pwr.oninput = trigger;
        this.e_mass.oninput = trigger;
        this.e_drag.oninput = trigger;
        this.e_rely.oninput = trigger;
        this.e_cool.oninput = trigger;
        this.e_over.oninput = trigger;
        this.e_fuel.oninput = trigger;
        this.e_alti.oninput = trigger;
        this.e_torq.oninput = trigger;
        this.e_rumb.oninput = trigger;
        this.e_cost.oninput = trigger;
        this.e_oil.onchange = trigger;
        this.e_pulsejet.onchange = trigger;
    }
    UpdateEngine(en) {
        this.engine = en;
    }
    InitMountSelect(mount_cell) {
        var txtSpan = document.createElement("SPAN");
        txtSpan.innerHTML = "Engine Mounting Location";
        mount_cell.appendChild(txtSpan);
        mount_cell.appendChild(document.createElement("BR"));
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.engine.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            opt.value = elem.pp_type;
            this.mount_select.add(opt);
        }
        this.mount_select.required = true;
        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        this.mount_select.onchange = () => { this.engine.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        mount_cell.appendChild(document.createElement("BR"));
        this.pushpull_input = document.createElement("INPUT");
        this.torque_input = document.createElement("INPUT");
        CreateCheckbox(" Push Pull", this.pushpull_input, mount_cell);
        CreateCheckbox(" Torque To Structure", this.torque_input, mount_cell);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }
    InitUpgradeSelect(upg_cell) {
        this.ds_input = document.createElement("INPUT");
        this.gp_input = document.createElement("INPUT");
        this.gpr_input = document.createElement("INPUT");
        CreateCheckbox("   Extended Driveshafts", this.ds_input, upg_cell);
        CreateInput("  Geared Propeller", this.gp_input, upg_cell);
        CreateInput("  Negate Reliability Penalty", this.gpr_input, upg_cell);
        this.gp_input.oninput = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.oninput = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };
    }
    InitStatDisplay() {
        var stat_cell = this.row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Power");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_powr = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Reliability");
        CreateTH(h2_row, "Visibility");
        CreateTH(h2_row, "Overspeed");
        var c2_row = tbl_stat.insertRow();
        this.d_rely = c2_row.insertCell();
        this.d_rely.className = "part_local";
        this.d_visi = c2_row.insertCell();
        this.d_over = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Cost");
        CreateTH(h3_row, "Altitude");
        CreateTH(h3_row, "Fuel Consumption");
        var c3_row = tbl_stat.insertRow();
        this.d_cost = c3_row.insertCell();
        this.d_alti = c3_row.insertCell();
        this.d_fuel = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Pitch Stab");
        CreateTH(h4_row, "Lateral Stab");
        CreateTH(h4_row, "Max Strain");
        var c4_row = tbl_stat.insertRow();
        this.d_pstb = c4_row.insertCell();
        this.d_lstb = c4_row.insertCell();
        this.d_maxs = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, "Structure");
        CreateTH(h5_row, "Flight Stress");
        CreateTH(h5_row, "Frame Sections");
        var c5_row = tbl_stat.insertRow();
        this.d_strc = c5_row.insertCell();
        this.d_fstr = c5_row.insertCell();
        this.d_sect = c5_row.insertCell();
    }
    InitCoolingSelect() {
        while (this.cool_cell.children.length > 0)
            this.cool_cell.removeChild(this.cool_cell.children[0]);
        if (this.e_oil.checked) {
            this.e_cool.valueAsNumber = 0;
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "Rotary Engines use Oil Tanks.<br/>+1 Mass, Oil Tank is a Vital Component.";
            this.cool_cell.appendChild(txtSpan);
        }
        else if (this.e_cool.valueAsNumber == 0) {
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "Air-Cooled Engine.<br/>All is well.";
            this.cool_cell.appendChild(txtSpan);
        }
        else {
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "    Select Radiator";
            if (!this.cool_select) {
                this.cool_select = document.createElement("SELECT");
                this.cool_select.required = true;
            }
            var numrad = this.engine.GetNumRadiators();
            while (this.cool_select.options.length > 0) {
                this.cool_select.options.remove(0);
            }
            for (let i = 1; i < numrad + 1; i++) {
                let opt = document.createElement("OPTION");
                opt.innerText = "Radiator #" + i.toString();
                this.cool_select.add(opt);
            }
            this.cool_select.onchange = () => {
                this.engine.SetRadiator(this.cool_select.selectedIndex);
            };
            this.cool_select.selectedIndex = this.engine.GetRadiator();
            this.cool_cell.appendChild(this.cool_select);
            this.cool_cell.appendChild(txtSpan);
            this.cool_cell.appendChild(document.createElement("BR"));
            var txtSpan2 = document.createElement("SPAN");
            txtSpan2.innerHTML = "    Cooling Amount";
            this.cool_count.min = "0";
            this.cool_count.valueAsNumber = this.engine.GetCooling();
            this.cool_count.max = this.engine.GetCurrentStats().stats.cooling.toString();
            if (this.cool_count.valueAsNumber > this.e_cool.valueAsNumber) {
                this.cool_count.valueAsNumber = this.e_cool.valueAsNumber;
            }
            this.cool_count.oninput = () => { this.engine.SetCooling(this.cool_count.valueAsNumber); };
            this.cool_cell.appendChild(this.cool_count);
            this.cool_cell.appendChild(txtSpan2);
        }
    }
    SendCustomStats() {
        var e_stats = new EngineStats();
        e_stats.stats.power = this.e_pwr.valueAsNumber;
        e_stats.stats.mass = this.e_mass.valueAsNumber;
        e_stats.stats.drag = this.e_drag.valueAsNumber;
        e_stats.stats.reliability = this.e_rely.valueAsNumber;
        e_stats.stats.cooling = this.e_cool.valueAsNumber;
        e_stats.overspeed = this.e_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.e_fuel.valueAsNumber;
        e_stats.altitude = this.e_alti.valueAsNumber;
        e_stats.torque = this.e_torq.valueAsNumber;
        e_stats.rumble = this.e_rumb.valueAsNumber;
        e_stats.stats.cost = this.e_cost.valueAsNumber;
        e_stats.oiltank = this.e_oil.checked;
        e_stats.pulsejet = this.e_pulsejet.checked;
        this.engine.SetCustomStats(e_stats);
    }
    SetInputDisable(b) {
        this.e_pwr.disabled = b;
        this.e_mass.disabled = b;
        this.e_drag.disabled = b;
        this.e_rely.disabled = b;
        this.e_cool.disabled = b;
        this.e_over.disabled = b;
        this.e_fuel.disabled = b;
        this.e_alti.disabled = b;
        this.e_torq.disabled = b;
        this.e_rumb.disabled = b;
        this.e_cost.disabled = b;
        this.e_oil.disabled = b;
        this.e_pulsejet.disabled = b;
    }
    UpdateDisplay() {
        var idx = this.engine.GetSelectedIndex();
        if (idx < 0)
            idx = this.engine_list.length;
        this.e_select.selectedIndex = idx;
        if (this.e_select.selectedIndex == this.engine_list.length) {
            this.SetInputDisable(false);
        }
        else {
            this.SetInputDisable(true);
        }
        var e_stats = this.engine.GetCurrentStats();
        this.e_pwr.valueAsNumber = e_stats.stats.power;
        this.e_mass.valueAsNumber = e_stats.stats.mass;
        this.e_drag.valueAsNumber = e_stats.stats.drag;
        this.e_rely.valueAsNumber = e_stats.stats.reliability;
        this.e_cool.valueAsNumber = e_stats.stats.cooling;
        this.e_over.valueAsNumber = e_stats.overspeed;
        this.e_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.e_alti.valueAsNumber = e_stats.altitude;
        this.e_torq.valueAsNumber = e_stats.torque;
        this.e_rumb.valueAsNumber = e_stats.rumble;
        this.e_cost.valueAsNumber = e_stats.stats.cost;
        this.e_oil.checked = e_stats.oiltank;
        this.e_pulsejet.checked = e_stats.pulsejet;
        this.InitCoolingSelect();
        if (this.mount_select.selectedIndex != this.engine.GetMountIndex()) {
            this.mount_select.selectedIndex = this.engine.GetMountIndex();
            Blink(this.mount_select.parentElement);
        }
        if (this.pushpull_input.checked != this.engine.GetUsePushPull()) {
            this.pushpull_input.checked = this.engine.GetUsePushPull();
            Blink(this.pushpull_input.parentElement);
        }
        if (this.torque_input.checked != this.engine.GetTorqueToStruct()) {
            this.torque_input.checked = this.engine.GetTorqueToStruct();
            Blink(this.torque_input.parentElement);
        }
        if (this.torque_input.checked != this.engine.GetTorqueToStruct()) {
            this.torque_input.checked = this.engine.GetTorqueToStruct();
            Blink(this.torque_input.parentElement);
        }
        this.torque_input.disabled = !this.engine.CanTorqueToStruct();
        if (this.ds_input.checked != this.engine.GetUseExtendedDriveshaft()) {
            this.ds_input.checked = this.engine.GetUseExtendedDriveshaft();
            Blink(this.ds_input.parentElement);
        }
        if (this.gp_input.valueAsNumber != this.engine.GetGearCount()) {
            this.gp_input.valueAsNumber = this.engine.GetGearCount();
            Blink(this.gp_input.parentElement);
        }
        if (this.gpr_input.valueAsNumber != this.engine.GetGearReliability()) {
            this.gpr_input.valueAsNumber = this.engine.GetGearReliability();
            Blink(this.gpr_input.parentElement);
        }
        if (e_stats.pulsejet) {
            this.mount_select.disabled = true;
            this.mount_select.selectedIndex = -1;
            this.pushpull_input.disabled = true;
            this.ds_input.disabled = true;
            this.gp_input.disabled = true;
            this.gpr_input.disabled = true;
            for (let opt of this.mount_select.options) {
                if (opt.value == "fuselage") {
                    opt.disabled = true;
                }
            }
        }
        else {
            this.mount_select.disabled = false;
            this.pushpull_input.disabled = false;
            this.ds_input.disabled = false;
            this.gp_input.disabled = false;
            this.gpr_input.disabled = false;
            for (let opt of this.mount_select.options) {
                opt.disabled = false;
            }
        }
        var full_stats = this.engine.PartStats();
        BlinkIfChanged(this.d_powr, full_stats.power.toString());
        BlinkIfChanged(this.d_mass, full_stats.mass.toString());
        BlinkIfChanged(this.d_drag, full_stats.drag.toString());
        BlinkIfChanged(this.d_rely, this.engine.GetReliability().toString());
        BlinkIfChanged(this.d_visi, full_stats.visibility.toString());
        BlinkIfChanged(this.d_over, this.engine.GetOverspeed().toString());
        BlinkIfChanged(this.d_cost, full_stats.cost.toString());
        BlinkIfChanged(this.d_alti, e_stats.altitude.toString());
        BlinkIfChanged(this.d_fuel, full_stats.fuelconsumption.toString());
        BlinkIfChanged(this.d_pstb, full_stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, full_stats.latstab.toString());
        BlinkIfChanged(this.d_maxs, full_stats.maxstrain.toString());
        BlinkIfChanged(this.d_strc, full_stats.structure.toString());
        BlinkIfChanged(this.d_fstr, full_stats.flightstress.toString());
        BlinkIfChanged(this.d_sect, full_stats.reqsections.toString());
    }
}
class Radiator extends Part {
    constructor(tl, ml, cl) {
        super();
        this.need_cool = 0;
        this.idx_type = 0;
        this.idx_mount = 0;
        this.idx_coolant = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
    }
    toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant
        };
    }
    fromJSON(js) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
    }
    GetTypeList() {
        return this.type_list;
    }
    GetMountList() {
        return this.mount_list;
    }
    GetCoolantList() {
        return this.coolant_list;
    }
    SetTypeIndex(num) {
        this.idx_type = num;
        this.CalculateStats();
    }
    GetTypeIndex() {
        return this.idx_type;
    }
    SetMountIndex(num) {
        this.idx_mount = num;
        this.CalculateStats();
    }
    GetMountIndex() {
        return this.idx_mount;
    }
    SetCoolantIndex(num) {
        this.idx_coolant = num;
        this.CalculateStats();
    }
    GetCoolantIndex() {
        return this.idx_coolant;
    }
    SetNeedCool(num) {
        this.need_cool = num;
    }
    PartStats() {
        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);
        stats.drag += Math.ceil(this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Radiator_HTML extends Display {
    constructor(row, rad) {
        super();
        this.radiator = rad;
        var type_cell = row.insertCell();
        //Radiator Type
        this.type_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetTypeList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.type_select.add(opt);
        }
        this.type_select.onchange = () => { this.radiator.SetTypeIndex(this.type_select.selectedIndex); };
        type_cell.appendChild(this.type_select);
        var mount_cell = row.insertCell();
        //Radiator Mounting
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.mount_select.add(opt);
        }
        this.mount_select.onchange = () => { this.radiator.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        var cool_cell = row.insertCell();
        //Special Coolant
        this.coolant_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetCoolantList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.coolant_select.add(opt);
        }
        this.coolant_select.onchange = () => { this.radiator.SetCoolantIndex(this.coolant_select.selectedIndex); };
        cool_cell.appendChild(this.coolant_select);
        var stats_cell = row.insertCell();
        var tbl = document.createElement("TABLE");
        stats_cell.className = "inner_table";
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Reliability");
        CreateTH(h1_row, "Lateral Stab");
        var c1_row = tbl.insertRow();
        this.c_mass = c1_row.insertCell();
        this.c_cost = c1_row.insertCell();
        this.c_drag = c1_row.insertCell();
        this.c_rely = c1_row.insertCell();
        this.c_lstb = c1_row.insertCell();
        stats_cell.appendChild(tbl);
    }
    UpdateRadiator(rad) {
        this.radiator = rad;
    }
    UpdateDisplay() {
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        var stats = this.radiator.PartStats();
        BlinkIfChanged(this.c_mass, stats.mass.toString());
        BlinkIfChanged(this.c_cost, stats.cost.toString());
        BlinkIfChanged(this.c_drag, stats.drag.toString());
        BlinkIfChanged(this.c_rely, stats.reliability.toString());
        BlinkIfChanged(this.c_lstb, stats.latstab.toString());
    }
}
class Propeller extends Part {
    constructor(json) {
        super();
        this.idx_prop = 2;
        this.use_variable = false;
        this.have_propellers = true;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({ name: elem["name"], stats: new Stats(elem), automatic: elem["automatic"] });
        }
    }
    toJSON() {
        return {
            type: this.idx_prop,
            use_variable: this.use_variable
        };
    }
    fromJSON(js) {
        this.idx_prop = js["type"];
        this.use_variable = js["use_variable"];
    }
    GetPropList() {
        return this.prop_list;
    }
    SetPropIndex(num) {
        this.idx_prop = num;
        if (this.prop_list[num].automatic)
            this.use_variable = false;
        this.CalculateStats();
    }
    GetPropIndex() {
        return this.idx_prop;
    }
    SetVariable(use) {
        if (!this.prop_list[this.idx_prop].automatic)
            this.use_variable = use;
        else
            this.use_variable = false;
        this.CalculateStats();
    }
    GetVariable() {
        return this.use_variable;
    }
    CanBeVariable() {
        return !this.prop_list[this.idx_prop].automatic;
    }
    SetHavePropeller(have) {
        this.have_propellers = have;
    }
    GetHavePropeller() {
        return this.have_propellers;
    }
    PartStats() {
        var stats = new Stats();
        if (this.have_propellers) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats);
            if (this.use_variable)
                stats.cost += 2;
        }
        else {
            stats.pitchboost = 1;
            stats.pitchspeed = 1;
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Propeller_HTML extends Display {
    constructor(prop) {
        super();
        this.prop = prop;
        this.select_prop = document.getElementById("propeller_pitch");
        for (let elem of prop.GetPropList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.select_prop.add(opt);
        }
        this.select_prop.onchange = () => { this.prop.SetPropIndex(this.select_prop.selectedIndex); };
        this.input_variable = document.getElementById("propeller_variable");
        this.input_variable.onchange = () => { this.prop.SetVariable(this.input_variable.checked); };
    }
    UpdateDisplay() {
        this.input_variable.checked = this.prop.GetVariable();
        this.input_variable.disabled = !this.prop.CanBeVariable();
        this.select_prop.selectedIndex = this.prop.GetPropIndex();
        this.select_prop.disabled = false;
        if (!this.prop.GetHavePropeller()) {
            this.input_variable.disabled = true;
            this.select_prop.disabled = true;
            this.select_prop.selectedIndex = -1;
        }
    }
}
class Frames extends Part {
    constructor(js) {
        super();
        this.frame_list = [];
        for (let elem of js["frames"]) {
            this.frame_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                basestruct: elem["basestructure"],
                basecost: elem["basecost"],
                geodesic: elem["geodesic"]
            });
        }
        this.skin_list = [];
        for (let elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"]
            });
        }
        this.farman = false;
        this.boom = false;
        this.has_tractor_nacelles = false;
        this.sel_tail = 1;
        this.tail_list = [];
        for (let elem of js["tail"]) {
            this.tail_list.push({
                name: elem["name"],
                stats: new Stats(elem)
            });
        }
        this.section_list = [];
        this.tail_section_list = [];
        this.SetRequiredSections(1);
    }
    toJSON() {
        return {
            sections: this.section_list,
            tail_sections: this.tail_section_list,
            tail_index: this.sel_tail,
            use_farman: this.farman,
            use_boom: this.boom
        };
    }
    fromJSON(js) {
        this.section_list = [];
        for (let elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.tail_section_list = [];
        for (let elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
    }
    DuplicateSection(num) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() + this.tail_section_list.length == this.CountInternalBracing()) {
            return;
        }
        this.section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }
    DuplicateTailSection(num) {
        var sec = this.tail_section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.CountInternalBracing()) {
            return;
        }
        this.tail_section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }
    DeleteSection(num) {
        if (this.required_sections == this.CountSections()
            && !this.section_list[num].internal_bracing)
            return;
        this.section_list.splice(num, 1);
        this.CalculateStats();
    }
    SetRequiredSections(num) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (!this.section_list[i].internal_bracing) {
                    while (this.required_sections > this.CountSections()) {
                        this.DuplicateSection(i);
                    }
                    return;
                }
            }
        }
    }
    SetRequiredTailSections(num) {
        if (num > this.tail_section_list.length) {
            if (this.tail_section_list.length == 0) {
                this.tail_section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            while (num > this.tail_section_list.length) {
                this.DuplicateTailSection(this.tail_section_list.length - 1);
            }
        }
        while (num < this.tail_section_list.length) {
            this.tail_section_list.pop();
        }
        while (this.CountSections() + num < this.CountInternalBracing()) {
            let idx = this.section_list.length - 1;
            for (; idx > 0; idx--) {
                if (this.section_list[idx].internal_bracing)
                    break;
            }
            this.DeleteSection(idx);
        }
        this.CalculateStats();
    }
    CountSections() {
        var count = 0;
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                count++;
        }
        return count;
    }
    GetNumFrames() {
        return this.CountSections() + this.tail_section_list.length;
    }
    CountInternalBracing() {
        var count = 0;
        for (let elem of this.section_list) {
            if (elem.internal_bracing)
                count++;
        }
        return count;
    }
    BaseType() {
        var hist = [...Array(this.frame_list.length).fill(0)];
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        var max_index = 0;
        var max = 0;
        for (let i = hist.length - 1; i > 0; i--) {
            if (hist[i] > max) {
                max = hist[i];
                max_index = i;
            }
        }
        return max_index;
    }
    GetFrameList() {
        return this.frame_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetSectionList() {
        return this.section_list;
    }
    SetFrame(num, type) {
        this.section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    SetSkin(num, type) {
        this.section_list[num].skin = type;
        if (type != 0)
            this.section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }
    SetGeodesic(num, use) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetMonocoque(num, use) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetLiftingBody(num, use) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetInternalBracing(num, use) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing()
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].skin = 0;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        }
        else if (!use) { // If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }
    PossibleInternalBracing() {
        return this.CountInternalBracing() < this.CountSections() + this.tail_section_list.length;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.section_list[num].skin].monocoque;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }
    PossibleTailMonocoque(num) {
        return this.skin_list[this.tail_section_list[num].skin].monocoque;
    }
    PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }
    GetFarmanOrBoom() {
        return this.farman || this.boom;
    }
    SectionStats(sec) {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic)
            stats.structure *= 1.5;
        if (sec.lifting_body) {
            stats.drag += 2;
            stats.wingarea += 2;
        }
        //If it's internal, no skin.
        if (sec.internal_bracing)
            stats.mass -= 1;
        else {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[sec.skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[sec.skin].stats);
        }
        return stats;
    }
    SetTailType(num) {
        this.sel_tail = num;
        this.SetRequiredTailSections(this.tail_list[num].stats.reqsections);
    }
    GetTailType() {
        return this.sel_tail;
    }
    GetTailList() {
        return this.tail_list;
    }
    GetTailSectionList() {
        return this.tail_section_list;
    }
    SetUseFarman(use) {
        this.farman = use;
        if (use && this.boom)
            this.boom = false;
        if (this.farman) {
            for (let sec of this.tail_section_list) {
                sec.skin = 0;
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
        this.CalculateStats();
    }
    GetUseFarman() {
        return this.farman;
    }
    SetUseBoom(use) {
        this.boom = use;
        if (use && this.farman)
            this.farman = false;
        this.CalculateStats();
    }
    GetUseBoom() {
        return this.boom;
    }
    SetTailFrame(num, type) {
        this.tail_section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    SetTailSkin(num, type) {
        this.tail_section_list[num].skin = type;
        if (type != 0)
            this.tail_section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.tail_section_list[num].monocoque = false;
            this.tail_section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }
    SetTailGeodesic(num, use) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetTailMonocoque(num, use) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetTailLiftingBody(num, use) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    SetHasTractorNacelles(use) {
        this.has_tractor_nacelles = true;
    }
    GetHasTractorNacelles() {
        return this.has_tractor_nacelles;
    }
    PartStats() {
        var stats = new Stats();
        var base_type = this.BaseType();
        stats.structure = this.frame_list[base_type].basestruct;
        stats.cost = this.frame_list[base_type].basecost;
        var is_clinker = false;
        for (let sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }
        var tail_stats = new Stats();
        for (let sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }
        if (is_clinker)
            stats.structure += 30;
        stats = stats.Add(this.tail_list[this.sel_tail].stats);
        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.5 * tail_stats.drag);
        }
        stats = stats.Add(tail_stats);
        stats.structure = Math.floor(stats.structure);
        stats.cost = Math.floor(stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);
        return stats;
    }
}
class Frames_HTML extends Display {
    constructor(frames) {
        super();
        this.frames = frames;
        var table = document.getElementById("table_frames");
        var row = table.insertRow();
        this.c_frame = row.insertCell();
        this.c_skin = row.insertCell();
        this.c_options = row.insertCell();
        this.c_stats = row.insertCell();
        this.c_stats.className = "inner_table";
        this.c_stats.rowSpan = 0;
        var tbl = document.createElement("TABLE");
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Toughness");
        CreateTH(h2_row, "Visibility");
        var c2_row = tbl.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, "Wing Area");
        CreateTH(h3_row, "Flammable");
        CreateTH(h3_row, "Pitch Stability");
        var c3_row = tbl.insertRow();
        this.d_area = c3_row.insertCell();
        this.d_flammable = c3_row.insertCell();
        this.d_pstb = c3_row.insertCell();
        var h4_row = tbl.insertRow();
        CreateTH(h4_row, "Max Strain");
        CreateTH(h4_row, "");
        CreateTH(h4_row, "");
        var c4_row = tbl.insertRow();
        this.d_strn = c4_row.insertCell();
        c4_row.insertCell();
        c4_row.insertCell();
        this.c_stats.appendChild(tbl);
        var row3 = table.insertRow();
        CreateTH(row3, "Tail Frame Type");
        CreateTH(row3, "Tail Skin Type");
        CreateTH(row3, "Tail Frame Options");
        var row4 = table.insertRow();
        this.t_frame = row4.insertCell();
        this.t_skin = row4.insertCell();
        this.t_options = row4.insertCell();
        this.t_select = document.getElementById("tail_type");
        this.t_farman = document.getElementById("tail_farman");
        this.t_boom = document.getElementById("tail_boom");
        for (let elem of this.frames.GetTailList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.t_select.add(opt);
        }
        this.t_select.onchange = () => { this.frames.SetTailType(this.t_select.selectedIndex); };
        this.t_farman.onchange = () => { this.frames.SetUseFarman(this.t_farman.checked); };
        this.t_boom.onchange = () => { this.frames.SetUseBoom(this.t_boom.checked); };
    }
    UpdateDisplay() {
        while (this.c_frame.children.length > 0)
            this.c_frame.removeChild(this.c_frame.children[0]);
        while (this.c_skin.children.length > 0)
            this.c_skin.removeChild(this.c_skin.children[0]);
        while (this.c_options.children.length > 0)
            this.c_options.removeChild(this.c_options.children[0]);
        while (this.t_frame.children.length > 0)
            this.t_frame.removeChild(this.t_frame.children[0]);
        while (this.t_skin.children.length > 0)
            this.t_skin.removeChild(this.t_skin.children[0]);
        while (this.t_options.children.length > 0)
            this.t_options.removeChild(this.t_options.children[0]);
        var section_list = this.frames.GetSectionList();
        var tail_section_list = this.frames.GetTailSectionList();
        var skin_list = this.frames.GetSkinList();
        var is_flammable = false;
        for (let i = 0; i < section_list.length; i++) {
            let sec = section_list[i];
            this.UpdateSection(i, sec);
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        this.t_select.selectedIndex = this.frames.GetTailType();
        this.t_farman.disabled = this.frames.GetUseBoom();
        this.t_boom.disabled = this.frames.GetUseFarman();
        for (let i = 0; i < tail_section_list.length; i++) {
            let sec = tail_section_list[i];
            this.UpdateTailSection(i, sec);
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        if (is_flammable)
            BlinkIfChanged(this.d_flammable, "Yes");
        else
            BlinkIfChanged(this.d_flammable, "No");
        var stats = this.frames.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_area, stats.wingarea.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_strn, stats.maxstrain.toString());
    }
    UpdateSection(i, sec) {
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var type_span = document.createElement("SPAN");
        var rem_button = document.createElement("BUTTON");
        rem_button.textContent = "-";
        rem_button.onclick = () => { this.frames.DeleteSection(i); };
        rem_button.disabled = !sec.internal_bracing && !this.frames.PossibleRemoveSections();
        var add_button = document.createElement("BUTTON");
        add_button.textContent = "+";
        add_button.disabled = sec.internal_bracing && !this.frames.PossibleInternalBracing();
        add_button.onclick = () => { this.frames.DuplicateSection(i); };
        var frame_select = document.createElement("SELECT");
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = ft.name;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
            frame_select.add(opt);
        }
        frame_select.onchange = () => { this.frames.SetFrame(i, frame_select.selectedIndex); };
        frame_select.selectedIndex = sec.frame;
        type_span.appendChild(rem_button);
        type_span.appendChild(add_button);
        type_span.appendChild(frame_select);
        this.c_frame.appendChild(type_span);
        this.c_frame.appendChild(document.createElement("BR"));
        var skin_select = document.createElement("SELECT");
        for (let st of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = st.name;
            if (sec.monocoque && !st.monocoque)
                opt.disabled = true;
            skin_select.add(opt);
        }
        if (sec.internal_bracing)
            skin_select.disabled = true;
        skin_select.onchange = () => { this.frames.SetSkin(i, skin_select.selectedIndex); };
        skin_select.selectedIndex = sec.skin;
        this.c_skin.appendChild(skin_select);
        this.c_skin.appendChild(document.createElement("BR"));
        var opt_span = document.createElement("SPAN");
        var geo_input = document.createElement("INPUT");
        CreateCheckbox("Geodesic", geo_input, opt_span, false);
        geo_input.checked = sec.geodesic;
        geo_input.disabled = !this.frames.PossibleGeodesic(i);
        geo_input.onchange = () => { this.frames.SetGeodesic(i, geo_input.checked); };
        var mono_input = document.createElement("INPUT");
        CreateCheckbox("Monocoque", mono_input, opt_span, false);
        mono_input.checked = sec.monocoque;
        mono_input.disabled = !this.frames.PossibleMonocoque(i);
        mono_input.onchange = () => { this.frames.SetMonocoque(i, mono_input.checked); };
        var int_input = document.createElement("INPUT");
        CreateCheckbox("Internal Bracing", int_input, opt_span, false);
        int_input.checked = sec.internal_bracing;
        if (!sec.internal_bracing && (!this.frames.PossibleInternalBracing() || !this.frames.PossibleRemoveSections()))
            int_input.disabled = true;
        int_input.onchange = () => { this.frames.SetInternalBracing(i, int_input.checked); };
        var lb_input = document.createElement("INPUT");
        CreateCheckbox("Lifing Botdy", lb_input, opt_span, false);
        lb_input.checked = sec.lifting_body;
        lb_input.disabled = !this.frames.PossibleMonocoque(i);
        lb_input.onchange = () => { this.frames.SetLiftingBody(i, lb_input.checked); };
        this.c_options.appendChild(opt_span);
        this.c_options.appendChild(document.createElement("BR"));
    }
    UpdateTailSection(i, sec) {
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var frame_select = document.createElement("SELECT");
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = ft.name;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (ft.basestruct != 0)
                frame_select.add(opt);
        }
        frame_select.onchange = () => { this.frames.SetTailFrame(i, frame_select.selectedIndex); };
        frame_select.selectedIndex = sec.frame;
        this.t_frame.appendChild(frame_select);
        this.t_frame.appendChild(document.createElement("BR"));
        var skin_select = document.createElement("SELECT");
        for (let st of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = st.name;
            if (sec.monocoque && !st.monocoque)
                opt.disabled = true;
            skin_select.add(opt);
        }
        if (this.frames.GetUseFarman()) {
            skin_select.disabled = true;
        }
        skin_select.onchange = () => { this.frames.SetTailSkin(i, skin_select.selectedIndex); };
        skin_select.selectedIndex = sec.skin;
        this.t_skin.appendChild(skin_select);
        this.t_skin.appendChild(document.createElement("BR"));
        var opt_span = document.createElement("SPAN");
        var geo_input = document.createElement("INPUT");
        CreateCheckbox("Geodesic", geo_input, opt_span, false);
        geo_input.checked = sec.geodesic;
        geo_input.disabled = !this.frames.PossibleTailGeodesic(i);
        geo_input.onchange = () => { this.frames.SetTailGeodesic(i, geo_input.checked); };
        var mono_input = document.createElement("INPUT");
        CreateCheckbox("Monocoque", mono_input, opt_span, false);
        mono_input.checked = sec.monocoque;
        mono_input.disabled = !this.frames.PossibleTailMonocoque(i);
        mono_input.onchange = () => { this.frames.SetTailMonocoque(i, mono_input.checked); };
        var lb_input = document.createElement("INPUT");
        CreateCheckbox("Lifting Body", lb_input, opt_span, false);
        lb_input.checked = sec.lifting_body;
        lb_input.disabled = !this.frames.PossibleTailMonocoque(i);
        lb_input.onchange = () => { this.frames.SetTailLiftingBody(i, lb_input.checked); };
        this.t_options.appendChild(opt_span);
        this.t_options.appendChild(document.createElement("BR"));
    }
}
class Wings extends Part {
    constructor(js) {
        super();
        this.skin_list = [];
        for (let elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"],
                dragfactor: elem["dragfactor"]
            });
        }
        this.stagger_list = [];
        for (let elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], inline: elem["inline"],
                wing_count: elem["wing_count"], hstab: elem["hstab"], stats: new Stats(elem)
            });
        }
        this.deck_list = [];
        for (let elem of js["decks"]) {
            this.deck_list.push({
                name: elem["name"], limited: elem["limited"], stats: new Stats(elem)
            });
        }
        this.wing_list = [];
        this.mini_wing_list = [];
        this.wing_stagger = Math.floor(this.stagger_list.length / 2);
        this.is_swept = false;
        this.is_closed = false;
    }
    toJSON() {
        return {
            wing_list: this.wing_list,
            mini_wing_list: this.mini_wing_list,
            wing_stagger: this.wing_stagger,
            is_swept: this.is_swept,
            is_closed: this.is_closed
        };
    }
    fromJSON(js) {
        this.wing_list = js["wing_list"];
        this.mini_wing_list = js["mini_wing_list"];
        this.wing_stagger = js["wing_stagger"];
        this.is_swept = js["is_swept"];
        this.is_closed = js["is_closed"];
    }
    GetWingList() {
        return this.wing_list;
    }
    GetMiniWingList() {
        return this.mini_wing_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetStaggerList() {
        return this.stagger_list;
    }
    GetDeckList() {
        return this.deck_list;
    }
    DeckCountFull() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    DeckCountMini() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.mini_wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    SetStagger(index) {
        this.wing_stagger = index;
        while (this.stagger_list[index].wing_count < this.wing_list.length) {
            this.wing_list.pop();
        }
        if (!this.stagger_list[index].inline) {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        else {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] == 1 && this.wing_list.length > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        this.CalculateStats();
    }
    GetStagger() {
        return this.wing_stagger;
    }
    CanAddFullWing(deck) {
        if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
            return false;
        var full_count = this.DeckCountFull();
        if (this.stagger_list[this.wing_stagger].inline) {
            if (full_count[deck] == 2)
                return false;
            if (full_count[deck] == 0 && this.wing_list.length > 0)
                return false;
        }
        else if (full_count[deck] == 1 && this.deck_list[deck].limited)
            return false;
        var mini_count = this.DeckCountMini();
        if (mini_count[deck] != 0)
            return false;
        return true;
    }
    CanAddMiniWing(deck) {
        var full_count = this.DeckCountFull();
        var mini_count = this.DeckCountMini();
        if (full_count[deck] != 0 || mini_count[deck] != 0)
            return false;
        return true;
    }
    CanMoveFullWing(idx, deck) {
        var w = this.wing_list[idx];
        this.wing_list.splice(idx, 1);
        var can = this.CanAddFullWing(deck);
        this.wing_list.splice(idx, 0, w);
        return can;
    }
    CanMoveMiniWing(idx, deck) {
        var w = this.mini_wing_list[idx];
        this.mini_wing_list.splice(idx, 1);
        var can = this.CanAddMiniWing(deck);
        this.mini_wing_list.splice(idx, 0, w);
        return can;
    }
    CanClosed() {
        return this.wing_list.length > 1 && !this.stagger_list[this.wing_stagger].inline;
    }
    SetClosed(use) {
        this.is_closed = use;
        this.CalculateStats();
    }
    GetClosed() {
        return this.is_closed;
    }
    SetSwept(use) {
        this.is_swept = use;
        this.CalculateStats();
    }
    GetSwept() {
        return this.is_swept;
    }
    GetTandem() {
        return this.stagger_list[this.wing_stagger].wing_count == 2;
    }
    SetFullWing(idx, w) {
        if (this.wing_list.length != idx)
            this.wing_list.splice(idx, 1);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 3);
            w.span = Math.max(w.span, 1);
            while (w.anhedral + w.dihedral > w.span - 1) {
                if (w.anhedral > w.dihedral) {
                    w.anhedral--;
                }
                else {
                    w.dihedral--;
                }
            }
            if (this.CanAddFullWing(w.deck))
                this.wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    SetMiniWing(idx, w) {
        if (this.mini_wing_list.length != idx)
            this.mini_wing_list.splice(idx, 1);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 1);
            w.area = Math.min(w.area, 2);
            w.span = Math.max(w.span, 1);
            w.dihedral = 0;
            w.anhedral = 0;
            if (this.CanAddMiniWing(w.deck))
                this.mini_wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    IsFlammable() {
        for (let w of this.wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        for (let w of this.mini_wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        return false;
    }
    SetNumFrames(num) {
        this.num_frames = num;
    }
    NeedHStab() {
        return this.stagger_list[this.wing_stagger].hstab;
    }
    NeedTail() {
        return this.NeedHStab() || !this.is_swept;
    }
    GetSpan() {
        var longest_span = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        return longest_span;
    }
    PartStats() {
        var stats = new Stats();
        var deck_count = this.DeckCountFull();
        var have_wing = false;
        var have_mini_wing = false;
        var longest_span = 0;
        let drag_reduction = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (!have_wing) { //Is first wing
                have_wing = true;
            }
            else { //Is not first wing
                stats.control += 3;
                stats.liftbleed += 5;
                stats.visibility -= 1;
            }
            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.wingarea = w.area;
            wStats.maxstrain -= 2 * w.span + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + 2 * w.area - w.span - drag_reduction);
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            //If tandem, set leading wing drag reduction
            if (this.stagger_list[this.wing_stagger].inline && drag_reduction == 0)
                drag_reduction = Math.floor(w.area / 2);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (!have_mini_wing) { //Is first miniature wing
                have_mini_wing = true;
            }
            else { //Is not first miniature wing
                stats.control += 1;
                stats.liftbleed += 1;
            }
            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.maxstrain -= 2 * wspan + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + w.area - wspan);
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        for (let i = 0; i < deck_count.length; i++) {
            if (deck_count[i] > 0)
                stats = stats.Add(this.deck_list[i].stats);
        }
        //Longest wing effects
        stats.control += 8 - longest_span;
        stats.latstab += Math.min(0, longest_span - 8);
        stats.latstab += Math.floor(longest_span / this.num_frames);
        //Wing Sweep effects
        if (this.is_swept) {
            stats.liftbleed += 5;
            stats.latstab--;
        }
        //Closed Wing effects
        if (this.is_closed) {
            stats.mass += 1;
            stats.control -= 5;
            stats.maxstrain += 20;
        }
        //Stagger effects, monoplane is nothing.
        if (this.wing_list.length > 1) {
            stats = stats.Add(this.stagger_list[this.wing_stagger].stats);
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Wings_HTML extends Display {
    constructor(w) {
        super();
        this.wings = w;
        this.stagger = document.getElementById("wing_stagger");
        this.closed = document.getElementById("wing_closed");
        this.swept = document.getElementById("wing_swept");
        for (let s of w.GetStaggerList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            this.stagger.append(opt);
        }
        this.stagger.onchange = () => { this.wings.SetStagger(this.stagger.selectedIndex); };
        this.closed.onchange = () => { this.wings.SetClosed(this.closed.checked); };
        this.swept.onchange = () => { this.wings.SetSwept(this.swept.checked); };
        var tbl = document.getElementById("wing_table");
        var full_row = tbl.insertRow();
        var mini_row = tbl.insertRow();
        var full_type = document.createElement("TH");
        full_type.textContent = "Full Wings";
        full_row.appendChild(full_type);
        var mini_type = document.createElement("TH");
        mini_type.textContent = "Miniature Wings";
        mini_row.appendChild(mini_type);
        this.full_cell = full_row.insertCell();
        this.mini_cell = mini_row.insertCell();
        var stat_cell = full_row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Wing Area");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_area = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Max Strain");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, "Lift Bleed");
        var c3_row = tbl_stat.insertRow();
        this.d_maxs = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_lift = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Cost");
        CreateTH(h4_row, "Charge");
        CreateTH(h4_row, "Flammable");
        var c4_row = tbl_stat.insertRow();
        this.d_cost = c4_row.insertCell();
        this.d_chrg = c4_row.insertCell();
        this.d_flam = c4_row.insertCell();
    }
    UpdateDisplay() {
        this.stagger.selectedIndex = this.wings.GetStagger();
        this.closed.checked = this.wings.GetClosed();
        this.closed.disabled = !this.wings.CanClosed();
        this.swept.checked = this.wings.GetSwept();
        while (this.full_cell.children.length > 0)
            this.full_cell.removeChild(this.full_cell.children[0]);
        while (this.mini_cell.children.length > 0)
            this.mini_cell.removeChild(this.mini_cell.children[0]);
        var wl = this.wings.GetWingList();
        for (let i = 0; i < wl.length; i++) {
            this.AddFullWing(this.full_cell, i, wl[i]);
        }
        var mwl = this.wings.GetMiniWingList();
        for (let i = 0; i < mwl.length; i++) {
            this.AddMiniWing(this.mini_cell, i, mwl[i]);
        }
        this.AddAddFullWing(this.full_cell, wl.length);
        this.AddAddMiniWing(this.mini_cell, mwl.length);
        var stats = this.wings.PartStats();
        BlinkIfChanged(this.d_area, stats.wingarea.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_chrg, "0"); //stats.charge.toString(); //TODO: Charge
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        if (this.wings.IsFlammable())
            BlinkIfChanged(this.d_flam, "Yes");
        else
            BlinkIfChanged(this.d_flam, "No");
    }
    AddFullWing(cell, idx, wing) {
        var span = document.createElement("SPAN");
        var deck = document.createElement("SELECT");
        span.appendChild(deck);
        CreateSpace(span);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (wing.deck != i && !this.wings.CanAddFullWing(i) && !this.wings.CanMoveFullWing(idx, i)) {
                opt.disabled = true;
            }
            deck.append(opt);
        }
        deck.oninput = () => {
            let w = Object.assign({}, wing);
            w.deck = deck.selectedIndex - 1;
            this.wings.SetFullWing(idx, w);
        };
        deck.selectedIndex = wing.deck + 1;
        var skin = document.createElement("SELECT");
        span.appendChild(skin);
        CreateSpace(span);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            skin.append(opt);
        }
        skin.oninput = () => {
            let w = Object.assign({}, wing);
            w.surface = skin.selectedIndex;
            this.wings.SetFullWing(idx, w);
        };
        skin.selectedIndex = wing.surface;
        var area = document.createElement("INPUT");
        CreateInput(" Area ", area, span, false);
        area.oninput = () => {
            let w = Object.assign({}, wing);
            w.area = area.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        area.min = "3";
        area.valueAsNumber = wing.area;
        var wspan = document.createElement("INPUT");
        CreateInput(" Span ", wspan, span, false);
        wspan.oninput = () => {
            let w = Object.assign({}, wing);
            w.span = wspan.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        wspan.min = "1";
        wspan.valueAsNumber = wing.span;
        var dihedral = document.createElement("INPUT");
        CreateInput(" Dihedral ", dihedral, span, false);
        dihedral.oninput = () => {
            let w = Object.assign({}, wing);
            w.dihedral = dihedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        dihedral.min = "0";
        dihedral.max = (wing.span - wing.anhedral - 1).toString();
        dihedral.valueAsNumber = wing.dihedral;
        var anhedral = document.createElement("INPUT");
        CreateInput(" Anhedral ", anhedral, span, false);
        anhedral.oninput = () => {
            let w = Object.assign({}, wing);
            w.anhedral = anhedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        anhedral.min = "0";
        anhedral.max = (wing.span - wing.dihedral - 1).toString();
        anhedral.valueAsNumber = wing.anhedral;
        cell.appendChild(span);
        cell.appendChild(document.createElement("BR"));
    }
    AddMiniWing(cell, idx, wing) {
        var span = document.createElement("SPAN");
        var deck = document.createElement("SELECT");
        span.appendChild(deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (wing.deck != i && !this.wings.CanAddMiniWing(i) && !this.wings.CanMoveMiniWing(idx, i)) {
                opt.disabled = true;
            }
            deck.append(opt);
        }
        deck.oninput = () => {
            let w = Object.assign({}, wing);
            w.deck = deck.selectedIndex - 1;
            this.wings.SetMiniWing(idx, w);
        };
        deck.selectedIndex = wing.deck + 1;
        var skin = document.createElement("SELECT");
        span.appendChild(skin);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            skin.append(opt);
        }
        skin.oninput = () => {
            let w = Object.assign({}, wing);
            w.surface = skin.selectedIndex;
            this.wings.SetMiniWing(idx, w);
        };
        skin.selectedIndex = wing.surface;
        var area = document.createElement("INPUT");
        CreateInput(" Area ", area, span, false);
        area.oninput = () => {
            let w = Object.assign({}, wing);
            w.area = area.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        area.min = "1";
        area.max = "2";
        area.valueAsNumber = wing.area;
        var wspan = document.createElement("INPUT");
        CreateInput(" Span ", wspan, span, false);
        wspan.oninput = () => {
            let w = Object.assign({}, wing);
            w.span = wspan.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        wspan.min = "1";
        wspan.valueAsNumber = wing.span;
        cell.appendChild(span);
        cell.appendChild(document.createElement("BR"));
    }
    AddAddFullWing(cell, idx) {
        var span = document.createElement("SPAN");
        var deck = document.createElement("SELECT");
        span.appendChild(deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        deck.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (!this.wings.CanAddFullWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            deck.append(opt);
        }
        deck.oninput = () => {
            let w = { surface: 0, area: 10, span: 5, dihedral: 0, anhedral: 0, deck: deck.selectedIndex - 1 };
            this.wings.SetFullWing(idx, w);
        };
        deck.selectedIndex = 0;
        deck.disabled = !can;
        cell.appendChild(span);
        cell.appendChild(document.createElement("BR"));
    }
    AddAddMiniWing(cell, idx) {
        var span = document.createElement("SPAN");
        var deck = document.createElement("SELECT");
        span.appendChild(deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        deck.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (!this.wings.CanAddMiniWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            deck.append(opt);
        }
        deck.oninput = () => {
            let w = { surface: 0, area: 2, span: 2, dihedral: 0, anhedral: 0, deck: deck.selectedIndex - 1 };
            this.wings.SetMiniWing(idx, w);
        };
        deck.selectedIndex = 0;
        deck.disabled = !can;
        cell.appendChild(span);
        cell.appendChild(document.createElement("BR"));
    }
}
class Stabilizers extends Part {
    constructor(js) {
        super();
        this.have_tail = false;
        this.is_tandem = false;
        this.is_swept = false;
        this.hstab_sel = 0;
        this.hstab_count = 1;
        this.hstab_list = [];
        for (let elem of js["hstab"]) {
            this.hstab_list.push({
                name: elem["name"],
                is_canard: elem["is_canard"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"]
            });
        }
        this.vstab_sel = 0;
        this.vstab_count = 1;
        this.vstab_list = [];
        for (let elem of js["vstab"]) {
            this.vstab_list.push({
                name: elem["name"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"]
            });
        }
    }
    toJSON() {
        return {
            hstab_sel: this.hstab_sel,
            hstab_count: this.hstab_count,
            vstab_sel: this.vstab_sel,
            vstab_count: this.vstab_count,
        };
    }
    fromJSON(js) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
    }
    GetHStabList() {
        return this.hstab_list;
    }
    GetVStabList() {
        return this.vstab_list;
    }
    GetHStabType() {
        return this.hstab_sel;
    }
    SetHStabType(num) {
        if (this.hstab_list[num].name == "The Wings" && !(this.is_tandem || this.is_swept))
            return;
        if (this.hstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.hstab_list[this.hstab_sel].is_vtail) {
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
        this.hstab_sel = num;
        this.SetHStabCount(this.hstab_count);
        this.CalculateStats();
    }
    GetHValidList() {
        var lst = [];
        for (let t of this.hstab_list) {
            if (t.name == "The Wings" && !(this.is_tandem || this.is_swept))
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    SetVTail() {
        for (let i = 0; i < this.hstab_list.length; i++) {
            if (this.hstab_list[i].is_vtail)
                this.hstab_sel = i;
        }
        for (let i = 0; i < this.vstab_list.length; i++) {
            if (this.vstab_list[i].is_vtail)
                this.vstab_sel = i;
        }
        this.hstab_count = 1;
        this.vstab_count = 0;
    }
    GetVStabType() {
        return this.vstab_sel;
    }
    SetVStabType(num) {
        if (this.vstab_list[num].name == "Outboard" && !this.GetVOutboard())
            return;
        if (this.vstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.vstab_list[this.vstab_sel].is_vtail) {
            this.hstab_sel = 0;
        }
        this.vstab_sel = num;
        this.SetVStabCount(this.vstab_count);
        this.CalculateStats();
    }
    GetVValidList() {
        var lst = [];
        for (let t of this.vstab_list) {
            if (t.name == "Outboard" && !this.GetVOutboard())
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    GetHStabCount() {
        return this.hstab_count;
    }
    SetHStabCount(num) {
        this.hstab_count = num;
        if (this.hstab_list[this.hstab_sel].increment != 0) {
            while ((this.hstab_count % this.hstab_list[this.hstab_sel].increment) != 0) {
                this.hstab_count++;
            }
        }
        else {
            this.hstab_count = 0;
        }
        this.CalculateStats();
    }
    GetHStabIncrement() {
        return this.hstab_list[this.hstab_sel].increment;
    }
    GetVStabCount() {
        return this.vstab_count;
    }
    SetVStabCount(num) {
        this.vstab_count = num;
        if (this.vstab_list[this.vstab_sel].increment != 0) {
            while ((this.vstab_count % this.vstab_list[this.vstab_sel].increment) != 0) {
                this.vstab_count++;
            }
        }
        else {
            this.vstab_count = 0;
        }
        this.CalculateStats();
    }
    GetVStabIncrement() {
        return this.vstab_list[this.vstab_sel].increment;
    }
    SetEngineCount(num) {
        this.engine_count = num;
    }
    GetIsTandem() {
        return this.is_tandem;
    }
    SetIsTandem(is) {
        this.is_tandem = is;
    }
    SetIsSwept(is) {
        this.is_swept = is;
    }
    GetVOutboard() {
        return this.is_swept || this.is_tandem || this.hstab_list[this.hstab_sel].is_canard;
    }
    SetWingArea(num) {
        this.wing_area = num;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        //HSTAB
        if (this.hstab_count > 0) {
            stats = stats.Add(this.hstab_list[this.hstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 5 * this.hstab_list[this.hstab_sel].dragfactor);
        }
        else if (this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(this.wing_area / 2);
            stats.liftbleed += 5;
        }
        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 10 * this.vstab_list[this.vstab_sel].dragfactor);
        }
        else if (this.vstab_list[this.vstab_sel].increment != 0) {
            stats.latstab -= this.wing_area;
        }
        //Additional stabilizers
        stats.drag += 2 * (Math.max(0, this.hstab_count - 1) + Math.max(0, this.vstab_count - 1));
        //Pairs of stabilizers
        var pairs = 0;
        if (this.vstab_list[this.vstab_sel].is_vtail) //V-Tail
            pairs = this.hstab_count;
        else
            pairs = Math.min(this.hstab_count, this.vstab_count);
        var leftovers = Math.max(this.hstab_count, this.vstab_count) - pairs;
        var es_pairs = Math.min(this.engine_count, pairs);
        leftovers += 2 * (pairs - es_pairs);
        stats.control += 3 * es_pairs + leftovers;
        return stats;
    }
}
class Stabilizers_HTML extends Display {
    constructor(s) {
        super();
        this.stab = s;
        var tbl = document.getElementById("stab_table");
        var row = tbl.insertRow();
        var hcell = row.insertCell();
        var vcell = row.insertCell();
        this.h_type = document.createElement("SELECT");
        this.h_count = document.createElement("INPUT");
        hcell.appendChild(this.h_type);
        hcell.append(document.createElement("BR"));
        CreateInput(" Stabilizers", this.h_count, hcell);
        this.h_count.min = "0";
        this.h_count.max = "20";
        this.h_count.oninput = () => { this.stab.SetHStabCount(this.h_count.valueAsNumber); };
        this.h_type.onchange = () => { this.stab.SetHStabType(this.h_type.selectedIndex); };
        for (let elem of s.GetHStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.h_type.add(opt);
        }
        this.v_type = document.createElement("SELECT");
        this.v_count = document.createElement("INPUT");
        vcell.appendChild(this.v_type);
        vcell.appendChild(document.createElement("BR"));
        CreateInput(" Stabilizers", this.v_count, vcell);
        this.v_count.min = "0";
        this.v_count.max = "20";
        this.v_count.oninput = () => { this.stab.SetVStabCount(this.v_count.valueAsNumber); };
        this.v_type.onchange = () => { this.stab.SetVStabType(this.v_type.selectedIndex); };
        for (let elem of s.GetVStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.v_type.add(opt);
        }
        var stat_cell = row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Control");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_cont = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        CreateTH(h2_row, "Lift Bleed");
        var c2_row = tbl_stat.insertRow();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
    }
    UpdateDisplay() {
        this.h_type.selectedIndex = this.stab.GetHStabType();
        this.v_type.selectedIndex = this.stab.GetVStabType();
        var valid = this.stab.GetHValidList();
        for (let i = 0; i < valid.length; i++) {
            this.h_type.options[i].disabled = !valid[i];
        }
        valid = this.stab.GetVValidList();
        for (let i = 0; i < valid.length; i++) {
            this.v_type.options[i].disabled = !valid[i];
        }
        this.h_count.valueAsNumber = this.stab.GetHStabCount();
        this.h_count.step = this.stab.GetHStabIncrement().toString();
        this.v_count.valueAsNumber = this.stab.GetVStabCount();
        this.v_count.step = this.stab.GetVStabIncrement().toString();
        var stats = this.stab.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
    }
}
class ControlSurfaces extends Part {
    constructor(js) {
        super();
        this.span = 0;
        this.is_cantilever = false;
        this.wing_area = 0;
        this.aileron_sel = 0;
        this.aileron_list = [];
        for (let elem of js["ailerons"]) {
            this.aileron_list.push({ name: elem["name"], warping: elem["warping"], stats: new Stats(elem) });
        }
        this.rudder_sel = 0;
        this.rudder_list = [];
        for (let elem of js["rudders"]) {
            this.rudder_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.elevator_sel = 0;
        this.elevator_list = [];
        for (let elem of js["elevators"]) {
            this.elevator_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.flaps_sel = 0;
        this.flaps_list = [];
        for (let elem of js["flaps"]) {
            this.flaps_list.push({ name: elem["name"], costfactor: elem["costfactor"], stats: new Stats(elem) });
        }
        this.slats_sel = 0;
        this.slats_list = [];
        for (let elem of js["slats"]) {
            this.slats_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_list = [];
        for (let elem of js["drag_inducers"]) {
            this.drag_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_sel = [...Array(this.drag_list.length).fill(false)];
    }
    toJSON() {
        return {
            aileron_sel: this.aileron_sel,
            rudder_sel: this.rudder_sel,
            elevator_sel: this.elevator_sel,
            flaps_sel: this.flaps_sel,
            slats_sel: this.slats_sel,
            drag_sel: this.drag_sel,
        };
    }
    fromJSON(js) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = js["drag_sel"];
    }
    GetAileronList() {
        return this.aileron_list;
    }
    GetAileron() {
        return this.aileron_sel;
    }
    SetAileron(num) {
        this.aileron_sel = num;
        this.CalculateStats();
    }
    GetRudderList() {
        return this.rudder_list;
    }
    GetRudder() {
        return this.rudder_sel;
    }
    SetRudder(num) {
        this.rudder_sel = num;
        this.CalculateStats();
    }
    GetElevatorList() {
        return this.elevator_list;
    }
    GetElevator() {
        return this.elevator_sel;
    }
    SetElevator(num) {
        this.elevator_sel = num;
        this.CalculateStats();
    }
    GetFlapsList() {
        return this.flaps_list;
    }
    GetFlaps() {
        return this.flaps_sel;
    }
    SetFlaps(num) {
        this.flaps_sel = num;
        this.CalculateStats();
    }
    GetSlatsList() {
        return this.slats_list;
    }
    GetSlats() {
        return this.slats_sel;
    }
    SetSlats(num) {
        this.slats_sel = num;
        this.CalculateStats();
    }
    GetDragList() {
        return this.drag_list;
    }
    GetDrag() {
        return this.drag_sel;
    }
    SetDrag(num, use) {
        this.drag_sel[num] = use;
        this.CalculateStats();
    }
    SetIsCantilever(use) {
        this.is_cantilever = use;
    }
    SetSpan(span) {
        this.span = span;
    }
    SetWingArea(wa) {
        this.wing_area = wa;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);
        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever)
                stats.cost += 2 * this.wing_area;
        }
        stats = stats.Add(this.rudder_list[this.rudder_sel].stats);
        stats = stats.Add(this.elevator_list[this.elevator_sel].stats);
        stats = stats.Add(this.flaps_list[this.flaps_sel].stats);
        stats = stats.Add(this.slats_list[this.slats_sel].stats);
        for (let i = 0; i < this.drag_list.length; i++) {
            if (this.drag_sel[i])
                stats = stats.Add(this.drag_list[i].stats);
        }
        return stats;
    }
}
class ControlSurfaces_HTML extends Display {
    constructor(cs) {
        super();
        this.cs = cs;
        var tbl = document.getElementById("tbl_control_surfaces");
        var row = tbl.insertRow();
        var cs_cell = row.insertCell();
        this.aileron_select = document.createElement("SELECT");
        for (let a of cs.GetAileronList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.aileron_select.add(opt);
        }
        this.aileron_select.onchange = () => { this.cs.SetAileron(this.aileron_select.selectedIndex); };
        this.rudder_select = document.createElement("SELECT");
        for (let a of cs.GetRudderList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.rudder_select.add(opt);
        }
        this.rudder_select.onchange = () => { this.cs.SetRudder(this.rudder_select.selectedIndex); };
        this.elevator_select = document.createElement("SELECT");
        for (let a of cs.GetElevatorList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.elevator_select.add(opt);
        }
        this.elevator_select.onchange = () => { this.cs.SetElevator(this.elevator_select.selectedIndex); };
        this.flaps_select = document.createElement("SELECT");
        for (let a of cs.GetFlapsList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.flaps_select.add(opt);
        }
        this.flaps_select.onchange = () => { this.cs.SetFlaps(this.flaps_select.selectedIndex); };
        this.slats_select = document.createElement("SELECT");
        for (let a of cs.GetSlatsList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.slats_select.add(opt);
        }
        this.slats_select.onchange = () => { this.cs.SetSlats(this.slats_select.selectedIndex); };
        CreateSelect("Ailerons", this.aileron_select, cs_cell);
        CreateSelect("Rudders", this.rudder_select, cs_cell);
        CreateSelect("Elevators", this.elevator_select, cs_cell);
        CreateSelect("Flaps", this.flaps_select, cs_cell);
        CreateSelect("Slats", this.slats_select, cs_cell);
        var drag_cell = row.insertCell();
        this.drag_chbx = [];
        var dlist = cs.GetDragList();
        for (let i = 0; i < dlist.length; i++) {
            let cbx = document.createElement("INPUT");
            CreateCheckbox(dlist[i].name, cbx, drag_cell, true);
            cbx.onchange = () => { this.cs.SetDrag(i, cbx.checked); };
            this.drag_chbx.push(cbx);
        }
        this.InitStatDisplay(row.insertCell());
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Lift Bleed");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, " ");
        var c3_row = tbl_stat.insertRow();
        this.d_lift = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_none = c3_row.insertCell();
    }
    UpdateDisplay() {
        this.aileron_select.selectedIndex = this.cs.GetAileron();
        this.rudder_select.selectedIndex = this.cs.GetRudder();
        this.elevator_select.selectedIndex = this.cs.GetElevator();
        this.flaps_select.selectedIndex = this.cs.GetFlaps();
        this.slats_select.selectedIndex = this.cs.GetSlats();
        var drag = this.cs.GetDrag();
        for (let i = 0; i < this.drag_chbx.length; i++) {
            this.drag_chbx[i].checked = drag[i];
        }
        var stats = this.cs.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }
}
class Reinforcement extends Part {
    constructor(js) {
        super();
        this.ext_list = [];
        for (let elem of js["external"]) {
            this.ext_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], stats: new Stats(elem) });
        }
        this.ext_wood_count = [...Array(this.ext_list.length).fill(0)];
        this.ext_steel_count = [...Array(this.ext_list.length).fill(0)];
        this.cant_list = [];
        for (let elem of js["cantilever"]) {
            this.cant_list.push({ name: elem["name"], limited: elem["limited"], stats: new Stats(elem) });
        }
        this.cant_count = [...Array(this.cant_list.length).fill(0)];
        this.wires = false;
        this.is_staggered = false;
        this.is_tandem = false;
        this.is_monoplane = false;
        this.acft_structure = 0;
    }
    GetExternalWoodCount() {
        return this.ext_wood_count;
    }
    SetExternalWoodCount(idx, count) {
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }
    GetExternalSteelCount() {
        return this.ext_steel_count;
    }
    SetExternalSteelCount(idx, count) {
        this.ext_steel_count[idx] = count;
        this.CalculateStats();
    }
    GetCantileverCount() {
        return this.cant_count;
    }
    SetCantileverCount(idx, count) {
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }
    ImplSCC(idx, count) {
        var diff = count - this.cant_count[idx];
        if (this.cant_list[idx].limited && diff > 0) {
            var total_structure = this.TotalStructure();
            for (let i = 0; i < this.cant_list.length; i++) {
                if (this.cant_list[i].limited) {
                    total_structure -= 5 * this.cant_count[i] * this.cant_list[i].stats.mass;
                }
            }
            diff = Math.min(diff, Math.floor(total_structure / (5 * this.cant_list[idx].stats.mass)));
        }
        this.cant_count[idx] += diff;
    }
    GetWires() {
        return this.wires;
    }
    SetWires(use) {
        this.wires = use;
        this.CalculateStats();
    }
    SetStaggered(is) {
        this.is_staggered = is;
    }
    SetTandem(is) {
        this.is_tandem = is;
    }
    SetMonoplane(is) {
        this.is_monoplane = is;
    }
    SetAcftStructure(struct) {
        if (struct < this.acft_structure) {
            for (let i = this.cant_list.length - 1; i >= 0; i--)
                this.ImplSCC(i, this.cant_count[i]);
        }
        this.acft_structure = struct;
    }
    TotalStructure() {
        var struct_count = 0;
        for (let i = 0; i < this.ext_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * 2 * this.ext_list[i].stats.structure;
        }
        return this.acft_structure + struct_count;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var tension_multiple = 1;
        if (this.is_monoplane)
            tension_multiple = 0.6;
        else if (this.is_tandem)
            tension_multiple = 0.8;
        else if (this.is_staggered)
            tension_multiple = 0.9;
        var tension = 0;
        var strut_count = 0;
        //Wood Struts
        for (let i = 0; i < this.ext_list.length; i++) {
            strut_count += this.ext_wood_count[i];
            let ts = this.ext_list[i].stats;
            ts = ts.Multiply(this.ext_wood_count[i]);
            stats.Add(ts);
            if (this.ext_list[i].config)
                tension += tension_multiple * this.ext_list[i].tension * this.ext_wood_count[i];
            else
                tension += this.ext_list[i].tension * this.ext_wood_count[i];
        }
        //Steel Struts
        for (let i = 0; i < this.ext_list.length; i++) {
            strut_count += this.ext_steel_count[i];
            let ts = this.ext_list[i].stats;
            ts.structure *= 2;
            ts.cost *= 2;
            ts.maxstrain += 5;
            ts = ts.Multiply(this.ext_steel_count[i]);
            stats.Add(ts);
            if (this.ext_list[i].config)
                tension += tension_multiple * this.ext_list[i].tension / 2.0 * this.ext_steel_count[i];
            else
                tension += this.ext_list[i].tension / 2.0 * this.ext_steel_count[i];
        }
        if (this.wires) {
            stats.maxstrain += Math.floor(tension);
            stats.drag += 3 * strut_count;
        }
        var use_cant = false;
        for (let i = 0; i < this.cant_list.length; i++) {
            if (this.cant_count[i] > 0)
                use_cant = true;
            let ts = this.cant_list[i].stats;
            ts = ts.Multiply(this.cant_count[i]);
            stats.Add(ts);
        }
        if (use_cant)
            stats.cost += 5;
        return stats;
    }
}
class Reinforcement_HTML extends Display {
    constructor(rf) {
        super();
        this.rf = rf;
    }
    UpdateDisplay() {
    }
}
