import React, { useState } from "react";
import { Flex, Surface, Text, TitleBar } from "@dynatrace/strato-components-preview";
import { UpdateStatusChart } from "../components/UpdateStatusChart";
import { AgentTable } from "../components/AgentTable";
import { OutdatedAgents } from "../components/OutdatedAgents";
import { OneAgentIcon } from "../components/OneAgentIcon";

export const OneAgentStatus = () => {
  const [agentSpecialFilter, setAgentSpecialFilter] = useState<"faulty" | "unsupported" | "older" | null>(null);

  return (
    <Flex flexDirection="column">
      <Surface>
        <TitleBar>
          <TitleBar.Prefix>
            <OneAgentIcon />
          </TitleBar.Prefix>
          <TitleBar.Title>OneAgent status</TitleBar.Title>
        </TitleBar>
        <Flex flexDirection="column">
          <Text>Detailed version and autoupdate status information for OneAgents</Text>
          <Flex flexDirection="row" gap={32}>
            <Flex flexItem flexBasis="60%">
              <UpdateStatusChart />
            </Flex>
            <Flex flexItem flexBasis="40%">
              <OutdatedAgents setAgentSpecialFilter={setAgentSpecialFilter} />
            </Flex>
          </Flex>
          <AgentTable agentSpecialFilter={agentSpecialFilter} setAgentSpecialFilter={setAgentSpecialFilter} />
        </Flex>
      </Surface>
    </Flex>
  );
};
