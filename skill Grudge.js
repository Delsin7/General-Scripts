/*//=========Grudge Skill by Delsin7=====================================================================
//
//Passive Action _getSurvivalValue function pointer info from 1-239's Notkill plugin, everything else done by Delsin7.
//
//Grudge is a type of limited Survival skill-
//Upon receiving lethal damage, if the user can counter it sets HP to 1 so can counter attack, however the unit dies at end of battle.
//It also increases damage dealt by 25%. To use a custom damage percent, add the custom param  grudgeDamage: n   ,where n is any whole number.
//An n of 100 is 100% extra damage. If you set n to 0, there will be no bonus damage.
//
//
//Use custom keyword 'Grudge' on a custom type skill to set up.
//
*///=====================================================================================================

(function() {

var alias1grudge = SkillRandomizer.isCustomSkillInvokedInternal;
SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
	if (keyword === 'Grudge') {
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	
	return alias1grudge.call(this, active, passive, skill, keyword);
};

var alias2grudge = AttackEvaluator.PassiveAction._getSurvivalValue;
AttackEvaluator.PassiveAction._getSurvivalValue = function(virtualActive, virtualPassive, attackEntry) {

	var key = alias2grudge.call(this, virtualActive, virtualPassive, attackEntry);
	var active = virtualActive.unitSelf;
	var passive = virtualPassive.unitSelf;
	aCount = virtualPassive.roundCount;

	if(aCount > 0){//Ensure user can counter before activating skill check, since dies at end, don't need to activate if can't counter anyway
		skill = SkillControl.checkAndPushCustomSkill(passive, active, attackEntry, false, 'Grudge');
	
		if (skill !== null) {
			virtualPassive.unitSelf.custom.grudge = true;
			return skill.getSkillValue();
		}
	}
	return key;
};

var alias2090grudge = AttackEvaluator.HitCritical.calculateDamage;
AttackEvaluator.HitCritical.calculateDamage = function(virtualActive, virtualPassive, entry) {
	var damage = alias2090grudge.call(this, virtualActive, virtualPassive, entry);
	var active = virtualActive.unitSelf;
	var passive = virtualPassive.unitSelf;
	//root.log(active.getName());
	if(active.custom.grudge){
		skill = SkillControl.getPossessionCustomSkill(active,'Grudge');
		if(skill && skill.custom.grudgeDamage){
			n = 1 + (skill.custom.grudgeDamage * 0.01);
			damage = Math.round(damage * n);
		}else{
			damage = Math.round(damage * 1.25);
		}

	}
	return damage;
};

var alias2091grudge = RealBattle.endBattle;
RealBattle.endBattle = function() {
	
	var battlerActive = this.getActiveBattler();
	var battlerPassive = this.getPassiveBattler();

	if(battlerActive.getUnit().custom.grudge){
		delete battlerActive.getUnit().custom.grudge;
		DamageControl.setDeathState(battlerActive.getUnit());
	}
	if(battlerPassive.getUnit().custom.grudge){
		delete battlerPassive.getUnit().custom.grudge;
		DamageControl.setDeathState(battlerPassive.getUnit());
	}

	alias2091grudge.call(this);
};

var alias2092grudge = EasyBattle.endBattle;
EasyBattle.endBattle = function() {
	
	var battlerActive = this.getActiveBattler();
	var battlerPassive = this.getPassiveBattler();
	if(battlerActive.getUnit().custom.grudge){
		delete battlerActive.getUnit().custom.grudge;
		DamageControl.setDeathState(battlerActive.getUnit());
	}
	if(battlerPassive.getUnit().custom.grudge){
		delete battlerPassive.getUnit().custom.grudge;
		DamageControl.setDeathState(battlerPassive.getUnit());
	}
	alias2092grudge.call(this);
};

})();
