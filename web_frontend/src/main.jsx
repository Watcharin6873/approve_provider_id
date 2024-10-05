import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//Locale
import {ConfigProvider} from 'antd';
import moment from 'moment';

import th from 'antd/lib/locale/th_TH.js'

moment.locale('th')

//Redux
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './components/reducers/index.jsx';

const store = createStore(rootReducer, composeWithDevTools())

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
