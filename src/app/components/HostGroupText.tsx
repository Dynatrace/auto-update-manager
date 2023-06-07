import React, { useMemo } from "react";
import { useDQLAllHostGroups } from "../hooks/useDQLAllHostGroups";
import { useSettingsReader } from "../hooks/useSettingsReader";
import { Text, ExpandableText, LoadingIndicator, List } from "@dynatrace/strato-components-preview";
import { Indicator } from "./Indicator";
import { HostGroupLink } from "./links/HostGroupLink";

export const HostGroupText = () => {
  const allHostGroups = useDQLAllHostGroups();
  const hostgroupOverrides = useSettingsReader("builtin:deployment.oneagent.updates", "hostgroup");

  const defaultHostGroups = useMemo(() => {
    const overriddenHostGroups = hostgroupOverrides?.data?.map((d) => d.scope);
    const otherHostGroups = allHostGroups?.data
      ?.filter((r) => !overriddenHostGroups?.includes(r.id))
      .sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
    return otherHostGroups;
  }, [allHostGroups.data, hostgroupOverrides.data]);

  if (allHostGroups.isLoading || hostgroupOverrides.isLoading) {
    return <LoadingIndicator />;
  }

  if (allHostGroups.isError || hostgroupOverrides.isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  return (
    <Text>
      {defaultHostGroups?.length || "?"} Host Groups using environment defaults:
      <ExpandableText>
        <List>{defaultHostGroups?.map((dhg, idx) => dhg && <HostGroupLink hostgroup={dhg} key={idx} />)}</List>
      </ExpandableText>
    </Text>
  );
};
