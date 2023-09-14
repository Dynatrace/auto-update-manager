import React from "react";
import { Flex, Surface, Text, Tabs, Tab, TitleBar } from "@dynatrace/strato-components-preview";
import { EnvironmentTable } from "../components/tables/EnvironmentTable";
import { HostGroupTable } from "../components/tables/HostGroupTable";
import { HostTable } from "../components/tables/HostTable";
import { HostGroupText } from "../components/HostGroupText";
import { SettingIcon } from "@dynatrace/strato-icons";
import { TitleBarIconWrapper } from "../components/customIcons/TitleBarIconWrapper";

export const CurrentSettings = () => {
  return (
    <Flex flexDirection="column">
      <Surface>
        <TitleBar>
          <TitleBar.Prefix>
            <TitleBarIconWrapper>
              <SettingIcon />
            </TitleBarIconWrapper>
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