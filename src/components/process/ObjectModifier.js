export const convertToRoleObject = (input) => {
  const result = {
    onTheJobTrainees: [],
    assistantDevelopers: [],
    associateDevelopers: [],
    softwareDevelopersDesigners: [],
    projectLeaders: [],
    reportingToCTO: [],
  };

  const regex = /\[(.+?)\]\s*([\s\S]*?)(?=\n?\[|$)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const role = match[1].trim();
    const block = match[2];

    const members = block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== "*EOL*")
      .map((name) => ({
        name,
        status: "",
        timeIn: "",
        reason: "",
        leaveType: "",
      }));

    // Hard-coded role assignment (NO dynamic naming)
    if (role === "SoftwareDevelopersDesigners") {
      result.softwareDevelopersDesigners = members;
    } else if (role === "ReportingToCTO") {
      result.reportingToCTO = members;
    } else if (role === "AssociateDevelopers") {
      result.associateDevelopers = members;
    } else if (role === "OnTheJobTrainees") {
      result.onTheJobTrainees = members;
    } else if (role === "ProjectLeaders") {
      result.projectLeaders = members;
    } else if (role === "AssistantDevelopers") {
      result.assistantDevelopers = members;
    }
  }

  return result;
};
