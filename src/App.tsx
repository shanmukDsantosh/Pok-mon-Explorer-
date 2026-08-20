import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PokemonProvider, usePokemonContext } from './context/PokemonContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchBar } from './components/filters/SearchBar';
import { TypeFilter } from './components/filters/TypeFilter';
import { SortDropdown } from './components/filters/SortDropdown';
import { PokemonGrid } from './components/pokemon/PokemonGrid';
import { PokemonModal } from './components/pokemon/PokemonModal';
import { fetchPokemonByNameOrId } from './services/pokemonApi';

const MainExplorer: React.FC = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name?: string }>();

  const {
    pokemonList,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    showFavoritesOnly,
    setShowFavoritesOnly,
    favorites,
    toggleFavorite,
    selectedPokemon,
    setSelectedPokemon,
    handleLoadMore,
    reload,
    clearFilters,
    handlePrevPokemon,
    handleNextPokemon,
  } = usePokemonContext();

  // Deep linking URL sync: when route is /pokemon/:name
  useEffect(() => {
    if (name) {
      const lowercaseName = name.toLowerCase();
      const match = pokemonList.find(
        (p) => p.name.toLowerCase() === lowercaseName || p.id.toString() === lowercaseName
      );

      if (match) {
        setSelectedPokemon(match);
      } else {
        // Fetch directly if not in current grid page
        fetchPokemonByNameOrId(lowercaseName)
          .then((data) => setSelectedPokemon(data))
          .catch(() => setSelectedPokemon(null));
      }
    } else {
      setSelectedPokemon(null);
    }
  }, [name, pokemonList, setSelectedPokemon]);

  const handleSelectPokemon = (pokemon: typeof selectedPokemon) => {
    if (pokemon) {
      setSelectedPokemon(pokemon);
      navigate(`/pokemon/${pokemon.name.toLowerCase()}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
    if (name) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <Header
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Controls & Filter Section */}
        <section className="space-y-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          
          {/* Top Row: Search & Sort Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="w-full md:w-auto flex justify-end">
              <SortDropdown
                sortBy={sortBy}
                onSortChange={setSortBy}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
                favoritesCount={favorites.length}
              />
            </div>
          </div>

          {/* Type Filter Chips */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Filter by Type
              </span>
              {selectedType !== 'all' && (
                <button
                  onClick={() => setSelectedType('all')}
                  className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Reset Type Filter
                </button>
              )}
            </div>
            <TypeFilter selectedType={selectedType} onSelectType={setSelectedType} />
          </div>
        </section>

        {/* Active Filter Bar Badge Info */}
        {(showFavoritesOnly || selectedType !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between px-4 py-2 bg-slate-200/60 dark:bg-slate-900/60 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex flex-wrap items-center gap-2">
              <span>Active filters:</span>
              {showFavoritesOnly && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[11px]">
                  Favorites Only
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold text-[11px] uppercase">
                  Type: {selectedType}
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white font-bold text-[11px]">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer underline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Pokemon Cards Grid */}
        <section className="w-full">
          <PokemonGrid
            pokemonList={pokemonList}
            favorites={favorites}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            error={error}
            onSelectPokemon={handleSelectPokemon}
            onToggleFavorite={toggleFavorite}
            onLoadMore={handleLoadMore}
            onRetry={reload}
            onClearFilters={clearFilters}
          />
        </section>
      </main>

      {/* Details Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={Boolean(selectedPokemon)}
        onClose={handleCloseModal}
        isFavorite={selectedPokemon ? favorites.includes(selectedPokemon.id) : false}
        onToggleFavorite={toggleFavorite}
        onPrevPokemon={handlePrevPokemon}
        onNextPokemon={handleNextPokemon}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PokemonProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainExplorer />} />
            <Route path="/pokemon/:name" element={<MainExplorer />} />
            <Route path="*" element={<MainExplorer />} />
          </Routes>
        </BrowserRouter>
      </PokemonProvider>
    </ThemeProvider>
  );
}
