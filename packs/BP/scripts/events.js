import { world } from "@minecraft/server";
import { openMainMenu } from "./ui_form.js";  
export function registerEvents() {
  world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack?.typeId !== "minecraft:book") return;
    openMainMenu(event.source); 
  });
}