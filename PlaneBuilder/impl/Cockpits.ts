/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Cockpit.ts" />

class Cockpits extends Part {
    private positions: Cockpit[];
    private types: { name: string, stats: Stats }[];
    private upgrades: { name: string, stats: Stats }[];
    private safety: { name: string, stats: Stats }[];
    private gunsights: { name: string, stats: Stats }[];

    constructor(js: JSON) {
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
        this.safety = [];
        //Add all the safety
        for (let elem of js["safety"]) {
            let sft = { name: elem["name"], stats: new Stats(elem) };
            this.safety.push(sft);
        }
        this.gunsights = [];
        //Add all the gunsights
        for (let elem of js["gunsights"]) {
            let gun = { name: elem["name"], stats: new Stats(elem) };
            this.gunsights.push(gun);
        }
    }

    public toJSON() {
        var lst = [];
        for (let cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }

    public fromJSON(js: JSON) {
        this.positions = [];
        for (let elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.fromJSON(elem);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);

        }
    }

    public GetAttackList() {
        //TODO: Attack
        var lst = [];
        for (let c of this.positions) {
            lst.push(0);
        }
        return lst;
    }

    public GetVisibilityList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetVisibility());
        }
        return lst;
    }

    public GetStressList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetFlightStress());
        }
        return lst;
    }

    public GetEscapeList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetEscape());
        }
        return lst;
    }

    public SetNumberOfCockpits(num: number) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(num);
        while (this.positions.length > num) {
            this.positions.pop();
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
        this.CalculateStats();
    }

    public GetNumberOfCockpits() {
        return this.positions.length;
    }

    public GetCockpit(index: number) {
        return this.positions[index];
    }

    public PartStats(): Stats {
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

    public UpdateCrewStats(escape: number, flightstress: number, visibility: number) {
        for (let cp of this.positions) {
            cp.CrewUpdate(escape, flightstress, visibility);
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}