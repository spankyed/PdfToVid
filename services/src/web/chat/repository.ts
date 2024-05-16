import { Op } from "sequelize";
import { MessagesTable, PdfDocumentTable, PromptPresetsTable, ThreadsTable } from "../../shared/schema";

function getThreads(paperId: string) {
  return ThreadsTable.findAll({
    where: { paperId }
  });
}

function getMessages(threadId: string, messageId?: number) {
  let whereClause: { [key: string]: any } = {
    threadId
  };

  if (messageId){
    whereClause.id = {
      [Op.lte]: messageId
    }

  }
  return MessagesTable.findAll({
    where: whereClause
  });
}

function getPromptPresets() {
  return PromptPresetsTable.findAll();
}

function getPdfDocuments(paperId: string){
  return PdfDocumentTable.findAll({
    where: {
      paperId
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
  getPromptPresets,
  getThreads,
  getMessages,
  getPdfDocuments
}
