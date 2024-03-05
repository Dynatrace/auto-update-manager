import React, { useMemo } from "react";
import { DataTable, ProgressCircle, TableColumn } from "@dynatrace/strato-components-preview";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { Indicator } from "./Indicator";
import { MaintenanceWindowCell } from "./MaintenanceWindowCell";
import { useDQLAllHostGroups } from "src/app/hooks/useDQLAllHostGroups";
import { HostGroupLink } from "./HostGroupLink";
import { HostGroup } from "src/app/types/Types";

export const HostGroupTable = () => {
  const { data, isError, isLoading } = useSettingsReader("builtin:deployment.oneagent.updates", "hostgroup");
  const allHostGroups = useDQLAllHostGroups();

  function getHostGroup(id: string) {
    const hg: HostGroup = allHostGroups.data?.find((r) => r.id == id) || { id: id, name: id };
    return hg;
  }

  const cols: TableColumn[] = useMemo(
    () => [
      {
        accessor: "scope",
        header: "Scope",
        cell: ({ value }) => <HostGroupLink hostgroup={getHostGroup(value)} />,
        autoWidth: true,
      },
      { accessor: "value.updateMode", header: "Update Mode", autoWidth: true },
      { accessor: "value.targetVersion", header: "Target Version", autoWidth: true },
      {
        accessor: "value.maintenanceWindows",
        header: "Update Windows",
        autoWidth: true,
        cell: ({ value }) => <MaintenanceWindowCell windows={value} />,
      },
    ],
    []
  );

  if (isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }

  if (isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  return (
    <DataTable columns={cols} data={data} fullWidth>
      <DataTable.Pagination defaultPageSize={10} />
    </DataTable>
  );
};
