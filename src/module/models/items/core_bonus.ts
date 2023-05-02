import { EntryType } from "../../enums.js";
import type { SourceData } from "../../source-template.js";
import type { PackedCoreBonusData } from "../../util/unpacking/packed-types.js";
import { unpackDeployable } from "../actors/deployable.js";
import { unpackAction } from "../bits/action.js";
import { unpackBonus } from "../bits/bonus.js";
import { unpackCounter } from "../bits/counter.js";
import { unpackSynergy } from "../bits/synergy.js";
import { LancerDataModel } from "../shared.js";
import type { UnpackContext } from "../shared.js";
import { template_universal_item, template_bascdt } from "./shared.js";

const fields: any = foundry.data.fields;

// @ts-ignore
export class CoreBonusModel extends LancerDataModel {
  static defineSchema() {
    return {
      description: new fields.StringField({ nullable: true }),
      effect: new fields.StringField(),
      mounted_effect: new fields.StringField(),
      manufacturer: new fields.StringField(),
      ...template_universal_item(),
      ...template_bascdt(),
    };
  }
}

export function unpackCoreBonus(
  data: PackedCoreBonusData,
  context: UnpackContext
): {
  name: string;
  type: EntryType.CORE_BONUS;
  system: DeepPartial<SourceData.CoreBonus>;
} {
  return {
    name: data.name,
    type: EntryType.CORE_BONUS,
    system: {
      actions: data.actions?.map(unpackAction) ?? [],
      bonuses: data.bonuses?.map(unpackBonus) ?? [],
      counters: data.counters?.map(unpackCounter) ?? [],
      deployables: data.deployables?.map(d => unpackDeployable(d, context)) ?? [],
      description: data.description,
      effect: data.effect,
      integrated: data.integrated,
      lid: data.id,
      manufacturer: data.source,
      mounted_effect: data.mounted_effect,
      synergies: data.synergies?.map(unpackSynergy),
      tags: [],
    },
  };
}