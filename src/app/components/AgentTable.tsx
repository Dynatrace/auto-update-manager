import React, { useEffect, useMemo, useState } from "react";
import {
  ProgressCircle,
  DataTable,
  Flex,
  FilterBar,
  Select,
  TextInput,
  FilterItemValues,
  SelectOption,
  TableColumn,
  SelectedKeys,
} from "@dynatrace/strato-components-preview";
import { useOneAgentOnAHost } from "src/app/hooks/useOneAgentOnAHost";
import { Indicator } from "./Indicator";
import { HostAgentInfo, HostAgentInfoUpdateStatus } from "@dynatrace-sdk/client-classic-environment-v1";
import { agentVersionToString } from "src/app/utils/helperFunctions";
import { useOutdatedAgents } from "src/app/hooks/useOutdatedAgents";

const SafetyCell = ({ value }) => {
  const jsonval = useMemo(() => JSON.stringify(value), [value]);
  return <DataTable.Cell>{typeof value == "object" ? jsonval : value}</DataTable.Cell>;
};

const typeGuardSelectedKeys = (selectedKeys:SelectedKeys|null): "faulty" | "unsupported" | "older" | null => {
  const key = selectedKeys?.[0] ?? null;
  if(key === "faulty" || key === "unsupported" || key === "older")return key;
  else return null;
}

interface AgentTableProps {
  agentSpecialFilter: "faulty" | "unsupported" | "older" | null;
  setAgentSpecialFilter: React.Dispatch<React.SetStateAction<"faulty" | "unsupported" | "older" | null>>;
}
export const AgentTable = ({ agentSpecialFilter, setAgentSpecialFilter }: AgentTableProps) => {
  const agents = useOneAgentOnAHost({ includeDetails: false });
  const outdatedAgents = useOutdatedAgents();
  const [filteredData, setFilteredData] = useState<HostAgentInfo[]>([]);

  function filterData(filters?: FilterItemValues) {
    if (!Array.isArray(agents.data) || agents.data.length < 1) return;
    let tmpData = agents.data
      .filter((h) => h.updateStatus != undefined)
      .filter((h) => h.hostInfo?.agentVersion != undefined);

    //coming from prop change
    if (!outdatedAgents.isError && !outdatedAgents.isLoading) {
      switch (agentSpecialFilter) {
        case "faulty":
          tmpData = tmpData.filter((h) => outdatedAgents.faultyAgents.includes(h));
          break;
        case "unsupported":
          tmpData = tmpData.filter((h) => outdatedAgents.unsupported.includes(h));
          break;
        case "older":
          tmpData = tmpData.filter((h) => outdatedAgents.older.includes(h));
          break;
      }
    }

    if (filters)
      for (const f of Object.keys(filters)) {
        const val: unknown = filters[f].value;
        if (val == undefined) continue;
        const valStr: string = typeof val.toString == "function" ? val.toString() : "";
        switch (f) {
          case "name":
            tmpData = tmpData.filter((td) => td.hostInfo?.displayName?.includes(valStr));
            break;
          case "updateStatus":
            tmpData = tmpData.filter((td) => td.updateStatus == valStr);
            break;
          case "hostgroup":
            tmpData = tmpData.filter((td) => td.hostInfo?.hostGroup?.meId == valStr);
            break;
          case "osType":
            tmpData = tmpData.filter((td) => td.hostInfo?.osType == valStr);
            break;
          case "netZone":
            tmpData = tmpData.filter((td) => td.currentNetworkZoneId == valStr);
            break;
          case "specialFilter":
            //coming from filter change
            if (!outdatedAgents.isError && !outdatedAgents.isLoading) {
              switch (valStr) {
                case "faulty":
                  tmpData = tmpData.filter((h) => outdatedAgents.faultyAgents.includes(h));
                  break;
                case "unsupported":
                  tmpData = tmpData.filter((h) => outdatedAgents.unsupported.includes(h));
                  break;
                case "older":
                  tmpData = tmpData.filter((h) => outdatedAgents.older.includes(h));
                  break;
              }
            }
            break;
          default:
            console.log("filterData: not yet implmented", { f, filters });
        }
      }
    setFilteredData((prev) => {
      console.log("setFilteredDate:", { prev, tmpData, filters, agentSpecialFilter });
      return tmpData;
    });
  }

  useEffect(() => {
    if (agents.data) {
      filterData();
    } else setFilteredData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents.data, agentSpecialFilter]);

  const cols: TableColumn[] = useMemo(
    () => [
      { header: "Status", accessor: "updateStatus", cell: SafetyCell, ratioWidth: 1, minWidth: 160 },
      {
        header: "Version",
        accessor: "hostInfo.agentVersion",
        ratioWidth: 1,
        cell: ({ value }) => agentVersionToString(value),
      },
      { header: "Name", accessor: "hostInfo.displayName", ratioWidth: 2, cell: SafetyCell },
      { header: "Hostgroup", accessor: "hostInfo.hostGroup.name", ratioWidth: 1, cell: SafetyCell },
      { header: "OS", accessor: "hostInfo.osType", ratioWidth: 1, cell: SafetyCell },
      { header: "NetZone", accessor: "currentNetworkZoneId", ratioWidth: 1, cell: SafetyCell },
    ],
    []
  );

  if (agents.isError) return <Indicator state="critical">{(agents.error as object).toString()}</Indicator>;
  if (agents.isLoading) return <ProgressCircle size="small" aria-label="Loading..." />;

  const statuses: HostAgentInfoUpdateStatus[] = [
    ...new Set(
      agents.data.map((d) =>
        typeof d.updateStatus != "undefined" ? d.updateStatus : HostAgentInfoUpdateStatus.Unknown
      )
    ),
  ];
  const hostgroups = agents.data.map((d) => d.hostInfo?.hostGroup);
  const hostgroupIDs = [
    ...new Set(agents.data.map((d) => d.hostInfo?.hostGroup?.meId).filter((hgid) => typeof hgid != "undefined")),
  ];

  const osTypes = [...new Set(agents.data.map((d) => d.hostInfo?.osType))];
  const netZones = [
    ...new Set(agents.data.map((d) => d.currentNetworkZoneId).filter((nz) => typeof nz != "undefined")),
  ];

  return (
    <Flex flexDirection="column">
      <FilterBar onFilterChange={filterData}>
        <FilterBar.Item name="updateStatus" label="Status">
          <Select defaultSelectedId={[]} name="status" id="status-select" clearable>
            {statuses.map((status) => (
              <SelectOption key={status} id={status}>
                {status}
              </SelectOption>
            ))}
          </Select>
        </FilterBar.Item>
        <FilterBar.Item name="name" label="Name">
          <TextInput />
        </FilterBar.Item>
        <FilterBar.Item name="hostgroup" label="Hostgroup">
          <Select defaultSelectedId={[]} name="hostgroup" id="hostgroup-select" clearable>
            {hostgroupIDs.map((hgid) => (
              <SelectOption key={hgid} id={hgid || 0}>
                {(hostgroups.find((hg) => hg?.meId == hgid) || { name: "" }).name}
              </SelectOption>
            ))}
          </Select>
        </FilterBar.Item>
        <FilterBar.Item name="osType" label="OS">
          <Select defaultSelectedId={[]} name="osType" id="osType-select" clearable>
            {osTypes.map((os) => (
              <SelectOption key={os} id={os || 0}>
                {os}
              </SelectOption>
            ))}
          </Select>
        </FilterBar.Item>
        <FilterBar.Item name="netZone" label="NetworkZone">
          <Select defaultSelectedId={[]} name="netZone" id="netZone-select" clearable>
            {netZones.map((nz) => (
              <SelectOption key={nz} id={nz || 0}>
                {nz}
              </SelectOption>
            ))}
          </Select>
        </FilterBar.Item>
        <FilterBar.Item name="specialFilter" label="Version">
          <Select
            selectedId={agentSpecialFilter != null ? [agentSpecialFilter] : []}
            name="specialFilter"
            id="specialFilter-select"
            onChange={(selectedKeys) => setAgentSpecialFilter(typeGuardSelectedKeys(selectedKeys))}
            clearable
          >
            <SelectOption key="faulty" id="faulty">
              Faulty
            </SelectOption>
            <SelectOption key="unsupported" id="unsupported">
              Unsupported
            </SelectOption>
            <SelectOption key="older" id="older">
              Older
            </SelectOption>
          </Select>
        </FilterBar.Item>
      </FilterBar>
      <DataTable data={filteredData} columns={cols} sortable>
        <DataTable.Pagination defaultPageSize={10} />
      </DataTable>
    </Flex>
  );
};
