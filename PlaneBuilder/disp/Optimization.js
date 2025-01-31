import { lu } from "../impl/Localization.js";
import { insertRow, CreateTH, BlinkIfChanged } from "./Tools.js";
import { Display } from "./Display.js";
export class Optimization_HTML extends Display {
    constructor(opt) {
        super();
        this.opt = opt;
        document.getElementById("lbl_optimization").textContent = lu("Optimization Section Title");
        document.getElementById("lbl_num_opt").textContent = lu("Optimization Num Free Optimizations");
        this.free_inp = document.getElementById("num_opt");
        this.free_inp.onchange = () => { this.opt.SetFreeDots(this.free_inp.valueAsNumber); };
        var tbl = document.getElementById("tbl_optimization");
        var fragment = document.createDocumentFragment();
        var row0 = insertRow(fragment);
        CreateTH(row0, lu("Optimization Negative"));
        CreateTH(row0, lu("Optimization Effect"));
        CreateTH(row0, lu("Optimization Positive"));
        CreateTH(row0, lu("Optimization Optimization Stats"));
        // <th>Negative < /th>
        // < th > Effect < /th>
        // < th > Positive < /th>
        // < th > Optimization Stats < /th>
        var row1 = insertRow(fragment);
        this.cost_cbx = this.InitRow(row1, lu("Optimization Cost"), (num) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(insertRow(fragment), lu("Optimization Lift Bleed"), (num) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(insertRow(fragment), lu("Optimization Leg Room"), (num) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(insertRow(fragment), lu("Optimization Mass"), (num) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(insertRow(fragment), lu("Optimization Toughness"), (num) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(insertRow(fragment), lu("Optimization Max Strain"), (num) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(insertRow(fragment), lu("Optimization Reliability"), (num) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(insertRow(fragment), lu("Optimization Drag"), (num) => this.opt.SetDrag(num));
        this.InitStatDisplay(row1.insertCell());
        tbl.appendChild(fragment);
    }
    InitRow(row, txt, call) {
        var cbxs = [];
        for (let i = 0; i < 6; i++) {
            cbxs.push(document.createElement("INPUT"));
            cbxs[i].setAttribute("type", "checkbox");
            if (i < 3)
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 3);
                    else
                        call(i - 2);
                };
            else
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 2);
                    else
                        call(i - 3);
                };
        }
        var ncell = row.insertCell();
        var ecell = row.insertCell();
        var pcell = row.insertCell();
        ncell.appendChild(cbxs[0]);
        ncell.appendChild(cbxs[1]);
        ncell.appendChild(cbxs[2]);
        ecell.textContent = txt;
        pcell.appendChild(cbxs[3]);
        pcell.appendChild(cbxs[4]);
        pcell.appendChild(cbxs[5]);
        return cbxs;
    }
    InitStatDisplay(stat_cell) {
        stat_cell.rowSpan = 0;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Cost"));
        CreateTH(h1_row, lu("Stat Lift Bleed"));
        CreateTH(h1_row, lu("Stat Escape"));
        var c1_row = tbl_stat.insertRow();
        this.d_cost = c1_row.insertCell();
        this.d_lift = c1_row.insertCell();
        this.d_escp = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Visibility"));
        CreateTH(h2_row, lu("Stat Mass"));
        CreateTH(h2_row, lu("Stat Toughness"));
        var c2_row = tbl_stat.insertRow();
        this.d_visi = c2_row.insertCell();
        this.d_mass = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Max Strain"));
        CreateTH(h3_row, lu("Stat Reliability"));
        CreateTH(h3_row, lu("Stat Drag"));
        var c3_row = tbl_stat.insertRow();
        this.d_mstr = c3_row.insertCell();
        this.d_reli = c3_row.insertCell();
        this.d_drag = c3_row.insertCell();
    }
    UpdateChecked(num, lst) {
        for (let i = 0; i < lst.length; i++)
            lst[i].checked = false;
        if (num < 0) {
            lst[2].checked = true;
            if (num < -1) {
                lst[1].checked = true;
                if (num < -2)
                    lst[0].checked = true;
            }
        }
        else if (num > 0) {
            lst[3].checked = true;
            if (num > 1) {
                lst[4].checked = true;
                if (num > 2)
                    lst[5].checked = true;
            }
        }
    }
    UpdateEnabled(num, lst) {
        var free = 0;
        for (let i = 3; i < lst.length; i++) {
            if (!lst[i].checked)
                free++;
            lst[i].disabled = free > num;
        }
    }
    UpdateDisplay() {
        this.free_inp.valueAsNumber = this.opt.GetFreeDots();
        //Update Checked
        this.UpdateChecked(this.opt.GetCost(), this.cost_cbx);
        this.UpdateChecked(this.opt.GetBleed(), this.bleed_cbx);
        this.UpdateChecked(this.opt.GetEscape(), this.escape_cbx);
        this.UpdateChecked(this.opt.GetMass(), this.mass_cbx);
        this.UpdateChecked(this.opt.GetToughness(), this.toughness_cbx);
        this.UpdateChecked(this.opt.GetMaxStrain(), this.maxstrain_cbx);
        this.UpdateChecked(this.opt.GetReliabiilty(), this.reliability_cbx);
        this.UpdateChecked(this.opt.GetDrag(), this.drag_cbx);
        //Update Enabled
        var can_dot = this.opt.GetUnassignedCount();
        this.UpdateEnabled(can_dot, this.cost_cbx);
        this.UpdateEnabled(can_dot, this.bleed_cbx);
        this.UpdateEnabled(can_dot, this.escape_cbx);
        this.UpdateEnabled(can_dot, this.mass_cbx);
        this.UpdateEnabled(can_dot, this.toughness_cbx);
        this.UpdateEnabled(can_dot, this.maxstrain_cbx);
        this.UpdateEnabled(can_dot, this.reliability_cbx);
        this.UpdateEnabled(can_dot, this.drag_cbx);
        //Update Stats
        var stats = this.opt.PartStats();
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_escp, stats.escape.toString(), true);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_mstr, this.opt.final_ms.toString(), true);
        BlinkIfChanged(this.d_reli, stats.reliability.toString(), true);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
    }
}
