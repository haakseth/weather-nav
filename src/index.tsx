import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Map from './components/Map';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<Map />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
