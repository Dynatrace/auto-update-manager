export type UpdateMode = "AUTOMATIC"|"AUTOMATIC_DURING_MW"|"MANUAL";
export type Macro = {
  name: string;
  filter: string;
  updateMode: UpdateMode;
  desiredVersion: string;
  desiredWindow: string;
  scope: "hostgroup"|"host";
};

export type SchemaType = "builtin:deployment.oneagent.updates" | "builtin:deployment.management.update-windows";
export type SelectorType = "environment" | "hostgroup" | "host";

export interface MaintenanceWindow {
  maintenanceWindow: string;
}

export type HostGroup = {
  id: string;
  name: string;
}

export type Host = {
  id: string;
  name: string;
}
