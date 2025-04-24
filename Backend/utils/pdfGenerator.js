// utils/pdfGenerator.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateTransactionPDF = (transactions, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text('Transaction Report', { align: 'center' });
    doc.moveDown();

    transactions.forEach((txn, idx) => {
      doc
        .fontSize(12)
        .text(`${idx + 1}. ${txn.type.toUpperCase()} - ₹${txn.amount} | Status: ${txn.status}`)
        .text(`Date: ${txn.createdAt.toDateString()}`)
        .text(`From: ${txn.fromAccount || 'N/A'}`)
        .text(`To: ${txn.toAccount || 'N/A'}`)
        .moveDown();
    });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};
