import { ActionFormData } from "@minecraft/server-ui";

export function openCreatureForm(player) {
  const form = new ActionFormData()
    .title("Creature Guide")
    .body("Choose a creature")
    .button("Ankle Biter")
    .button("Chomper");

  form.show(player).then((res) => {
    if (res.canceled) return;
    player.sendMessage(`Selected ${res.selection}`);
  });
}