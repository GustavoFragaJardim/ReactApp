import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Router, Route } from 'react-router-dom';
import AuthorBox from './Author';
import BookBox from './Book';
import Home from './home';

import createHistory from "history/createBrowserHistory"

const history = createHistory({
    basename: "",
    forceRefresh: false
})

export { history }

ReactDOM.render(
    (<Router history={history}>
        <div>
            <App>
                <Route exact path='/' component={Home} />
                <Route path='/author' component={AuthorBox} />
                <Route path='/book' component={BookBox} />
            </App>
        </div>
    </Router>),
    document.getElementById('root'));
registerServiceWorker();
