/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Passengers extends Part {
    private seats: number;
    private beds: number;
    private connected: boolean;

    constructor(js: JSON) {
        super();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }

    public toJSON() {
        return {
            seats: this.seats,
            beds: this.beds,
            connected: this.connected
        };
    }

    public fromJSON(js: JSON) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }

    public GetSeats() {
        return this.seats;
    }

    public SetSeats(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.seats = num;
        this.CalculateStats();
    }

    public GetBeds() {
        return this.beds;
    }

    public SetBeds(num: number) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(num);
        this.beds = num;
        this.CalculateStats();
    }

    public PossibleConnection() {
        return (this.seats + this.beds) > 0;
    }

    public GetConnected() {
        return this.connected;
    }

    public SetConnected(sel: boolean) {
        this.connected = sel;
        this.CalculateStats();
    }

    public PartStats(): Stats {
        var s = new Stats();
        s.reqsections = 2 * Math.ceil((this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            s.mass = 1;
        }
        return s;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}