import { SectionsNames } from "@/enums/sectionsNames";
import { normalizeString } from "@/modules/utils/normalizeString";
import { IProject, ITechnologiesMap } from "@/types/storeTypes";

type Map = Partial<Record<SectionsNames, string[]>>;

function findDuplicates(arr: string[]) {
  const seen = new Set();
  const duplicates: string[] = [];

  arr.forEach((elem) => {
    const normalizedElem = normalizeString(elem);
    if (seen.has(normalizedElem)) {
      duplicates.push(elem);
    } else {
      seen.add(normalizedElem);
    }
  });

  return duplicates;
}

export const getSummary = (projects: IProject[], technologiesMap: ITechnologiesMap) => {
  const summary: Map = {
    [SectionsNames.ProgrammingLanguages]: [],
    [SectionsNames.Frontend]: [],
    [SectionsNames.BackendTechnologies]: [],
    [SectionsNames.JavaFrameworks]: [],
    [SectionsNames.Containerization]: [],
    [SectionsNames.CiCd]: [],
    [SectionsNames.Cloud]: [],
    [SectionsNames.Databases]: [],
    [SectionsNames.VersionControlSystems]: [],
    [SectionsNames.AITools]: [],
  };
  const technologies = projects.flatMap(({ technologies }) => technologies ?? []);
  const uniqueTechnologies = Array.from(new Set<string>(technologies));
  const normalizedSet = Array.from(new Set<string>(technologies.map(normalizeString)));

  const techDetails = uniqueTechnologies.map((tech) => ({
    original: tech,
    normalized: normalizeString(tech),
    map: technologiesMap[normalizeString(tech)],
  }));

  techDetails
    .sort((a, b) => {
      // If Map have both of technologies we make sorting
      if (a.map && b.map) {
        return a.map.orderWeight - b.map.orderWeight;
      }
      // If Map don't have a technologies
      return 0;
    })
    .forEach(({ original, map }) => {
      if (!map) return;

      const section = map.name as SectionsNames;

      if (summary[section]) {
        summary[section]!.push(original);
      } else {
        summary[SectionsNames.Frontend]!.push(original);
      }
    });

  // Delete empty summary sections
  for (const key in summary) {
    const typedKey = key as keyof typeof summary;

    if (summary[typedKey]!.length === 0) {
      delete summary[typedKey];
    }
  }

  const hasCollisions = uniqueTechnologies.length !== normalizedSet.length;
  const duplicatedValues = findDuplicates(uniqueTechnologies);

  return { summary, hasCollisions, duplicatedValues };
};
