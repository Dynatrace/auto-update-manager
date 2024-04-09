import React, { useState, useRef, FormEvent } from "react";
import { queryAssistanceClient } from "@dynatrace-sdk/client-query";
import {
  Modal,
  Flex,
  FormField,
  TextInput,
  Button,
  Select,
  SelectOption,
  SelectedKeys,
  Code,
  ProgressCircle,
  InformationOverlay,
  Text,
  List,
  SelectSection,
  Strong,
  RadioGroup,
  Radio,
} from "@dynatrace/strato-components-preview";
import { PlusIcon, EditIcon, CriticalFailedIcon, CheckmarkIcon } from "@dynatrace/strato-icons";
import Colors from "@dynatrace/strato-design-tokens/colors";
import { useVersions } from "src/app/hooks/useVersions";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { useMacros } from "src/app/hooks/useMacros";
import { useAddMacro } from "src/app/hooks/useAddMacro";
import { Indicator } from "./Indicator";
import { Macro } from "src/app/types/Types";
import "./MacroModal.css";

type MacroModalProps = {
  modalMode: "Add" | "Update" | null;
  onDismiss: () => void;
  macro?: Macro;
};

const criticalFailedStyle: React.CSSProperties = {
  fill: Colors.Icon.Critical.Default,
};
const successStyle: React.CSSProperties = {
  fill: Colors.Icon.Success.Default,
};

export const MacroModal = ({ modalMode, onDismiss, macro }: MacroModalProps) => {
  const [name, setName] = useState<string>(macro ? macro.name : "");
  const [dupName, setDupName] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>(macro ? macro.filter : `in(tags,"poland-windows-host")`);
  const [filterValid, setFilterValid] = useState<boolean>(true);
  const [desiredVersionKeys, setDesiredVersionKeys] = useState<SelectedKeys | null>(
    macro ? [macro.desiredVersion] : null
  );
  const [desiredWindowKeys, setDesiredWindowKeys] = useState<SelectedKeys | null>(macro ? [macro.desiredWindow] : null);
  const [updateModeKeys, setUpdateModeKeys] = useState<SelectedKeys | null>(
    macro ? [macro.updateMode] : ["AUTOMATIC_DURING_MW"]
  );
  const versions = useVersions();
  const windows = useSettingsReader("builtin:deployment.management.update-windows");
  const formRef = useRef<HTMLFormElement>(null);
  const macros = useMacros();
  const { mutate: addMacro } = useAddMacro();

  async function onFilterChange(filter: string) {
    setFilter(filter);
    const query = `fetch dt.entity.host |filter ${filter}`;
    const response = await queryAssistanceClient.queryVerify({
      body: { query },
    });
    setFilterValid(response.valid);
  }

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      if (modalMode == "Update" && macro) await addMacro({ formData, macro });
      else await addMacro({ formData });
    }
    onDismiss();
  }
  return (
    <Modal title={modalMode + " Group"} show={modalMode != null} onDismiss={onDismiss}>
      <form ref={formRef} onSubmit={submit}>
        <Flex flexDirection="column">
          <FormField label="Scope" required>
            <RadioGroup defaultValue={macro?.scope ? macro.scope : "hostgroup"} name="scope">
              <Flex flexDirection="row">
                <Radio aria-label="Hostgroup" value="hostgroup">
                  Host group
                </Radio>
                <Radio aria-label="Host" value="host">
                  Host
                </Radio>
              </Flex>
            </RadioGroup>
          </FormField>
          <FormField label="Name" required>
            <TextInput
              placeholder="Group Name"
              name="name"
              value={name}
              onChange={(val) => {
                setName(val);
                setDupName(macros.data ? macros.data.filter((m) => m.name == val)?.length > 0 : false);
              }}
            />
            {dupName && <Indicator state="critical">Macro name must be unique</Indicator>}
          </FormField>

          <FormField label="Filter" required>
            <Flex flexDirection="row" alignItems="center" columnGap={2}>
              <Flex flexItem className="codeFilter">
                <Code>|Filter </Code>
              </Flex>
              <Flex flexItem flexGrow={1}>
                <TextInput placeholder="DQL Filter" value={filter} name="filter" onChange={onFilterChange}>
                  <TextInput.Prefix>
                    {(!filterValid && <CriticalFailedIcon style={criticalFailedStyle} />) || (
                      <CheckmarkIcon style={successStyle} />
                    )}
                  </TextInput.Prefix>
                </TextInput>
              </Flex>
              <Flex flexItem>
                <InformationOverlay>
                  <InformationOverlay.Trigger />
                  <InformationOverlay.Content>
                    <Text>
                      Create a filter to pick hostgroups. Use a DQL filter for <Strong>host</Strong> entities. The
                      constructed query will find all matching hosts, then return their hostgroups.
                    </Text>
                    <Text>
                      <Strong>Examples:</Strong>
                    </Text>
                    <List>
                      <Code>{`osType=="LINUX"`}</Code>
                      <Code>{`in(tags,"poland-windows-host")`}</Code>
                      <Code>{`contains(toString(tags),"production")`}</Code>
                    </List>
                  </InformationOverlay.Content>
                </InformationOverlay>
              </Flex>
            </Flex>
          </FormField>

          <FormField label="Update Mode" required>
            <Select name="updateMode" selectedId={updateModeKeys} onChange={setUpdateModeKeys}>
              <SelectOption id="AUTOMATIC" key="AUTOMATIC" value="AUTOMATIC">
                AUTOMATIC
              </SelectOption>
              <SelectOption id="AUTOMATIC_DURING_MW" key="AUTOMATIC_DURING_MW" value="AUTOMATIC_DURING_MW">
                AUTOMATIC_DURING_MW
              </SelectOption>
              <SelectOption id="MANUAL" key="MANUAL" value="MANUAL">
                MANUAL
              </SelectOption>
            </Select>
          </FormField>

          <FormField label="Version" required>
            {versions.isLoading && <ProgressCircle size="small" aria-label="Loading..." />}
            {versions.isError && <CriticalFailedIcon style={criticalFailedStyle} />}
            {!versions.isLoading && !versions.isError && (
              <Select
                name="desiredVersion"
                placeholder="Desired Version"
                selectedId={desiredVersionKeys}
                onChange={(keys) => {
                  setDesiredVersionKeys(keys);
                }}
              >
                <SelectSection id="relative" title="Relative">
                  <SelectOption id="latest" key="latest" value="latest">
                    Latest (n)
                  </SelectOption>
                  <SelectOption id="previous" key="previous" value="previous">
                    Previous (n-1)
                  </SelectOption>
                  <SelectOption id="older" key="older" value="older">
                    Older (n-2)
                  </SelectOption>
                </SelectSection>
                <SelectSection id="absolute" title="Absolute">
                  {(versions.data &&
                    versions.data?.map((v) => (
                      <SelectOption id={v} key={v} value={v}>
                        {v}
                      </SelectOption>
                    ))) || <></>}
                </SelectSection>
              </Select>
            )}
          </FormField>
          <FormField label="Window">
            {windows.isLoading && <ProgressCircle size="small" aria-label="Loading..." />}
            {windows.isError && <CriticalFailedIcon style={criticalFailedStyle} />}
            {!windows.isLoading && !windows.isError && (
              <Select
                name="desiredWindow"
                selectedId={desiredWindowKeys}
                disabled={
                  !Array.isArray(updateModeKeys) ||
                  updateModeKeys.length < 1 ||
                  !updateModeKeys.includes("AUTOMATIC_DURING_MW")
                }
                onChange={(keys) => {
                  setDesiredWindowKeys(keys);
                }}
              >
                {(windows.data &&
                  windows.data?.map((w) => (
                    <SelectOption id={w.objectId || "0"} key={w.objectId || "0"} value={w.objectId}>
                      {w.summary}
                    </SelectOption>
                  ))) || <></>}
              </Select>
            )}
          </FormField>
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            {modalMode == "Add" && (
              <Button
                variant="emphasized"
                type="submit"
                disabled={dupName || name.length < 1 || filter.length < 1 || !filterValid}
              >
                <Button.Prefix>
                  <PlusIcon />
                </Button.Prefix>
                Add
              </Button>
            )}
            {modalMode == "Update" && (
              <Button
                variant="emphasized"
                type="submit"
                disabled={name.length < 1 || filter.length < 1 || !filterValid}
              >
                <Button.Prefix>
                  <EditIcon />
                </Button.Prefix>
                Update
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};
