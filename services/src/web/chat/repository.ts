import { Op } from "sequelize";
import { MessagesTable, ThreadsTable } from "../../shared/schema";

function getThreads(paperId: string): Promise<any> {
  return ThreadsTable.findAll({
    where: { paperId }
  });
}

function addMessage(threadId: string, content: string, sender: string): Promise<any> {
  return MessagesTable.create({
    threadId,
    content,
    sender
  });
}

function getMessages(threadId: string): Promise<any> {
  return MessagesTable.findAll({
    where: { threadId }
  });
}

export {
  getThreads,
  addMessage
}
