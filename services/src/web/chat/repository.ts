import { Op } from "sequelize";
import { MessagesTable, PdfDocumentTable, ThreadsTable } from "../../shared/schema";

function getAllThreads(paperId: string) {
  return ThreadsTable.findAll({
    where: { paperId }
  });
}

function getThread(threadId: string) {
  return ThreadsTable.findOne({
    where: { id: threadId }
  });
}

type MessageParams = {
  threadId: string;
  messageId?: string;
  includeHidden?: boolean;
}
function getMessages({ threadId, messageId, includeHidden = false }: MessageParams) {
  let whereClause: { [key: string]: any } = {
    threadId
  };

  if (messageId) {
    whereClause.id = {
      [Op.lte]: messageId
    }
  }

  if (!includeHidden) {
    whereClause.hidden = false;
  }

  return MessagesTable.findAll({
    where: whereClause
  });
}


function getPdfDocuments(paperId: string, viewMode = 0){
  return PdfDocumentTable.findAll({
    where: {
      paperId,
      viewMode
    }
  });
}

function addPdfDocument(pdfDocument: any) {
  return PdfDocumentTable.create(pdfDocument);
}

function addMessage(message: any) {
  return MessagesTable.create(message);
  // {
  //   threadId,
  //   content,
  //   sender
  // }
}

function addMessagesBulk(messages: any[]) {
  return MessagesTable.bulkCreate(messages);
}

function addThread(thread: any) {
  return ThreadsTable.create(thread);
  // {
  //   paperId,
  //   description,
  //   messageId,
  //   viewMode: 0
  // }
}

export {
  addMessage,
  addMessagesBulk,
  addThread,
  addPdfDocument,
  getAllThreads,
  getThread,
  getMessages,
  getPdfDocuments
}