import { DayDocument, PaperDocument } from "../database/schema";

export type RecordTypes = DayDocument | PaperDocument | { lastRun: string };
