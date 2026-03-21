/**
 * Dynamically loads jsPDF from CDN since npm install was not possible in the environment.
 */
export const loadJsPDF = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf) {
      resolve((window as any).jspdf);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve((window as any).jspdf);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const generateTestReport = async (userName: string, testTitle: string, results: any) => {
  const { jsPDF } = await loadJsPDF();
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 44, 52);
  doc.text('IELTS Test Report', 105, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.text(`Student: ${userName}`, 20, 40);
  doc.text(`Test: ${testTitle}`, 20, 50);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

  // Scores Table (Simple implementation without autotable for now)
  doc.setFontSize(16);
  doc.text('Results Summary', 20, 80);
  
  let y = 90;
  Object.entries(results).forEach(([section, data]: [string, any]) => {
    doc.setFontSize(12);
    doc.text(`${section.toUpperCase()}: Band ${data.band} (Score: ${data.score})`, 30, y);
    y += 10;
  });

  // Convert to Base64
  const pdfBase64 = doc.output('datauristring').split(',')[1];
  return pdfBase64;
};

export const sendToTelegram = async (pdfBase64: string, filename: string) => {
  try {
    const response = await fetch('/api/telegram/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        pdfData: pdfBase64, 
        filename,
        caption: `New IELTS Mock Test Result - ${filename}`
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
};
