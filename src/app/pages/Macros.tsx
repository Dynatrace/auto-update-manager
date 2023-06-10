import React, { useState } from "react";
import { Flex, Surface, Text, Button, TitleBar } from "@dynatrace/strato-components-preview";
import { HostGroupMacroTable } from "../components/tables/HostGroupMacroTable";
import { PlusIcon } from "@dynatrace/strato-icons";
import { MacroModal } from "../components/modals/MacroModal";

export const HostgroupMacros = () => {
  const [macroModalOpen, setMacroModalOpen] = useState(false);

  return (
    <Flex flexDirection="column">
      <Surface>
        <TitleBar>
          <TitleBar.Title>Hostgroup Macros</TitleBar.Title>
          <TitleBar.Action>
            <Button onClick={() => setMacroModalOpen(true)} variant="emphasized">
              <Button.Prefix>
                <PlusIcon />
              </Button.Prefix>
            </Button>
          </TitleBar.Action>
        </TitleBar>

        <Flex flexDirection="row">
          <Flex flexItem flexGrow={1}></Flex>

          {macroModalOpen && (
            <MacroModal
              modalMode="Add"
              onDismiss={() => {
                setMacroModalOpen(false);
              }}
            />
          )}
        </Flex>
        <Text>Hostgroup macros provide a convenient way update settings for a large number of hostgroups</Text>
        <Flex flexDirection="column">
          <HostGroupMacroTable />
        </Flex>
      </Surface>
    </Flex>
  );
};
