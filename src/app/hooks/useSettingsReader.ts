import { useQuery } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { settingsObjectsClient, SettingsObject } from "@dynatrace-sdk/client-classic-environment-v2";
import { SchemaType, SelectorType } from "../types/Types";

const FIELDS = "origin,value,objectId,scope,created,modified,schemaId,summary,externalId,updateToken";

async function fetcher(schema: SchemaType) {
  let items: SettingsObject[] = [];
  let res = await settingsObjectsClient.getSettingsObjects({
    schemaIds: schema,
    fields: FIELDS,
  });
  items = items.concat(res.items);
  while (res.nextPageKey != undefined) {
    res = await settingsObjectsClient.getSettingsObjects({
      nextPageKey: res.nextPageKey,
    });
    items = items.concat(res.items);
  }
  return items;
}

export function useSettingsReader(schema: SchemaType, selector?: SelectorType) {
  const meta: Meta = {
    errorTitle: "Failed to read settings",
  };

  function selectorFn(objs: SettingsObject[]): SettingsObject[] {
    switch (selector) {
      case "environment":
        return objs.filter((o) => o.scope == "environment");
      case "hostgroup":
        return objs.filter((o) => o.scope?.startsWith("HOST_GROUP-"));
      case "host":
        return objs.filter((o) => o.scope?.startsWith("HOST-"));
      default:
        return objs;
    }
  }

  return useQuery({
    queryFn: () => fetcher(schema),
    queryKey: ["auto-update-settings", schema],
    meta,
    select: selectorFn,
  });
}
