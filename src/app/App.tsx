import React, { useState } from "react";
import {
  Heading,
  List,
  Text,
  Flex,
  AppHeader,
  Page,
  useCurrentTheme,
  Button,
} from "@dynatrace/strato-components-preview/";
import { DetailViewCard } from "./components/DetailViewCard";
import { MainViewCard } from "./components/MainViewCard";
import { AutoUpdateTerminology } from "./components/terminologyOverlays/AutoUpdateTerminology";
import { HostgroupTerminology } from "./components/terminologyOverlays/HostgroupTerminology";
import { MaximizeIcon, MinimizeIcon, SettingIcon, TriggerIcon } from "@dynatrace/strato-icons";
import { Route, NavLink as RouterLink, Routes, Navigate } from "react-router-dom";
import { CurrentSettings } from "./pages/CurrentSettings";
import { Macros } from "./pages/Macros";
import { OneAgentStatus } from "./pages/OneAgentStatus";
import { OneAgentIcon } from "./components/customIcons/OneAgentIcon";

export const App = () => {
  const theme = useCurrentTheme();
  const [hideAds, setHideAds] = useState(false);
  const max_width = !hideAds ? 1280 : "100%";

  const appIconSrc = `assets/Au.png`;

  return (
    <Page>
      <Page.Header>
        <AppHeader>
          <AppHeader.NavItems>
            <AppHeader.AppNavLink as={RouterLink} to="/" />
            <AppHeader.NavItem as={RouterLink} to="/current_settings" >
              <SettingIcon />
              Current settings
            </AppHeader.NavItem>
            <AppHeader.NavItem as={RouterLink} to="/macros">
              <TriggerIcon/>
              Macros
            </AppHeader.NavItem>
            <AppHeader.NavItem as={RouterLink} to="/oneagent_status">
              <OneAgentIcon/>
              OneAgent status
            </AppHeader.NavItem>
          </AppHeader.NavItems>
        </AppHeader>
      </Page.Header>
      <Page.Main>
        <Flex flexDirection="row" justifyContent="flex-end">
          <Button
            onClick={() => {
              setHideAds((old) => !old);
            }}
          >
            <Button.Prefix>{!hideAds ? <MaximizeIcon /> : <MinimizeIcon />}</Button.Prefix>
          </Button>
        </Flex>
        <Flex flexDirection="column" padding={32} gap={32} maxWidth={max_width} alignSelf={"center"}>
          <Flex flexDirection="row" alignItems="center">
            <Flex flexDirection="column" gap={16}>
              <Flex gap={4} flexDirection="column">
                <Heading>AutoUpdate Manager</Heading>
                {!hideAds && (
                  <Text>
                    This Sample App enables you to control your OneAgent <AutoUpdateTerminology /> settings per host
                    group at large scale. It introduces the concept of "macros" as meta-configuration to enable
                    automation-assisted tasks.
                  </Text>
                )}
              </Flex>
              {!hideAds && (
                <Flex gap={4} flexDirection="column">
                  <Heading level={4}>This app demonstrates</Heading>
                  <List ordered={false}>
                    <Text key={1}>Querying information from Settings 2.0 SDKs</Text>
                    <Text key={2}>Visualizing data</Text>
                    <Text key={3}>Taking action via Settings 2.0 SDKs</Text>
                    <Text key={4}>Store App state</Text>
                  </List>
                  <Text>
                    Please note: AutoUpdate settings are scaled via <HostgroupTerminology /> because they are
                    deterministic, ie the settings can only be inherited by a host from a single hostgroup. "Macros"
                    used in this app are by their nature non-deterministic, ie depending on the filters you create, a
                    hostgroup could appear in multiple macros. In this case, syncing the settings of one macro will
                    overwrite the settings already synced from another macro.
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex alignSelf={"flex-start"}>
              <img src={appIconSrc} width="90px" height="90px" />
            </Flex>
          </Flex>
          <Flex flexDirection="column" width={max_width}>
            <Routes>
              <Route path="/current_settings" element={<CurrentSettings />} />
              <Route path="/macros" element={<Macros />} />
              <Route path="/oneagent_status" element={<OneAgentStatus />} />
              <Route index element={<Navigate to="/macros" />} />
            </Routes>
          </Flex>
          {!hideAds && <MainViewCard />}
        </Flex>
      </Page.Main>
      <Page.DetailView
        dismissed={hideAds}
        preferredWidth={350}
        onDismissChange={() => {
          return;
        }}
      >
        <Flex flexDirection="column" gap={16} paddingTop={32} paddingLeft={8} paddingRight={8}>
          <Flex gap={4} flexDirection="column">
            <Heading level={4}>Ready to develop?</Heading>
            <Text>Learn to write apps with Dynatrace Developer and the Dynatrace community.</Text>
          </Flex>
          <DetailViewCard
            href="https://developer.dynatrace.com/preview/getting-started/quickstart/"
            imgSrc={theme === "light" ? "./assets/DevPortalLogo_light@3x.png" : "./assets/DevPortalLogo_dark@3x.png"}
            headline="Learn to create apps"
            text="Dynatrace Developer shows you how"
          ></DetailViewCard>
          <DetailViewCard
            href="https://community.dynatrace.com/t5/Developers/ct-p/developers"
            imgSrc={theme === "light" ? "./assets/CommunityIcon_light@3x.png" : "./assets/CommunityIcon_dark@3x.png"}
            headline="Join Dynatrace Community"
            text="Ask questions, get answers, share ideas"
          ></DetailViewCard>
          <DetailViewCard
            href="https://github.com/Dynatrace/auto-update-manager"
            imgSrc={theme === "light" ? "./assets/GitBranchIcon_light@3x.png" : "./assets/GitBranchIcon_dark@3x.png"}
            headline="Collaborate in GitHub"
            text="Start your own app by forking it on GitHub"
          ></DetailViewCard>
        </Flex>
      </Page.DetailView>
    </Page>
  );
};
