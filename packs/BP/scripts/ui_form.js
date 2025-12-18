import { ActionFormData, MessageFormData } from "@minecraft/server-ui";

// Example SMOB creatures with stats
const creatures = [
  { id: "exinfo:ankle_biter", name: "Ankle Biter", desc: "Tiny but mischievous!", health: 20, damage: 5 },
  { id: "exinfo:chomper", name: "Chomper", desc: "Bites anything nearby!", health: 50, damage: 10 }
];

// Player settings (per-player)
const playerSettings = new Map();

// The main menu function that will be called when the book is used
export function openMainMenu(player) {
  const form = new ActionFormData()
    .title("Creature Guide")
    .body(
      "SMOB is a fun Minecraft addon with Mario-inspired mobs and behaviors.\n\nSelect an option below:"
    )
    .button("Creature List")
    .button("Settings")
    .button("Battle Mode")
    .button("Set Favorite")
    .button("About"); // Move About to the last button

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === 0) openCreatureList(player);
    if (res.selection === 1) openSettingsMenu(player);
    if (res.selection === 2) openBattleMenu(player);
    if (res.selection === 3) openFavoriteMenu(player);
    if (res.selection === 4) openAboutPage(player);  // About is now the last button
  });
}

// Creature list function
function openCreatureList(player) {
  const form = new ActionFormData()
    .title("Creature List")
    .body("Choose a creature")
    .button("Ankle Biter")
    .button("Chomper")
    .button("Back");

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === 0) showCreatureDetails(player, creatures[0]);
    if (res.selection === 1) showCreatureDetails(player, creatures[1]);
    if (res.selection === 2) openMainMenu(player);  // Go back to main menu
  });
}

// Show details of a selected creature
function showCreatureDetails(player, creature) {
  const form = new MessageFormData()
    .title(creature.name)
    .body(`§e${creature.desc}\n\nHealth: §a${creature.health}\nDamage: §c${creature.damage}`)
    .button1("Summon Creature")
    .button2("Back");

  form.show(player).then(res => {
    if (res.selection === 0) spawnCreature(player, creature.id);
    if (res.selection === 1) openCreatureList(player);
  });

  player.playSound("entity.item.pickup");
}

// Summon the selected creature
function spawnCreature(player, creatureId) {
  const creature = player.dimension.spawnEntity(creatureId, player.location);
  player.sendMessage(`You summoned a ${creatureId} at your location!`);
  player.playSound("entity.creature.ambient");
}

// Settings menu
function openSettingsMenu(player) {
  if (!playerSettings.has(player.id)) {
    playerSettings.set(player.id, { sounds: true });
  }

  const form = new ActionFormData()
    .title("Settings")
    .body("Configure SMOB options")
    .button("Toggle Sounds")
    .button("Back");

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === 0) toggleSounds(player);
    if (res.selection === 1) openMainMenu(player);
  });
}

// Toggle sound settings
function toggleSounds(player) {
  const settings = playerSettings.get(player.id);
  settings.sounds = !settings.sounds;

  player.sendMessage(
    settings.sounds
      ? "§aSounds enabled!"
      : "§cSounds disabled!"
  );

  player.playSound("ui.button.click");
  openSettingsMenu(player);
}

// About page function
function openAboutPage(player) {
  const form = new MessageFormData()
    .title("About SMOB")
    .body(
      "Originally created for an Addon Jam, SMOB focuses on simple custom entities with personality.\n\nDeveloped by Exinfo!"
    )
    .button1("Back")
    .button2("Close");

  form.show(player).then(res => {
    if (!res) return;
    if (res.selection === 0) openMainMenu(player);
  });

  player.playSound("entity.player.levelup");
}

// Battle mode function
function openBattleMenu(player) {
  const form = new ActionFormData()
    .title("Creature Battle")
    .body("Choose two creatures to fight!")
    .button("Ankle Biter vs Chomper")
    .button("Back");

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === 0) startCreatureBattle(player, creatures[0], creatures[1]);
    if (res.selection === 1) openMainMenu(player);
  });
}

// Battle logic between two creatures
function startCreatureBattle(player, creature1, creature2) {
  let creature1Health = creature1.health;
  let creature2Health = creature2.health;
  let winner = "";

  // Simulate battle
  while (creature1Health > 0 && creature2Health > 0) {
    creature2Health -= creature1.damage;
    creature1Health -= creature2.damage;

    if (creature1Health <= 0) winner = creature2.name;
    if (creature2Health <= 0) winner = creature1.name;
  }

  // Display winner
  player.sendMessage(`${winner} wins the battle!`);
  player.playSound("entity.generic.explode");
}

// Favorite creature menu
function openFavoriteMenu(player) {
  const form = new ActionFormData()
    .title("Set Favorite Creature")
    .body("Select your favorite creature:")
    .button("Ankle Biter")
    .button("Chomper")
    .button("Back");

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === 0) setFavoriteCreature(player, "exinfo:ankle_biter");
    if (res.selection === 1) setFavoriteCreature(player, "exinfo:chomper");
    if (res.selection === 2) openMainMenu(player);
  });
}

// Set favorite creature for the player
function setFavoriteCreature(player, creatureId) {
  const settings = playerSettings.get(player.id);
  settings.favoriteCreature = creatureId;
  player.sendMessage(`§aYour favorite creature is now ${creatureId}!`);
  openMainMenu(player);
}