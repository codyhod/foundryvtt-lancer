import { LancerActor } from "../actor/lancer-actor";
import { LancerItem } from "../item/lancer-item";
import { encodeMacroData } from "../macros";

/**
 *
 * @param compendiumActor The document you want to import
 * @param forPilot Who the import is for
 */
export async function requestImport(compendiumActor: LancerActor, forPilot: LancerActor) {
  if (game.user?.isGM) {
    // Do it ourselves
    return fulfillImportActor(compendiumActor, forPilot);
  }

  let macroData = encodeMacroData({
    fn: "importActor",
    args: [compendiumActor.uuid, forPilot.uuid],
    title: `Import ${LancerActor.name}`,
  });

  let content = `<button class="self-destruct" data-macro="${macroData}">
                        IMPORT ${compendiumActor.name} FOR ${LancerActor.name}?
                    </button>`;

  ChatMessage.create({
    blind: true,
    whisper: game.users?.filter(u => u.isGM).map(u => u.id),
    content,
  });
}

/** Brings an actor from compendium into the world.
 * If for a pilot, gives its name an appropriate prefix (Callsign) and putting it in that pilots folder
 * If for a mech, reroutes to the mechs pilot
 * If for an npc, just imports to same folder, nothing fancy
 *
 * @param compDeployable The actor (or actor UUID) to import
 * @param forActor The actor (or actor UUID) to associate the new deployable with
 */
export async function fulfillImportActor(compDeployable: string | LancerActor, forActor: string | LancerActor) {
  compDeployable = await LancerActor.fromUuid(compDeployable);
  forActor = await LancerActor.fromUuid(forActor);

  // Redirect mech to pilot
  if (forActor.is_mech() && forActor.system.pilot?.status == "resolved") {
    forActor = forActor.system.pilot.value;
  }

  // If pilot, get callsign
  let ownerName = forActor.name;
  if (forActor.is_pilot()) {
    ownerName = forActor.system.callsign || forActor.name;
  }

  let newName = `${compDeployable.name} [${ownerName}]`;
  return LancerActor.create({
    ...compDeployable.toObject(),
    "system.owner": forActor.uuid,
    name: newName,
    folder: forActor.folder?.id,
  });
}