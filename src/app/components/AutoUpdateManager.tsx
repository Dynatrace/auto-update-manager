import React, { useState } from "react";
import { Flex, Heading, Surface, Text, Divider, Button } from "@dynatrace/strato-components-preview";
import { EnvironmentTable } from "./tables/EnvironmentTable";
import { HostGroupTable } from "./tables/HostGroupTable";
import { HostGroupMacroTable } from "./tables/HostGroupMacroTable";
import { HostTable } from "./tables/HostTable";
import { HostGroupText } from "./HostGroupText";
import "./AutoUpdateManager.module.css";
import { UnfoldMoreIcon, UnfoldLessIcon, PlusIcon } from "@dynatrace/strato-icons";
import { MacroModal } from "./modals/MacroModal";
import { UpdateStatusChart } from "./charts/UpdateStatusChart";
import { AgentTable } from "./tables/AgentTable";
import { OutdatedAgents } from "./OutdatedAgents";

export const AutoUpdateManager = () => {
  const [expandCurrentSettings, setExpandCurrentSettings] = useState(false);
  const [expandHostGroupMacros, setExpandHostGroupMacros] = useState(true);
  const [expandAgents, setExpandAgents] = useState(false);
  const [macroModalOpen, setMacroModalOpen] = useState(false);
  const [agentSpecialFilter,setAgentSpecialFilter] = useState<"faulty"|"unsupported"|"older"|null>(null);

  return (
      <Flex flexDirection="column">
        <Surface>
          <Flex flexDirection="row">
            <Button onClick={() => setExpandCurrentSettings((old) => !old)}>
              <Button.Prefix>{(expandCurrentSettings && <UnfoldLessIcon />) || <UnfoldMoreIcon />}</Button.Prefix>
            </Button>
            <Heading level={2}>Current settings</Heading>
          </Flex>
          <Text>
            AutoUpdate settings are inherited from Environment, to Host Group, to Host. More specific settings override
            inherited ones.
          </Text>
          <Flex className={expandCurrentSettings ? "show" : "hide"} flexDirection="column">
            <Heading level={3}>Environment-wide settings</Heading>
            <EnvironmentTable />
            <HostGroupText />
            <Divider />
            <Heading level={3}>Hostgroup overrides</Heading>
            <HostGroupTable />
            <Divider />
            <Heading level={3}>Per host overrides</Heading>
            <HostTable />
          </Flex>
        </Surface>
        <Surface>
          <Flex flexDirection="row">
            <Button onClick={() => setExpandHostGroupMacros((old) => !old)}>
              <Button.Prefix>{(expandHostGroupMacros && <UnfoldLessIcon />) || <UnfoldMoreIcon />}</Button.Prefix>
            </Button>
            <Heading level={2}>Hostgroup macros</Heading>
            <Flex flexItem flexGrow={1}></Flex>
            <Button onClick={() => setMacroModalOpen(true)} variant="emphasized">
              <Button.Prefix>
                <PlusIcon />
              </Button.Prefix>
            </Button>

            {macroModalOpen && (
              <MacroModal
                modalMode="Add"
                onDismiss={() => {
                  setMacroModalOpen(false);
                  setExpandHostGroupMacros(true);
                }}
              />
            )}
          </Flex>
          <Text>Hostgroup macros provide a convenient way update settings for a large number of hostgroups</Text>
          <Flex className={expandHostGroupMacros ? "show" : "hide"} flexDirection="column">
            <HostGroupMacroTable />
          </Flex>
        </Surface>
        <Surface>
          <Flex flexDirection="column">
            <Flex flexDirection="row">
              <Button onClick={() => setExpandAgents((old) => !old)}>
                <Button.Prefix>{(expandAgents && <UnfoldLessIcon />) || <UnfoldMoreIcon />}</Button.Prefix>
              </Button>
              <Heading level={2}>OneAgent Status</Heading>
            </Flex>
            <Text>Detailed version and autoupdate status information for OneAgents</Text>
            {expandAgents && (
              <Flex flexDirection="row">
                <Flex flexDirection="column" flexBasis="30%" gap={32}>
                  <UpdateStatusChart />
                  <OutdatedAgents setAgentSpecialFilter={setAgentSpecialFilter}/>
                </Flex>
                <Flex flexItem flexBasis="70%">
                  <AgentTable agentSpecialFilter={agentSpecialFilter} setAgentSpecialFilter={setAgentSpecialFilter}/>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Surface>
      </Flex>
  );
};
