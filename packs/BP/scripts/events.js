import { world } from "@minecraft/server";
import { openCreatureForm } from "./ui_form.js";

export function registerEvents() {
  world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack?.typeId !== "minecraft:book") return;
    openCreatureForm(event.source);
  });
}