import { AlterStats } from "./AlterStats.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
import { Era } from "./Era.js";
import { Cockpits } from "./Cockpits.js";
import { Passengers } from "./Passengers.js";
import { Engines } from "./Engines.js";
import { Propeller } from "./Propeller.js";
import { Frames } from "./Frames.js";
import { Wings } from "./Wings.js";
import { Stabilizers } from "./Stabilizers.js";
import { ControlSurfaces } from "./ControlSurfaces.js";
import { Reinforcement } from "./Reinforcement.js";
import { Fuel } from "./Fuel.js";
import { Munitions } from "./Munitions.js";
import { CargoAndPassengers } from "./CargoAndPassengers.js";
import { LandingGear } from "./LandingGear.js";
import { Accessories } from "./Accessories.js";
import { Optimization } from "./Optimization.js";
import { Weapons } from "./Weapons.js";
import { Used } from "./Used.js";
import { Rotor } from "./Rotor.js";
import { AIRCRAFT_TYPE, IsAnyOrnithopter, MergeElectrics } from "./Part.js";
import { lu } from "./Localization.js";
export class Aircraft {
    constructor(js, weapon_json, storage) {
        this.use_storage = false;
        this.reset_json = String.raw `{"version":"11.3","name":"Basic Biplane","aircraft_type":0,"era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Rhona Motorbau Z11 80hp","overspeed":18,"altitude":29,"torque":2,"rumble":0,"oiltank":true,"pulsejet":false,"liftbleed":0,"wetmass":0,"mass":4,"drag":8,"control":0,"cost":4,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":-1,"power":8,"fuelconsumption":10,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0},"selected_inputs":{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},"cooling_count":0,"radiator_index":-1,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":2,"is_generator":false,"has_alternator":false,"intake_fan":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":2,"use_variable":false},"frames":{"sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"wings":{"wing_list":[{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":0},{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[1,0,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":1,"wing_blades":false},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"info_sel":[false,false],"visi_sel":[false,false,false],"clim_sel":[false,false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":0,"w_count":1}],"ammo":1,"action":0,"projectile":0,"repeating":false}],"brace_count":0},"used":{"enabled":false,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0},"rotor":{"type":0,"rotor_count":0,"rotor_span":0,"rotor_mat":0,"is_tandem":false,"accessory":false}}`;
        this.freeze_calculation = true;
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js["version"];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers(js["cargo"]);
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(weapon_json);
        this.used = new Used();
        this.rotor = new Rotor(js["rotor"]);
        this.alter = new AlterStats();
        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.wings.SetCalculateStats(() => { this.CalculateStats(); });
        this.stabilizers.SetCalculateStats(() => { this.CalculateStats(); });
        this.controlsurfaces.SetCalculateStats(() => { this.CalculateStats(); });
        this.reinforcements.SetCalculateStats(() => { this.CalculateStats(); });
        this.fuel.SetCalculateStats(() => { this.CalculateStats(); });
        this.munitions.SetCalculateStats(() => { this.CalculateStats(); });
        this.cargo.SetCalculateStats(() => { this.CalculateStats(); });
        this.gear.SetCalculateStats(() => { this.CalculateStats(); });
        this.accessories.SetCalculateStats(() => { this.CalculateStats(); });
        this.optimization.SetCalculateStats(() => { this.CalculateStats(); });
        this.weapons.SetCalculateStats(() => { this.CalculateStats(); });
        this.used.SetCalculateStats(() => { this.CalculateStats(); });
        this.rotor.SetCalculateStats(() => { this.CalculateStats(); });
        this.alter.SetCalculateStats(() => { this.CalculateStats(); });
        this.rotor.SetCantileverList(this.reinforcements.GetCantileverList());
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
        this.updated_stats = false;
        this.freeze_calculation = false;
        this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
        this.Reset();
    }
    toJSON() {
        return {
            version: this.version,
            name: this.name,
            aircraft_type: this.aircraft_type,
            era: this.era.toJSON(),
            cockpits: this.cockpits.toJSON(),
            passengers: this.passengers.toJSON(),
            engines: this.engines.toJSON(),
            propeller: this.propeller.toJSON(),
            frames: this.frames.toJSON(),
            wings: this.wings.toJSON(),
            stabilizers: this.stabilizers.toJSON(),
            controlsurfaces: this.controlsurfaces.toJSON(),
            reinforcements: this.reinforcements.toJSON(),
            fuel: this.fuel.toJSON(),
            munitions: this.munitions.toJSON(),
            cargo: this.cargo.toJSON(),
            gear: this.gear.toJSON(),
            accessories: this.accessories.toJSON(),
            optimization: this.optimization.toJSON(),
            weapons: this.weapons.toJSON(),
            used: this.used.toJSON(),
            rotor: this.rotor.toJSON(),
            alter: this.alter.toJSON(),
        };
    }
    fromJSON(js, disp = true) {
        this.freeze_calculation = true;
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
        const json_version = parseFloat(js["version"]);
        this.name = js["name"];
        if (json_version > 11.05) {
            this.aircraft_type = js["aircraft_type"];
            this.rotor.SetType(js["aircraft_type"]);
        }
        else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
        this.era.fromJSON(js["era"], json_version);
        this.cockpits.fromJSON(js["cockpits"], json_version);
        this.passengers.fromJSON(js["passengers"], json_version);
        this.engines.fromJSON(js["engines"], json_version);
        this.propeller.fromJSON(js["propeller"], json_version);
        this.frames.fromJSON(js["frames"], json_version);
        this.wings.fromJSON(js["wings"], json_version);
        this.stabilizers.fromJSON(js["stabilizers"], json_version);
        this.controlsurfaces.fromJSON(js["controlsurfaces"], json_version);
        this.reinforcements.fromJSON(js["reinforcements"], json_version);
        this.fuel.fromJSON(js["fuel"], json_version);
        this.munitions.fromJSON(js["munitions"], json_version);
        this.cargo.fromJSON(js["cargo"], json_version);
        this.gear.fromJSON(js["gear"], json_version);
        this.accessories.fromJSON(js["accessories"], json_version);
        this.optimization.fromJSON(js["optimization"], json_version);
        this.weapons.fromJSON(js["weapons"], json_version);
        if (json_version > 10.65) {
            this.used.fromJSON(js["used"], json_version);
        }
        if (json_version > 11.05) {
            this.rotor.fromJSON(js["rotor"], json_version);
        }
        if (json_version > 12.25) {
            this.alter.fromJSON(js["alter"], json_version);
        }
        else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
        return true;
    }
    serialize(s) {
        s.PushString(this.version);
        s.PushString(this.name);
        this.era.serialize(s);
        this.cockpits.serialize(s);
        this.passengers.serialize(s);
        this.engines.serialize(s);
        this.propeller.serialize(s);
        this.frames.serialize(s);
        this.wings.serialize(s);
        this.stabilizers.serialize(s);
        this.controlsurfaces.serialize(s);
        this.reinforcements.serialize(s);
        this.fuel.serialize(s);
        this.munitions.serialize(s);
        this.cargo.serialize(s);
        this.gear.serialize(s);
        this.accessories.serialize(s);
        this.optimization.serialize(s);
        this.weapons.serialize(s);
        this.used.serialize(s);
        this.rotor.serialize(s);
        s.PushNum(this.aircraft_type);
        this.alter.serialize(s);
    }
    deserialize(d) {
        this.freeze_calculation = true;
        d.version = parseFloat(d.GetString());
        this.name = d.GetString();
        this.era.deserialize(d);
        this.cockpits.deserialize(d);
        this.passengers.deserialize(d);
        this.engines.deserialize(d);
        this.propeller.deserialize(d);
        this.frames.deserialize(d);
        this.wings.deserialize(d);
        this.stabilizers.deserialize(d);
        this.controlsurfaces.deserialize(d);
        this.reinforcements.deserialize(d);
        this.fuel.deserialize(d);
        this.munitions.deserialize(d);
        this.cargo.deserialize(d);
        this.gear.deserialize(d);
        this.accessories.deserialize(d);
        this.optimization.deserialize(d);
        this.weapons.deserialize(d);
        if (d.version > 10.65) {
            this.used.deserialize(d);
        }
        if (d.version > 11.05) {
            this.rotor.deserialise(d);
            this.aircraft_type = d.GetNum();
            this.rotor.SetType(this.aircraft_type);
        }
        else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
        if (d.version > 12.25) {
            this.alter.deserialize(d);
        }
        else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
    }
    SetType(type) {
        this.aircraft_type = type;
        this.rotor.SetType(type);
        this.CalculateStats();
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        if (this.freeze_calculation) {
            return;
        }
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());
        this.engines.SetTailMods(this.frames.GetFarmanOrBoom(), this.wings.GetSwept() && this.stabilizers.GetVOutboard(), this.stabilizers.GetCanard());
        this.engines.SetInternal(this.aircraft_type == AIRCRAFT_TYPE.HELICOPTER || IsAnyOrnithopter(this.aircraft_type));
        this.engines.SetMetalArea(this.wings.GetMetalArea());
        this.engines.HaveParasol(this.wings.GetParasol());
        stats = stats.Add(this.engines.PartStats());
        this.propeller.SetEngineTypes(this.engines.GetEngineTypes());
        this.propeller.SetAcftType(this.aircraft_type);
        stats = stats.Add(this.propeller.PartStats());
        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        //Weapons go here, because they make sections.
        this.weapons.SetNumberOfCockpits(this.cockpits.GetNumberOfCockpits());
        this.weapons.SetTractorInfo(this.engines.GetTractorSpinner());
        this.weapons.SetPusherInfo(this.engines.GetPusherSpinner());
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        this.weapons.SetHavePropeller(this.engines.GetNumPropellers() > 0);
        this.weapons.SetCanWing(!IsAnyOrnithopter(this.aircraft_type));
        stats = stats.Add(this.weapons.PartStats());
        //Cargo makes sections
        stats = stats.Add(this.cargo.PartStats());
        //If there are wings...
        if (this.aircraft_type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.wings.SetRotorSpan(this.rotor.GetRotorSpan());
        }
        else {
            this.wings.SetRotorSpan(0);
        }
        stats = stats.Add(this.wings.PartStats());
        this.rotor.SetWingArea(stats.wingarea);
        //If there is a rotor...
        if (this.aircraft_type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor.SetEngineCount(this.engines.GetNumberOfEngines());
            stats = stats.Add(this.rotor.PartStats());
        }
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetBoomTail(this.frames.GetUseBoom());
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        this.controlsurfaces.SetAcftType(this.aircraft_type);
        this.controlsurfaces.SetCanElevator(this.stabilizers.GetHStabCount() > 0);
        this.controlsurfaces.SetCanRudder(this.stabilizers.GetVStabCount() > 0);
        this.controlsurfaces.SetIsVTail(this.stabilizers.GetIsVTail());
        if (this.aircraft_type == AIRCRAFT_TYPE.AIRPLANE) {
            this.controlsurfaces.SetNumCantilever(this.reinforcements.GetTotalCantilevers());
        }
        else {
            this.controlsurfaces.SetNumCantilever(0);
        }
        stats = stats.Add(this.controlsurfaces.PartStats());
        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        this.reinforcements.SetCanUseExternal(this.wings.GetArea() > 0);
        this.reinforcements.SetSesquiplane(this.wings.GetIsSesquiplane());
        this.reinforcements.SetAircraftType(this.aircraft_type);
        this.reinforcements.SetCantLift(this.era.GetCantLift());
        stats = stats.Add(this.reinforcements.PartStats());
        if (this.rotor.GetTailRotor()) {
            stats.power = Math.floor(1.0e-6 + 0.9 * stats.power);
        }
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        this.accessories.SetSkinArmor(this.frames.GetArmor());
        this.accessories.SetVitalParts(this.VitalComponentList().length);
        this.accessories.SetCanCutouts(this.wings.CanCutout(), this.frames.CanCutout());
        stats = stats.Add(this.accessories.PartStats());
        //You know what, frames go last, because lots of things make sections.
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.frames.SetIsTandem(this.wings.GetTandem());
        stats = stats.Add(this.frames.PartStats());
        //Depends on Lifting area.
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetHelicopter(false);
        this.stabilizers.SetLiftingArea(stats.wingarea);
        this.stabilizers.wing_drag = this.wings.GetWingDrag() + this.rotor.GetRotorDrag();
        stats = stats.Add(this.stabilizers.PartStats());
        //Treated Paper needs to apply near to last
        this.wings.SetAircraftMass(stats.mass);
        this.wings.SetAcftType(this.aircraft_type);
        stats.mass += this.wings.GetPaperMass();
        //Because treated paper brings mass down.
        stats.mass = Math.max(1, stats.mass);
        //Gear go last, because they need total mass.
        this.gear.SetGull(this.wings.HasInvertedGull());
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), this.wings.GetWingHeight());
        stats = stats.Add(this.gear.PartStats());
        //Add toughness here so it gets optimized properly.
        stats.toughness += Math.floor(1.0e-6 + stats.structure / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        //Has flight stress from open cockpit + tractor rotary.
        this.cockpits.SetHasRotary(this.engines.HasTractorRotary());
        stats = stats.Add(this.alter.PartStats());
        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();
        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;
            const derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);
            //Used: burnt_out
            stats.reliability -= this.used.burnt_out;
            //Used: sticky_guns  (Just needs to happen before display)
            this.weapons.SetStickyGuns(this.used.sticky_guns);
            //Update Part Local stuff
            this.cockpits.SetArmed(this.weapons.GetArmedSeats());
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.ControlStress, derived.RumbleStress, this.stats.visibility, this.stats.crashsafety);
            //Check Flight Stress for warnings
            let stress_reduction = 0;
            for (const s of this.cockpits.GetStressList()) {
                stress_reduction = Math.max(stress_reduction, s[0] - s[1]);
            }
            if (stress_reduction != 0 && this.stats.warnings.findIndex((value) => { return value.source == lu("Co-Pilot Controls"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Co-Pilot Controls"),
                    warning: lu("Co-Pilot Warning", stress_reduction),
                    color: WARNING_COLOR.WHITE,
                });
            }
            if (IsAnyOrnithopter(this.aircraft_type)) {
                stats.upkeep += 1;
            }
            if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
                stats.reliability -= 2;
            }
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftParameters(stats.structure, this.era.GetMaxBomb(), this.wings.HasInvertedGull());
            //Airplanes always cost 1
            this.stats.cost = Math.max(1, this.stats.cost);
            //Always have at least 1 liftbleed
            this.stats.liftbleed = Math.max(1, this.stats.liftbleed);
            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: lu("Stat Rumble"),
                    warning: lu("Rumble Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
            if (this.DisplayCallback && !this.freeze_calculation)
                this.DisplayCallback();
            if (this.use_storage)
                window.localStorage.setItem("aircraft", JSON.stringify(this));
        }
    }
    GetDerivedStats() {
        let DryMP = Math.floor(1.0e-6 + this.stats.mass / 5);
        DryMP = Math.max(DryMP, 1);
        let WetMP = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass) / 5);
        WetMP = Math.max(WetMP, 1);
        let WetMPwBombs = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        WetMPwBombs = Math.max(WetMPwBombs, 1);
        let DPEmpty = Math.floor(1.0e-6 + (this.stats.drag + DryMP) / 5);
        DPEmpty = Math.max(DPEmpty, 1);
        const DPFull = DPEmpty; //Based on advice from Discord.
        let DPwBombs = Math.floor(1.0e-6 + (this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        DPwBombs = Math.max(DPwBombs, 1);
        let MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9))));
        let MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9))));
        let MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9))));
        // Supersonic Tests
        // const MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPEmpty * 9))));
        // const MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPFull * 9))));
        // const MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPwBombs * 9))));
        let StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea)));
        let StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea)));
        let StallSpeedFullwBombs = Math.max(Math.floor(1.0e-6 + this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea)));
        var Overspeed = this.engines.GetOverspeed();
        const BoostEmpty = Math.floor(1.0e-6 + this.stats.power / DryMP);
        const BoostFull = Math.floor(1.0e-6 + this.stats.power / WetMP);
        const BoostFullwBombs = Math.floor(1.0e-6 + this.stats.power / WetMPwBombs);
        if (BoostFullwBombs == 0) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Boost"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Boost"), warning: lu("Boost Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
        }
        const Dropoff = Math.floor(1.0e-6 + this.stats.pitchboost * MaxSpeedEmpty);
        //Used: Ragged
        // Comes after Dropoff so Used only affects the one number, not multiple.
        MaxSpeedEmpty = Math.floor(1.0e-6 + MaxSpeedEmpty * (1 - 0.1 * this.used.ragged));
        MaxSpeedFull = Math.floor(1.0e-6 + MaxSpeedFull * (1 - 0.1 * this.used.ragged));
        MaxSpeedwBombs = Math.floor(1.0e-6 + MaxSpeedwBombs * (1 - 0.1 * this.used.ragged));
        var Stability = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stability += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stability -= 2;
        let HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stability > 10 || Stability < -10) {
            HandlingEmpty = -1 / 0;
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Stability"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Stability"), warning: lu("Stability Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
        }
        else if (Stability == 10)
            HandlingEmpty -= 4;
        else if (Stability > 6)
            HandlingEmpty -= 3;
        else if (Stability > 3)
            HandlingEmpty -= 2;
        else if (Stability > 0)
            HandlingEmpty -= 1;
        else if (Stability == 0)
            HandlingEmpty += 0;
        else if (Stability > -4)
            HandlingEmpty += 1;
        else if (Stability > -7)
            HandlingEmpty += 2;
        else if (Stability > -10)
            HandlingEmpty += 3;
        else if (Stability == -10)
            HandlingEmpty += 4;
        let HandlingFull = HandlingEmpty + DryMP - WetMP;
        let HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;
        //Used: Sluggish
        HandlingEmpty = Math.floor(1.0e-6 + HandlingEmpty - 5 * this.used.sluggish);
        HandlingFull = Math.floor(1.0e-6 + HandlingFull - 5 * this.used.sluggish);
        HandlingFullwBombs = Math.floor(1.0e-6 + HandlingFullwBombs - 5 * this.used.sluggish);
        let MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        //And store the results so they can be displayed
        this.optimization.final_ms = Math.floor(1.0e-6 + this.optimization.GetMaxStrain() * 1.5 * MaxStrain / 10);
        MaxStrain += this.optimization.final_ms;
        //Used: Fragile
        MaxStrain = Math.floor(1.0e-6 + MaxStrain * (1 - 0.2 * this.used.fragile));
        if (MaxStrain < 10 && this.stats.warnings.findIndex((value) => { return value.source == lu("Stat Max Strain"); }) == -1) {
            this.stats.warnings.push({
                source: lu("Stat Max Strain"), warning: lu("Max Strain Warning"),
                color: WARNING_COLOR.RED,
            });
        }
        let Toughness = this.stats.toughness;
        //Used: Weak
        Toughness = Math.floor(1.0e-6 + Toughness * (1 - 0.5 * this.used.weak));
        const Structure = this.stats.structure;
        let EnergyLoss = Math.ceil(-1.0e-6 + DPEmpty / this.propeller.GetEnergy());
        let EnergyLosswBombs = EnergyLoss + 1;
        EnergyLoss = Math.min(EnergyLoss, 10);
        EnergyLosswBombs = Math.min(EnergyLosswBombs, 10);
        let TurnBleed = Math.ceil(-1.0e-6 + Math.floor(1.0e-6 + (StallSpeedEmpty + StallSpeedFull) / 2) / this.propeller.GetTurn());
        if (this.aircraft_type == AIRCRAFT_TYPE.HELICOPTER) {
            TurnBleed = Math.max(1, Math.floor(1.0e-6 + DryMP / 2)) + this.rotor.GetRotorBleed();
            EnergyLoss = Math.max(1, Math.floor(1.0e-6 + DPEmpty / 7));
            StallSpeedEmpty = 0;
            StallSpeedFull = 0;
            StallSpeedFullwBombs = 0;
            MaxSpeedEmpty = Math.min(37, MaxSpeedEmpty);
            MaxSpeedFull = Math.min(37, MaxSpeedFull);
            MaxSpeedwBombs = Math.min(37, MaxSpeedwBombs);
        }
        TurnBleed = Math.max(TurnBleed, 1);
        let TurnBleedwBombs = TurnBleed + 1;
        TurnBleedwBombs = Math.max(TurnBleedwBombs, 1);
        //Used: Hefty
        // Comes after Turnbleed so Used only affects the one number, not multiple.
        StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + StallSpeedEmpty * (1 + 0.2 * this.used.hefty)));
        StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + StallSpeedFull * (1 + 0.2 * this.used.hefty)));
        StallSpeedFullwBombs = Math.max(1, Math.floor(1.0e-6 + StallSpeedFullwBombs * (1 + 0.2 * this.used.hefty)));
        if (MaxSpeedwBombs <= StallSpeedFullwBombs || MaxSpeedFull <= StallSpeedFull) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Stall Speed"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Stall Speed"), warning: lu("Stall Speed Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
        }
        let FuelUses = Math.floor(1.0e-6 + this.stats.fuel / this.stats.fuelconsumption);
        //Used: Leaky
        FuelUses = Math.floor(1.0e-6 + FuelUses * (1 - 0.2 * this.used.leaky));
        if (!isFinite(FuelUses)) {
            FuelUses = 0;
        }
        if (FuelUses < 6) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Fuel Uses"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Fuel Uses"), warning: lu("Fuel Uses Warning"),
                    color: WARNING_COLOR.YELLOW,
                });
            }
        }
        let ControlStress = 1;
        if (Stability > 3 || Stability < -3)
            ControlStress++;
        //Flight Stress from Rumble.
        var RumbleStress = 0;
        ControlStress += Math.min(this.accessories.GetMaxMassStress(), Math.floor(1.0e-6 + DryMP / 10));
        const MaxStress = this.accessories.GetMaxTotalStress();
        ControlStress = Math.min(MaxStress, ControlStress);
        if (this.engines.GetMaxRumble() > 0) {
            RumbleStress += Math.max(1, this.engines.GetMaxRumble());
            RumbleStress = Math.floor(1.0e-6 + RumbleStress);
        }
        if (MaxStress == 0) {
            RumbleStress = 0;
        }
        let RateOfClimbEmpty = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / DryMP) * (23.0 / this.stats.pitchspeed) / DPEmpty));
        let RateOfClimbFull = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMP) * (23.0 / this.stats.pitchspeed) / DPFull));
        let RateOfClimbwBombs = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMPwBombs) * (23.0 / this.stats.pitchspeed) / DPwBombs));
        if (!isFinite(RateOfClimbEmpty)) {
            RateOfClimbEmpty = 0;
            RateOfClimbFull = 0;
            RateOfClimbwBombs = 0;
        }
        //Ornithopter Stuff
        if (IsAnyOrnithopter(this.aircraft_type)) {
            HandlingEmpty += 5;
            HandlingFull += 5;
            HandlingFullwBombs += 5;
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Ornithopter Stall"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Ornithopter Stall"), warning: lu("Ornithopter Stall Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
            Overspeed = MaxStrain;
        }
        if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            HandlingEmpty += 5;
            HandlingFull += 5;
            HandlingFullwBombs += 5;
            Overspeed = Infinity;
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Ornithopter Flutterer Attack"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Ornithopter Flutterer Attack"), warning: lu("Ornithopter Flutterer Attack Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
        }
        if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Ornithopter Buzzer Boost"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Ornithopter Buzzer Boost"), warning: lu("Ornithopter Buzzer Boost Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Ornithopter Buzzer Stall"); }) == -1) {
                this.stats.warnings.push({
                    source: lu("Ornithopter Buzzer Stall"), warning: lu("Ornithopter Buzzer Stall Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
        }
        return {
            DryMP: DryMP,
            WetMP: WetMP,
            WetMPwBombs: WetMPwBombs,
            DPEmpty: DPEmpty,
            DPFull: DPFull,
            DPwBombs: DPwBombs,
            MaxSpeedEmpty: MaxSpeedEmpty,
            MaxSpeedFull: MaxSpeedFull,
            MaxSpeedwBombs: MaxSpeedwBombs,
            StallSpeedEmpty: StallSpeedEmpty,
            StallSpeedFull: StallSpeedFull,
            StallSpeedFullwBombs: StallSpeedFullwBombs,
            Overspeed: Overspeed,
            BoostEmpty: BoostEmpty,
            BoostFull: BoostFull,
            BoostFullwBombs: BoostFullwBombs,
            Dropoff: Dropoff,
            Stabiilty: Stability,
            HandlingEmpty: HandlingEmpty,
            HandlingFull: HandlingFull,
            HandlingFullwBombs: HandlingFullwBombs,
            MaxStrain: MaxStrain,
            Toughness: Toughness,
            Structure: Structure,
            EnergyLoss: EnergyLoss,
            EnergyLosswBombs: EnergyLosswBombs,
            TurnBleed: TurnBleed,
            TurnBleedwBombs: TurnBleedwBombs,
            FuelUses: FuelUses,
            ControlStress: ControlStress,
            RumbleStress: RumbleStress,
            RateOfClimbFull: RateOfClimbFull,
            RateOfClimbEmpty: RateOfClimbEmpty,
            RateOfClimbwBombs: RateOfClimbwBombs,
        };
    }
    VitalComponentList() {
        const derived = this.GetDerivedStats();
        const vital = [];
        vital.push(lu("Vital Part Controls"));
        for (let i = 0; i < this.GetCockpits().GetNumberOfCockpits(); i++) {
            vital.push(lu("Seat #", i + 1) + ": " + lu(this.GetCockpits().GetCockpit(i).GetName()));
        }
        if (derived.FuelUses > 0) {
            vital.push(lu("Vital Part Fuel Tanks"));
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfEngines(); i++) {
            if (this.GetEngines().GetEngine(i).GetUsePushPull()) {
                vital.push(lu("Vital Part Engine Pusher", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan Pusher", i + 1));
                }
                vital.push(lu("Vital Part Engine Puller", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan Puller", i + 1));
                }
            }
            else {
                vital.push(lu("Vital Part Engine", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan", i + 1));
                }
            }
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfRadiators(); i++) {
            vital.push(lu("Vital Part Radiator", i + 1));
        }
        if (this.IsElectrics()) {
            vital.push(lu("Vital Part Electrics"));
        }
        const wlist = this.GetWeapons().GetWeaponList();
        for (let i = 0; i < this.GetWeapons().GetWeaponSets().length; i++) {
            vital.push(lu("Vital Part Weapon Set", i + 1, wlist[this.GetWeapons().GetWeaponSets()[i].GetWeaponSelected()].abrv));
        }
        if (this.GetLandingGear().IsVital()) {
            vital.push(lu("Vital Part Landing Gear"));
        }
        if (this.rotor.GetTailRotor()) {
            vital.push(lu("Vital Part Tail Rotor"));
        }
        return vital;
    }
    SetStorage(use) {
        this.use_storage = use;
    }
    Reset() {
        this.fromJSON(JSON.parse(this.reset_json), false);
    }
    GetVersion() {
        return this.version;
    }
    GetCommunicationName() {
        return this.accessories.GetCommunicationName();
    }
    GetAttackList() {
        return this.cockpits.GetAttackList();
    }
    GetVisibilityList() {
        return this.cockpits.GetVisibilityList();
    }
    GetStressList() {
        return this.cockpits.GetStressList();
    }
    GetEscapeList() {
        return this.cockpits.GetEscapeList();
    }
    GetCrashList() {
        return this.cockpits.GetCrashList();
    }
    GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }
    GetMinIAF() {
        return this.engines.GetMinIAF();
    }
    GetMaxIAF() {
        return this.engines.GetMaxIAF();
    }
    GetMinAltitude() {
        return this.engines.GetMinAltitude();
    }
    GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }
    GetGearName() {
        return this.gear.GetGearName();
    }
    GetIsFlammable() {
        return this.frames.GetIsFlammable() || this.wings.GetIsFlammable() || this.engines.GetIsFlammable();
    }
    GetAircraftType() {
        return this.aircraft_type;
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
    GetReinforcements() {
        return this.reinforcements;
    }
    GetFuel() {
        return this.fuel;
    }
    GetMunitions() {
        return this.munitions;
    }
    GetCargoAndPassengers() {
        return this.cargo;
    }
    GetLandingGear() {
        return this.gear;
    }
    GetAccessories() {
        return this.accessories;
    }
    GetOptimization() {
        return this.optimization;
    }
    GetStats() {
        return this.stats;
    }
    GetWeapons() {
        return this.weapons;
    }
    IsElectrics() {
        return this.engines.IsElectrics() || this.accessories.IsElectrics() || this.cockpits.IsElectrics();
    }
    GetUsed() {
        return this.used;
    }
    GetRotor() {
        return this.rotor;
    }
    GetAlter() {
        return this.alter;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        value = MergeElectrics(value, this.accessories.GetElectrics());
        value = MergeElectrics(value, this.wings.GetElectrics());
        value = MergeElectrics(value, this.cockpits.GetElectrics());
        value = MergeElectrics(value, this.alter.GetElectrics());
        value = MergeElectrics(value, this.cargo.GetElectrics());
        value = MergeElectrics(value, this.era.GetElectrics());
        value = MergeElectrics(value, this.frames.GetElectrics());
        value = MergeElectrics(value, this.fuel.GetElectrics());
        value = MergeElectrics(value, this.gear.GetElectrics());
        value = MergeElectrics(value, this.munitions.GetElectrics());
        value = MergeElectrics(value, this.optimization.GetElectrics());
        value = MergeElectrics(value, this.passengers.GetElectrics());
        value = MergeElectrics(value, this.reinforcements.GetElectrics());
        value = MergeElectrics(value, this.rotor.GetElectrics());
        value = MergeElectrics(value, this.stabilizers.GetElectrics());
        value = MergeElectrics(value, this.used.GetElectrics());
        value.equipment = value.equipment.sort((a, b) => {
            var ac = parseInt(a.charge);
            if (a.charge == "-")
                ac = 0;
            var bc = parseInt(b.charge);
            if (b.charge == "-")
                bc = 0;
            if (isNaN(ac) && isNaN(bc))
                return 0;
            if (isNaN(ac))
                return -1;
            if (isNaN(bc))
                return 1;
            return bc - ac;
        });
        value = MergeElectrics(this.engines.GetElectrics(), value);
        value = MergeElectrics(value, this.weapons.GetElectrics());
        var have_generation = false;
        //Add + symbols
        for (const eq of value.equipment) {
            const chg = parseInt(eq.charge);
            if (!isNaN(chg) && chg > 0) {
                eq.charge = "+" + eq.charge;
                have_generation = true;
            }
        }
        if (value.equipment.length > 0
            && value.storage <= 0
            && !have_generation
            && this.stats.warnings.findIndex((value) => { return value.source == lu("Insufficient Charge"); }) == -1) {
            this.stats.warnings.push({
                source: lu("Insufficient Charge"), warning: lu("Insufficient Charge Warning"),
                color: WARNING_COLOR.RED,
            });
        }
        return value;
    }
}
