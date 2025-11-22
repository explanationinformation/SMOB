import { system, world } from "@minecraft/server";

system.run(() => {
    world.getDimension("overworld").runCommand("say Hello world!"); 
});

