import { observer } from "mobx-react-lite";
import { useStore } from "@/hooks";
import { Flex, Typography } from "antd";
import { normalizeString } from "@/modules/utils/normalizeString";
import { FC, useCallback, useMemo } from "react";
import { ISummaryField } from "@/types/storeTypes";

const { Title, Paragraph } = Typography;

type SummaryContentProps = {
  summary: ISummaryField;
  getDuplicatedColor: (value: string) => string | undefined;
};

const SummaryContent: FC<SummaryContentProps> = ({ summary, getDuplicatedColor }) => {
  return (
    <div>
      {Object.entries(summary).map(([key, valueArr]) => {
        if (valueArr.length === 0) return;
        return (
          <div key={key}>
            <Title level={3}>{key}</Title>
            <Paragraph>
              {valueArr.map((value, index, array) => {
                const color = getDuplicatedColor(value);
                return (
                  <span key={value + `${!!color}`}>
                    <span style={{ backgroundColor: color || "transparent" }}>{value}</span>
                    {index === array.length - 1 ? "." : ","}{" "}
                  </span>
                );
              })}
            </Paragraph>
          </div>
        );
      })}
    </div>
  );
};

const DUPLICATE_COLORS = ["#FFC1C1", "#C1FFC1", "#C1C1FF", "#FFFFC1", "#FFC1FF", "#C1FFFF"];

const tableOfTechnologiesLink = import.meta.env.VITE_TABLE_LINK ?? "";

export const SummarizingField = observer(() => {
  const {
    projects: { summary, hasCollisions, duplicatedValues, notFoundTechnologies },
  } = useStore();

  const normalizedDuplicatedValues = useMemo(
    () => duplicatedValues.map((item) => normalizeString(item)),
    [duplicatedValues],
  );

  const duplicatedColorMap = useMemo(() => {
    const map = new Map<string, string>();
    normalizedDuplicatedValues.forEach((value, index) => {
      map.set(value, DUPLICATE_COLORS[index % DUPLICATE_COLORS.length]);
    });
    return map;
  }, [normalizedDuplicatedValues]);

  const getDuplicatedColor = useCallback(
    (value: string) => {
      return duplicatedColorMap.get(normalizeString(value));
    },
    [duplicatedColorMap],
  );

  return (
    <Flex vertical gap="small" align="stretch" style={{ width: "30%" }}>
      {hasCollisions && (
        <Paragraph
          style={{
            backgroundColor: "#e31717",
            padding: "10px",
            color: "#fff",
            fontSize: "20px",
          }}
        >
          Fields has duplicated technologies names above:
          <br />
          <b style={{ fontStyle: "normal", color: "#09f2f6" }}>{duplicatedValues.join(", ")}</b>
        </Paragraph>
      )}
      {notFoundTechnologies.length > 0 && (
        <Paragraph
          style={{
            backgroundColor: "#e31717",
            padding: "10px",
            color: "#fff",
            fontSize: "20px",
          }}
        >
          Table has not found technologies! Please add them to the{" "}
          <a
            href={tableOfTechnologiesLink}
            target="_blank"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            table of technologies
          </a>{" "}
          and refetch database:
          <br />
          <b style={{ fontStyle: "normal", color: "#09f2f6" }}>{notFoundTechnologies.join(", ")}</b>
        </Paragraph>
      )}
      <SummaryContent summary={summary} getDuplicatedColor={getDuplicatedColor} />
    </Flex>
  );
});
