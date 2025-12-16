import { Flex } from "./styles";
import { ListProjects } from "@/modules/components/ListProjects";
import { TableSection } from "@/modules/components/TableSection";
import { ReloadPageButton } from "@/modules/components/ReloadPageButton";
// import { GenerateDocumentButton } from "@/modules/components/GenerateDocumentButton";
import { SummarizingField } from "@/modules/components/SummarizingField";
import { useStore } from "@/hooks";
import { observer } from "mobx-react-lite";
import { Spinner } from "@/ui-kit/Spinner";
import { TableLink } from "@/components/TableLink";
import { RefetchDataButton } from "@/modules/components/RefetchDataButton";
import { DocumentInput } from "@/modules/components/DocumentInput";
// import { GenerateBrightboxFormatDocumentButton } from "@/modules/components/GenerateBrightBoxFormatDocumentButton";
// import { BackgroundToggleCheckbox } from "@/modules/components/BackgroundToggleCheckbox";
// import { ConnectDatabaseButton } from "@/modules/components/ConnectDatabaseButton";

const isEmpty = <T extends object>(obj: T) => Object.keys(obj).length === 0;

export const MainPage = observer(() => {
  const {
    projects: { technologiesMap },
  } = useStore();

  if (isEmpty(technologiesMap))
    return (
      <div style={{ height: "100vh" }}>
        <Spinner />
      </div>
    );

  return (
    <>
      <Flex gap={10} align="center">
        <ReloadPageButton />
        <DocumentInput />
        {/* <GenerateDocumentButton /> */}
        {/* <GenerateBrightboxFormatDocumentButton /> */}
        <RefetchDataButton />
        {/* <ConnectDatabaseButton /> */}
        <TableLink />
        {/* <BackgroundToggleCheckbox /> */}
      </Flex>
      <Flex gap={100} justify="start">
        <ListProjects />
        <TableSection />
        <SummarizingField />
      </Flex>
    </>
  );
});
