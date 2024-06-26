import React, { useMemo } from "react";
import {
  DataTable,
  ProgressCircle,
  TableColumn,
  Flex,
  Text,
  ExpandableText,
  List,
} from "@dynatrace/strato-components-preview";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { Indicator } from "./Indicator";
import { MaintenanceWindowCell } from "./MaintenanceWindowCell";
import { HostLink } from "./HostLink";
import { Host, Macro } from "src/app/types/Types";
import { useHostFromMacro } from "src/app/hooks/useHostFromMacro";
import { testMaintenanceWindows } from "src/app/utils/helperFunctions";
import { displayVersionFromSettings } from "src/app/utils/helperFunctions";

interface HostFromMacroDetailTableProps {
  /** display these hosts groups with matching to settings, else just from settings */
  macro: Macro;
}

export const HostFromMacroDetailTable = ({ macro }: HostFromMacroDetailTableProps) => {
  const hostsFromSettingsResult = useSettingsReader("builtin:deployment.oneagent.updates", "host");
  const hostsFromMacroResult = useHostFromMacro(macro);

  function lookupSettings(row, value?: string) {
    const host: Host = row.original;
    const match = hostsFromSettingsResult?.data?.find((so) => so.scope == host.id);
    if (value) return match?.value?.[value];
    else return match;
  }

  const cols: TableColumn[] = useMemo(
    () => [
      {
        header: "Host",
        id: "host",
        cell: ({ row }) => <HostLink hostid={row.original.id} />,
        //Note: custom styling cannot be removed, otherwise table is unreadable
        autoWidth: true,
        minWidth: 150,
      },
      {
        header: "Update Mode",
        id: "updateMode",
        autoWidth: true,
        cell: ({ row }) => {
          const updateMode = lookupSettings(row, "updateMode");
          if (updateMode === "MANUAL") return <Indicator state="critical">{updateMode}</Indicator>;
          if (updateMode === macro.updateMode) return <>{updateMode}</>;
          return <Indicator state="warning">{updateMode}</Indicator>;
        },
      },
      {
        header: "Target Version",
        id: "displayVersion",
        autoWidth: true,
        cell: ({ row }) => {
          const settings = lookupSettings(row);
          const displayVersion = displayVersionFromSettings(settings);
          if (displayVersion === macro.desiredVersion) return <>{displayVersion}</>;
          return <Indicator state="warning">{displayVersion}</Indicator>;
        },
      },
      {
        accessor: "value.maintenanceWindows",
        header: "Update Windows",
        autoWidth: true,
        cell: ({ row }) => {
          const maintenanceWindows = lookupSettings(row, "maintenanceWindows");
          if (testMaintenanceWindows(maintenanceWindows, macro.desiredWindow))
            return <MaintenanceWindowCell windows={maintenanceWindows} />;
          return (
            <Indicator state="warning">
              <MaintenanceWindowCell windows={maintenanceWindows} />
            </Indicator>
          );
        },
      },
    ],
    []
  );

  if (hostsFromMacroResult.isError)
    return <Indicator state="critical">{(hostsFromMacroResult.error || "").toString()}</Indicator>;

  if (hostsFromSettingsResult.isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  if (hostsFromSettingsResult.isLoading || hostsFromMacroResult.isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }

  const hostWithSettings = hostsFromMacroResult.data.filter(
    (host) => hostsFromSettingsResult?.data?.find((so) => so.scope == host.id) != undefined
  );
  const hostWithoutSettings = hostsFromMacroResult.data.filter(
    (host) => hostsFromSettingsResult?.data?.find((so) => so.scope == host.id) == undefined
  );

  return (
    <Flex flexDirection="column">
      <DataTable columns={cols} data={hostWithSettings} fullWidth>
        <DataTable.Pagination defaultPageSize={10} />
      </DataTable>
      {hostWithoutSettings?.length > 0 && (
        <div>
          <Text>{hostWithoutSettings?.length || "?"} Hosts using environment defaults:</Text>
          <ExpandableText>
            <List>
              {hostWithoutSettings?.map((host) => (
                <HostLink hostid={host.id} key={host.id} />
              ))}
            </List>
          </ExpandableText>
        </div>
      )}
    </Flex>
  );
};
