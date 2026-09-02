// Utility functions for handling base64 PDFs
export const base64ToBlob = (base64Data: string, contentType: string = 'application/pdf'): Blob => {
  try {
    // Extract the base64 content
    const base64Content = base64Data.split(',')[1];
    
    // Convert base64 to binary
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw error;
  }
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadBase64PDF = (base64Data: string, filename: string = 'documento.pdf'): void => {
  try {
    const blob = base64ToBlob(base64Data);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
};

export const openBase64PDF = (base64Data: string): void => {
  try {
    const blob = base64ToBlob(base64Data);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Note: We don't revoke the URL here because the new tab needs it
    // The browser will clean up when the tab is closed
  } catch (error) {
    console.error('Error opening PDF:', error);
  }
};