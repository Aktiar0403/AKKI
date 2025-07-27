// html2pdf.js – Export visit summary and prescription to PDF

export function exportToPDF(containerId = 'pdf-content', filename = 'NephroCare_Report.pdf') {
  const element = document.getElementById(containerId);
  if (!element) return;
  
  const opt = {
    margin: 0.5,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  window.html2pdf().set(opt).from(element).save(); // use `window.html2pdf`
}
