const React = window.React = require('react');
const ReactDOM = require('react-dom');
const mountNode = document.getElementById('app');
import OfferTables from './components/OfferTables.jsx';
import OfferMakers from './components/OfferMakers.jsx';
import Session from './components/Session.jsx';
import PairPicker from './components/PairPicker.jsx';
import url from 'url';
import Header from './components/Header.jsx';
import Driver from './lib/Driver';

let network = {};

let useLiveNetwork = () => {
  network.horizonUrl = 'https://horizon.stellar.org';
  StellarSdk.Network.usePublicNetwork();
}
let useTestNetwork = () => {
  network.horizonUrl = 'https://horizon-testnet.stellar.org';
  StellarSdk.Network.useTestNetwork();
}
useTestNetwork();

let driver = new Driver({
  horizonUrl: network.horizonUrl,
});


const parseUrl = (href) => {
  let hash = url.parse(href).hash;
  if (hash === null) {
    return '';
  }
  return hash.substr(1);
}

class TermApp extends React.Component {
  constructor(props) {
    super(props);
    this.d = props.d;
    this.state = {
      // The url is the hash cleaned up
      url: parseUrl(window.location.href)
    };
    window.addEventListener('hashchange', (e) => {
      this.setState({
        url: parseUrl(e.newURL)
      })
    } , false);
  }
  render() {
    let url = this.state.url;

    let body;
    if (url === '') {
      // Home page
      body = <div className="so-back">
        <div className="so-chunk">
          Welcome to stellarterm.com
        </div>
      </div>
    } else if (url === 'account') {
      body = <Session d={this.d}></Session>
    } else if (url === 'trading') {
      body = <div>
        <div className="so-back islandBack">
          <div className="island island--simplePadTB">
            <PairPicker d={this.d}></PairPicker>
          </div>
        </div>
        <div className="so-back islandBack">
          <div className="island">
            <div className="island__header">
              Orderbook
            </div>
            <OfferMakers d={this.d}></OfferMakers>
            <div className="island__separator"></div>
            <OfferTables d={this.d}></OfferTables>
          </div>
        </div>
      </div>
    } else {
      body = <div className="so-back islandBack">
        <div className="island">
          <div className="island__header">
            Page not found
          </div>
          <div className="OfferTables island__sub">
            <div className="OfferTables__tables island__sub__division island--simplePadTB">
              The requested page was not found. Try going to the <a href="#">home page</a> to navigate to where you want to go.
            </div>
            <div className="OfferTables__table island__sub__division">
            </div>
          </div>
        </div>
      </div>
    }

    return <div>
      <Header></Header>
      {body}
    </div>;

  }
};

ReactDOM.render(<TermApp d={driver} />, mountNode);
