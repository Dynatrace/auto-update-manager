import React, { useState } from "react";
import { Button, Flex, ProgressCircle, Menu, Modal, Text } from "@dynatrace/strato-components-preview";
import { CycleIcon, DotMenuIcon, DeleteIcon, EditIcon, GhostIcon } from "@dynatrace/strato-icons";
import { useRemoveMacro } from "src/app/hooks/useRemoveMacro";
import { Macro } from "src/app/types/Types";
import { useSyncSettingsFromMacro } from "src/app/hooks/useSyncSettingsFromMacro";
import { Indicator } from "./Indicator";
import { useClearHostgroupsFromMacro } from "src/app/hooks/useClearHostgroupsFromMacro";
import { MacroModal } from "./MacroModal";

export const ActionsCell = ({ macro }: { macro: Macro }) => {
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [firedRealSync, setFiredRealSync] = useState(false);
  const { mutate: removeMacro } = useRemoveMacro();
  const sync = useSyncSettingsFromMacro();
  const clear = useClearHostgroupsFromMacro();
  function syncTitle() {
    if (sync.isLoading) {
      if (firedRealSync) return "Syncing...";
      else return "Running pre-validation...";
    } else return "Sync to Settings?";
  }
  return (
    <Flex flexDirection="row" gap={2}>
      <Button
        onClick={() => {
          console.log("sync (validate)");
          setShowSyncModal(true);
          sync.mutate({ macro: macro, validateOnly: true });
        }}
      >
        <Button.Prefix>
          <CycleIcon />
        </Button.Prefix>
      </Button>
      <Modal
        size="small"
        title={syncTitle()}
        show={showSyncModal || sync.isLoading}
        onDismiss={() => setShowSyncModal(false)}
      >
        {sync.isError && <Indicator state="critical">{(sync.error || "").toString()}</Indicator>}
        {sync.isLoading && <ProgressCircle size="small" aria-label="Loading..." />}
        {!sync.isError && !sync.isLoading && (
          <Button
            variant="emphasized"
            onClick={() => {
              setFiredRealSync(true);
              sync.mutate({ macro: macro, validateOnly: false });
              setShowSyncModal(false);
            }}
          >
            <Button.Prefix>
              <CycleIcon />
            </Button.Prefix>
            Sync
          </Button>
        )}
      </Modal>
      <Menu>
        <Menu.Trigger>
          <Button>
            <Button.Prefix>
              <DotMenuIcon />
            </Button.Prefix>
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item
            onSelect={() => {
              setShowEditModal(true);
            }}
          >
            <Menu.ItemIcon>
              <EditIcon />
            </Menu.ItemIcon>
            Edit Macro
          </Menu.Item>
          <Menu.Item
            onSelect={() => {
              removeMacro(macro);
            }}
          >
            <Menu.ItemIcon>
              <DeleteIcon />
            </Menu.ItemIcon>
            Delete Macro
          </Menu.Item>
          <Menu.Item
            onSelect={() => {
              setShowClearModal(true);
            }}
          >
            <Menu.ItemIcon>
              <GhostIcon />
            </Menu.ItemIcon>
            Clear Hostgroups
          </Menu.Item>
        </Menu.Content>
      </Menu>
      <Modal title="Are you sure?" show={showClearModal || clear.isLoading} onDismiss={() => setShowClearModal(false)}>
        <Text>Are you sure you want to clear autoupdate settings from these hostgroups?</Text>
        {clear.isError && <Indicator state="critical">{(clear.error || "").toString()}</Indicator>}
        {clear.isLoading && <ProgressCircle size="small" aria-label="Loading..." />}
        {!clear.isError && !clear.isLoading && (
          <Button
            variant="emphasized"
            onClick={() => {
              clear.mutate({ macro: macro });
              setShowClearModal(false);
            }}
          >
            <Button.Prefix>
              <GhostIcon />
            </Button.Prefix>
            Clear
          </Button>
        )}
      </Modal>
      {showEditModal && <MacroModal modalMode="Update" onDismiss={() => setShowEditModal(false)} macro={macro} />}
    </Flex>
  );
};
