const util = require('util');

const penalize = (player, attr, callback) => {
  const factor = player.getAttribute(attr) / item.getPrerequisite(attr);
  callback(factor);
}

const getPenaltyDesc = (item, location, status) => status + '_by_' + item.getShortDesc() + '_' + location;

const useDefaultPenalties = (item, player, location, missedPrerequisites) => {

  missedPrerequisites.forEach(prereq => {

    switch (prereq) {

      case 'stamina':
        return penalize(player, 'stamina', factor => {
          const name = getPenaltyDesc(item, location, 'encumbered');
          player.warn('You are not strong enough to wear this properly.');

          player.addEffect(name , Effects.encumbered({ player, factor }));
          player.combat.addSpeedMod({ name, effect: speed => speed * factor });
        });

      case 'quickness':
        return penalize(player, 'quickness', factor => {
          const name = getPenaltyDesc(item, location, 'slowed');

          player.warn('You are not quick enough to move about deftly while wearing ' + item.getShortDesc() + '.');
          player.combat.addDodgeMod({ name, effect: dodge => dodge * factor });
        });

      case 'cleverness':
        return penalize(player, 'cleverness', factor => {
          const name = getPenaltyDesc(item, location, 'confused');

          player.warn('You are not sure how to handle this piece of gear...');
          player.combat.addToHitMod({ name, effect: toHit => toHit * factor });
        });

      case 'willpower':
        return penalize(player, 'willpower', factor => {
          const name = getPenaltyDesc(item, location, 'distracted');
          
          player.say('You find yourself easily distracted as you don the ' + item.getShortDesc());
          player.combat.addDefenseMod({ name, effect: defense => defense * factor });
        });

      default:
        player.say('You have some trouble putting that on...');
        util.log('ITEM ' + item.getShortDesc() + ' has unsupported prerequisites.');
    }
  });
};

const checkForCrit = (attacker, defender, damageDealt) => {
  var defenderHealth = defender.getAttribute('health');
  var defenderMaxHealth = defender.getAttribute('max_health');


  //TODO: Improve... if the damage is over the weapon's normal max damage it should be considered a crit...
  var massiveDamage = damageDealt > defenderMaxHealth * .5;
  var almostDead = defenderHealth <= defenderMaxHealth * .2;
  var coupDeGrace = almostDead && damageDealt >= defenderHealth;

  if (massiveDamage || coupDeGrace) {
    //TODO: Add some kind of bonus.
    attacker.say('<bold><cyan>You have dealt a critical blow!</cyan></bold>');
  }
}

exports.ItemUtil = { penalize, getPenaltyDesc, useDefaultPenalties, checkForCrit };
