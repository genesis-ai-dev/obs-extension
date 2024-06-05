export const getResourceType = (subject: string) => {
  if (subject === "Open Bible Stories") return "obs";
  if (subject === "OBS Translation Notes" || subject === "TSV OBS Translation Notes")
    return "obs-tn";
  if (subject === "OBS Translation Questions") return "obs-tq";
  if (subject === "TSV OBS Translation Questions") return "obs-tq";
  if (subject === "OBS Translation Words Links" || subject === "TSV OBS Translation Words Links")
    return "obs-twl";
  throw new Error("Invalid resource type");
};
