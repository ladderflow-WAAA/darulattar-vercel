export const setMetadata = (title: string, description: string, url?: string) => {
  let finalTitle = title;
  if (!finalTitle.includes('Darul Attar')) {
      finalTitle += ' | Darul Attar Chennai';
  }
  
  document.title = finalTitle;

  const updateTag = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const isProperty = selector.includes('property=');
      el.setAttribute(isProperty ? 'property' : 'name', selector.match(/["'](.*?)["']/)?.[1] || '');
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  updateTag('meta[name="description"]', 'content', description);
  updateTag('meta[property="og:title"]', 'content', finalTitle);
  updateTag('meta[property="og:description"]', 'content', description);
  updateTag('meta[name="twitter:title"]', 'content', finalTitle);
  updateTag('meta[name="twitter:description"]', 'content', description);

  if (url) {
    updateTag('meta[property="og:url"]', 'content', url);
  }
};