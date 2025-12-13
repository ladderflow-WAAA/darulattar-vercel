export const setMetadata = (title: string, description: string) => {
  // Ensure "Darul Attar" and "Chennai" are in the title if space permits and not already there
  let finalTitle = title;
  if (!finalTitle.includes('Darul Attar')) {
      finalTitle += ' | Darul Attar';
  }
  
  document.title = finalTitle;

  let descriptionMeta = document.querySelector('meta[name="description"]');
  
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    document.head.appendChild(descriptionMeta);
  }
  
  descriptionMeta.setAttribute('content', description);
};