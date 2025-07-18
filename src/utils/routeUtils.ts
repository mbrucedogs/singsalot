// Route to title mapping for dynamic navigation
export const getPageTitle = (pathname: string): string => {
  const routeMap: { [key: string]: string } = {
    '/': 'Search Songs',
    '/search': 'Search Songs',
    '/queue': 'Queue',
    '/singers': 'Singers',
    '/artists': 'Artists',
    '/top-played': 'Top 100 Played',
    '/favorites': 'Favorites',
    '/history': 'History',
    '/new-songs': 'New Songs',
    '/song-lists': 'Song Lists',
    '/settings': 'Settings'
  };

  return routeMap[pathname] || 'Search Songs';
}; 