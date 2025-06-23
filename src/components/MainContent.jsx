import React from 'react';
import HomeView from './HomeView';
import SearchView from './SearchView';
import LibraryView from './LibraryView';

const MainContent = ({ appState }) => {
  const { activeView } = appState;

  return (
    <div className="flex-1 bg-gradient-to-b from-purple-900 via-gray-900 to-black text-white overflow-auto">
      {activeView === 'home' && <HomeView appState={appState} />}
      {activeView === 'search' && <SearchView appState={appState} />}
      {activeView === 'library' && <LibraryView appState={appState} />}
    </div>
  );
};

export default MainContent;
