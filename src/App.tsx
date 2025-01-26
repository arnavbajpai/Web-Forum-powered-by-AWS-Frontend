import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Navbar from './components/CategoryList/CategoriesList';
import Header from './components/Helpbar/Helpbar';
import Food from './pages/Food/Food';
import Games from './pages/Games/Games';
import Movies from './pages/Movies/Movies';
import Sports from './pages/Sports/Sports';
import Tech from './pages/Tech/Tech';
import Music from './pages/Music/Music';
import CommentListPageAPI from './pages/CommentsListPage/CommentListPageAPI';
import Home from './pages/Home/Home';
import Callback from './pages/Callback/Callback';

const App: React.FC = () => {
  const [title, setTitle] = useState<string>('Forum');
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('id_token');

  useEffect(() => {
    const pathName = location.pathname;
    const parsedTitle =
      pathName === '/'
        ? 'Web Forum'
        : pathName
            .substring(1)
            .replace(/\W/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))[0];

    setTitle(parsedTitle);
  }, [location]);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!isAuthenticated && location.pathname !== '/callback') {
      navigate('/');
    }
  }, [isAuthenticated, location, navigate]);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <Navbar />
          </Grid>
          <Grid item xs={12}>
            <Header title={title} />
          </Grid>
          <Grid item xs={12}>
            <Routes>
              <Route path="/" element={<Outlet />}>
                <Route path="food" element={<Food />} />
                <Route path="tech" element={<Tech />} />
                <Route path="sports" element={<Sports />} />
                <Route path="movies" element={<Movies />} />
                <Route path="games" element={<Games />} />
                <Route path="music" element={<Music />} />
                <Route path=":categoryName/:topicID" element={<CommentListPageAPI />} />
              </Route>
              <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default App;