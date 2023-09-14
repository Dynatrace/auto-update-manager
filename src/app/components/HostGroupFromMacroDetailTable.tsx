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
import { HostGroupLink } from "./HostGroupLink";
import { HostGroup, Macro } from "src/app/types/Types";
import { useHostGroupFromMacro } from "src/app/hooks/useHostGroupFromMacro";
import { testMaintenanceWindows } from "src/app/utils/helperFunctions";
import { displayVersionFromSettings } from "src/app/utils/helperFunctions";

interface HostGroupFromMacroDetailTableProps {
  /** display these hosts groups with matching to settings, else just from settings */
  macro: Macro;
}

export const HostGroupFromMacroDetailTable = ({ macro }: HostGroupFromMacroDetailTableProps) => {
  const hostGroupsFromSettingsResult = useSettingsReader("builtin:deployment.oneagent.updates", "hostgroup");
  const hostgroupsFromMacroResult = useHostGroupFromMacro(macro);

  function lookupSettings(row, value?: string) {
    const hg: HostGroup = row.original;
    const match = hostGroupsFromSettingsResult?.data?.find((so) => so.scope == hg.id);
    if (value) return match?.value[value];
    else return match;
  }

  if (hostgroupsFromMacroResult.isError)
    return <Indicator state="critical">{(hostgroupsFromMacroResult.error || "").toString()}</Indicator>;

  if (hostGroupsFromSettingsResult.isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  if (hostGroupsFromSettingsResult.isLoading || hostgroupsFromMacroResult.isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }

  const cols: TableColumn[] = useMemo(
    () => [
      {
        header: "Hostgroup",
        id: "hostgroup",
        cell: ({ row }) => <HostGroupLink hostgroup={row.original} />,
        autoWidth: true,
        minWidth: 150,
      },
      {
        header: "Update Mode",
        id: "updateMode",
        cell: ({ row }) => {
          const updateMode = lookupSettings(row, "updateMode");
          if (updateMode == "MANUAL") return <Indicator state="critical">{updateMode}</Indicator>;
          else if (updateMode == macro.updateMode) return <>{updateMode}</>;
          else return <Indicator state="warning">{updateMode}</Indicator>;
        },
      },
      {
        header: "Target Version",
        id: "displayVersion",
        cell: ({ row }) => {
          const settings = lookupSettings(row);
          const displayVersion = displayVersionFromSettings(settings);
          if (displayVersion == macro.desiredVersion) return <>{displayVersion}</>;
          else return <Indicator state="warning">{displayVersion}</Indicator>;
        },
      },
      {
        accessor: "value.maintenanceWindows",
        header: "Update Windows",
        cell: ({ row }) => {
          const maintenanceWindows = lookupSettings(row, "maintenanceWindows");
          if (testMaintenanceWindows(maintenanceWindows, macro.desiredWindow))
            return <MaintenanceWindowCell windows={maintenanceWindows} />;
          else {
            return (
              <Indicator state="warning">
                <MaintenanceWindowCell windows={maintenanceWindows} />
              </Indicator>
            );
          }
        },
      },
    ],
    []
  );
  const hgWithSettings = hostgroupsFromMacroResult.data.filter(
    (hg) => hostGroupsFromSettingsResult?.data?.find((so) => so.scope == hg.id) != undefined
  );
  const hgWithoutSettings = hostgroupsFromMacroResult.data.filter(
    (hg) => hostGroupsFromSettingsResult?.data?.find((so) => so.scope == hg.id) == undefined
  );
  return (
    <Flex flexDirection="column">
      <DataTable columns={cols} data={hgWithSettings} fullWidth>
        <DataTable.Pagination defaultPageSize={10} />
      </DataTable>
      {hgWithoutSettings?.length > 0 && (
        <div>
          <Text>{hgWithoutSettings?.length || "?"} Host Groups using environment defaults:</Text>
          <ExpandableText>
            <List>
              {hgWithoutSettings?.map((hg) => (
                <HostGroupLink hostgroup={hg} key={hg.id} />
              ))}
            </List>
          </ExpandableText>
        </div>
      )}
    </Flex>
  );
};
