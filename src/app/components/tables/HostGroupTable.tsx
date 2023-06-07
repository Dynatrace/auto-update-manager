import React from "react";
import { DataTable, LoadingIndicator, TableColumn } from "@dynatrace/strato-components-preview";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { Indicator } from "../Indicator";
import { MaintenanceWindowCell } from "./cells/MaintenanceWindowCell";
import { useDQLAllHostGroups } from "src/app/hooks/useDQLAllHostGroups";
import { HostGroupLink } from "../links/HostGroupLink";
import { HostGroup } from "src/app/types/Types";

export const HostGroupTable = () => {
  const { data, isError, isLoading } = useSettingsReader("builtin:deployment.oneagent.updates", "hostgroup");
  const allHostGroups = useDQLAllHostGroups();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  function getHostGroup(id: string) {
    const hg: HostGroup = allHostGroups.data?.find((r) => r.id == id) || { id: id, name: id };
    return hg;
  }

  const cols:TableColumn[] = [
    { accessor: "scope", header: "Scope", cell: ({ value }) => <HostGroupLink hostgroup={getHostGroup(value)} />, autoWidth: true },
    { accessor: "value.updateMode", header: "Update Mode",  },
    { accessor: "value.targetVersion", header: "Target Version", },
    {
      accessor: "value.maintenanceWindows",
      header: "Update Windows",
      cell: ({ value }) => <MaintenanceWindowCell windows={value} />,
    },
  ];

  return <DataTable columns={cols} data={data} />;
};
