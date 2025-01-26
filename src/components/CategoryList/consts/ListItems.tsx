
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
export const CategoryItems = [
    {
        id: 0,
        icon: <RestaurantIcon />,
        label: 'Food',
        route: 'food',
    },
    {
        id: 1,
        icon: <SportsEsportsIcon />,
        label: 'Games',
        route: 'games',
    },
    {
        id: 2,
        icon: <LocalMoviesIcon />,
        label: 'Movies',
        route: 'movies',
    },
    {
        id: 3,
        icon: <MusicNoteIcon />,
        label: 'Music',
        route: 'music',
    },
    {
        id: 4,
        icon: <SportsSoccerIcon />,
        label: 'Sports',
        route: 'sports',
    },
    {
        id: 5,
        icon: <PhonelinkIcon />,
        label: 'Tech',
        route: 'tech',
    },
]