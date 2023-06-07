* Overall structure
Goal: structure presentation and data layers independently for future maintainability

** UI Layer
The UI should have three tables in the main pane. The top table should show environment wide settings. Below should be a table of groups of host groups. Clicking `details` in either should present a list of hostgroups in the right pane. Finally, a third table in the main pane should give a listing of any per host overrides.

*** Environment table
We should present (readonly):
- Update mode: autoupdate, autoupdate windows, disabled. 
- Update window(s): default update window(s) if mode set to update windows
- Target version: target OA version to update to, only valid in autoupdate or autoupdate windows
- Default version: only valid if disabled

Note: avoid replicating built-in UI, where possible. Instead link to the UI pages.

*** Groups of host groups table
We should allow creation of macro-groups based on DQL queries. Each should contain:
- Name: friendly name for the group
- Filter: DQL filter to be added to a complicated DQL query to get a list of Hostgroups
- Target version: OA target version, including `latest`, `previous`, `older`
- Update window(s): when can updates take place
- Status: how many of the host groups are updated to the desired settings
- Action menu: write settings, refresh, delete

*** Individual host overrides
We should present (readonly):
- Host: with link to settings page
- Update mode: 
- Target version:
- Update window(s):

** Data layer:
Each should be queried through TanStack to handle caching and invalidation.
- hostgroups: list of all hostgroups
- hostgroups per group: list of hostgroups matching group's filter
- filtered hostgroups: all hostgroups less group hostgroups
- env settings: autoupdate settings with env scope
- hostgroup settings: all autoupdate settings with a hostgroup scope
- host settings: all individual host overrides
- maintenance windows: all maintenance windows