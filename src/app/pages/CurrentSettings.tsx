import React from "react";
import { Flex, Surface, Text, Tabs, Tab, TitleBar } from "@dynatrace/strato-components-preview";
import { EnvironmentTable } from "../components/EnvironmentTable";
import { HostGroupTable } from "../components/HostGroupTable";
import { HostTable } from "../components/HostTable";
import { HostGroupText } from "../components/HostGroupText";
import { SettingIcon } from "@dynatrace/strato-icons";

export const CurrentSettings = () => {
  return (
    <Flex flexDirection="column">
      <Surface>
        <TitleBar>
          <TitleBar.Prefix>
            <SettingIcon />
          </TitleBar.Prefix>
          <TitleBar.Title>Current settings</TitleBar.Title>
        </TitleBar>
        <Text>
          AutoUpdate settings are inherited from Environment, to Host Group, to Host. More specific settings override
          inherited ones.
        </Text>
        <Tabs>
          <Tab title="Environment-wide settings">
            <EnvironmentTable />
            <HostGroupText />
          </Tab>
          <Tab title="Hostgroup overrides">
            <HostGroupTable />
          </Tab>
          <Tab title="Per host overrides">
            <HostTable />
          </Tab>
        </Tabs>
      </Surface>
    </Flex>
  );
};
