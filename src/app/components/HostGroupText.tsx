import React from "react";
import { useDQLAllHostGroups } from "../hooks/useDQLAllHostGroups";
import { useSettingsReader } from "../hooks/useSettingsReader";
import { Text, ExpandableText, ProgressCircle, List } from "@dynatrace/strato-components-preview";
import { Indicator } from "./Indicator";
import { HostGroupLink } from "./links/HostGroupLink";

export const HostGroupText = () => {
  const allHostGroups = useDQLAllHostGroups();
  const hostgroupOverrides = useSettingsReader("builtin:deployment.oneagent.updates", "hostgroup");

  if (allHostGroups.isLoading || hostgroupOverrides.isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }

  if (allHostGroups.isError || hostgroupOverrides.isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  const overriddenHostGroups = hostgroupOverrides?.data?.map((d) => d.scope);
  const defaultHostGroups = allHostGroups?.data
    ?.filter((r) => !overriddenHostGroups?.includes(r.id))
    .sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

  if (defaultHostGroups.length > 0)
    return (
      <Text>
        {defaultHostGroups.length} Host Groups using environment defaults:
        <ExpandableText>
          <List>{defaultHostGroups?.map((dhg, idx) => dhg && <HostGroupLink hostgroup={dhg} key={idx} />)}</List>
        </ExpandableText>
      </Text>
    );
  else return <Text>No host groups using environment defaults.</Text>;
};
