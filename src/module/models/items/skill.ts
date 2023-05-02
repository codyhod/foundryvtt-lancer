import { EntryType } from "../../enums.js";
import type { SourceData } from "../../source-template.js";
import type { PackedSkillData } from "../../util/unpacking/packed-types.js";
import { LancerDataModel } from "../shared.js";
import type { UnpackContext } from "../shared.js";
import { template_universal_item } from "./shared.js";

const fields: any = foundry.data.fields;

// @ts-ignore
export class SkillModel extends LancerDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      detail: new fields.StringField(),
      family: new fields.StringField(),
      curr_rank: new fields.NumberField({ nullable: false, initial: 1, min: 1, max: 3 }),
      ...template_universal_item(),
    };
  }
}

// Converts an lcp bonus into our expected format
export function unpackSkill(
  data: PackedSkillData,
  context: UnpackContext
): {
  name: string;
  type: EntryType.SKILL;
  system: DeepPartial<SourceData.Skill>;
} {
  return {
    name: data.name,
    type: EntryType.SKILL,
    system: {
      lid: data.id,
      curr_rank: 1,
      description: data.description,
      detail: data.detail,
      family: data.family,
    },
  };
}