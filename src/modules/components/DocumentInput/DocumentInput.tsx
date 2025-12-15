import { useStore } from "@/hooks";
import { calculateDateRange } from "@/modules/utils/calculateDateRange";
import mammoth from "mammoth";
import { observer } from "mobx-react-lite";
import { ChangeEventHandler, useRef, useState } from "react";
import { findProjectsData, findSelfInfo } from "./utils";
import { Button, Flex } from "antd";
import { Title } from "@/ui-kit/Typography";

export const DocumentInput = observer(() => {
  const {
    projects: { clearStore, addProject, addSelfInfo },
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0] || null;

    async function convertDocxToHtml(arrayBuffer: ArrayBuffer) {
      const result = await mammoth.convertToHtml({ arrayBuffer });
      return result.value;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await convertDocxToHtml(arrayBuffer);
        const projects = findProjectsData(result);
        const selfInfo = findSelfInfo(result);

        clearStore();
        addSelfInfo(selfInfo);
        projects.forEach((item) => {
          addProject({
            id: 0,
            firstDate: item.dates[0],
            lastDate: item.dates[1],
            dateRange: calculateDateRange(item.dates[0], item.dates[1]),
            technologies: item.technologies,
            name: item.name,
            responsibilities: item.responsibilities,
            description: item.description,
          });
        });
      };
      setFileName(file.name);
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Flex gap={10} align="center">
      <Button onClick={() => fileInputRef.current?.click()}>Upload Document</Button>
      <input
        ref={fileInputRef}
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        hidden={true}
      />
      <Title level={5} style={{ margin: 0 }}>
        {fileName}
      </Title>
    </Flex>
  );
});
