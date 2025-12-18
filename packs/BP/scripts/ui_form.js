import { ActionFormData, MessageFormData } from "@minecraft/server-ui";

// SMOB creatures
const creatures = [
  { id: "smob:ankle_biter", name: "Ankle Biter", desc: "Tiny but mischievous!" },
  { id: "smob:chomper", name: "Chomper", desc: "Bites anything nearby!" }
];

const playerSettings = new Map();

// ---------------- Main Menu ----------------
export function openCreatureForm(player) {
  const form = new ActionFormData()
    .title("Creature Guide")
    .body(
      "SMOB is a fun little Minecraft Bedrock addon with Mario-inspired mobs and behaviors.\n\nSelect an option below:"
    ) 
    .button("Creature List")
    .button("Settings");

  form.show(player).then(res => {
    if (res.canceled) return;

    if (res.selection === 0) openCreatureList(player);
    else if (res.selection === 1) openSettingsMenu(player);
  });
}

// ---------------- Creature List ----------------
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
    else if (res.selection === 1) showCreatureDetails(player, creatures[1]);
    else if (res.selection === 2) openCreatureForm(player); 
  });
}

function showCreatureDetails(player, creature) {
  const form = new MessageFormData()
    .title(creature.name)
    .body(`§e${creature.desc}`) 
    .button1("Back")
    .button2("Close");

  form.show(player).then(res => {
    if (!res) return;
    if (res.selection === 0) openCreatureList(player); 
  });

  player.playSound("entity.item.pickup"); // sound for viewing creature
}

// ---------------- Settings ----------------
function openSettingsMenu(player) {
  // Initialize player settings if not set
  if (!playerSettings.has(player.id)) {
    playerSettings.set(player.id, { sounds: true });
  }

  const form = new ActionFormData()
    .title("Settings")
    .body("Configure SMOB options")
    .button("About")
    .button("Toggle Sounds")
    .button("Back");

  form.show(player).then(res => {
    if (!res) return;

    switch (res.selection) {
      case 0:
        openAboutPage(player);
        break;
      case 1:
        toggleSounds(player);
        break;
      case 2:
        openCreatureForm(player); 
        break;
    }
  });
}

function openAboutPage(player) {
  const form = new MessageFormData()
    .title("About SMOB")
    .body(
      "SMOB is a fun little Minecraft Bedrock addon built around Super Mario–inspired mobs and behaviors."
    )
    .button1("Back")
    .button2("Close");

  form.show(player).then(res => {
    if (!res) return;
    if (res.selection === 0) openSettingsMenu(player); 
  });

  player.playSound("entity.player.levelup"); // optional sound
}

function toggleSounds(player) {
  const settings = playerSettings.get(player.id);
  settings.sounds = !settings.sounds;

  player.sendMessage(
    settings.sounds ? "§aSounds enabled!" : "§cSounds disabled!"
  );

  player.playSound("ui.button.click"); 
  openSettingsMenu(player); 
}