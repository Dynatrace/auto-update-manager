import React, { useMemo } from "react";
import {
  ProgressCircle,
  InformationOverlay,
  SimpleTable,
  Button,
  Flex,
  Heading,
  SimpleTableColumn,
} from "@dynatrace/strato-components-preview";
import { Indicator } from "./Indicator";
import { useOutdatedAgents } from "../hooks/useOutdatedAgents";
import "./OutdatedAgents.module.css";

interface OutdatedAgentsProps {
  setAgentSpecialFilter: React.Dispatch<React.SetStateAction<"faulty" | "unsupported" | "older" | null>>;
}
export const OutdatedAgents = ({ setAgentSpecialFilter }: OutdatedAgentsProps) => {
  const { isError, isLoading, error, faultyAgents, unsupported, older } = useOutdatedAgents();

  if (isError) return <Indicator state="critical">{(error as object).toString()}</Indicator>;
  if (isLoading) return <ProgressCircle size="small" aria-label="Loading..." />;

  const tableData = [
    {
      info: (
        <InformationOverlay variant="critical">
          <InformationOverlay.Content>
            A "faulty version" is one that Dynatrace has determined to have introduced a bug and has since revoked this
            version. It is recommended that you update immediately!
          </InformationOverlay.Content>
        </InformationOverlay>
      ),
      name: "Faulty version:",
      detail: (faultyAgents.length > 0 && (
        <Button onClick={() => setAgentSpecialFilter("faulty")}>{faultyAgents.length}</Button>
      )) || <> 0</>,
    },
    {
      info: (
        <InformationOverlay variant="warning">
          <InformationOverlay.Content>
            These OneAgents are over 1 year old and no longer supported by Dynatrace. The ability to autoupdate from
            this version can no longer be guaranteed. It is recommended you update at the first available window, and if
            necessary reinstall a newer version.
          </InformationOverlay.Content>
        </InformationOverlay>
      ),
      name: "Unsupported:",
      detail: (unsupported.slice(0, 10).length > 0 && (
        <Button onClick={() => setAgentSpecialFilter("unsupported")}>{unsupported.length}</Button>
      )) || <> 0</>,
    },
    {
      info: (
        <InformationOverlay variant="primary">
          <InformationOverlay.Content>
            These OneAgents are over 6 months old. They are still supported, but updating soon is strongly recommended.
            You are currently missing out on new features, more supported technologies, and the latest bug fixes.
          </InformationOverlay.Content>
        </InformationOverlay>
      ),
      name: "Older:",
      detail: (older.length > 0 && <Button onClick={() => setAgentSpecialFilter("older")}>{older.length}</Button>) || (
        <> 0</>
      ),
    },
  ];
  const cols: SimpleTableColumn[] = useMemo(
    () => [
      { accessor: "info", header: " ", alignment: "right" },
      { accessor: "name", header: " " },
      { accessor: "detail", header: " ", alignment: "center" },
    ],
    []
  );

  return (
    <Flex flexDirection="column" className="outdated-agents">
      <Heading level={4}>Outdated OneAgents</Heading>
      <SimpleTable columns={cols} data={tableData} />
    </Flex>
  );
};
