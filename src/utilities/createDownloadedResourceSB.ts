import moment from "moment";
import { v5 as uuidv5 } from "uuid";

import { environment } from "../data/environment";
import OBSburrito from "../data/OBSTemplate.json";
import languageCode from "../data/LanguageCode.json";
import type { AnyObject } from "../types";

const findCode = (list: AnyObject[], id: string) => {
  let code = "";
  list.forEach((obj) => {
    if (obj.name.toLowerCase() === id.toLowerCase()) {
      code = obj.lang_code;
    }
  });
  return code;
};

export const createDownloadedResourceSB = ({
  resourceMetadata,
  resource,
  username,
}: {
  username: string;
  resourceMetadata: AnyObject;
  resource: AnyObject;
}) => {
  try {
    const key = username + resource.name + resource.owner + moment().format();
    const id = uuidv5(key, environment.uuidToken);
    const json: {
      [key: string]: any;
    } = OBSburrito;

    json.meta.generator.userName = username;
    json.meta.generator.softwareName = "Scribe"; // TODO: replace software name
    json.meta.generator.softwareVersion = "0.0.1"; // TODO: get version from package.json
    json.meta.dateCreated = moment().format();
    json.idAuthorities = {
      dcs: {
        id: new URL(resource.url).hostname,
        name: {
          en: resource.owner,
        },
      },
    };
    json.identification.primary = {
      scribe: {
        [id]: {
          revision: "1",
          timestamp: moment().format(),
        },
      },
    };
    json.identification.upstream = {
      dcs: [
        {
          [`${resource.owner}:${resource.name}`]: {
            revision: resource.release.tag_name,
            timestamp: resource.released,
          },
        },
      ],
    };
    json.identification.name.en = resource.name;
    json.identification.abbreviation.en = "";

    if (resourceMetadata.dublin_core.language.identifier) {
      json.languages[0].tag = resourceMetadata.dublin_core.language.identifier;
    } else if (resourceMetadata.dublin_core.language.title) {
      const code = findCode(languageCode, resourceMetadata.dublin_core.language.title);
      if (code) {
        json.languages[0].tag = code;
      } else {
        json.languages[0].tag = resourceMetadata.dublin_core.language.title.substring(0, 3);
      }
    }
    json.languages[0].name.en = resource.language_title;

    json.copyright.shortStatements = [
      {
        statement: resourceMetadata?.dublin_core?.rights,
      },
    ];
    json.copyright.licenses[0].ingredient = "LICENSE.md";

    return json;
  } catch (err) {
    throw new Error(`Generate Burrito Failed :  ${err}`);
  }
};
