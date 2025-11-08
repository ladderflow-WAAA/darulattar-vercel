import React, { useEffect, useRef } from 'react';
import Home from '../components/Home';
import Categories from '../components/Categories';
import Collection from '../components/Collection';
import About from '../components/About';
import Contact from '../components/Contact';
import { PageState } from '../App';

interface HomePageProps {
  navigate: (pageState: PageState) => void;
  section?: 'collection' | 'about' | 'contact';
}

const HomePage: React.FC<HomePageProps> = ({ navigate, section }) => {
  const collectionRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const refs = {
      collection: collectionRef,
      about: aboutRef,
      contact: contactRef,
    };

    const elementRef = section ? refs[section] : null;

    if (elementRef && elementRef.current) {
      setTimeout(() => {
        elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [section]);

  const handleDiscoverClick = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="overflow-x-hidden">
      <Home navigate={navigate} onDiscoverClick={handleDiscoverClick} />
      <Collection navigate={navigate} ref={collectionRef} />
      <Categories navigate={navigate} />
      <About ref={aboutRef} navigate={navigate} />
      <Contact ref={contactRef} />
    </div>
  );
};

export default HomePage;
