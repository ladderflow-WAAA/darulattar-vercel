export const setMetadata = (title: string, description: string) => {
  document.title = title;

  let descriptionMeta = document.querySelector('meta[name="description"]');
  
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    document.head.appendChild(descriptionMeta);
  }
  
  descriptionMeta.setAttribute('content', description);
};
