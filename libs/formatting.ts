export const formatMessage = (content: string): string => {
    return content
    .replace(/(\d+\.\s.*?)(?=(?:\d+\.|$))/g, '$1<br/><br/>')
    .replace(/(\*\s.*?)(?=(?:\*\s|$))/g, '$1<br/><br/>')
    .replace(/\*\*(.*?)\*\*/g, (_, p1) => `<strong>${p1}</strong>`);
  };
  
