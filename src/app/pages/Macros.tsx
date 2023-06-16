import React, { useState } from "react";
import { Flex, Surface, Text, Button, TitleBar, Tabs, Tab } from "@dynatrace/strato-components-preview";
import { HostGroupMacroTable } from "../components/tables/HostGroupMacroTable";
import { HostMacroTable } from "../components/tables/HostMacroTable";
import { PlusIcon } from "@dynatrace/strato-icons";
import { MacroModal } from "../components/modals/MacroModal";
import { TriggerIcon } from "@dynatrace/strato-icons";
import { TitleBarIconWrapper } from "../components/customIcons/TitleBarIconWrapper";

export const Macros = () => {
  const [macroModalOpen, setMacroModalOpen] = useState(false);

  return (
    <Flex flexDirection="column">
      <Surface>
        <TitleBar>
          <TitleBar.Prefix>
            <TitleBarIconWrapper>
              <TriggerIcon />
            </TitleBarIconWrapper>
          </TitleBar.Prefix>
          <TitleBar.Title>Macros</TitleBar.Title>
          <TitleBar.Action>
            <Button onClick={() => setMacroModalOpen(true)} variant="emphasized">
              <Button.Prefix>
                <PlusIcon />
              </Button.Prefix>
            </Button>
          </TitleBar.Action>
        </TitleBar>
        {macroModalOpen && (
          <MacroModal
            modalMode="Add"
            onDismiss={() => {
              setMacroModalOpen(false);
            }}
          />
        )}
        <Tabs>
          <Tab title="Hostgroup">
            <Text>Hostgroup macros provide a convenient way update settings for a large number of hostgroups</Text>
            <Flex flexDirection="column">
              <HostGroupMacroTable />
            </Flex>
          </Tab>
          <Tab title="Host">
            <Text>Host macros provide a convenient way update settings for a large number of hosts</Text>
            <Text>
              Note: Host group macros are preferred to host macros, as they create significantly less settings objects.
            </Text>
            <Flex flexDirection="column">
              <HostMacroTable />
            </Flex>
          </Tab>
        </Tabs>
      </Surface>
    </Flex>
  );
};
