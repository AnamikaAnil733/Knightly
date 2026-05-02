import axios from "./Axios/Useraxios";
import { ReportEvidence } from "../../Types/ReportTypes";

export const reportUser = async (data: {
  reportedId: string;
  reason: string;
  description: string;
  evidence: ReportEvidence;
}) => {
  const res = await axios.post("/user/reports", data);
  return res.data;
};
