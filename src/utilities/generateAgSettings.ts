import { environment } from "../data/environment";
import type { AnyObject } from "../types";
import moment from "moment";

export const generateAgSettings = ({
  resourceBurrito,
  resourceMetadata,
}: {
  resourceBurrito: AnyObject;
  resourceMetadata: AnyObject;
}) => {
  console.log("resourceBurrito", resourceBurrito);
  const settings: Record<string, any> = {
    version: environment.AG_SETTING_VERSION,
    project: {
      [resourceBurrito.type.flavorType.flavor.name]: {
        scriptDirection: resourceMetadata?.dublin_core?.language?.direction,
        starred: false,
        description: resourceMetadata?.dublin_core?.description,
        copyright: resourceMetadata?.dublin_core?.rights,
        lastSeen: moment().format(),
        refResources: [],
        bookMarks: [],
        font: "",
      },
    },
    sync: { services: { door43: [] } },
  };
  return settings;
};
